<template>
  <div id="map-view" class="m-scene-view-container">
    <div v-if="sceneView" class="measurement-widget-container m-widget">
      <line-measurement ref="lineMeasureRef" :view="sceneView" @active="handleMeasure" />
      <area-measurement ref="areaMeasureRef" :view="sceneView" @active="handleMeasure" />
      <volume-measurement ref="volumeMeasureRef" :view="sceneView" @active="handleMeasure" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, shallowRef } from "vue";

import _ from "lodash";

import Map from "@arcgis/core/Map";
import Ground from "@arcgis/core/Ground";
import SceneView from "@arcgis/core/views/SceneView.js";
import esriConfig from "@arcgis/core/config";
import IntegratedMeshLayer from "@arcgis/core/layers/IntegratedMeshLayer.js";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer.js";

import LineMeasurement from "./widgets/LineMeasurement.vue";
import AreaMeasurement from "./widgets/AreaMeasurement.vue";
import VolumeMeasurement from "./widgets/VolumeMeasurement.vue";

import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Polyline from "@arcgis/core/geometry/Polyline.js";
import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";

import * as lineMeasure from "./scheduler/lineMeasure.js";
import * as areaMeasure from "./scheduler/areaMeasure.js";
import * as volumeMeasure from "./scheduler/volumeMeasure.js";

// view
const sceneView = shallowRef(null);

// map
const map = shallowRef(null);

// 激活的组件
const activeWidget = ref(null);

// 距离测量组件
const lineMeasureRef = ref(null);

// 面积测量组件
const areaMeasureRef = ref(null);

// 体积测量组件
const volumeMeasureRef = ref(null);

onMounted(() => {
  sceneView.value = createMapView();
  map.value = sceneView.value.map;

  sceneView.value.when(() => {
    createLayer();
  });
});

// 测量控件
function handleMeasure(measureType, status) {
  const widgetMap = {
    line: lineMeasureRef.value,
    area: areaMeasureRef.value,
    volume: volumeMeasureRef.value,
  };

  if (status === "on") {
    activeWidget.value?.destroy();
    activeWidget.value = widgetMap[measureType];
  }
  if (status === "off") {
    activeWidget.value = null;
  }
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
    container: "map-view",
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

// 创建图层
function createLayer() {
  const data = [
    {
      id: "张家峁区域1第1期无人机倾斜三维模型",
      url: "https://portal.beidouhj.com/server/rest/services/C6100002011031120111634_UAVTP3DModel_20230912_1/SceneServer",
      showTypeName: "IntegratedMeshLayer",
    },
    {
      id: "地形基座",
      url: "https://portal.beidouhj.com/server/rest/services/ShXi_DEM_12_5/ImageServer",
      showTypeName: "ElevationLayer",
    },
  ];

  data.forEach((o) => {
    let layer = _createTypeLayer(o);

    // 处理地形图层
    if (o.showTypeName === "ElevationLayer") {
      map.value.ground = new Ground({
        layers: [layer],
      });
    } else {
      layer.when(() => {
        goTo(layer.fullExtent);
      });
      map.value.add(layer);
    }
  });
}

// 创建类型图层
function _createTypeLayer(config) {
  switch (config.showTypeName) {
    case "IntegratedMeshLayer":
      return new IntegratedMeshLayer({
        id: config.id,
        url: config.url,
      });
    case "ElevationLayer":
      return new ElevationLayer({
        id: config.id,
        url: config.url,
      });
    default:
      break;
  }

  return;
}

// 跳转
function goTo(center) {
  const view = sceneView.value;

  return view.goTo(
    {
      center,
      tilt: 0,
      heading: 0,
    },
    {
      duration: 0,
    }
  );
}

onMounted(() => {
  sceneView.value.when(() => {
    sendMessage({ invoke: "mounted" });
  });

  window.addEventListener("message", async (evt) => {
    const { invoke, args } = evt.data;

    if (!invoke) return void 0;

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
// 同步视图
function synchronousView(args) {
  if (!args) return void 0;
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

onUnmounted(() => {
  sceneView.value.destroy();
});
</script>

<style scoped>
#map-view {
  width: 100vw;
  height: 100vh;
}

.m-scene-view-container {
  width: 100%;
  position: fixed;

  .measurement-widget-container {
    position: absolute;
    bottom: 35px;
    right: 25px;
    border-radius: 4px;
  }
}

.active {
  color: #004b9d;
}

.esri-ui .esri-attribution {
  display: flex !important;
}
</style>
