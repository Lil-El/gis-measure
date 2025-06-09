import * as volumeMeasure from "../scheduler/volumeMeasure.js";
import * as areaMeasure from "../scheduler/areaMeasure.js";
import * as lineMeasure from "../scheduler/lineMeasure.js";

self.onmessage = async function (event) {
  try {
    let result = null;

    const { invoke, args } = event.data;

    const [module, method] = invoke.split(".");

    if (module === "volumeMeasure") {
      result = await volumeMeasure[method](args);
    } else if (module === "areaMeasure") {
      result = await areaMeasure[method](args);
    } else if (module === "lineMeasure") {
      result = await lineMeasure[method](args);
    } else {
      console.error(`Unknown module: ${module}`);
    }

    self.postMessage(result);
  } catch (error) {
    self.postMessage({
      error: error.message,
      stack: error.stack,
      success: false,
      detail: "worker.js",
    });
  }
};
