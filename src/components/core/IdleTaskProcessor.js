import { TaskProcessor } from "./TaskProcessor";

export class IdleTaskProcessor extends TaskProcessor {
  #callbackID = null;

  constructor() {
    super();
    this._init();
  }

  /**
   * 添加在主线程空闲时中执行的任务
   * @param {AsyncGenerator | Generator | Iterator} iterator
   */
  execute(iterator) {
    if (["AsyncGenerator", "Generator"].includes(iterator[Symbol.toStringTag]) || iterator instanceof Iterator) {
      return super.execute(iterator);
    } else {
      return Promise.reject("param must be iterator.", iterator);
    }
  }

  _processQueue() {
    if (this._active) return;

    const task = this._taskQueue.shift();

    if (task) {
      this._active = task;
      this.#callbackID = requestIdleCallback((deadline) => this._runTask(deadline, task));
    }
  }

  async _runTask(deadline, task, result = []) {
    const { handler: iterator, resolve, reject } = task;

    try {
      while (deadline.timeRemaining() > 0) {
        let current = iterator.next();

        // 异步迭代器
        if (current instanceof Promise) current = await current;

        const { value: taskOrResult, done } = current;

        if (done) {
          return void this._handleTaskResponse(resolve, result);
        }

        if (typeof taskOrResult === "function") {
          result.push(await taskOrResult.call());
        } else {
          result.push(taskOrResult);
        }
      }

      this.#callbackID = requestIdleCallback((deadline) => this._runTask(deadline, task, result));
    } catch (error) {
      this._handleTaskError(reject, error);
    }
  }

  terminate() {
    cancelIdleCallback(this.#callbackID);
    super.terminate();
  }
}
