export * from "./chunkBuilder";
export * from "./geometric";
export * from "./getPool";

// 设置 label 标签
export function setCenterLabel(graphic, text) {
  const layer = graphic.layer;

  const center = graphic.geometry.extent.center;

  const labelGraphic = layer.graphics.find((g) => g.for === graphic);

  if (text === null) return void (labelGraphic.visible = false);

  const symbol = {
    type: "point-3d",
    verticalOffset: {
      screenLength: 15,
    },
    symbolLayers: [
      {
        type: "text",
        material: { color: "white" },
        text,
        size: 12,
        background: { color: [0, 0, 0, 0.6] },
        verticalAlignment: "bottom",
      },
    ],
  };

  if (labelGraphic) {
    labelGraphic.visible = true;
    labelGraphic.geometry = center;
    labelGraphic.symbol = symbol;
    return void 0;
  }

  layer.add({
    type: "graphic",
    geometry: center,
    symbol,
    for: graphic,
  });
}
