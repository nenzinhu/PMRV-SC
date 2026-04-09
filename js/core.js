/* ---------------------------------------------------------------
   NAMESPACE GLOBAL PMRV - CORE ENGINE
--------------------------------------------------------------- */
window.PMRV = window.PMRV || {};

function core_formatarKM(input) {
  let val = input.value.trim().replace(/[^\d.,]/g, '').replace('.', ',');
  if (!val) {
    input.value = '';
    return;
  }

  let partes = val.split(',');
  let inteiro = partes[0] || '0';
  let decimal = partes[1] || '';

  let numInteiro = parseInt(inteiro, 10);
  if (isNaN(numInteiro)) numInteiro = 0;
  if (numInteiro > 99) numInteiro = 99;
  inteiro = numInteiro.toString();

  // Sempre força 3 zeros se não houver decimal, ou trunca/completa se houver
  decimal = (decimal + '000').substring(0, 3);

  input.value = inteiro + ',' + decimal;
  input.dispatchEvent(new Event('input'));
}

window.core_formatarKM = core_formatarKM;

PMRV.core = (function() {
  const SCREENS = [
    'home', 'assumir', 'patrulhamento', 'infracoes', 'envolvidos', 'pmrv', 'danos',
    'relatorio', 'pesos', 'tacografo', 'croqui', 'rodovias-ref', 'referencias-proximas', 'docs',
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
      if (!el) return;

      const isActive = id === target;
      el.classList.toggle('active', isActive);
      if (!isActive) return;

      el.scrollTop = 0;

      setTimeout(() => {
        const heading = el.querySelector('h1, h2, .card-title, .btn');
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus();
        }
      }, 250);
    });

    document.querySelectorAll('.nav-item').forEach(btn => {
      const btnId = btn.id.replace('nav-', '');
      btn.classList.toggle('active', btnId === target || (target === 'home' && btnId === 'home'));
    });

    const app = document.querySelector('.app');
    if (app) app.classList.toggle('app-wide', APP_WIDE_SCREENS.has(target));

    const container = document.getElementById('main-container');
    if (container) container.scrollTop = 0;

    if (target === 'pesos' && typeof window.pes_init === 'function') window.pes_init();
    if (target === 'tacografo' && typeof window.tac_init === 'function') window.tac_init();
    if (target === 'prazos-transito' && typeof window.prazos_init === 'function') window.prazos_init();
    if (target === 'patrulhamento' && typeof window.pat_init === 'function') window.pat_init();
    if (target === 'pmrv' && typeof window.pmrv_init === 'function') window.pmrv_init();
    if (target === 'infracoes' && typeof window.infra_init === 'function') window.infra_init();
    if (target === 'danos' && typeof window.danPrepararTela === 'function') window.danPrepararTela();
    if (typeof window.gps_onScreenChange === 'function') window.gps_onScreenChange(target);
    if (target === 'docs') docs_switchTab('bases');
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
    const tabs = ['bases', 'ciclomotores', 'estrangeiros', 'aet', 'pops'];
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

  function sin_closeZoomOnBackdrop(event) {
    if (event.target.id === 'sin-zoom-modal') sin_closeZoom();
  }

  async function limparCache() {
    Object.keys(window.localStorage || {})
      .filter(key => key.startsWith('pmrv_'))
      .forEach(key => window.localStorage.removeItem(key));

    Object.keys(window.sessionStorage || {})
      .filter(key => key.startsWith('pmrv_'))
      .forEach(key => window.sessionStorage.removeItem(key));

    if (PMRV.dataManager?.clearCache) {
      await PMRV.dataManager.clearCache();
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name.startsWith('pmrv-4em1'))
          .map(name => caches.delete(name))
      );
    }
  }

  async function confirmarLimpezaCompleta() {
    const ok = window.confirm('ATENÇÃO: Isso apagará todos os dados salvos e caches offline do app. Deseja continuar?');
    if (!ok) return;

    try {
      await limparCache();
      window.location.reload();
    } catch (err) {
      console.error('[PMRV] Falha ao limpar dados locais.', err);
      window.alert('Não foi possível concluir a limpeza completa dos dados locais.');
    }
  }

  function splitArguments(argsSource) {
    const args = [];
    let current = '';
    let quote = '';

    for (let i = 0; i < argsSource.length; i++) {
      const char = argsSource[i];
      const prev = argsSource[i - 1];

      if ((char === '"' || char === '\'') && prev !== '\\') {
        if (!quote) {
          quote = char;
        } else if (quote === char) {
          quote = '';
        }
        current += char;
        continue;
      }

      if (char === ',' && !quote) {
        args.push(current.trim());
        current = '';
        continue;
      }

      current += char;
    }

    if (current.trim()) args.push(current.trim());
    return args;
  }

  function parseDeclarativeArg(raw, target, event) {
    if (raw === 'this') return target;
    if (raw === 'event') return event;
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    if (raw === 'null') return null;
    if (raw === 'undefined') return undefined;

    if ((raw.startsWith('\'') && raw.endsWith('\'')) || (raw.startsWith('"') && raw.endsWith('"'))) {
      return raw.slice(1, -1).replace(/\\'/g, '\'').replace(/\\"/g, '"');
    }

    if (/^-?\d+(\.\d+)?$/.test(raw)) {
      return Number(raw);
    }

    throw new Error(`Argumento declarativo não suportado: ${raw}`);
  }

  function executeDeclarativeHandler(attr, target, event) {
    const code = target.getAttribute(attr)?.trim();
    if (!code) return;

    const match = code.match(/^([A-Za-z_$][\w$]*)\s*\((.*)\)$/);
    if (!match) {
      throw new Error(`Handler declarativo inválido: ${code}`);
    }

    const fnName = match[1];
    const fn = window[fnName];
    if (typeof fn !== 'function') {
      throw new Error(`Função declarativa não encontrada: ${fnName}`);
    }

    const argsSource = match[2].trim();
    const args = argsSource ? splitArguments(argsSource).map(arg => parseDeclarativeArg(arg, target, event)) : [];
    return fn.apply(window, args);
  }

  function bindDeclarativeHandlers() {
    document.addEventListener('click', event => {
      const target = event.target.closest('[data-click]');
      if (!target) return;
      try {
        executeDeclarativeHandler('data-click', target, event);
      } catch (err) {
        console.error(err);
      }
    });

    document.addEventListener('input', event => {
      const target = event.target.closest('[data-input]');
      if (!target) return;
      try {
        executeDeclarativeHandler('data-input', target, event);
      } catch (err) {
        console.error(err);
      }
    });

    document.addEventListener('change', event => {
      const target = event.target.closest('[data-change]');
      if (!target) return;
      try {
        executeDeclarativeHandler('data-change', target, event);
      } catch (err) {
        console.error(err);
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      const target = event.target.closest('[data-keydown-enter]');
      if (!target) return;
      event.preventDefault();
      try {
        executeDeclarativeHandler('data-keydown-enter', target, event);
      } catch (err) {
        console.error(err);
      }
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
    confirmarLimpezaCompleta,
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
window.core_confirmarLimpezaCompleta = PMRV.core.confirmarLimpezaCompleta;

document.addEventListener('DOMContentLoaded', PMRV.core.bindDeclarativeHandlers);
