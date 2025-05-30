import { ref, h, reactive, render, watchEffect } from "vue";
import { ElSlider, ElSwitch } from "element-plus";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GroupLayer from "@arcgis/core/layers/GroupLayer.js";
import { geodesicArea, geodesicLength } from "@arcgis/core/geometry/geometryEngine.js";
import { IdleTaskProcessor } from "@lil-el/task-processor";

const LAYER_NAME = "MEASURE_HELPER";

export default function useCellAnalysisHelper(view, scheduler, slotSelector) {
  const map = view.map;

  const _open = ref(!false);

  const loading = ref(false);

  const _offsetZ = ref(5);

  const _precision = reactive({});

  const processor = new IdleTaskProcessor();

  let _currentWork = "";

  let _executeMeasureWork = null;

  let _callback = () => void 0;

  function createFeatureLayer(view, geometryType) {
    return new FeatureLayer({
      id: geometryType,
      elevationInfo: {
        mode: "absolute-height",
        offset: _offsetZ.value,
      },
      fields: [
        {
          name: "oid",
          alias: "自定义ID",
          type: "oid",
        },
        {
          name: "type",
          alias: "要素类型",
          type: "string",
        },
        {
          name: "render",
          alias: "渲染方式",
          type: "string",
        },
        {
          name: "relation",
          alias: "空间关系",
          type: "string",
        },
        {
          name: "height",
          alias: "高度",
          type: "double",
        },
        {
          name: "work",
          alias: "所属任务",
          type: "string",
        },
      ],
      geometryType,
      objectIdField: "oid",
      source: [],
      spatialReference: view.spatialReference,
      hasZ: true,
      returnZ: true,
    });
  }

  function createRenderer(type, features) {
    if (type === "point") {
      return {
        type: "simple",
        symbol: {
          type: "point-3d",
          symbolLayers: [
            {
              type: "icon",
              size: 3,
              resource: { primitive: "circle" },
              material: { color: [183, 36, 255] },
            },
          ],
        },
      };
    } else if (type === "polyline") {
      return {
        type: "simple",
        symbol: {
          type: "line-3d",
          symbolLayers: [
            {
              type: "line",
              size: 3,
              material: {
                color: [0, 255, 0],
              },
            },
          ],
        },
      };
    } else if (type === "polygon") {
      const feature3d = features.filter((f) => f.attributes.render === "polygon-3d");

      // 面积类型
      if (!feature3d.length)
        return {
          type: "unique-value",
          field: "relation",
          field2: "render",
          fieldDelimiter: ", ",
          uniqueValueInfos: [
            {
              value: "intersect, simple-fill",
              symbol: {
                type: "simple-fill",
                color: [255, 255, 255, 0.8],
                outline: {
                  color: [183, 36, 255, 0.8],
                  width: 1.5,
                },
              },
            },
            {
              value: "inside, simple-fill",
              symbol: {
                type: "simple-fill",
                color: [255, 255, 255, 0.8],
                outline: {
                  color: [0, 255, 0, 0.8],
                  width: 1.5,
                },
              },
            },
            {
              value: "outside, simple-fill",
              symbol: {
                type: "simple-fill",
                color: [0, 0, 0, 0],
                outline: {
                  color: [255, 0, 0, 0.8],
                  width: 1,
                },
              },
            },
          ],
        };
      // 体积类型
      else
        return {
          type: "simple",
          symbol: {
            type: "polygon-3d",
            symbolLayers: [{ type: "extrude" }],
          },
          visualVariables: [
            {
              type: "size",
              field: "height",
            },
            {
              type: "color",
              field: "height",
              stops: [
                {
                  value: Math.min(...feature3d.map((f) => f.attributes.height)),
                  color: "#FFFCD4",
                },
                {
                  value: Math.max(...feature3d.map((f) => f.attributes.height)),
                  color: [153, 83, 41],
                },
              ],
            },
          ],
        };
    }
  }

  // 核心
  async function renderCellAnalysisHelper(graphic, callback) {
    const measuredVal =
      graphic.geometry.type === "polygon"
        ? geodesicArea(graphic.geometry, "square-meters")
        : geodesicLength(graphic.geometry, "meters");

    _executeMeasureWork = scheduler.start.bind(scheduler, graphic);

    _callback = callback;

    renderControlEl(slotSelector, measuredVal);

    loading.value = true;

    await scheduler.syncView(map, graphic.geometry);

    handleMeasureWork();
  }

  // 进行测量
  function handleMeasureWork() {
    if (!_executeMeasureWork) return void 0;

    loading.value = true;

    let { work, tasks } = _executeMeasureWork(_precision.value);
    _currentWork = work;

    if (!_open.value) {
      return Promise.all(tasks)
        .then((chunks) => chunks.flat())
        .then(_callback)
        .finally(() => {
          loading.value = false;
        });
    }

    let layer = map.findLayerById(LAYER_NAME);

    if (!layer) {
      layer = new GroupLayer({
        id: LAYER_NAME,
        layers: [],
      });
      map.add(layer);
    }

    removeFeatures(layer);

    const cells = [];

    return Promise.all(
      tasks.map((task) =>
        task.then((cellChunk) => (cells.push(...cellChunk), cellChunk)).then(processRenderTask.bind(null, layer))
      )
    )
      .then(() => _callback(cells))
      .finally(() => {
        loading.value = false;
        removeFeatures(layer);
      });
  }

  // 执行渲染任务
  function processRenderTask(layer, cellChunk) {
    const group = Object.groupBy(cellChunk, (cell) => cell.attributes.type);

    return processor
      .execute(genFeatureTask(layer, group))
      .then((featureArr) => Object.groupBy(featureArr, (r) => r.layerType))
      .then((layerObj) => {
        return Promise.all(
          Object.keys(layerObj).map((layerType) => {
            let featureLayer = layer.findLayerById(layerType);
            const features = layerObj[layerType].map((i) => i.feature);
            return featureLayer.applyEdits({
              addFeatures: features,
            });
          })
        );
      });
  }

  // 生成单个渲染任务
  function* genFeatureTask(layer, group) {
    for (const type in group) {
      let featureLayer = layer.findLayerById(type);

      if (!featureLayer) layer.add((featureLayer = createFeatureLayer(view, type)));

      featureLayer.renderer = createRenderer(type, group[type]);

      for (let i = 0; i < group[type].length; i++) {
        yield {
          feature: group[type][i],
          layerType: type,
        };
      }
    }
  }

  // 移除 feature
  function removeFeatures(layer) {
    layer.layers.forEach((l) => {
      l.queryObjectIds({
        where: `work <> '${_currentWork}'`,
      }).then(function (results) {
        if (results.length) {
          l.applyEdits({
            deleteFeatures: results.map((i) => ({ objectId: i })),
          });
        }
      });
    });
  }

  // 渲染dom
  function renderControlEl(selector, val) {
    const container = document.querySelector(selector);

    const precisionInfo = getDynamicPrecision(val);

    if (precisionInfo.min !== _precision.min) {
      Object.assign(_precision, precisionInfo);
    }

    watchEffect(() => {
      const heightNode = h("div", [
        h("span", "高度偏移"),
        h(ElSlider, {
          modelValue: _offsetZ.value,
          min: 0,
          max: 20,
          "onUpdate:modelValue": (value) => {
            _offsetZ.value = value;
          },
          onInput: setGraphicsElevation,
        }),
      ]);

      const precisionNode = h("div", { style: "margin-bottom: 14px;" }, [
        h("span", "精度"),
        h(ElSlider, {
          modelValue: _precision.value,
          min: _precision.min,
          max: _precision.max,
          step: _precision.step,
          marks: _precision.marks,
          showStops: true,
          "onUpdate:modelValue": (value) => {
            _precision.value = value;
          },
          onChange(v) {
            handleMeasureWork();
          },
        }),
      ]);

      const controlNode = h("div", { style: "margin-bottom: 6px;" }, [
        h("span", { style: "margin-right: 10px;" }, "可视化"),
        h(ElSwitch, {
          modelValue: _open.value,
          size: "small",
          onChange(v) {
            _open.value = v;
            if (v) {
              handleMeasureWork();
            } else {
              helpDestroy();
            }
          },
        }),
      ]);

      const node = h("div", [controlNode, _open.value ? heightNode : null, _open.value ? precisionNode : null]);

      render(node, container);
    });
  }

  // 获取动态精度
  function getDynamicPrecision(val) {
    let min,
      max,
      step,
      value,
      marks = {};

    if (val <= 2500) {
      if (val <= 300) {
        min = 0.2;
      } else {
        min = Number(Number(Math.ceil((val - 300) / 440) * 0.1 + 0.2).toFixed(2));
      }
      step = 0.2;
    } else {
      min = Number(Number(Math.floor(val / 2500) * 0.1 + 0.7).toFixed(2));
      max = min * 3;
      step = Number(((max - min) / 4).toFixed(2));
    }

    for (let i = 0; i < 5; i++) {
      const key = Number((min + i * step).toFixed(2));

      marks[`${key}`] = ["高", "较高", "适中", "较低", "低"][i];

      if (i === 2) value = key;
      if (i === 4) max = key;
    }

    return { min, max, step, marks, value };
  }

  // 调整图层高度
  function setGraphicsElevation(elevation) {
    const layer = map.findLayerById(LAYER_NAME);
    layer.layers.forEach((l) => {
      l.elevationInfo = {
        mode: "absolute-height",
        offset: elevation,
      };
    });
  }

  // 图层销毁
  function helpDestroy() {
    map.remove(map.findLayerById(LAYER_NAME));
  }

  return {
    loading,
    renderCellAnalysisHelper,
    helpDestroy,
  };
}
