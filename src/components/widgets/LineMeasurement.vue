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
import useWidget from "../hooks/useWidget";
import createLineMeasureScheduler from "../scheduler/lineMeasure";
import { setCenterLabel } from "../utils";

const props = defineProps(["view"]);

const emits = defineEmits(["active"]);

// 测量结果
const distance = ref(0);

const scheduler = createLineMeasureScheduler();

const { state, handleSwitch, handleNew, destroy } = useWidget(
  emits.bind(null, "active", "line"),
  startSketch,
  scheduler.terminate
);

const { loading, renderCellAnalysisHelper, helpDestroy } = useCellAnalysisHelper(
  props.view,
  scheduler,
  "#line-control-slot"
);

// 开始测量
function startSketch() {
  distance.value = 0;

  const view = props.view;
  const map = view.map;

  const graphicsLayer = new GraphicsLayer({
    id: "measurement",
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
