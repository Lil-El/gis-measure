import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import { geodesicLength, geodesicDensify } from "@arcgis/core/geometry/geometryEngine.js";

/**
 * 获取三维场景中的高程
 * @param {SceneView} view 视图
 * @param {Point | [x: number, y: number, z: number]} point 坐标
 * @returns
 */
export async function getElevation(view, coord) {
  const point =
    coord instanceof Point
      ? coord
      : new Point({
          x: coord[0],
          y: coord[1],
          spatialReference: view.spatialReference,
        });

  const meshLayer = view.map.layers.items.find((l) => l.type === "integrated-mesh" && l.visible);

  const screenPoint = view.toScreen(point);

  const { ground } = await view.hitTest(screenPoint, { include: meshLayer });

  return ground.mapPoint.z;
}

/**
 * extent 两条边插值
 * @param {Extent} extent
 * @param {number} CELL_SIZE 每多少米插一个值
 * @returns
 */
export function densifyExtentEdge(extent, CELL_SIZE) {
  const p1 = [extent.xmin, extent.ymin, extent.zmin];
  const p2 = [extent.xmax, extent.ymin, extent.zmin];
  // const p3 = [extent.xmax, extent.ymax, extent.zmin];
  const p4 = [extent.xmin, extent.ymax, extent.zmin];

  const geom1 = new Polyline({
    hasM: false,
    hasZ: true,
    paths: [[p1, p2]],
    spatialReference: extent.spatialReference,
  });
  const geom2 = new Polyline({
    hasM: false,
    hasZ: true,
    paths: [[p1, p4]],
    spatialReference: extent.spatialReference,
  });

  const l1 = geodesicDensify(geom1, CELL_SIZE, "meters");
  const l2 = geodesicDensify(geom2, CELL_SIZE, "meters");

  return { l1, l2 };
}

/**
 * 拆解多边形为三角形
 * @param {Polygon} polygon 多边形
 */
export function disassemblingGraphics(polygon) {
  if (polygon.rings[0].length === 4) return [polygon];

  const geometryArr = [];

  const points = polygon.rings[0];

  for (let i = 2; i < points.length - 1; i++) {
    const geometry = new Polygon({
      rings: [[points[0], points[i - 1], points[i], points[0]]],
      spatialReference: polygon.spatialReference,
    });

    geometryArr.push(geometry);
  }

  return geometryArr;
}

// 计算一条线段的空间距离
export function calcLineDistance(polyline) {
  const x = geodesicLength(polyline, "meters");
  const y = Math.abs(polyline.paths[0][0][2] - polyline.paths[0][1][2]);

  return Math.sqrt(y ** 2 + x ** 2);
}

/**
 * 计算三角形面积
 * @param {Polygon} polygon 三角形
 */
export function calcTriangleArea(polygon) {
  const points = polygon.rings[0];

  const edges = [];

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];

    // 边
    const edgeGeometry = new Polyline({
      paths: [prev, cur],
      spatialReference: polygon.spatialReference,
    });

    edges.push(calcLineDistance(edgeGeometry));
  }

  const p = (edges[0] + edges[1] + edges[2]) / 2;

  return Math.sqrt(p * (p - edges[0]) * (p - edges[1]) * (p - edges[2]));
}
