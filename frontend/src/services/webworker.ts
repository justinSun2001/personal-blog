// worker.ts
self.onmessage = function (_) {
  const list: number[] = [];
  for (let i = 0; i < 10000000; ++i) {
    list.push(Date.now());
  }
  self.postMessage(list.length);  // 返回数组的长度
}
