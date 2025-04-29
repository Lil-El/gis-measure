import { ref } from "vue";

/**
 *
 * @param {()=>Function} onSketch return 每次绘制结束时的绘制销毁回调函数
 * @param {Function} onDestroy
 * @returns
 */
export default function useWidget(_emits, onSketch, onDestroy) {
  // ready | finish | active
  const state = ref("finish");

  // 图层、Sketch 销毁函数
  let _destroyLayerAndSketch = () => void 0;

  // 控件开关
  function handleSwitch() {
    state.value = state.value === "finish" ? "ready" : "finish";
    if (state.value === "finish") {
      destroy();
      _emits("off");
    } else {
      _destroyLayerAndSketch = onSketch();
      _emits("on");
    }
  }

  // 新测量
  function handleNew() {
    destroy();
    state.value = "ready";
    _destroyLayerAndSketch = onSketch();
  }

  // 销毁
  function destroy() {
    state.value = "finish";
    onDestroy();
    _destroyLayerAndSketch();
    _destroyLayerAndSketch = () => void 0;
  }

  return {
    state,
    handleSwitch,
    handleNew,
    destroy,
  };
}
