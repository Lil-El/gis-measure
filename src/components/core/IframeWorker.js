export class IframeWorker {
  name = "IframeWorker";

  #uuid = null;

  #controller = null;

  #iframe = null;

  #mountedTask = null;

  constructor(href) {
    const { promise, resolve, reject } = Promise.withResolvers();
    this.#mountedTask = { promise, resolve, reject };

    this.#uuid = crypto.randomUUID();

    this.#iframe = this.#createFrame(href, this.#uuid);

    this.#controller = new AbortController();

    window.addEventListener("message", this.#onMessage.bind(this), {
      signal: this.#controller.signal,
    });
  }

  postMessage(data) {
    return this.#mountedTask.promise.then(() => {
      this.#iframe.contentWindow.postMessage(data);
    });
  }

  onmessage = () => void 0;

  terminate() {
    document.body.removeChild(this.#iframe);
    this.#iframe = null;
    this.#controller.abort();
  }

  #createFrame(href, uuid) {
    const iframe = document.createElement("iframe");
    iframe.src = href;
    iframe.style.position = "fixed";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";

    iframe.contentWindow.uuid = uuid;

    return iframe;
  }

  #onMessage(evt) {
    const { uuid, invoke, ...data } = evt.data;

    if (uuid !== this.#uuid) return void 0;

    if (invoke === "mounted") {
      return void this.#mountedTask.resolve();
    }

    this.onmessage(data);
  }
}

export function IframeWorkerWrapper(href) {
  return new IframeWorker(href);
}
