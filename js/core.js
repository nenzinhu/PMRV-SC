/* ---------------------------------------------------------------
   NAMESPACE GLOBAL PMRV - CORE ENGINE
--------------------------------------------------------------- */
window.PMRV = window.PMRV || {};

PMRV.core = (function() {
  const SCREENS = [
    'home', 'assumir', 'patrulhamento', 'infracoes', 'envolvidos', 'pmrv', 'danos',
    'relatorio', 'pesos', 'tacografo', 'croqui', 'rodovias-ref', 'docs',
    'guia-ciclomotores', 'guia-estrangeiros', 'prazos-transito', 'prazos-gerais',
    'guia-aet', 'guia-sinistros', 'help', 'ended', 'module-missing'
  ];
  const APP_WIDE_SCREENS = new Set(['infracoes', 'croqui']);

  function getExistingScreen(name) {
    return document.getElementById('screen-' + name) ? name : null;
  }

  function go(name) {
    const requestedTarget = getExistingScreen(name);
    const fallbackTarget = getExistingScreen('module-missing') || 'home';
    const target = requestedTarget || (name === 'home' ? 'home' : fallbackTarget);

    if (!requestedTarget && name !== 'home') {
      const missingModuleName = document.getElementById('missing-module-name');
      if (missingModuleName) missingModuleName.innerText = name;
    }

    SCREENS.forEach(id => {
      const el = document.getElementById('screen-' + id);
      if (el) el.classList.toggle('active', id === target);
    });

    const app = document.querySelector('.app');
    if (app) app.classList.toggle('app-wide', APP_WIDE_SCREENS.has(target));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (target === 'pesos' && typeof window.pes_init === 'function') window.pes_init();
    if (target === 'tacografo' && typeof window.tac_init === 'function') window.tac_init();
    if (target === 'prazos-transito' && typeof window.prazos_init === 'function') window.prazos_init();
    if (target === 'patrulhamento' && typeof window.pat_init === 'function') window.pat_init();
    if (target === 'pmrv' && typeof window.pmrv_init === 'function') window.pmrv_init();
    if (target === 'danos' && typeof window.danPrepararTela === 'function') window.danPrepararTela();
    if (target === 'docs') docs_switchTab('ciclomotores');
  }

  function cic_switchTab(tab) {
    const contentRegras = document.getElementById('cic-content-regras');
    const contentDecisao = document.getElementById('cic-content-decisao');
    const tabRegras = document.getElementById('tab-cic-regras');
    const tabDecisao = document.getElementById('tab-cic-decisao');
    if (contentRegras && contentDecisao) {
      contentRegras.classList.toggle('hidden', tab !== 'regras');
      contentDecisao.classList.toggle('hidden', tab !== 'decisao');
      tabRegras?.classList.toggle('btn-primary', tab === 'regras');
      tabDecisao?.classList.toggle('btn-primary', tab === 'decisao');
    }
  }

  function docs_switchTab(tab) {
    const tabs = ['ciclomotores'];
    tabs.forEach(id => {
      document.getElementById('docs-content-' + id)?.classList.toggle('hidden', id !== tab);
      document.getElementById('tab-docs-' + id)?.classList.toggle('btn-primary', id === tab);
    });
    if (tab === 'ciclomotores') docs_ciclomotoresSwitchTab('');
  }

  function docs_ciclomotoresSwitchTab(tab) {
    const tabs = ['lei', 'fiscalizar', 'como-fazer', 'autuar', 'nao-autuar', 'equipamentos', 'documentos'];
    tabs.forEach(id => {
      document.getElementById('docs-ciclomotores-' + id)?.classList.toggle('hidden', !tab || id !== tab);
      document.getElementById('tab-docs-ciclomotores-' + id)?.classList.toggle('btn-primary', id === tab);
    });
    document.getElementById('docs-ciclomotores-placeholder')?.classList.toggle('hidden', !!tab);
  }

  function sin_zoom(code, title, desc, img) {
    const modal = document.getElementById('sin-zoom-modal');
    const codeEl = document.getElementById('sin-zoom-code');
    const titleEl = document.getElementById('sin-zoom-title');
    const descEl = document.getElementById('sin-zoom-desc');
    const imgEl = document.getElementById('sin-zoom-img');
    if (!modal || !codeEl || !titleEl || !descEl || !imgEl) return;

    codeEl.innerText = code;
    titleEl.innerText = title;
    descEl.innerText = desc;
    imgEl.src = 'img/sinistros/' + img;
    modal.classList.add('show');
  }

  function sin_closeZoom() {
    document.getElementById('sin-zoom-modal')?.classList.remove('show');
  }

  function sin_closeZoomOnBackdrop(e) {
    if (e.target.id === 'sin-zoom-modal') sin_closeZoom();
  }

  function limparCache() {
    Object.keys(window.localStorage || {})
      .filter(key => key.startsWith('pmrv_'))
      .forEach(key => localStorage.removeItem(key));
  }

  function runDeclarativeCode(attr, target, event) {
    const code = target.getAttribute(attr);
    try {
      const fn = new Function('event', code);
      fn.call(target, event);
    } catch (err) {
      console.error(err);
    }
  }

  function bindDeclarativeHandlers() {
    document.addEventListener('click', e => {
      const target = e.target.closest('[data-click]');
      if (target) runDeclarativeCode('data-click', target, e);
    });

    document.addEventListener('input', e => {
      const target = e.target.closest('[data-input]');
      if (target) runDeclarativeCode('data-input', target, e);
    });

    document.addEventListener('change', e => {
      const target = e.target.closest('[data-change]');
      if (target) runDeclarativeCode('data-change', target, e);
    });

    document.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const target = e.target.closest('[data-keydown-enter]');
      if (!target) return;
      e.preventDefault();
      runDeclarativeCode('data-keydown-enter', target, e);
    });
  }

  return {
    go,
    cic_switchTab,
    docs_switchTab,
    docs_ciclomotoresSwitchTab,
    sin_zoom,
    sin_closeZoom,
    sin_closeZoomOnBackdrop,
    limparCache,
    bindDeclarativeHandlers
  };
})();

window.go = PMRV.core.go;
window.cic_switchTab = PMRV.core.cic_switchTab;
window.docs_switchTab = PMRV.core.docs_switchTab;
window.docs_ciclomotoresSwitchTab = PMRV.core.docs_ciclomotoresSwitchTab;
window.sin_zoom = PMRV.core.sin_zoom;
window.sin_closeZoom = PMRV.core.sin_closeZoom;
window.sin_closeZoomOnBackdrop = PMRV.core.sin_closeZoomOnBackdrop;
window.core_limparCache = PMRV.core.limparCache;

document.addEventListener('DOMContentLoaded', PMRV.core.bindDeclarativeHandlers);
