import { TaskProcessor } from "./TaskProcessor";

export class ThreadTaskProcessor extends TaskProcessor {
  #pool = null;

  constructor(pool) {
    super();
    this.#pool = pool;
  }

  /**
   * 添加需要在子线程中执行的任务
   * @param {Object} data
   */
  execute(data) {
    if (typeof data === "object") {
      return super.execute(data);
    } else {
      return Promise.reject("param must be object or array.", data);
    }
  }

  _processQueue() {
    const thread = this.#pool.getThread();
    if (!thread) return void 0;

    const task = this._taskQueue.shift();

    if (task) {
      this._runTask(task, thread);
    } else {
      this.#pool.recycleThread(thread);
    }
  }

  _runTask(task, thread) {
    const { handler: data, resolve, reject } = task;

    thread.postMessage.call(thread, data);

    thread.onmessage = (e) => {
      this.#pool.recycleThread(thread);
      this._handleTaskResponse(resolve, e.data);
    };
    thread.onerror = (e) => {
      this.#pool.destroyThread(thread);
      this._handleTaskError(reject, e);
    };
  }

  terminate(clearPool = false) {
    if (clearPool) this.#pool.terminate();

    super.terminate();
  }
}
