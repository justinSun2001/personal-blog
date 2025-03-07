// 解码 HTML 实体的辅助函数
export function decodeHtmlEntity(encodedString: string): string {
  const element = document.createElement('div');
  element.innerHTML = encodedString;
  return element.textContent || element.innerText || '';
}
// 定义可包含 `title` 和 `summary` 属性的类型
interface Article {
  title: string;
  summary: string;
  [key: string]: unknown; // 其他字段，允许任意其他属性
}
// 递归处理嵌套数组或对象中的数据
export function decodeNestedData(data: Article[] | Article): unknown {
  if (Array.isArray(data)) {
    // 如果是数组，遍历每一项
    return data.map((item) => decodeNestedData(item));
  } else if (typeof data === 'object' && data !== null) {
    // 如果是对象，遍历每个属性
    Object.keys(data).forEach((key) => {
      if (key === 'title' || key === 'summary') {
        // 如果属性名是 title 或 summary，进行解码
        data[key] = decodeHtmlEntity(data[key]);
      }
      // else {
      //   // 对其他字段递归处理
      //   data[key] = decodeNestedData(data[key]);
      // }
    });
  }
  return data;
}
