<template>
  <div class="esri-widget">
    <div
      class="esri-widget--button esri-interactive esri-icon-elevation-profile"
      :class="[state !== 'finish' ? 'active' : '']"
      title="体积测量工具"
      @click="handleSwitch"
    ></div>

    <template v-if="state != 'finish'">
      <div class="measurement-container" v-show="state === 'ready'">
        <p>通过单击场景以放置您的第一个点来开始测量。</p>
      </div>

      <div class="measurement-container" v-show="state === 'active'" v-loading="loading">
        <div class="measurement-content">
          <div>挖方量</div>
          <div class="esri-direct-line-measurement-3d__measurement-item-value">
            {{ Number(volume.cut).toFixed(2) }} m³
          </div>
        </div>
        <div class="measurement-content">
          <div>填方量</div>
          <div class="esri-direct-line-measurement-3d__measurement-item-value">
            {{ Number(volume.fill).toFixed(2) }} m³
          </div>
        </div>
        <div id="volume-control-slot"></div>
        <el-button class="measurement-button" @click="handleNew">新测量</el-button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted, shallowRef } from "vue";

import { sumBy } from "lodash";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import { getElevation } from "../utils";
import useCellAnalysisHelper from "../hooks/useCellAnalysisHelper";
import useWidget from "../hooks/useWidget";
import createVolumeMeasureScheduler from "../scheduler/volumeMeasure";
import { setCenterLabel } from "../utils";

const props = defineProps(["view"]);

const emits = defineEmits(["active"]);

// 测量结果
const volume = reactive({
  fill: 0,
  cut: 0,
});

const scheduler = createVolumeMeasureScheduler();

const { state, handleSwitch, handleNew, destroy } = useWidget(
  emits.bind(null, "active", "volume"),
  startSketch,
  scheduler.terminate
);

const { loading, renderCellAnalysisHelper, helpDestroy } = useCellAnalysisHelper(
  props.view,
  scheduler,
  "#volume-control-slot"
);

let baseElevation = 0;

// 开始测量
function startSketch() {
  volume.fill = volume.cut = 0;

  const view = props.view;
  const map = view.map;

  const graphicsLayer = new GraphicsLayer({
    id: "measurement",
    elevationInfo: {
      mode: "absolute-height",
    },
  });
  map.add(graphicsLayer);

  const normalSymbol = {
    type: "simple-fill",
    color: [255, 255, 255, 0.5],
    outline: {
      color: "#00ccff",
      width: 3,
    },
  };

  const sketchViewModel = new SketchViewModel({
    view,
    layer: graphicsLayer,
    polygonSymbol: normalSymbol,
    snappingOptions: {
      enabled: true,
      featureSources: [{ layer: graphicsLayer }],
    },
    tooltipOptions: { enabled: !false },
    labelOptions: { enabled: !false },
    defaultUpdateOptions: {
      tool: "reshape",
      toggleToolOnClick: false,
      reshapeOptions: {
        edgeOperation: "none",
        shapeOperation: "none",
      },
    },
  });

  sketchViewModel.on("create", async (evt) => {
    if (evt.state === "start") {
      state.value = "active";

      baseElevation = await getElevation(view, evt.graphic.geometry.rings[0][0]);
    } else if (evt.state === "active") {
      evt.graphic.geometry.rings[0].forEach((p) => (p[2] = baseElevation));
    } else if (evt.state === "complete") {
      onMeasure(evt.graphic);
    }
  });

  sketchViewModel.on("update", (evt) => {
    if (evt.state === "active") {
      evt.graphics[0].remeasure = true;
    } else if (evt.state === "complete") {
      if (!!evt.graphics[0].remeasure === false) return void 0;

      evt.graphics[0].remeasure = false;

      // 同步graphic所有点为的高程值
      const points = evt.graphics[0].geometry.rings[0];
      let elevation = findUnique(points.map((p) => p[2])) || points[0][2];
      const geom = evt.graphics[0].geometry.clone();
      geom.rings[0].forEach((p) => (p[2] = elevation));
      evt.graphics[0].geometry = geom;

      onMeasure(evt.graphics[0]);
    }
  });

  sketchViewModel.create("polygon");

  return () => {
    sketchViewModel.destroy();
    map.remove(graphicsLayer);
    helpDestroy();
  };
}

// 测量回调
async function onMeasure(graphic) {
  renderCellAnalysisHelper(graphic, (cells) => {
    volume.cut = sumBy(
      cells.filter((c) => c.attributes.vol > 0),
      (c) => c.attributes.vol
    );
    volume.fill = sumBy(
      cells.filter((c) => c.attributes.vol < 0),
      (c) => -c.attributes.vol
    );

    const text = `挖方量 ${Number(volume.cut).toFixed(2)} m³\n填方量 ${Number(volume.fill).toFixed(2)} m³`;
    setCenterLabel(graphic, text);
  });
}

// 获取数组唯一一个不同的值
function findUnique(arr) {
  const count = {};

  arr.forEach((item) => {
    count[item] = (count[item] || 0) + 1;
  });

  for (const key in count) {
    if (count[key] === 1) {
      return isNaN(key) ? key : Number(key);
    }
  }
}

onUnmounted(() => {
  scheduler.terminate(true);
});

defineExpose({
  destroy,
});
</script>

<style scoped>
.measurement-container {
  position: fixed;
  right: 85px;
  bottom: 35px;
  background-color: white;
  padding: 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  user-select: none;

  p {
    white-space: nowrap;
  }

  .measurement-content {
    padding: 4px 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .measurement-button {
    align-items: center;
    background-color: #0079c1;
    border: 1px solid #0079c1;
    border-radius: 0;
    color: #fff;
    display: flex;
    font-size: 14px;
    min-height: 32px;
    justify-content: center;
    padding: 6px 7px;
    width: 130px;
  }
}

.active {
  color: #004b9d;
}
</style>
