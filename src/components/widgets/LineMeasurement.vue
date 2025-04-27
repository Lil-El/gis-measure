<template>
  <div class="esri-widget">
    <div
      class="esri-widget--button esri-interactive esri-icon-measure-line"
      :class="[state !== 'finish' ? 'active' : '']"
      title="距离测量工具"
      @click="handleSwitch"
    ></div>

    <template v-if="state != 'finish'">
      <div class="measurement-container" v-show="state === 'ready'">
        <p>通过单击场景以放置您的第一个点来开始测量。</p>
      </div>

      <div class="measurement-container" v-show="state === 'active'" v-loading="loading">
        <div class="measurement-content">
          <div>距离</div>
          <div class=".esri-direct-line-measurement-3d__measurement-item-value">
            {{ Number(distance).toFixed(2) }} m
          </div>
        </div>
        <div id="line-control-slot"></div>
        <el-button class="measurement-button" @click="handleNew">新测量</el-button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, shallowRef } from "vue";

import { sumBy } from "lodash";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import useCellAnalysisHelper from "../hooks/useCellAnalysisHelper";
import createLineMeasureScheduler from "../scheduler/lineMeasure";

import { ElButton } from "element-plus";
const props = defineProps(["view"]);

// 状态
const state = ref("finish"); // ready | active | finish

// 测量结果
const distance = ref(0);

const scheduler = createLineMeasureScheduler();

const { loading, renderCellAnalysisHelper, helpDestroy } = useCellAnalysisHelper(
  props.view,
  scheduler,
  "#line-control-slot"
);

// 图层、Sketch 销毁函数
let _destroyLayerAndSketch = () => void 0;

// 控件开关
function handleSwitch() {
  state.value = state.value === "finish" ? "ready" : "finish";
  if (state.value === "finish") {
    _destroyLayerAndSketch();
  } else {
    _destroyLayerAndSketch = startSketch();
  }
}

// 新测量
function handleNew() {
  _destroyLayerAndSketch();
  state.value = "ready";
  _destroyLayerAndSketch = startSketch();
}

// 开始测量
function startSketch() {
  distance.value = 0;

  const view = props.view;
  const map = view.map;

  const graphicsLayer = new GraphicsLayer({
    id: "measure-line",
    elevationInfo: {
      mode: "on-the-ground",
    },
  });
  map.add(graphicsLayer);

  const sketchViewModel = new SketchViewModel({
    view,
    layer: graphicsLayer,
    polylineSymbol: {
      type: "line-3d",
      symbolLayers: [
        {
          type: "line",
          size: "3px",
          material: {
            color: "#00ccff",
          },
        },
      ],
    },
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

  sketchViewModel.on("create", (evt) => {
    if (evt.state === "start") state.value = "active";
    if (evt.state === "complete") onMeasure(evt.graphic);
  });

  sketchViewModel.on("update", (evt) => {
    if (evt.state === "complete") onMeasure(evt.graphics[0]);
  });

  sketchViewModel.create("polyline");

  return () => {
    sketchViewModel.destroy();
    map.remove(graphicsLayer);
    helpDestroy();
    _destroyLayerAndSketch = () => void 0;
  };
}

// 防抖：测量回调
function onMeasure(graphic) {
  renderCellAnalysisHelper(graphic, (cells) => {
    distance.value = sumBy(
      cells.filter((cell) => cell.geometry.type === "polyline"),
      (c) => c.attributes.distance
    );

    setCenterLabel(graphic, distance.value.toFixed(2) + " m");
  });
}

// 设置 label 标签
function setCenterLabel(graphic, text) {
  const layer = graphic.layer;

  const center = graphic.geometry.extent.center;

  const labelGraphic = layer.graphics.find((g) => g.for === graphic);

  if (text === null) return void (labelGraphic.visible = false);

  const symbol = {
    type: "point-3d",
    verticalOffset: {
      screenLength: 15,
    },
    symbolLayers: [
      {
        type: "text",
        material: { color: "white" },
        text,
        size: 12,
        background: { color: [0, 0, 0, 0.6] },
        verticalAlignment: "bottom",
      },
    ],
  };

  if (labelGraphic) {
    labelGraphic.visible = true;
    labelGraphic.geometry = center;
    labelGraphic.symbol = symbol;
    return void 0;
  }

  layer.add({
    type: "graphic",
    geometry: center,
    symbol,
    for: graphic,
  });
}

function destroy() {
  loading.value = false;
  state.value = "finish";
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
