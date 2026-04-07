/**
 * PMRV Data Manager
 * Gerenciamento assíncrono de dados com cache em IndexedDB.
 */
window.PMRV = window.PMRV || {};

PMRV.dataManager = (function() {
  const DB_NAME = 'PMRV_Data';
  const DB_VERSION = 1;
  const STORE_NAME = 'resources';
  const RESOURCE_VERSIONS = {
    gps_data: 2,
    infracoes: 2
  };

  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = event => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = event => resolve(event.target.result);
      request.onerror = event => reject(event.target.error);
    });

    return dbPromise;
  }

  async function getStore(mode) {
    const db = await openDB();
    return db.transaction([STORE_NAME], mode).objectStore(STORE_NAME);
  }

  async function getFromCache(key) {
    const store = await getStore('readonly');
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveToCache(key, url, data) {
    const store = await getStore('readwrite');
    const payload = {
      version: RESOURCE_VERSIONS[key] || 1,
      url,
      updatedAt: Date.now(),
      data
    };

    return new Promise((resolve, reject) => {
      const request = store.put(payload, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  function isValidCachedResource(key, url, cached) {
    if (!cached || typeof cached !== 'object' || !('data' in cached)) return false;
    return cached.version === (RESOURCE_VERSIONS[key] || 1) && cached.url === url;
  }

  async function loadResource(key, url) {
    try {
      const cached = await getFromCache(key);
      if (isValidCachedResource(key, url, cached)) {
        console.log(`[DataManager] ${key} carregado do cache.`);
        return cached.data;
      }

      console.log(`[DataManager] ${key} não encontrado no cache válido. Iniciando fetch de ${url}...`);
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      saveToCache(key, url, data).catch(err => console.error(`[DataManager] Erro ao salvar cache de ${key}:`, err));
      return data;
    } catch (err) {
      console.error(`[DataManager] Falha ao carregar recurso ${key}:`, err);
      throw err;
    }
  }

  async function clearCache() {
    const store = await getStore('readwrite');
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  return {
    loadResource,
    clearCache
  };
})();
