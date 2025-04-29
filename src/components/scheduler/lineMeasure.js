import Point from "@arcgis/core/geometry/Point.js";
import Polyline from "@arcgis/core/geometry/Polyline.js";
import { geodesicDensify } from "@arcgis/core/geometry/geometryEngine.js";

import { ThreadTaskProcessor } from "@mino_97/task-processor";

import { threadPool, viewPool, createChunkBuilder, getElevation, calcLineDistance } from "../utils";

/**
 * @typedef Cell
 * @property {Geometry} geometry
 * @property {Object} attributes
 */

function createLineMeasureScheduler() {
  const threadTaskProcessor = new ThreadTaskProcessor(threadPool);

  const viewTaskProcessor = new ThreadTaskProcessor(viewPool);

  /**
   * 单个任务执行
   * @returns {Cell[]}
   */
  async function taskFlow(work, taskArg) {
    let result = [];

    try {
      const line = await viewTaskProcessor.execute(taskArg);

      const buildTaskChunks = createChunkBuilder(line.points.length);
      const chunks = buildTaskChunks((start, end) =>
        taskArgWrapper("lineMeasure.deconstructCell", {
          points: line.points.slice(start, end),
          spatialReference: line.spatialReference,
        })
      );

      result = (await Promise.all(chunks.map(threadTaskProcessor.execute.bind(threadTaskProcessor)))).flat();
    } catch (error) {
      console.error(error);
    }

    return result.map((c) => {
      return c?.attributes?.type === "polyline"
        ? { geometry: Polyline.fromJSON(c.geoJSON), attributes: { ...c.attributes, work } }
        : { geometry: Point.fromJSON(c.geoJSON), attributes: { ...c.attributes, work } };
    });
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

      const line = geodesicDensify(graphic.geometry, precision, "meters");

      const buildTaskChunks = createChunkBuilder(line.paths[0].length);

      const chunks = buildTaskChunks((start, end) =>
        taskArgWrapper("lineMeasure.getPointElevation", {
          points: line.paths[0].slice(start, end + 1),
          spatialReference: graphic.geometry.toJSON().spatialReference,
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
function deconstructCell(args) {
  const { points, spatialReference } = args;

  let i = 0;

  const cells = [];

  while (i < points.length) {
    let point, line;

    point = new Point({
      x: points[i][0],
      y: points[i][1],
      z: points[i][2],
      spatialReference,
    });
    cells.push({
      geoJSON: point.toJSON(),
      attributes: { type: "point", render: "point-3d" },
    });

    if (i + 1 < points.length) {
      line = new Polyline({
        paths: [points[i], points[i + 1]],
        spatialReference,
      });
      cells.push({
        geoJSON: line.toJSON(),
        attributes: { type: "polyline", render: "line-3d", distance: calcLineDistance(line) },
      });
    }

    i++;
  }

  return cells;
}

async function getPointElevation(view, args) {
  const { points } = args;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    point[2] = await getElevation(view, point);
  }

  return args;
}

export { createLineMeasureScheduler as default, getPointElevation, deconstructCell };
