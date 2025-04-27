/**
 * 创建分块生成器
 * @param {number} loopCount
 * @param {number} offset
 * @returns {Function}
 *
 * worker 处理5000个分块，耗时600ms左右
 */
export function createChunkBuilder(loopCount, offset = 5000) {
  /**
   * 构建分块
   * @param {(start: number, end: number) => T} chunkGenerator
   * @returns {Array<T>}
   */
  return function buildChunks(chunkGenerator) {
    const chunks = [];

    let start = 0;

    while (start <= loopCount) {
      chunks.push(chunkGenerator(start, Math.min(loopCount, start + offset)));
      start += offset;
    }

    return chunks;
  };
}
