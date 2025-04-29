import _ from "lodash";

export class TaskProcessor {
  // _ 约定 protected 属性

  _active = null;

  _taskQueue = [];

  constructor() {
    this._init();
    // console.log(_.find([1, 2, 3, 4, 5, 6], (v) => v > 5));
  }

  _init() {
    this._active = null;
    this._taskQueue = [];
  }

  execute(handler) {
    return new Promise((resolve, reject) => {
      this._taskQueue.push({ handler, resolve, reject });
      this._processQueue();
    });
  }

  _processQueue() {
    if (this._active) return;

    const task = this._taskQueue.shift();

    if (task) {
      this._active = task;
      this._runTask(task);
    }
  }

  async _runTask(task, result = []) {
    const { handler, resolve, reject } = task;

    try {
      result.push(await handler.call());
      this._handleTaskResponse(resolve, result);
    } catch (error) {
      this._handleTaskError(reject, error);
    }
  }

  _handleTaskResponse(resolve, result) {
    resolve(result);
    this._active = null;
    this._processQueue();
  }

  _handleTaskError(reject, error) {
    reject(error);
    this._active = null;
    this._processQueue();
  }

  terminate() {
    if (this._active) {
      this._active.reject("任务终止");
    }
    this._taskQueue.forEach((task) => task.reject("任务终止"));
    this._init();
  }
}
