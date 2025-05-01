import { IframeWorkerWrapper } from "../core/IframeWorker";
import { ThreadPool } from "@lil-el/thread-pool";
import WebWorkerWrapper from "../core/worker.js?worker";

/**
 * 测量使用同一线程池
 */

let threadPool = null;

let viewPool = null;

// iframe 和 worker 中禁止创建
if (typeof document !== "undefined" && !window.uuid) {
  threadPool = new ThreadPool(WebWorkerWrapper, navigator.hardwareConcurrency || 4);
  viewPool = new ThreadPool(IframeWorkerWrapper.bind(null, `${location.href}/`), 2, true);
}

export { threadPool, viewPool };
