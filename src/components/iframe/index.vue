<template>
  <div id="iframe-map-view"></div>
</template>

<script setup>
import Map from "@arcgis/core/Map";
import Ground from "@arcgis/core/Ground";
import SceneView from "@arcgis/core/views/SceneView.js";
import esriConfig from "@arcgis/core/config";
import IntegratedMeshLayer from "@arcgis/core/layers/IntegratedMeshLayer.js";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Polyline from "@arcgis/core/geometry/Polyline.js";
import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";

import * as lineMeasure from "../scheduler/lineMeasure.js";
import * as areaMeasure from "../scheduler/areaMeasure.js";
import * as volumeMeasure from "../scheduler/volumeMeasure.js";

// view
const sceneView = shallowRef(null);

// map
const map = shallowRef(null);

onMounted(() => {
  sceneView.value = createMapView();
  map.value = sceneView.value.map;

  sceneView.value.when(() => {
    sendMessage({ invoke: "mounted" });
  });

  window.addEventListener("message", async (evt) => {
    const { invoke, args } = evt.data;

    const [module, method] = invoke.split(".");

    let result = null;

    try {
      if (module === "volumeMeasure") {
        result = await volumeMeasure[method](sceneView.value, args);
      } else if (module === "areaMeasure") {
        result = await areaMeasure[method](sceneView.value, args);
      } else if (module === "lineMeasure") {
        result = await lineMeasure[method](sceneView.value, args);
      } else {
        result = await synchronousView(args);
      }
    } catch (error) {
      console.error(error);
    }

    sendMessage({ data: result });
  });
});

function sendMessage(obj) {
  if (!window.uuid) return void console.error("uuid is not defined.");

  window.parent.postMessage({
    uuid: window.uuid,
    ...obj,
  });
}

// 创建地图视图
function createMapView() {
  esriConfig.apiKey =
    "AAPK3c95aa1ef4534bc586a1e2b3331b24c2ggia2FYcSV1QOijNvW6gRv2IOTZ_ZZXRRZ8cDZgq9S_dGgrgcyt98ItbNLNexYH5";

  const map = new Map({
    basemap: "arcgis-imagery-standard",
    ground: "world-elevation",
  });

  const view = new SceneView({
    map,
    container: "iframe-map-view",
    constraints: {
      tilt: {
        max: 90,
      },
    },
    popup: {
      dockEnabled: true,
      dockOptions: {
        position: "top-left",
      },
    },
  });

  // 最大缩放级别
  const maxZoom = 22;

  // 监听zoom事件
  view.watch("zoom", function (newValue) {
    if (newValue > maxZoom + 0.5) {
      view.zoom = maxZoom;
    }
  });

  map.layers.add(
    new GraphicsLayer({
      id: "graphicsLayer",
      elevationInfo: {
        mode: "relative-to-scene",
        unit: "meters",
      },
    })
  );

  return view;
}

// 同步视图
function synchronousView(args) {
  const view = sceneView.value;
  const map = view.map;

  let geometry, meshUrl, groundUrl;

  const geometryType = args.geometry.rings ? "Polygon" : "Polyline";

  geometry = geometryType === "Polyline" ? Polyline.fromJSON(args.geometry) : Polygon.fromJSON(args.geometry);
  meshUrl = args.meshUrl;
  groundUrl = args.groundUrl;

  return view.when(() => {
    let p0 = Promise.resolve();
    let p1 = Promise.resolve();
    let p2 = Promise.resolve();

    if (geometry) {
      const l = view.map.findLayerById("graphicsLayer");

      const g = new Graphic({
        type: "graphic",
        geometry,
      });

      l.graphics = [g];

      p0 = goTo(g);
    }

    if (meshUrl) {
      const meshLayer = map.layers.find((l) => l.type === "integrated-mesh" && l.url === meshUrl);

      if (!meshLayer) {
        const layer = createLayer({ url: meshUrl }, "IntegratedMeshLayer");

        let { promise, resolve } = Promise.withResolvers();
        p1 = promise;

        view.whenLayerView(layer).then((lv) => {
          let h = lv.watch("updating", (v) => {
            if (!v) {
              h.remove();
              resolve();
            }
          });
        });
      } else {
        meshLayer.visible = true;
      }

      map.layers.forEach((l) => {
        if (l.type === "integrated-mesh" && l.url !== meshUrl) {
          l.visible = false;
        }
      });
    } else {
      const layers = map.layers.filter((l) => l.type === "integrated-mesh");
      layers.forEach((l) => (l.visible = false));
    }

    const groundLayer = map.ground.layers.find((l) => l.id === "ground");
    if (groundLayer?.url !== groundUrl) {
      const layer = createLayer({ id: "ground", url: groundUrl }, "ElevationLayer");

      let { promise, resolve } = Promise.withResolvers();
      p2 = promise;

      view.whenLayerView(layer).then((lv) => {
        let h = lv.watch("updating", (v) => {
          if (!v) {
            h.remove();
            resolve();
          }
        });
      });
    }

    return Promise.all([p0, p1, p2]);
  });
}

// 创建图层
function createLayer(data, showTypeName) {
  let layer = null;

  layer = _createTypeLayer({ ...data, showTypeName });

  if (showTypeName === "ElevationLayer") {
    map.value.ground = new Ground({
      layers: [layer],
    });

    return layer;
  }

  layer.on("layerview-create-error", () => {
    layer.destroy();
  });

  map.value.add(layer);

  return layer;
}

// 创建类型图层
function _createTypeLayer(config) {
  switch (config.showTypeName) {
    case "IntegratedMeshLayer":
      return new IntegratedMeshLayer({
        id: config.id,
        url: config.url,
        title: config.label,
      });
    case "ElevationLayer":
      return new ElevationLayer({
        id: config.id,
        url: config.url,
        title: config.label,
      });
    default:
      break;
  }

  return;
}

// 跳转
function goTo(target) {
  const view = sceneView.value;

  return view.goTo(
    {
      target,
      tilt: 0,
      heading: 0,
    },
    {
      duration: 0,
    }
  );
}

onUnmounted(() => {
  sceneView.value.destroy();
});
</script>

<style scoped>
#iframe-map-view {
  width: calc(100vw - 40px);
  height: calc(100vh - 105px);
}
</style>
