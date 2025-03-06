// 定义 IndexedDB 中存储的数据类型
interface CachedData {
  url: string;
  data: unknown;
  etag: string;
  timestamp: number;
}

// 打开 IndexedDB 数据库
export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('myCacheDB', 1);

    request.onsuccess = function (event) {
      resolve((event.target as IDBRequest)?.result as IDBDatabase); // 返回数据库对象
    };

    request.onerror = function () {
      reject('打开数据库失败');
    };

    // 数据库版本升级时触发
    request.onupgradeneeded = function (event) {
      const db = (event.target as IDBRequest)?.result as IDBDatabase;
      // 创建对象存储
      if (!db.objectStoreNames.contains('articlesData')) {
        db.createObjectStore('articlesData', { keyPath: 'url' });
      }
    };
  });
}

// 存储数据到 IndexedDB
export function storeDataToIndexedDB(url: string, data: unknown, etag: string): void {
  openDatabase()
    .then((db) => {
      const transaction = db.transaction(['articlesData'], 'readwrite');
      const store = transaction.objectStore('articlesData');

      const item: CachedData = {
        url: url,
        data: data,
        etag: etag, // 存储 ETag 信息
        timestamp: Date.now(), // 存储时间戳，用于检查缓存是否过期
      };

      store.put(item); // 使用 put() 方法存储数据，如果键已存在则更新
      transaction.oncomplete = function () {
        console.log('数据成功存储到 IndexedDB');
      };
      transaction.onerror = function () {
        console.error('数据存储失败');
      };
    })
    .catch((error) => {
      console.error('打开数据库失败:', error);
    });
}

// 从 IndexedDB 获取数据
export function getDataFromIndexedDB(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    openDatabase()
      .then((db) => {
        const transaction = db.transaction(['articlesData'], 'readonly');
        const store = transaction.objectStore('articlesData');

        const request = store.get(url); // 使用 URL 作为 key 获取数据
        request.onsuccess = function (event) {
          const cachedData = (event.target as IDBRequest)?.result as CachedData;
          if (cachedData) {
            console.log('从 IndexedDB 获取数据成功');
            resolve(cachedData.data); // 返回存储的数据
          } else {
            reject('没有找到缓存的数据');
          }
        };
        request.onerror = function () {
          reject('读取数据失败');
        };
      })
      .catch((error) => {
        reject('打开数据库失败:' + error);
      });
  });
}

// 获取 ETag 值
export function getEtagFromIndexedDB(url: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    openDatabase()
      .then((db) => {
        const transaction = db.transaction(['articlesData'], 'readonly');
        const store = transaction.objectStore('articlesData');

        const request = store.get(url); // 使用 URL 作为 key 获取数据
        request.onsuccess = function (event) {
          const cachedData = (event.target as IDBRequest)?.result as CachedData;
          if (cachedData) {
            console.log('从 IndexedDB 获取 ETag 成功');
            resolve(cachedData.etag); // 返回 ETag 信息
          } else {
            console.log('没有找到缓存的数据');
            resolve(null); // 没有找到缓存的数据时返回 null
          }
        };
        request.onerror = function () {
          reject('读取 ETag 失败');
        };
      })
      .catch((error) => {
        reject('打开数据库失败:' + error);
      });
  });
}
