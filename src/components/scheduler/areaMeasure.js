import { ElMessage } from "element-plus";
import Polygon from "@arcgis/core/geometry/Polygon.js";
import { contains, intersect } from "@arcgis/core/geometry/geometryEngine.js";

import { ThreadTaskProcessor } from "@lil-el/task-processor";

import {
  threadPool,
  viewPool,
  createChunkBuilder,
  getElevation,
  densifyExtentEdge,
  calcTriangleArea,
  disassemblingGraphics,
} from "../utils";

/**
 * @typedef Cell
 * @property {Geometry} geometry
 * @property {Object} attributes
 */

function createAreaMeasureScheduler() {
  const threadTaskProcessor = new ThreadTaskProcessor(threadPool);

  const viewTaskProcessor = new ThreadTaskProcessor(viewPool);

  /**
   * 单个任务执行
   * @returns {Cell[]}
   */
  async function taskFlow(work, taskArg) {
    let result = [];

    try {
      const data = await threadTaskProcessor.execute(taskArg);

      const buildTaskChunks = createChunkBuilder(data.length);
      const viewTaskChunk = buildTaskChunks((start, end) =>
        taskArgWrapper("areaMeasure.getCellVertexElevation", {
          cells: data.slice(start, end),
        })
      );

      const cells = (await Promise.all(viewTaskChunk.map(viewTaskProcessor.execute.bind(viewTaskProcessor)))).flat();

      result = await threadTaskProcessor.execute(taskArgWrapper("areaMeasure.areaTask", cells));
    } catch (error) {
      console.error(error);
      ElMessage.error(`计算失败，请刷新重试。`);
    }

    return result.map((c) => ({ geometry: Polygon.fromJSON(c.geoJSON), attributes: { ...c.attributes, work } }));
  }

  return {
    syncView(map, geometry) {
      const mesh = map.layers.find((l) => l.type === "integrated-mesh" && l.visible);
      const ground = map.ground.layers.find((l) => l.type === "elevation");

      if (viewPool.threads.length < viewPool.maxThreads) {
        viewPool.fillThreads();
      }

      return Promise.all(
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
    /**
     * @param {Graphic} graphic 计算区域图形
     * @param {number} precision 精度
     * @returns { { work: string, tasks: Promise<Cell[]>[]} }
     */
    start(graphic, precision) {
      this.terminate();

      const { l1, l2 } = densifyExtentEdge(graphic.geometry.extent, precision);

      const buildTaskChunks = createChunkBuilder((l1.paths[0].length - 1) * (l2.paths[0].length - 1));

      const chunks = buildTaskChunks((start, end) =>
        taskArgWrapper("areaMeasure.deconstructCell", {
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
    terminate() {
      threadTaskProcessor.terminate();
      viewTaskProcessor.terminate();
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

  while (count < end) {
    let i = 1 + Math.floor(count / (d2.length - 1));
    let j = 1 + (count % (d2.length - 1));

    count++;

    const rings = [
      [d1[i - 1][0], d2[j - 1][1], 0],
      [d1[i][0], d2[j - 1][1], 0],
      [d1[i][0], d2[j][1], 0],
      [d1[i - 1][0], d2[j][1], 0],
      [d1[i - 1][0], d2[j - 1][1], 0],
    ];

    let square = new Polygon({
      rings,
      spatialReference: measuredGeometry.spatialReference,
    });

    const triangles = getTriangleCell(measuredGeometry, square);

    for (let k = 0; k < triangles.length; k++) {
      cells.push(triangles[k]);
    }
  }

  return cells;
}

function getTriangleCell(graphicGeometry, geometry, absoluteContains = false) {
  // 图形拆分
  const triangles = disassemblingGraphics(geometry);

  const cells = [];

  if (absoluteContains) {
    return triangles.map((t) => ({
      geoJSON: t.toJSON(),
      attributes: {
        type: "polygon",
        render: "simple-fill",
        relation: "intersect",
      },
    }));
  }

  for (let k = 0; k < triangles.length; k++) {
    let triangleGeometry = triangles[k];

    // 空间关系
    const isContains = contains(graphicGeometry, triangleGeometry);
    const intersectGeometry = isContains ? null : intersect(graphicGeometry, triangleGeometry);

    // 相交时递归，拆分并计算边缘图形，获取 cell
    if (intersectGeometry) {
      const edgeTriangles = getTriangleCell(graphicGeometry, intersectGeometry, true);
      cells.push(...edgeTriangles);
      continue;
    }

    // 取消 outside 单元渲染
    if (!isContains) continue;

    // cell 数据
    const triangleCell = {
      geoJSON: triangleGeometry.toJSON(),
      attributes: {
        type: "polygon",
        render: "simple-fill",
        relation: isContains ? "inside" : "outside",
      },
    };

    cells.push(triangleCell);
  }

  return cells;
}

async function getCellVertexElevation(view, args) {
  const { cells } = args;

  const elevationMap = {};

  for (let i = 0; i < cells.length; i++) {
    const { geoJSON } = cells[i];

    for (let j = 0; j < geoJSON.rings[0].length; j++) {
      const point = geoJSON.rings[0][j];

      const key = `${point[0]},${point[1]}`;

      point[2] = elevationMap[key] = elevationMap[key] || (await getElevation(view, point));
    }
  }

  return cells;
}

function areaTask(cells) {
  for (let i = 0; i < cells.length; i++) {
    const { geoJSON, attributes } = cells[i];

    const geometry = Polygon.fromJSON(geoJSON);

    attributes.area = calcTriangleArea(geometry);
  }

  return cells;
}

export { createAreaMeasureScheduler as default, deconstructCell, getCellVertexElevation, areaTask };
