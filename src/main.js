import { createApp } from "vue";
import "./style.css";
import "@arcgis/core/assets/esri/themes/light/main.css";
import "element-plus/dist/index.css";

import { ElLoading } from "element-plus";

import App from "./App.vue";

const app = createApp(App);

app.mount("#app");

app.directive("loading", ElLoading.directive);
