
/**
 * PMRV Data Manager
 * Gerenciamento assíncrono de dados com cache em IndexedDB.
 */
window.PMRV = window.PMRV || {};

PMRV.dataManager = (function() {
  const DB_NAME = 'PMRV_Data';
  const DB_VERSION = 1;
  const STORES = ['resources'];

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        STORES.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store);
          }
        });
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getFromCache(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['resources'], 'readonly');
      const store = transaction.objectStore('resources');
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveToCache(key, data) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['resources'], 'readwrite');
      const store = transaction.objectStore('resources');
      const request = store.put(data, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Carrega um recurso JSON, priorizando o cache local (IndexedDB).
   * @param {string} key Identificador único do recurso.
   * @param {string} url Caminho do arquivo JSON.
   */
  async function loadResource(key, url) {
    try {
      // 1. Tenta recuperar do cache
      const cached = await getFromCache(key);
      if (cached) {
        console.log(`[DataManager] ${key} carregado do cache.`);
        return cached;
      }

      // 2. Se não houver cache, faz o fetch
      console.log(`[DataManager] ${key} não encontrado no cache. Iniciando fetch de ${url}...`);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      // 3. Salva no cache para uso futuro (em background)
      saveToCache(key, data).catch(err => console.error(`[DataManager] Erro ao salvar cache de ${key}:`, err));

      return data;
    } catch (err) {
      console.error(`[DataManager] Falha ao carregar recurso ${key}:`, err);
      throw err;
    }
  }

  return {
    loadResource,
    clearCache: async () => {
      const db = await openDB();
      const transaction = db.transaction(['resources'], 'readwrite');
      transaction.objectStore('resources').clear();
    }
  };
})();
