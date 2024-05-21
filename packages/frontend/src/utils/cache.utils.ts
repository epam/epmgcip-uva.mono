export enum CacheKey {
  Events = 'uvaEventsCache-',
}

const setCache =
  <T>(cacheKey: CacheKey, ttl: number) =>
  (key: string, data: T): void => {
    const now = new Date();
    const item = {
      data,
      expireAt: now.getTime() + ttl,
    };
    try {
      localStorage.setItem(cacheKey + key, JSON.stringify(item));
    } catch (e) {
      /* empty */
    }
  };

const getCache =
  <T>(cacheKey: CacheKey) =>
  (key: string): T | null => {
    try {
      const itemStr = localStorage.getItem(cacheKey + key);
      if (!itemStr) {
        return null;
      }
      const item = JSON.parse(itemStr);
      const now = new Date();
      if (now.getTime() > item.expireAt) {
        localStorage.removeItem(cacheKey + key);
        return null;
      }
      return item.data;
    } catch (e) {
      return null;
    }
  };

const clearCache =
  (cacheKey: CacheKey) =>
  (key: string): void => {
    try {
      localStorage.removeItem(cacheKey + key);
    } catch (e) {
      /* empty */
    }
  };

/**
 * Cache values to LS. Pass separate cacheKey for independend cache dictionary
 * and ttl to define time to live in seconds, default is 60 (1 minute).
 * */
export const cacheUtils = <T>(cacheKey: CacheKey, ttl: number = 60) => ({
  setCache: setCache<T>(cacheKey, ttl * 1000),
  getCache: getCache<T>(cacheKey),
  clearCache: clearCache(cacheKey),
});
