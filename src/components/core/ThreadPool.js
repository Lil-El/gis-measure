export class ThreadPool {
  ThreadConstructor;

  maxThreads = 0;

  #threads = [];

  #idleThreads = [];

  constructor(ThreadConstructor, maxThreads, preload = false) {
    this.ThreadConstructor = ThreadConstructor;
    this.maxThreads = maxThreads;

    if (preload) {
      this.fillThreads();
    }
  }

  get threads() {
    return this.#threads;
  }

  fillThreads() {
    for (let i = this.#threads.length; i < this.maxThreads; i++) {
      this.#idleThreads.push(this.#createThread());
    }
  }

  getThread() {
    if (this.#idleThreads.length) {
      return this.#idleThreads.pop();
    } else if (this.#threads.length < this.maxThreads) {
      return this.#createThread();
    }
  }

  #createThread() {
    if (this.#threads.length >= this.maxThreads) return void console.log("Max threads reached.");

    const thread = this.ThreadConstructor();
    this.#threads.push(thread);

    return thread;
  }

  recycleThread(thread) {
    this.#idleThreads.push(thread);
  }

  destroyThread(thread) {
    thread.terminate();
    const index = this.#threads.indexOf(thread);
    if (index !== -1) {
      this.#threads.splice(index, 1);
    }
  }

  terminate() {
    this.#threads.forEach((thread) => thread.terminate());
    this.#threads = [];
    this.#idleThreads = [];
  }
}
