# processor

Processor：任务处理器，可以依照迭代器的顺序执行任务。

- IdleTaskProcessor：空闲任务处理器，可以依照迭代器的顺序执行任务，不需要设置线程池。任务会直接执行。
  - 在空闲时执行 feature 渲染的任务。
- ThreadTaskProcessor：线程任务处理器，并且需要设置线程池。任务会从线程池中获取线程执行。
  - 在线程池中执行空间计算的任务。
- IframeTaskProcessor：框架任务处理器，并且需要设置线程池。任务会从 iframe 中执行。
  - 在 iframe 页面中执行依赖于 DOM 的任务。

ThreadPool：线程池，设置线程数量，并且要设置线程的创建函数。

- WebWorker：设置 worker 创建函数。
  - `import WebWorkerWrapper from "./worker?worker"` 使用 vite 内置方式加载 worker。
- IframeWorker：设置自定义的 iframe worker 创建函数。
  - 自定义 iframe worker，并实现 postMessage、onmessage 等方法。

# arcgis-measure

- 实现沿地表的距离测量、面积测量、体积测量。
- 根据微积分的核心，将距离、平面分割为多个单元，然后对所有单元进行测量、计算，得出最终结果；
