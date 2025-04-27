<template>
  <div class="esri-widget">
    <div
      class="esri-widget--button esri-interactive esri-icon-measure-area"
      :class="[state !== 'finish' ? 'active' : '']"
      title="面积测量工具"
      @click="handleSwitch"
    ></div>

    <template v-if="state != 'finish'">
      <div class="measurement-container" v-show="state === 'ready'">
        <p>通过单击场景以放置您的第一个点来开始测量。</p>
      </div>

      <div class="measurement-container" v-show="state === 'active'" v-loading="loading">
        <div class="measurement-content">
          <div>面积</div>
          <div class=".esri-direct-line-measurement-3d__measurement-item-value">
            {{ Number(areaMeasurement).toFixed(2) }} m²
          </div>
        </div>
        <div id="area-control-slot"></div>
        <el-button class="measurement-button" @click="handleNew">新测量</el-button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, shallowRef } from "vue";

import { sumBy } from "lodash";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import useCellAnalysisHelper from "../hooks/useCellAnalysisHelper";
import createAreaMeasureScheduler from "../scheduler/areaMeasure";

import { ElButton, ElSlider } from "element-plus";

const props = defineProps(["view"]);

// 控件状态
const state = ref("finish"); // ready | active | finish

// 测量结果
const areaMeasurement = ref(0);

const scheduler = createAreaMeasureScheduler();

const { loading, renderCellAnalysisHelper, helpDestroy } = useCellAnalysisHelper(
  props.view,
  scheduler,
  "#area-control-slot"
);

// 图层、Sketch 销毁函数
let _destroyLayerAndSketch = () => void 0;

// 控件开关
function handleSwitch() {
  state.value = state.value === "finish" ? "ready" : "finish";
  if (state.value === "finish") {
    destroy();
  } else {
    _destroyLayerAndSketch = startSketch();
  }
}

// 新测量
function handleNew() {
  destroy();
  state.value = "ready";
  _destroyLayerAndSketch = startSketch();
}

// 开始测量
function startSketch() {
  areaMeasurement.value = 0;

  const view = props.view;
  const map = view.map;

  const graphicsLayer = new GraphicsLayer({
    id: "measure-area",
    elevationInfo: {
      mode: "on-the-ground",
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

      onMeasure(evt.graphics[0]);
    }
  });

  sketchViewModel.create("polygon");

  return () => {
    sketchViewModel.destroy();
    map.remove(graphicsLayer);
    helpDestroy();
    _destroyLayerAndSketch = () => void 0;
  };
}

// 测量回调
function onMeasure(graphic) {
  renderCellAnalysisHelper(graphic, (cells) => {
    areaMeasurement.value = sumBy(cells, (c) => c.attributes.area);
  });
}

function destroy() {
  state.value = "finish";
  scheduler.terminate();
  _destroyLayerAndSketch();
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
  position: absolute;
  right: 55px;
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
