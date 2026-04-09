window.PMRV = window.PMRV || {};

PMRV.patrulhamentoStore = (function() {
  const STORAGE_KEY = 'pmrv_pat_lote';
  let veiculos = [];

  function sanitizeList(value) {
    return Array.isArray(value) ? value : [];
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(veiculos));
  }

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      veiculos = [];
      return veiculos;
    }

    try {
      veiculos = sanitizeList(JSON.parse(raw));
    } catch (error) {
      console.error('Erro ao carregar cache de patrulhamento', error);
      veiculos = [];
    }

    return veiculos;
  }

  function getAll() {
    return veiculos;
  }

  function add(entry) {
    veiculos.unshift(entry);
    persist();
    return veiculos;
  }

  function removeAt(index) {
    if (index < 0 || index >= veiculos.length) return veiculos;
    veiculos.splice(index, 1);
    persist();
    return veiculos;
  }

  function clear() {
    veiculos = [];
    persist();
    return veiculos;
  }

  return {
    add,
    clear,
    getAll,
    load,
    removeAt
  };
})();
