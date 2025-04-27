import Polygon from "@arcgis/core/geometry/Polygon.js";
import { contains, geodesicArea, intersect } from "@arcgis/core/geometry/geometryEngine.js";

import { ThreadTaskProcessor } from "../core";

import { threadPool, viewPool, createChunkBuilder, getElevation, densifyExtentEdge } from "../utils";

function createVolumeMeasureScheduler() {
  const threadTaskProcessor = new ThreadTaskProcessor(threadPool);

  const viewTaskProcessor = new ThreadTaskProcessor(viewPool);

  async function taskFlow(work, raw) {
    let result = [];

    try {
      const data = await threadTaskProcessor.execute(raw);

      const buildTaskChunks = createChunkBuilder(data.length);
      const viewTaskChunk = buildTaskChunks((start, end) =>
        taskArgWrapper("volumeMeasure.getCellCenterElevation", {
          cells: data.slice(start, end),
        })
      );

      result = (await Promise.all(viewTaskChunk.map(viewTaskProcessor.execute.bind(viewTaskProcessor)))).flat();
    } catch (error) {
      console.error(error);
    }

    return result.map((c) => ({ geometry: Polygon.fromJSON(c.geoJSON), attributes: { ...c.attributes, work } }));
  }

  return {
    async syncView(map, geometry) {
      const mesh = map.layers.find((l) => l.type === "integrated-mesh" && l.visible);
      const ground = map.ground.layers.find((l) => l.type === "elevation");

      await Promise.all(
        viewPool.threads.map(
          viewTaskProcessor.execute.bind(viewTaskProcessor, {
            invoke: "synchronousView",
            args: {
              meshUrl: mesh?.url,
              groundUrl: ground.url,
              geometry: geometry.toJSON(),
            },
          })
        )
      );
    },
    start(graphic, precision) {
      this.terminate();

      const { l1, l2 } = densifyExtentEdge(graphic.geometry.extent, precision);

      const buildTaskChunks = createChunkBuilder((l1.paths[0].length - 1) * (l2.paths[0].length - 1));

      const chunks = buildTaskChunks((start, end) =>
        taskArgWrapper("volumeMeasure.deconstructCell", {
          d1: l1.paths[0],
          d2: l2.paths[0],
          start,
          end,
          measuredGeoJSON: graphic.geometry.toJSON(),
        })
      );

      const work = Date.now().toString();

      return {
        work,
        tasks: chunks.map(taskFlow.bind(null, work)),
      };
    },
    terminate(bool = false) {
      threadTaskProcessor.terminate(bool);
      viewTaskProcessor.terminate(bool);
    },
  };
}

// 创建 worker 的任务对象
function taskArgWrapper(invoke, args) {
  return {
    invoke,
    args,
  };
}

// 将 chunk 对象解构为 cell
function deconstructCell(chunk) {
  const { d1, d2, start, end, measuredGeoJSON } = chunk;

  const measuredGeometry = Polygon.fromJSON(measuredGeoJSON);

  let count = start;

  const cells = [];

  const z = d1[0][2];

  while (count < end) {
    let i = 1 + Math.floor(count / (d2.length - 1));
    let j = 1 + (count % (d2.length - 1));

    count++;

    const rings = [
      [d1[i - 1][0], d2[j - 1][1], z],
      [d1[i][0], d2[j - 1][1], z],
      [d1[i][0], d2[j][1], z],
      [d1[i - 1][0], d2[j][1], z],
      [d1[i - 1][0], d2[j - 1][1], z],
    ];

    let cellGeometry = new Polygon({
      rings,
      spatialReference: measuredGeometry.spatialReference,
    });

    // 空间关系
    const isContains = contains(measuredGeometry, cellGeometry);
    const intersectGeometry = isContains ? null : intersect(measuredGeometry, cellGeometry);

    // 取消 outside 单元渲染
    if (!intersectGeometry && !isContains) continue;

    cellGeometry = intersectGeometry || cellGeometry;

    // cell 单元
    const cell = {
      geoJSON: cellGeometry.toJSON(),
      attributes: {
        type: "polygon",
        render: isContains || intersectGeometry ? "polygon-3d" : "simple-fill",
        relation: isContains ? "inside" : intersectGeometry ? "intersect" : "outside",
      },
    };

    // 计算面积、高度
    if (cell.attributes.relation !== "outside") {
      cell.attributes.area = Math.abs(geodesicArea(cellGeometry, "square-meters"));
    }

    cells.push(cell);
  }

  return cells;
}

async function getCellCenterElevation(view, args) {
  const { cells } = args;

  for (let i = 0; i < cells.length; i++) {
    const { geoJSON, attributes } = cells[i];
    const geometry = Polygon.fromJSON(geoJSON);
    const elevation = await getElevation(view, geometry.extent.center);
    attributes.height = elevation - geoJSON.rings[0][0][2];
    attributes.vol = attributes.area * attributes.height;
  }

  return cells;
}

export { createVolumeMeasureScheduler as default, deconstructCell, getCellCenterElevation };
