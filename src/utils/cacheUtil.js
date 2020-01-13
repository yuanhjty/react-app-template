class Cache {
  constructor(storage) {
    this._storage = storage;
  }

  size() {
    return this._storage.length;
  }

  key(n) {
    return this._storage.key(n);
  }

  getItem(key) {
    let item = this._storage.getItem(key);
    try {
      item = JSON.parse(item);
    } catch (error) {}
    return item;
  }

  setItem(key, value) {
    return this._storage.setItem(key, JSON.stringify(value));
  }

  removeItem(key) {
    return this._storage.removeItem(key);
  }

  clear() {
    return this._storage.clear();
  }
}

export const localCache = new Cache(localStorage);
export const sessionCache = new Cache(sessionStorage);

const localCacheKeys = new Set();
export function registerLocalCacheKey(key) {
  if (localCacheKeys.has(key)) {
    console.error(`local cache key [${key}] already exists`);
  }
  return key;
}

const sessionCacheKeys = new Set();
export function registerSessionCacheKey(key) {
  if (sessionCacheKeys.has(key)) {
    console.error(`session cache key [${key}] already exists`);
  }
  return key;
}
