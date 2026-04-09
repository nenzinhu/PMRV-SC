/* ---------------------------------------------------------------
   DANOS INTERATIVO — IMAGENS REAIS
--------------------------------------------------------------- */
const CARRO_IMGS = {
  frontal: 'frente.png',
  traseira: 'traseira.png',
  esquerda: 'lateral esquerda.png',
  direita: 'lateral direita.png'
};

const MOTO_IMGS = {
  moto_frontal: 'img/extracted_8.png',
  moto_traseira: 'img/extracted_9.png',
  moto_direita: 'img/extracted_10.png',
  moto_esquerda: 'img/extracted_11.png'
};

const DAN_VEICULO_META = {
  carro: { label: 'Carro', emoji: '🚗', usa360: false },
  moto: { label: 'Motocicleta', emoji: '🏍️', usa360: true },
  caminhao: { label: 'Caminhão', emoji: '🚚', usa360: false }
};

// Fallback seguro: sem recortes/overrides até recalibrar para os novos assets.
const DAN_IMG_BOXES = {};
const DAN_MOBILE_POINT_OVERRIDES = {};

const DAN_DIAGRAMAS = {
  carro: {
    frontal: { img: 'frontal', vb:"0 0 900 500", pontos:[
      {id:'F1', label:'Capô',                          px:40.2, py:41.4},
      {id:'F2', label:'Para-choque',                   px:49.6, py:51.2},
      {id:'F3', label:'Para-Brisa',                    px:54.9, py:24.8},
      {id:'F4', label:'Farol Direito',                 px:28.7, py:54.4},
      {id:'F5', label:'Farol Esquerdo',                px:72.6, py:53.4},
      {id:'F6', label:'Farol de Milha Direito',        px:29.9, py:75.6},
      {id:'F7', label:'Farol de Milha Esquerdo',       px:74.3, py:75.4},
      {id:'F8', label:'Grade Superior Frontal',        px:61.9, py:59.8},
      {id:'F9', label:'Grade Inferior Frontal',        px:60.9, py:79.6},
      {id:'F10',label:'Retrovisor Direito',            px:22.9, py:34.0},
      {id:'F11',label:'Retrovisor Esquerdo',           px:77.3, py:34.0},
      {id:'F12',label:'Para-lama Dianteiro Esquerdo',  px:20.4, py:65.8},
      {id:'F13',label:'Para-lama Dianteiro Direito',   px:79.1, py:61.8},
      {id:'F14',label:'Placa Dianteira',               px:49.3, py:75.6},
    ]},
    traseira: { img: 'traseira', vb:"0 0 880 490", pontos:[
      {id:'T1', label:'Lanterna Traseira Esquerda', px:29.1, py:55.7},
      {id:'T2', label:'Lanterna Traseira Direita',  px:70.8, py:55.5},
      {id:'T3', label:'Vidro Traseiro / Vigia',     px:42.6, py:39.0},
      {id:'T4', label:'Tampa Porta-Malas',          px:41.0, py:66.7},
      {id:'T5', label:'Para-choque Traseiro',       px:55.8, py:73.3},
      {id:'T6', label:'Escapamento',                px:35.7, py:90.4},
      {id:'T7', label:'Refletor Esquerdo',          px:31.5, py:81.0},
      {id:'T8', label:'Refletor Direito',           px:68.8, py:82.9},
      {id:'T9', label:'Emblema',                    px:50.0, py:48.2},
      {id:'T10',label:'Placa Traseira',             px:50.1, py:58.4},
    ]},
    esquerda: { img: 'esquerda', vb:"0 0 880 490", pontos:[
      {id:'E1', label:'Roda Dianteira Esquerda',      px:21.9, py:81.0},
      {id:'E2', label:'Roda Traseira Esquerda',       px:78.1, py:80.2},
      {id:'E3', label:'Porta Dianteira Esquerda',     px:43.4, py:68.0},
      {id:'E4', label:'Porta Traseira Esquerda',      px:62.4, py:68.2},
      {id:'E5', label:'Vidro Dianteiro Esquerdo',     px:46.6, py:46.3},
      {id:'E6', label:'Vidro Traseiro Esquerdo',      px:62.7, py:43.7},
      {id:'E7', label:'Para-lama Dianteiro Esquerdo', px:12.8, py:78.0},
    ]},
    direita: { img: 'direita', vb:"0 0 880 490", pontos:[
      {id:'D1', label:'Roda Dianteira Direita',       px:19.9, py:73.9},
      {id:'D2', label:'Roda Traseira Direita',        px:73.8, py:74.3},
      {id:'D3', label:'Porta Dianteira Direita',      px:55.1, py:63.9},
      {id:'D4', label:'Porta Traseira Direita',       px:35.2, py:67.1},
      {id:'D5', label:'Vidro Dianteiro Direito',      px:49.1, py:43.7},
      {id:'D6', label:'Vidro Traseiro Direito',       px:33.6, py:40.6},
      {id:'D7', label:'Para-lama Dianteiro Direito',  px:83.4, py:69.4},
    ]},
  },
  moto: {
    frontal: { img: 'moto_frontal', vb:"0 0 400 500", pontos:[
      {id:'F1', label:'Farol frontal',              px:50,  py:18},
      {id:'F2', label:'Carenagem frontal esq.',     px:32,  py:33},
      {id:'F3', label:'Carenagem frontal dir.',     px:68,  py:33},
      {id:'F4', label:'Guidão esquerdo',            px:18,  py:22},
      {id:'F5', label:'Guidão direito',             px:82,  py:22},
      {id:'F6', label:'Painel / Instrumentos',      px:50,  py:26},
      {id:'F7', label:'Paralama dianteiro',         px:50,  py:52},
      {id:'F8', label:'Bengala esquerda',           px:40,  py:55},
      {id:'F9', label:'Bengala direita',            px:60,  py:55},
      {id:'F10',label:'Pneu dianteiro',             px:50,  py:80},
    ]},
    traseira: { img: 'moto_traseira', vb:"0 0 400 500", pontos:[
      {id:'T1', label:'Lanterna traseira',          px:50,  py:17},
      {id:'T2', label:'Baú / Bagageiro',            px:50,  py:27},
      {id:'T3', label:'Assento',                    px:50,  py:37},
      {id:'T4', label:'Carenagem traseira esq.',    px:30,  py:45},
      {id:'T5', label:'Carenagem traseira dir.',    px:70,  py:45},
      {id:'T6', label:'Paralama traseiro',          px:50,  py:57},
      {id:'T7', label:'Placa',                      px:50,  py:68},
      {id:'T8', label:'Pneu traseiro',              px:50,  py:82},
    ]},
    esquerda: { img: 'moto_esquerda', vb:"0 0 600 400", pontos:[
      {id:'E1', label:'Farol dianteiro',            px:13,  py:30},
      {id:'E2', label:'Guidão esq.',                px:20,  py:18},
      {id:'E3', label:'Painel',                     px:22,  py:30},
      {id:'E4', label:'Tanque esq.',                px:35,  py:28},
      {id:'E5', label:'Assento',                    px:50,  py:25},
      {id:'E6', label:'Carenagem lateral esq.',     px:35,  py:48},
      {id:'E7', label:'Motor / Cárter esq.',        px:38,  py:62},
      {id:'E8', label:'Escapamento',                px:62,  py:70},
      {id:'E9', label:'Pneu dianteiro',             px:14,  py:78},
      {id:'E10',label:'Pneu traseiro',              px:82,  py:78},
      {id:'E11',label:'Paralama dianteiro',         px:14,  py:52},
      {id:'E12',label:'Paralama traseiro',          px:78,  py:55},
      {id:'E13',label:'Lanterna traseira',          px:88,  py:30},
    ]},
    direita: { img: 'moto_direita', vb:"0 0 600 400", pontos:[
      {id:'D1', label:'Farol dianteiro',            px:87,  py:30},
      {id:'D2', label:'Guidão dir.',                px:80,  py:18},
      {id:'D3', label:'Painel',                     px:78,  py:30},
      {id:'D4', label:'Tanque dir.',                px:65,  py:28},
      {id:'D5', label:'Assento',                    px:50,  py:25},
      {id:'D6', label:'Carenagem lateral dir.',     px:65,  py:48},
      {id:'D7', label:'Motor / Cárter dir.',        px:62,  py:62},
      {id:'D8', label:'Freio / Pedal dir.',         px:38,  py:70},
      {id:'D9', label:'Pneu dianteiro',             px:86,  py:78},
      {id:'D10',label:'Pneu traseiro',              px:18,  py:78},
      {id:'D11',label:'Paralama dianteiro',         px:86,  py:52},
      {id:'D12',label:'Paralama traseiro',          px:22,  py:55},
      {id:'D13',label:'Lanterna traseira',          px:12,  py:30},
    ]},
  }
  ,
  caminhao: {
    frontal: { vb:"0 0 940 520", pontos:[
      {id:'F1', label:'Para-brisa',                 px:50.0, py:20.5},
      {id:'F2', label:'Cabine frontal',             px:50.0, py:33.0},
      {id:'F3', label:'Grade frontal',              px:50.0, py:48.0},
      {id:'F4', label:'Para-choque dianteiro',      px:50.0, py:63.0},
      {id:'F5', label:'Farol dianteiro esquerdo',   px:30.5, py:54.0},
      {id:'F6', label:'Farol dianteiro direito',    px:69.5, py:54.0},
      {id:'F7', label:'Retrovisor esquerdo',        px:21.0, py:30.0},
      {id:'F8', label:'Retrovisor direito',         px:79.0, py:30.0},
      {id:'F9', label:'Paralama dianteiro esquerdo',px:24.0, py:67.0},
      {id:'F10',label:'Paralama dianteiro direito', px:76.0, py:67.0},
      {id:'F11',label:'Roda dianteira esquerda',    px:28.0, py:84.0},
      {id:'F12',label:'Roda dianteira direita',     px:72.0, py:84.0},
    ]},
    traseira: { vb:"0 0 940 520", pontos:[
      {id:'T1', label:'Baú / carroceria traseira',  px:50.0, py:28.0},
      {id:'T2', label:'Porta traseira esquerda',    px:38.5, py:34.5},
      {id:'T3', label:'Porta traseira direita',     px:61.5, py:34.5},
      {id:'T4', label:'Para-choque traseiro',       px:50.0, py:66.0},
      {id:'T5', label:'Lanterna traseira esquerda', px:27.0, py:60.0},
      {id:'T6', label:'Lanterna traseira direita',  px:73.0, py:60.0},
      {id:'T7', label:'Placa traseira',             px:50.0, py:56.0},
      {id:'T8', label:'Paralama traseiro esquerdo', px:25.5, py:76.0},
      {id:'T9', label:'Paralama traseiro direito',  px:74.5, py:76.0},
      {id:'T10',label:'Roda traseira esquerda',     px:31.0, py:86.0},
      {id:'T11',label:'Roda traseira direita',      px:69.0, py:86.0},
    ]},
    esquerda: { vb:"0 0 980 480", pontos:[
      {id:'E1', label:'Para-choque dianteiro',      px:13.0, py:62.0},
      {id:'E2', label:'Cabine lado esquerdo',       px:24.0, py:38.0},
      {id:'E3', label:'Porta da cabine esquerda',   px:30.0, py:48.0},
      {id:'E4', label:'Retrovisor esquerdo',        px:20.0, py:29.0},
      {id:'E5', label:'Para-brisa',                 px:22.0, py:22.0},
      {id:'E6', label:'Degrau da cabine esquerdo',  px:24.0, py:67.0},
      {id:'E7', label:'Roda dianteira esquerda',    px:22.0, py:82.0},
      {id:'E8', label:'Tanque / lateral do chassi', px:44.0, py:71.0},
      {id:'E9', label:'Carroceria / baú lateral',   px:63.0, py:37.0},
      {id:'E10',label:'Longarina / chassi',         px:60.0, py:67.0},
      {id:'E11',label:'Roda traseira esquerda 1',   px:71.0, py:82.0},
      {id:'E12',label:'Roda traseira esquerda 2',   px:84.0, py:82.0},
    ]},
    direita: { vb:"0 0 980 480", pontos:[
      {id:'D1', label:'Para-choque dianteiro',      px:87.0, py:62.0},
      {id:'D2', label:'Cabine lado direito',        px:76.0, py:38.0},
      {id:'D3', label:'Porta da cabine direita',    px:70.0, py:48.0},
      {id:'D4', label:'Retrovisor direito',         px:80.0, py:29.0},
      {id:'D5', label:'Para-brisa',                 px:78.0, py:22.0},
      {id:'D6', label:'Degrau da cabine direita',   px:76.0, py:67.0},
      {id:'D7', label:'Roda dianteira direita',     px:78.0, py:82.0},
      {id:'D8', label:'Tanque / lateral do chassi', px:56.0, py:71.0},
      {id:'D9', label:'Carroceria / baú lateral',   px:37.0, py:37.0},
      {id:'D10',label:'Longarina / chassi',         px:40.0, py:67.0},
      {id:'D11',label:'Roda traseira direita 1',    px:29.0, py:82.0},
      {id:'D12',label:'Roda traseira direita 2',    px:16.0, py:82.0},
    ]},
  }
};

const DAN_VISTA_LABELS = {frontal:'Frontal',traseira:'Traseira',esquerda:'Esquerda',direita:'Direita'};
const DAN_DMG_EMOJI    = {amassado:'🔨',riscado:'✏️',quebrado:'💥',trincado:'🔍'};
const DAN_DMG_COR      = {amassado:'#f97316',riscado:'#a78bfa',quebrado:'#ef4444',trincado:'#38bdf8'};

let danVeiculos = [];
let danVeiculoAtivo = 0;
let danVeiculo      = null;
let danDanos        = {};
let danVista        = 'frontal';
let danPontoAberto  = null;
let danVeiculosSalvos = [];
let danTooltipHideTimer = null;

function danGetReportModule() {
  return PMRV.danosReport;
}

function danGetRenderModule() {
  return PMRV.danosRender;
}

function danGetStateModule() {
  return PMRV.danosState;
}

function danBuildStatePayload() {
  return {
    currentDamages: danDanos,
    currentVehicle: danVeiculo,
    motoDb: v360db,
    motoEditId: v360editId,
    motoTab: v360tab,
    savedVehicles: danVeiculosSalvos
  };
}

function danApplyState(nextState) {
  if (!nextState) return;
  danDanos = nextState.currentDamages;
  danVeiculo = nextState.currentVehicle;
  v360db = nextState.motoDb;
  v360editId = nextState.motoEditId;
  v360tab = nextState.motoTab;
  danVeiculosSalvos = nextState.savedVehicles;
}

function danGetMeta(tipo) {
  return DAN_VEICULO_META[tipo] || DAN_VEICULO_META.carro;
}

function danGetLabel(tipo) {
  return danGetMeta(tipo).label;
}

function danGetEmoji(tipo) {
  return danGetMeta(tipo).emoji;
}

function danUsa360(tipo) {
  return !!danGetMeta(tipo).usa360;
}

function danAtualizarBotoesTipo(tipo) {
  Object.keys(DAN_VEICULO_META).forEach(function(key) {
    const btn = document.getElementById('dan-btn-' + key);
    if (btn) btn.classList.toggle('active', tipo === key);
  });
}

function danAtualizarCabecalhoDiagrama() {
  if (!danVeiculo || danUsa360(danVeiculo)) return;
  const label = danGetLabel(danVeiculo);
  document.getElementById('dan-veh-badge').textContent = danGetEmoji(danVeiculo);
  document.getElementById('dan-diag-title').textContent = 'Danos Aparentes — ' + label;
  danAtualizarThumbs();
}

function danMakeThumbDataUrl(tipo, vista) {
  const emoji = danGetEmoji(tipo);
  const label = DAN_VISTA_LABELS[vista] || vista;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
    <rect width="160" height="90" rx="18" fill="#111a2b"/>
    <rect x="4" y="4" width="152" height="82" rx="14" fill="#172338" stroke="#314868" stroke-width="2"/>
    <text x="80" y="38" text-anchor="middle" font-size="32">${emoji}</text>
    <text x="80" y="66" text-anchor="middle" font-size="15" font-family="Arial, sans-serif" fill="#f3f6fb">${label}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

function danAtualizarThumbs() {
  const thumbs = {
    frontal: document.getElementById('dan-tab-frontal')?.querySelector('.dan-tab-thumb'),
    traseira: document.getElementById('dan-tab-traseira')?.querySelector('.dan-tab-thumb'),
    esquerda: document.getElementById('dan-tab-esquerda')?.querySelector('.dan-tab-thumb'),
    direita: document.getElementById('dan-tab-direita')?.querySelector('.dan-tab-thumb')
  };
  if (!danVeiculo || danUsa360(danVeiculo)) return;
  if (danVeiculo === 'carro') {
    if (thumbs.frontal) thumbs.frontal.src = 'carro_frente_nobg.png';
    if (thumbs.traseira) thumbs.traseira.src = 'carro_tras_nobg.png';
    if (thumbs.esquerda) thumbs.esquerda.src = 'carro_esquerda_nobg.png';
    if (thumbs.direita) thumbs.direita.src = 'carro_direita_nobg.png';
    return;
  }
  Object.keys(thumbs).forEach(function(vista) {
    if (thumbs[vista]) thumbs[vista].src = danMakeThumbDataUrl(danVeiculo, vista);
  });
}

function danAdicionarVeiculo(tipo) {
  if (danVeiculos.length >= 5) { alert('Limite de 5 veículos atingido!'); return; }
  danVeiculos.push({ tipo, danos: {}, vista: 'frontal' });
  danVeiculoAtivo = danVeiculos.length - 1;
  danRenderVeiculos();
}

function danSelecionarVeiculo(idx) {
  danVeiculoAtivo = idx;
  danRenderVeiculos();
}

function danRemoverVeiculo(idx) {
  if (danVeiculos.length <= 1) return;
  danVeiculos.splice(idx, 1);
  danVeiculoAtivo = Math.max(0, danVeiculoAtivo - 1);
  danRenderVeiculos();
}

function danRenderVeiculos() {
  const area = document.getElementById('dan-veiculos-area');
  area.innerHTML = '';
  danVeiculos.forEach((v, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = '18px';
    card.style.border = idx === danVeiculoAtivo ? '2px solid var(--laranja)' : '1px solid var(--border)';
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <div style="flex:1;min-width:0;">
          <h2 class="card-title">Mapeie os danos — ${danGetLabel(v.tipo)}</h2>
          <p class="card-sub">Toque nos pontos numerados para registrar o dano</p>
        </div>
        <span style="font-size:28px;">${danGetEmoji(v.tipo)}</span>
        ${danVeiculos.length > 1 ? `<button data-click="danRemoverVeiculo(${idx})" style="font-size:12px;padding:4px 8px;color:#D82A2E;border:1px solid #D82A2E;border-radius:6px;background:transparent;cursor:pointer;">✕ Remover</button>` : ''}
      </div>
      <div style="display:flex;gap:6px;margin-top:12px;flex-wrap:wrap;">
        ${['frontal','traseira','esquerda','direita'].map(vis =>
          `<button class="btn${(v.vista||'frontal')===vis?' btn-active':''}" style="font-size:12px;padding:4px 10px;" data-click="danMudarVistaMulti(${idx},'${vis}')">${vis.charAt(0).toUpperCase()+vis.slice(1)}</button>`
        ).join('')}
      </div>
      <div id="dan-diagram-area-${idx}" style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;display:flex;align-items:center;justify-content:center;min-height:220px;margin-top:10px;"></div>
    `;
    area.appendChild(card);
    // Renderizar diagrama para cada veículo
    setTimeout(() => danRenderDiagramaMulti(idx), 0);
  });
}

function danRenderDiagramaMulti(idx) {
  const v = danVeiculos[idx];
  if (!v) return;
  const cfg  = DAN_DIAGRAMAS[v.tipo][v.vista || 'frontal'];
  const area = document.getElementById('dan-diagram-area-' + idx);
  if (!area) return;

  const [,, vbW, vbH] = cfg.vb.split(' ').map(Number);
  const ALL_IMGS = Object.assign({}, CARRO_IMGS, MOTO_IMGS);
  const zoomSrc = cfg.img && ALL_IMGS[cfg.img] ? ALL_IMGS[cfg.img] : '';

  let hs = '';
  cfg.pontos.forEach((p, i) => {
    const dano = v.danos[p.id];
    const cor  = dano ? DAN_DMG_COR[dano] : '#F58220';
    const cx   = (p.px / 100) * vbW;
    const cy   = (p.py / 100) * vbH;
    const r    = Math.min(vbW, vbH) * 0.038;
    const rRing= r * 1.45;
    const fSize= r * 0.75;
    hs += `
      <g style="cursor:pointer;transform-origin:${cx}px ${cy}px" data-click="danAbrirModalMulti(${idx},'${p.id}')">
        <title>${p.label}</title>
        <circle cx="${cx}" cy="${cy}" r="${rRing}" fill="none" stroke="${cor}" stroke-width="1.5" stroke-dasharray="4 2" opacity="${dano?'1':'0.5'}"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="${dano ? cor : 'rgba(10,20,60,0.82)'}" stroke="${cor}" stroke-width="2" data-part-label="${p.label}" data-zoom-src="${zoomSrc}" data-zoom-x="${p.px}" data-zoom-y="${p.py}" data-zoom-scale="${v.tipo === 'carro' ? 300 : 240}"/>
        <text x="${cx}" y="${cy + fSize*0.38}" text-anchor="middle" dominant-baseline="middle"
              fill="${dano?'#000':'#fff'}" font-size="${fSize}" font-weight="900"
              font-family="Barlow Condensed,sans-serif" style="pointer-events:none">${i+1}</text>
        ${dano ? `<text x="${cx}" y="${cy - rRing - 3}" text-anchor="middle"
              fill="${cor}" font-size="${fSize*1.1}" style="pointer-events:none">${DAN_DMG_EMOJI[dano]}</text>` : ''}
      </g>`;
  });

  let bgEl = '';
  if (cfg.img && ALL_IMGS[cfg.img]) {
    const isCarro = CARRO_IMGS[cfg.img] !== undefined;
    if (isCarro) {
      bgEl = `<rect x="0" y="0" width="${vbW}" height="${vbH}" fill="#0d1117" rx="12"/>
    <image href="${ALL_IMGS[cfg.img]}" x="0" y="0" width="${vbW}" height="${vbH}" preserveAspectRatio="none"/>`;
    } else {
      bgEl = `<image href="${ALL_IMGS[cfg.img]}" x="0" y="0" width="${vbW}" height="${vbH}" preserveAspectRatio="none"/>`;
    }
  } else {
    bgEl = `<rect x="0" y="0" width="${vbW}" height="${vbH}" fill="#0d1117" rx="12"/>`;
    bgEl += danFallbackSvg(v.tipo, v.vista || 'frontal', vbW, vbH);
  }

  area.innerHTML = `<svg viewBox="${cfg.vb}" xmlns="http://www.w3.org/2000/svg"
    style="width:100%;max-width:560px;height:auto;display:block;border-radius:12px;">
    ${bgEl}
    ${hs}
  </svg>`;
  danBindHotspotTooltips(area, 'dan-part-readout');
}

/* ---------------------------------------------------------------
   DANOS — NAVEGAÇÃO
--------------------------------------------------------------- */
function danEscolherVeiculo(v) {
  danApplyState(
    danGetStateModule()?.selectVehicle?.(danBuildStatePayload(), v, danUsa360, v360makeDb)
  );
  danVista = 'frontal';
  danAtualizarBotoesTipo(v);
  document.getElementById('dan-step-vehicle').style.display = 'none';

  if (danUsa360(v)) {
    document.getElementById('dan-step-moto360').style.display = 'block';
    document.getElementById('dan-step-diagram').style.display = 'none';
    v360render();
  } else {
    document.getElementById('dan-step-diagram').style.display = 'block';
    document.getElementById('dan-step-moto360').style.display = 'none';
    danAtualizarCabecalhoDiagrama();
    danAtualizarTabs();
    danRenderDiagrama();
  }
}

function danVoltarStep1() {
  document.getElementById('dan-step-diagram').style.display = 'none';
  document.getElementById('dan-step-moto360').style.display = 'none';
  document.getElementById('dan-step-vehicle').style.display = 'block';
  document.getElementById('dan-result-area').style.display  = 'none';
}

function danPrepararTela() {
  document.getElementById('dan-result-area').style.display = 'none';
  document.getElementById('dan-todos-result-area').style.display = 'none';
  document.getElementById('v360-result-area').style.display = 'none';
  danAtualizarBotoesTipo(danVeiculo);
  danRenderSalvos();

  if (danUsa360(danVeiculo)) {
    document.getElementById('dan-step-vehicle').style.display = 'none';
    document.getElementById('dan-step-diagram').style.display = 'none';
    document.getElementById('dan-step-moto360').style.display = 'block';
    v360switchTab(document.getElementById('v360-tab-' + v360tab), v360tab);
    return;
  }

  if (danVeiculo && !danUsa360(danVeiculo)) {
    document.getElementById('dan-step-vehicle').style.display = 'none';
    document.getElementById('dan-step-diagram').style.display = 'block';
    document.getElementById('dan-step-moto360').style.display = 'none';
    danAtualizarCabecalhoDiagrama();
    danAtualizarTabs();
    danRenderDiagrama();
    return;
  }

  danVoltarStep1();
}

function danLimparTudo() {
  if (!confirm('Apagar todos os danos registrados?')) return;
  danApplyState(
    danGetStateModule()?.clearAll?.(v360makeDb)
  );
  document.getElementById('dan-summary-tags').innerHTML = '<div style="font-size:13px;color:var(--label);text-align:center;padding:18px;border:1px dashed var(--border);border-radius:10px;">Nenhum dano registrado ainda.<br>Toque nos pontos do diagrama.</div>';
  document.getElementById('v360-summary-tags').innerHTML = '<div style="font-size:13px;color:var(--label);text-align:center;padding:18px;border:1px dashed var(--border);border-radius:10px;">Nenhum dano registrado ainda.<br>Adicione marcadores na foto.</div>';
  document.getElementById('dan-result-area').style.display = 'none';
  document.getElementById('dan-todos-result-area').style.display = 'none';
  document.getElementById('v360-result-area').style.display = 'none';
  danFotoLimpar('dan-foto-grid-carro','dan-foto-actions-carro');
  danFotoLimpar('dan-foto-grid-moto','dan-foto-actions-moto');
  danRenderSalvos();
  danPrepararTela();
}

function danSalvarVeiculo() {
  if (danUsa360(danVeiculo)) {
    if (!danGetReportModule()?.hasMotoAvaria?.(v360db)) { alert('Registre ao menos um dano antes de salvar.'); return; }
    danApplyState(
      danGetStateModule()?.saveCurrentVehicle?.(
        danBuildStatePayload(),
        { tipo: 'moto', v360db: danGetReportModule().cloneMotoSnapshot(v360db) }
      )
    );
  } else {
    if (!Object.keys(danDanos).length) { alert('Registre ao menos um dano antes de salvar.'); return; }
    danApplyState(
      danGetStateModule()?.saveCurrentVehicle?.(
        danBuildStatePayload(),
        { tipo: danVeiculo, danos: Object.assign({}, danDanos) }
      )
    );
  }
  danAtualizarBotoesTipo(null);
  danVoltarStep1();
  danRenderSalvos();
}

function danRenderSalvos() {
  const area = document.getElementById('dan-salvos-area');
  const lista = document.getElementById('dan-salvos-lista');
  if (!danVeiculosSalvos.length) { area.style.display = 'none'; return; }
  area.style.display = 'block';
  lista.innerHTML = danGetRenderModule()?.buildSavedVehiclesHtml?.(danVeiculosSalvos, {
    countVehicleAvarias: danGetReportModule()?.countVehicleAvarias,
    getEmoji: danGetEmoji,
    getLabel: danGetLabel,
    uses360: danUsa360
  }) || '';
  document.getElementById('dan-todos-result-area').style.display = 'none';
}

function danRemoverSalvo(idx) {
  danApplyState(
    danGetStateModule()?.removeSavedVehicle?.(danBuildStatePayload(), idx)
  );
  danRenderSalvos();
}

function danGerarTextoTodos() {
  if (!danVeiculosSalvos.length) { alert('Nenhum veículo salvo ainda.'); return; }
  const txt = danGetReportModule()?.buildMultipleReport?.({
    date: new Date().toLocaleDateString('pt-BR'),
    diagramas: DAN_DIAGRAMAS,
    getLabel: danGetLabel,
    motoTabNames: { frente: 'Frente', tras: 'Traseira', direita: 'Lado Direito', esquerda: 'Lado Esquerdo' },
    uses360: danUsa360,
    vehicles: danVeiculosSalvos,
    vistaLabels: DAN_VISTA_LABELS
  }) || '';

  document.getElementById('dan-todos-result-text').textContent = txt;
  const ra = document.getElementById('dan-todos-result-area');
  ra.style.display = 'block';
  ra.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function danTodosCopiar(btn) {
  const texto = document.getElementById('dan-todos-result-text').textContent;
  navigator.clipboard.writeText(texto).then(function() {
    const original = btn.innerHTML;
    btn.innerHTML = '✅ Copiado!';
    btn.classList.add('btn-success');
    setTimeout(function() { btn.innerHTML = original; }, 2000);
  });
}

function danTodosWhatsApp() {
  const texto = document.getElementById('dan-todos-result-text').textContent;
  window.open('https://wa.me/?text=' + encodeURIComponent(texto), '_blank');
}

/* ---------------------------------------------------------------
   DANOS — FOTOS
--------------------------------------------------------------- */
function danFotoMiniatura(input, gridId, actionsId) {
  const container = document.getElementById(gridId);
  const actions   = document.getElementById(actionsId);
  if (!input.files || !input.files.length) return;
  Array.from(input.files).forEach(arquivo => {
    const r = new FileReader();
    r.onload = e => {
      const wrap = document.createElement('div');
      wrap.className = 'foto-wrap';
      const img = document.createElement('img');
      img.src = e.target.result;
      img.onclick = () => danFotoCompartilhar(gridId);
      const del = document.createElement('button');
      del.className = 'foto-del';
      del.innerHTML = '✕';
      del.onclick = ev => {
        ev.stopPropagation();
        wrap.remove();
        if (!container.querySelectorAll('.foto-wrap').length) actions.style.display = 'none';
      };
      wrap.appendChild(img);
      wrap.appendChild(del);
      container.appendChild(wrap);
      actions.style.display = 'flex';
    };
    r.readAsDataURL(arquivo);
  });
  input.value = '';
}

function danFotoLimpar(gridId, actionsId) {
  const el = document.getElementById(gridId);
  if (el) el.innerHTML = '';
  const ac = document.getElementById(actionsId);
  if (ac) ac.style.display = 'none';
}

function danFotoCompartilhar(gridId) {
  const grid  = document.getElementById(gridId);
  const fotos = Array.from(grid.querySelectorAll('img'));
  if (!fotos.length) { alert('Nenhuma foto para compartilhar.'); return; }
  const titulo = gridId.includes('moto') ? 'Motocicleta' : danGetLabel(danVeiculo || 'carro');
  const overlay = document.getElementById('foto-galeria-overlay');
  overlay.querySelector('.foto-galeria-titulo').textContent = '📸 Fotos — ' + titulo;
  const g = overlay.querySelector('.foto-galeria-grid');
  g.innerHTML = '';
  fotos.forEach(f => {
    const img = document.createElement('img');
    img.src = f.src;
    img.onclick = () => env_verFoto(f.src);
    g.appendChild(img);
  });
  overlay.dataset.nome    = titulo;
  overlay.dataset.veiculo = titulo;
  overlay.dataset.qtd     = fotos.length;
  overlay._fotos          = fotos.map(f => f.src);
  overlay.classList.add('open');
}

function danMudarVista(v) {
  danVista = v;
  danAtualizarTabs();
  danRenderDiagrama();
}

function danAtualizarTabs() {
  ['frontal','traseira','esquerda','direita'].forEach(v => {
    document.getElementById('dan-tab-' + v).classList.toggle('active', v === danVista);
  });
}

function danGetViewMetrics() {
  const cfg = DAN_DIAGRAMAS[danVeiculo][danVista];
  const [,, vbW, vbH] = cfg.vb.split(' ').map(Number);
  const isMobile = window.matchMedia('(max-width: 520px)').matches;
  const imgBox = (isMobile && cfg.img && DAN_IMG_BOXES[cfg.img]) ? DAN_IMG_BOXES[cfg.img] : null;
  const mobileOverrides = isMobile && DAN_MOBILE_POINT_OVERRIDES[danVeiculo]
    ? DAN_MOBILE_POINT_OVERRIDES[danVeiculo][danVista]
    : null;
  return { cfg, vbW, vbH, isMobile, imgBox, mobileOverrides };
}

function danStoredToSvgCoords(px, py, metrics) {
  if (metrics.imgBox) {
    return {
      x: ((px - metrics.imgBox.x) / metrics.imgBox.w) * metrics.vbW,
      y: ((py - metrics.imgBox.y) / metrics.imgBox.h) * metrics.vbH
    };
  }
  return {
    x: (px / 100) * metrics.vbW,
    y: (py / 100) * metrics.vbH
  };
}

function danSvgToStoredCoords(x, y, metrics) {
  const clampedX = Math.max(0, Math.min(metrics.vbW, x));
  const clampedY = Math.max(0, Math.min(metrics.vbH, y));
  if (metrics.imgBox) {
    return {
      px: Math.max(2, Math.min(98, parseFloat((metrics.imgBox.x + (clampedX / metrics.vbW) * metrics.imgBox.w).toFixed(2)))),
      py: Math.max(2, Math.min(98, parseFloat((metrics.imgBox.y + (clampedY / metrics.vbH) * metrics.imgBox.h).toFixed(2))))
    };
  }
  return {
    px: Math.max(2, Math.min(98, parseFloat(((clampedX / metrics.vbW) * 100).toFixed(2)))),
    py: Math.max(2, Math.min(98, parseFloat(((clampedY / metrics.vbH) * 100).toFixed(2))))
  };
}

/* ---------------------------------------------------------------
   DANOS — RENDER SVG
--------------------------------------------------------------- */
function danRenderDiagrama() {
  if (!danVeiculo) return;
  const metrics = danGetViewMetrics();
  const cfg  = metrics.cfg;
  const area = document.getElementById('dan-diagram-area');

  const { vbW, vbH, imgBox, mobileOverrides } = metrics;
  const r     = Math.min(vbW, vbH) * 0.038;
  const rRing = r * 1.45;
  const fSize = r * 0.75;

  // Build hotspot circles as SVG elements (% coordinates → svg units)
  let hs = '';
  const ALL_IMGS = Object.assign({}, CARRO_IMGS, MOTO_IMGS);
  const zoomSrc = cfg.img && ALL_IMGS[cfg.img] ? ALL_IMGS[cfg.img] : '';
  cfg.pontos.forEach((p, i) => {
    const ref = mobileOverrides && mobileOverrides[p.id] && !p.saved ? { ...p, ...mobileOverrides[p.id] } : p;
    const dano = danDanos[p.id];
    const cor  = dano ? DAN_DMG_COR[dano] : '#F58220';
    const coords = danStoredToSvgCoords(ref.px, ref.py, metrics);
    const cx   = coords.x;
    const cy   = coords.y;

    hs += `
      <g style="cursor:pointer;transform-origin:${cx}px ${cy}px" data-click="danAbrirModal('${p.id}')">
        <title>${p.label}</title>
        <circle cx="${cx}" cy="${cy}" r="${rRing}" fill="none" stroke="${cor}" stroke-width="1.5" stroke-dasharray="4 2" opacity="${dano?'1':'0.5'}"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="${dano ? cor : 'rgba(10,20,60,0.82)'}" stroke="${cor}" stroke-width="2" data-part-label="${p.label}" data-zoom-src="${zoomSrc}" data-zoom-x="${ref.px}" data-zoom-y="${ref.py}" data-zoom-scale="${danVeiculo === 'carro' ? 300 : 240}"/>
        <text x="${cx}" y="${cy + fSize*0.38}" text-anchor="middle" dominant-baseline="middle"
              fill="${dano?'#000':'#fff'}" font-size="${fSize}" font-weight="900"
              font-family="Barlow Condensed,sans-serif" style="pointer-events:none">${i+1}</text>
        ${dano ? `<text x="${cx}" y="${cy - rRing - 3}" text-anchor="middle"
              fill="${cor}" font-size="${fSize*1.1}" style="pointer-events:none">${DAN_DMG_EMOJI[dano]}</text>` : ''}
      </g>`;
  });

  // If we have a real photo for this view, use it as SVG image background
  let bgEl = '';
  if (cfg.img && ALL_IMGS[cfg.img]) {
    const isCarro = CARRO_IMGS[cfg.img] !== undefined;
    if (isCarro) {
      if (imgBox) {
        const imgX = -((imgBox.x / imgBox.w) * vbW);
        const imgY = -((imgBox.y / imgBox.h) * vbH);
        const imgW = (100 / imgBox.w) * vbW;
        const imgH = (100 / imgBox.h) * vbH;
        bgEl = `<rect x="0" y="0" width="${vbW}" height="${vbH}" fill="#0d1117" rx="12"/>
    <image href="${ALL_IMGS[cfg.img]}" x="${imgX}" y="${imgY}" width="${imgW}" height="${imgH}" preserveAspectRatio="none"/>`;
      } else {
        bgEl = `<rect x="0" y="0" width="${vbW}" height="${vbH}" fill="#0d1117" rx="12"/>
    <image href="${ALL_IMGS[cfg.img]}" x="0" y="0" width="${vbW}" height="${vbH}" preserveAspectRatio="none"/>`;
      }
    } else {
      if (imgBox) {
        const imgX = -((imgBox.x / imgBox.w) * vbW);
        const imgY = -((imgBox.y / imgBox.h) * vbH);
        const imgW = (100 / imgBox.w) * vbW;
        const imgH = (100 / imgBox.h) * vbH;
        bgEl = `<image href="${ALL_IMGS[cfg.img]}" x="${imgX}" y="${imgY}" width="${imgW}" height="${imgH}" preserveAspectRatio="none"/>`;
      } else {
        bgEl = `<image href="${ALL_IMGS[cfg.img]}" x="0" y="0" width="${vbW}" height="${vbH}" preserveAspectRatio="none"/>`;
      }
    }
  } else {
    bgEl = `<rect x="0" y="0" width="${vbW}" height="${vbH}" fill="#0d1117" rx="12"/>`;
    bgEl += danFallbackSvg(danVeiculo, danVista, vbW, vbH);
  }

  area.innerHTML = `<svg id="dan-svg-main" viewBox="${cfg.vb}" xmlns="http://www.w3.org/2000/svg"
    style="width:100%;max-width:560px;height:auto;display:block;border-radius:12px;">
    ${bgEl}
    ${hs}
  </svg>`;
  danBindHotspotTooltips(area, 'dan-part-readout');
}

function danGetTooltipEl() {
  return document.getElementById('dan-hover-tooltip');
}

function danEscapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function danSetPartReadout(targetId, label, fallback) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.textContent = label || fallback;
}

function danClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function danApplyTooltipZoom(img, zoomMeta) {
  const frame = img && img.parentElement;
  if (!img || !frame || !zoomMeta || !zoomMeta.src) return;

  const frameW = frame.clientWidth || 190;
  const frameH = frame.clientHeight || 190;
  const naturalW = img.naturalWidth || frameW;
  const naturalH = img.naturalHeight || frameH;
  const scaleRatio = (zoomMeta.scale || 240) / 100;
  const scaledW = naturalW * scaleRatio;
  const scaledH = naturalH * scaleRatio;
  const pointX = danClamp(((zoomMeta.x || 50) / 100) * scaledW, 0, scaledW);
  const pointY = danClamp(((zoomMeta.y || 50) / 100) * scaledH, 0, scaledH);
  const minLeft = Math.min(0, frameW - scaledW);
  const minTop = Math.min(0, frameH - scaledH);
  const offsetX = danClamp((frameW / 2) - pointX, minLeft, 0);
  const offsetY = danClamp((frameH / 2) - pointY, minTop, 0);

  img.style.width = `${scaledW}px`;
  img.style.height = `${scaledH}px`;
  img.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

function danShowTooltip(label, event, zoomMeta) {
  const el = danGetTooltipEl();
  if (!el || !label) return;
  if (danTooltipHideTimer) {
    clearTimeout(danTooltipHideTimer);
    danTooltipHideTimer = null;
  }
  if (zoomMeta && zoomMeta.src) {
    el.innerHTML = `<div class="dan-tooltip-zoom"><img class="dan-tooltip-zoom-img" src="${danEscapeHtml(zoomMeta.src)}" alt="" /><div class="dan-tooltip-crosshair" aria-hidden="true"></div><div class="dan-tooltip-point" aria-hidden="true"></div></div><span class="dan-tooltip-label">${danEscapeHtml(label)}</span>`;
    const zoomImg = el.querySelector('.dan-tooltip-zoom-img');
    if (zoomImg) {
      const applyZoom = () => danApplyTooltipZoom(zoomImg, zoomMeta);
      if (zoomImg.complete) {
        applyZoom();
      } else {
        zoomImg.addEventListener('load', applyZoom, { once: true });
      }
    }
  } else {
    el.innerHTML = `<span class="dan-tooltip-label">${danEscapeHtml(label)}</span>`;
  }
  el.classList.add('open');
  danMoveTooltip(event);
}

function danMoveTooltip(event) {
  const el = danGetTooltipEl();
  if (!el || !el.classList.contains('open')) return;
  const offset = 10;
  const maxLeft = window.innerWidth - el.offsetWidth - 12;
  const maxTop = window.innerHeight - el.offsetHeight - 12;
  const target = event && event.currentTarget && typeof event.currentTarget.getBoundingClientRect === 'function'
    ? event.currentTarget
    : null;

  if (target) {
    const rect = target.getBoundingClientRect();
    const preferredLeft = rect.left + (rect.width / 2) - (el.offsetWidth / 2);
    const preferredTop = rect.top - el.offsetHeight - offset;
    const left = Math.max(12, Math.min(preferredLeft, maxLeft));
    const top = preferredTop < 12
      ? Math.max(12, Math.min(rect.bottom + offset, maxTop))
      : Math.max(12, Math.min(preferredTop, maxTop));
    el.style.transform = `translate(${left}px, ${top}px)`;
    return;
  }

  const left = Math.min(event.clientX + offset, maxLeft);
  const top = Math.min(event.clientY + offset, maxTop);
  el.style.transform = `translate(${Math.max(12, left)}px, ${Math.max(12, top)}px)`;
}

function danHideTooltip() {
  const el = danGetTooltipEl();
  if (!el) return;
  danTooltipHideTimer = setTimeout(() => {
    el.classList.remove('open');
    el.style.transform = 'translate(-9999px, -9999px)';
  }, 40);
}

function danBindHotspotTooltips(container, readoutId) {
  const nodes = container.querySelectorAll('[data-part-label]');
  const fallback = 'Passe ou toque em um círculo para ver o nome da peça.';
  nodes.forEach(node => {
    const label = node.getAttribute('data-part-label');
    const zoomMeta = {
      src: node.getAttribute('data-zoom-src'),
      x: parseFloat(node.getAttribute('data-zoom-x') || '50'),
      y: parseFloat(node.getAttribute('data-zoom-y') || '50'),
      scale: parseFloat(node.getAttribute('data-zoom-scale') || '240')
    };
    node.addEventListener('mouseenter', event => {
      danSetPartReadout(readoutId, label, fallback);
      danShowTooltip(label, event, zoomMeta);
    });
    node.addEventListener('mousemove', danMoveTooltip);
    node.addEventListener('mouseleave', () => {
      danHideTooltip();
      danSetPartReadout(readoutId, '', fallback);
    });
    node.addEventListener('pointerdown', event => {
      danSetPartReadout(readoutId, label, fallback);
      danShowTooltip(label, event, zoomMeta);
    });
    node.addEventListener('focus', event => {
      danSetPartReadout(readoutId, label, fallback);
      danShowTooltip(label, event, zoomMeta);
    });
  });
}

function v360BindTooltips(container, readoutId) {
  const nodes = container.querySelectorAll('.v360-pin[data-part-label]');
  const fallback = 'Toque em um círculo para ver o nome da peça selecionada.';
  nodes.forEach(node => {
    const label = node.getAttribute('data-part-label');
    const zoomMeta = {
      src: node.getAttribute('data-zoom-src'),
      x: parseFloat(node.getAttribute('data-zoom-x') || '50'),
      y: parseFloat(node.getAttribute('data-zoom-y') || '50'),
      scale: parseFloat(node.getAttribute('data-zoom-scale') || '240')
    };
    node.addEventListener('mouseenter', event => {
      danSetPartReadout(readoutId, label, fallback);
      danShowTooltip(label, event, zoomMeta);
    });
    node.addEventListener('mousemove', danMoveTooltip);
    node.addEventListener('mouseleave', () => {
      danHideTooltip();
      danSetPartReadout(readoutId, '', fallback);
    });
    node.addEventListener('pointerdown', event => {
      danSetPartReadout(readoutId, label, fallback);
      danShowTooltip(label, event, zoomMeta);
    });
    node.addEventListener('focus', event => {
      danSetPartReadout(readoutId, label, fallback);
      danShowTooltip(label, event, zoomMeta);
    });
  });
}

function danCarregarCoordenadasSalvas() {
  ['carro', 'caminhao'].forEach(tipo => {
    ['frontal','traseira','esquerda','direita'].forEach(vista => {
      if (DAN_DIAGRAMAS[tipo] && DAN_DIAGRAMAS[tipo][vista]) {
        DAN_DIAGRAMAS[tipo][vista].pontos = DAN_DIAGRAMAS[tipo][vista].pontos.map(p => ({ ...p, saved: true }));
      }
    });
  });
}

/* ---------------------------------------------------------------
   MOTO — POSICIONAMENTO E VISUALIZAÇÃO (v360)
--------------------------------------------------------------- */

function v360GetCanvasEl() {
  return document.getElementById('v360-canvas');
}

function v360GetActiveImageEl() {
  return document.querySelector('#v360-canvas .moto-img.active');
}

function v360GetImageMetrics() {
  const canvas = v360GetCanvasEl();
  const img = v360GetActiveImageEl();
  if (!canvas) return null;

  const canvasRect = canvas.getBoundingClientRect();
  if (!img) {
    return { canvas, canvasRect, leftPct: 0, topPct: 0, widthPct: 100, heightPct: 100 };
  }

  const imgRect = img.getBoundingClientRect();
  if (!imgRect.width || !imgRect.height || !canvasRect.width || !canvasRect.height) {
    return { canvas, canvasRect, leftPct: 0, topPct: 0, widthPct: 100, heightPct: 100 };
  }

  return {
    canvas,
    canvasRect,
    leftPct: ((imgRect.left - canvasRect.left) / canvasRect.width) * 100,
    topPct: ((imgRect.top - canvasRect.top) / canvasRect.height) * 100,
    widthPct: (imgRect.width / canvasRect.width) * 100,
    heightPct: (imgRect.height / canvasRect.height) * 100
  };
}

function v360ImageToCanvasPosition(x, y) {
  const metrics = v360GetImageMetrics();
  if (!metrics) return { left: x, top: y };
  return {
    left: metrics.leftPct + (x / 100) * metrics.widthPct,
    top: metrics.topPct + (y / 100) * metrics.heightPct
  };
}


function danMotoSVGFallback(vista, W, H) {
  // Detailed moto silhouette SVG for each view
  if (vista === 'frontal') {
    return `
    <!-- Guidão -->
    <line x1="${W*0.12}" y1="${H*0.20}" x2="${W*0.38}" y2="${H*0.22}" stroke="#3a5080" stroke-width="5" stroke-linecap="round"/>
    <line x1="${W*0.62}" y1="${H*0.22}" x2="${W*0.88}" y2="${H*0.20}" stroke="#3a5080" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${W*0.12}" cy="${H*0.20}" r="5" fill="#4a6090"/>
    <circle cx="${W*0.88}" cy="${H*0.20}" r="5" fill="#4a6090"/>
    <!-- Painel -->
    <rect x="${W*0.38}" y="${H*0.21}" width="${W*0.24}" height="${H*0.06}" rx="4" fill="#1a2540" stroke="#3a5080" stroke-width="1.5"/>
    <!-- Farol -->
    <ellipse cx="${W*0.5}" cy="${H*0.16}" rx="${W*0.09}" ry="${H*0.04}" fill="#1e2d48" stroke="#4a6898" stroke-width="2"/>
    <ellipse cx="${W*0.5}" cy="${H*0.16}" rx="${W*0.05}" ry="${H*0.02}" fill="#2a3d60" stroke="#5a7aaa" stroke-width="1"/>
    <!-- Carenagem frontal -->
    <path d="M${W*0.30},${H*0.28} Q${W*0.50},${H*0.26} ${W*0.70},${H*0.28} L${W*0.72},${H*0.48} Q${W*0.50},${H*0.50} ${W*0.28},${H*0.48} Z" fill="#141e35" stroke="#2a3a5c" stroke-width="2"/>
    <line x1="${W*0.50}" y1="${H*0.28}" x2="${W*0.50}" y2="${H*0.48}" stroke="#2a3a5c" stroke-width="1" stroke-dasharray="3 2"/>
    <!-- Bengalas -->
    <line x1="${W*0.40}" y1="${H*0.45}" x2="${W*0.42}" y2="${H*0.68}" stroke="#3a5080" stroke-width="4" stroke-linecap="round"/>
    <line x1="${W*0.60}" y1="${H*0.45}" x2="${W*0.58}" y2="${H*0.68}" stroke="#3a5080" stroke-width="4" stroke-linecap="round"/>
    <!-- Paralama dianteiro -->
    <path d="M${W*0.38},${H*0.62} Q${W*0.50},${H*0.56} ${W*0.62},${H*0.62}" fill="none" stroke="#2a3a5c" stroke-width="3"/>
    <!-- Roda / Pneu dianteiro -->
    <ellipse cx="${W*0.5}" cy="${H*0.80}" rx="${W*0.17}" ry="${H*0.12}" fill="#0a0f1a" stroke="#1e2d45" stroke-width="3"/>
    <ellipse cx="${W*0.5}" cy="${H*0.80}" rx="${W*0.11}" ry="${H*0.07}" fill="#111825" stroke="#2a3a5c" stroke-width="2"/>
    <!-- Raios -->
    <line x1="${W*0.5}" y1="${H*0.69}" x2="${W*0.5}" y2="${H*0.91}" stroke="#1e2d45" stroke-width="0.8"/>
    <line x1="${W*0.35}" y1="${H*0.80}" x2="${W*0.65}" y2="${H*0.80}" stroke="#1e2d45" stroke-width="0.8"/>
    <line x1="${W*0.38}" y1="${H*0.72}" x2="${W*0.62}" y2="${H*0.88}" stroke="#1e2d45" stroke-width="0.8"/>
    <line x1="${W*0.62}" y1="${H*0.72}" x2="${W*0.38}" y2="${H*0.88}" stroke="#1e2d45" stroke-width="0.8"/>`;
  }
  if (vista === 'traseira') {
    return `
    <!-- Lanterna -->
    <rect x="${W*0.38}" y="${H*0.13}" width="${W*0.24}" height="${H*0.04}" rx="4" fill="#3a1520" stroke="#6a2540" stroke-width="2"/>
    <!-- Bagageiro -->
    <rect x="${W*0.30}" y="${H*0.19}" width="${W*0.40}" height="${H*0.08}" rx="3" fill="#141e35" stroke="#2a3a5c" stroke-width="1.5"/>
    <line x1="${W*0.35}" y1="${H*0.23}" x2="${W*0.65}" y2="${H*0.23}" stroke="#2a3a5c" stroke-width="1"/>
    <!-- Assento -->
    <path d="M${W*0.28},${H*0.30} Q${W*0.50},${H*0.28} ${W*0.72},${H*0.30} L${W*0.70},${H*0.40} Q${W*0.50},${H*0.42} ${W*0.30},${H*0.40} Z" fill="#1a2235" stroke="#2a3a5c" stroke-width="1.5"/>
    <!-- Carenagem traseira -->
    <path d="M${W*0.25},${H*0.38} Q${W*0.50},${H*0.36} ${W*0.75},${H*0.38} L${W*0.78},${H*0.58} Q${W*0.50},${H*0.60} ${W*0.22},${H*0.58} Z" fill="#141e35" stroke="#2a3a5c" stroke-width="2"/>
    <line x1="${W*0.50}" y1="${H*0.38}" x2="${W*0.50}" y2="${H*0.58}" stroke="#2a3a5c" stroke-width="1" stroke-dasharray="3 2"/>
    <!-- Paralama traseiro -->
    <path d="M${W*0.36},${H*0.60} Q${W*0.50},${H*0.55} ${W*0.64},${H*0.60}" fill="none" stroke="#2a3a5c" stroke-width="3"/>
    <!-- Placa -->
    <rect x="${W*0.40}" y="${H*0.63}" width="${W*0.20}" height="${H*0.06}" rx="2" fill="#1a2235" stroke="#3a5080" stroke-width="1.5"/>
    <text x="${W*0.50}" y="${H*0.67}" text-anchor="middle" fill="#3a5080" font-size="8" font-family="monospace">ABC-1234</text>
    <!-- Roda / Pneu traseiro -->
    <ellipse cx="${W*0.5}" cy="${H*0.82}" rx="${W*0.18}" ry="${H*0.12}" fill="#0a0f1a" stroke="#1e2d45" stroke-width="3"/>
    <ellipse cx="${W*0.5}" cy="${H*0.82}" rx="${W*0.12}" ry="${H*0.07}" fill="#111825" stroke="#2a3a5c" stroke-width="2"/>
    <!-- Raios -->
    <line x1="${W*0.5}" y1="${H*0.71}" x2="${W*0.5}" y2="${H*0.93}" stroke="#1e2d45" stroke-width="0.8"/>
    <line x1="${W*0.34}" y1="${H*0.82}" x2="${W*0.66}" y2="${H*0.82}" stroke="#1e2d45" stroke-width="0.8"/>
    <line x1="${W*0.37}" y1="${H*0.74}" x2="${W*0.63}" y2="${H*0.90}" stroke="#1e2d45" stroke-width="0.8"/>
    <line x1="${W*0.63}" y1="${H*0.74}" x2="${W*0.37}" y2="${H*0.90}" stroke="#1e2d45" stroke-width="0.8"/>`;
  }
  // Vista lateral (esquerda ou direita)
  const flip = (vista === 'direita') ? ` transform="translate(${W},0) scale(-1,1)"` : '';
  return `<g${flip}>
    <!-- Roda dianteira -->
    <circle cx="${W*0.14}" cy="${H*0.78}" r="${W*0.10}" fill="#0a0f1a" stroke="#1e2d45" stroke-width="3"/>
    <circle cx="${W*0.14}" cy="${H*0.78}" r="${W*0.065}" fill="#111825" stroke="#2a3a5c" stroke-width="2"/>
    <line x1="${W*0.14}" y1="${H*0.68}" x2="${W*0.14}" y2="${H*0.88}" stroke="#1e2d45" stroke-width="0.8"/>
    <line x1="${W*0.06}" y1="${H*0.78}" x2="${W*0.22}" y2="${H*0.78}" stroke="#1e2d45" stroke-width="0.8"/>
    <line x1="${W*0.08}" y1="${H*0.71}" x2="${W*0.20}" y2="${H*0.85}" stroke="#1e2d45" stroke-width="0.8"/>
    <line x1="${W*0.20}" y1="${H*0.71}" x2="${W*0.08}" y2="${H*0.85}" stroke="#1e2d45" stroke-width="0.8"/>
    <!-- Bengala dianteira -->
    <line x1="${W*0.15}" y1="${H*0.68}" x2="${W*0.22}" y2="${H*0.35}" stroke="#3a5080" stroke-width="4" stroke-linecap="round"/>
    <!-- Paralama dianteiro -->
    <path d="M${W*0.06},${H*0.68} Q${W*0.14},${H*0.58} ${W*0.22},${H*0.68}" fill="none" stroke="#2a3a5c" stroke-width="2.5"/>
    <!-- Farol -->
    <ellipse cx="${W*0.14}" cy="${H*0.30}" rx="${W*0.028}" ry="${H*0.035}" fill="#1e2d48" stroke="#4a6898" stroke-width="2"/>
    <!-- Guidão -->
    <line x1="${W*0.18}" y1="${H*0.20}" x2="${W*0.24}" y2="${H*0.26}" stroke="#3a5080" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${W*0.18}" cy="${H*0.19}" r="4" fill="#4a6090"/>
    <!-- Painel -->
    <rect x="${W*0.20}" y="${H*0.26}" width="${W*0.06}" height="${H*0.05}" rx="3" fill="#1a2540" stroke="#3a5080" stroke-width="1"/>
    <!-- Tanque -->
    <path d="M${W*0.26},${H*0.25} Q${W*0.35},${H*0.18} ${W*0.46},${H*0.24} L${W*0.44},${H*0.34} Q${W*0.35},${H*0.36} ${W*0.26},${H*0.34} Z" fill="#1a2540" stroke="#2a3a5c" stroke-width="2"/>
    <!-- Assento -->
    <path d="M${W*0.44},${H*0.24} Q${W*0.56},${H*0.20} ${W*0.68},${H*0.28} L${W*0.65},${H*0.32} Q${W*0.54},${H*0.30} ${W*0.44},${H*0.32} Z" fill="#1e2840" stroke="#2a3a5c" stroke-width="1.5"/>
    <!-- Carenagem lateral -->
    <path d="M${W*0.24},${H*0.34} L${W*0.48},${H*0.34} L${W*0.56},${H*0.55} L${W*0.48},${H*0.68} L${W*0.28},${H*0.68} L${W*0.22},${H*0.50} Z" fill="#141e35" stroke="#2a3a5c" stroke-width="2"/>
    <!-- Motor -->
    <rect x="${W*0.28}" y="${H*0.52}" width="${W*0.18}" height="${H*0.16}" rx="4" fill="#0f1825" stroke="#2a3a5c" stroke-width="2"/>
    <line x1="${W*0.30}" y1="${H*0.56}" x2="${W*0.44}" y2="${H*0.56}" stroke="#2a3a5c" stroke-width="0.8"/>
    <line x1="${W*0.30}" y1="${H*0.60}" x2="${W*0.44}" y2="${H*0.60}" stroke="#2a3a5c" stroke-width="0.8"/>
    <line x1="${W*0.30}" y1="${H*0.64}" x2="${W*0.44}" y2="${H*0.64}" stroke="#2a3a5c" stroke-width="0.8"/>
    <!-- Escapamento -->
    <path d="M${W*0.46},${H*0.62} Q${W*0.55},${H*0.65} ${W*0.65},${H*0.70} L${W*0.78},${H*0.70}" fill="none" stroke="#4a3020" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="${W*0.79}" cy="${H*0.70}" rx="${W*0.015}" ry="${H*0.018}" fill="#3a2518" stroke="#5a4030" stroke-width="1"/>
    <!-- Balança traseira -->
    <line x1="${W*0.52}" y1="${H*0.60}" x2="${W*0.82}" y2="${H*0.72}" stroke="#2a3a5c" stroke-width="3" stroke-linecap="round"/>
    <!-- Roda traseira -->
    <circle cx="${W*0.82}" cy="${H*0.78}" r="${W*0.10}" fill="#0a0f1a" stroke="#1e2d45" stroke-width="3"/>
    <circle cx="${W*0.82}" cy="${H*0.78}" r="${W*0.065}" fill="#111825" stroke="#2a3a5c" stroke-width="2"/>
    <line x1="${W*0.82}" y1="${H*0.68}" x2="${W*0.82}" y2="${H*0.88}" stroke="#1e2d45" stroke-width="0.8"/>
    <line x1="${W*0.74}" y1="${H*0.78}" x2="${W*0.90}" y2="${H*0.78}" stroke="#1e2d45" stroke-width="0.8"/>
    <line x1="${W*0.76}" y1="${H*0.71}" x2="${W*0.88}" y2="${H*0.85}" stroke="#1e2d45" stroke-width="0.8"/>
    <line x1="${W*0.88}" y1="${H*0.71}" x2="${W*0.76}" y2="${H*0.85}" stroke="#1e2d45" stroke-width="0.8"/>
    <!-- Paralama traseiro -->
    <path d="M${W*0.74},${H*0.68} Q${W*0.82},${H*0.58} ${W*0.90},${H*0.68}" fill="none" stroke="#2a3a5c" stroke-width="2"/>
    <!-- Lanterna -->
    <rect x="${W*0.84}" y="${H*0.28}" width="${W*0.03}" height="${H*0.04}" rx="2" fill="#3a1520" stroke="#6a2540" stroke-width="1.5"/>
    <!-- Corrente -->
    <path d="M${W*0.38},${H*0.66} L${W*0.82},${H*0.76}" fill="none" stroke="#2a3a5c" stroke-width="1" stroke-dasharray="2 1.5"/>
  </g>`;
}

/* ---------------------------------------------------------------
   DANOS — MODAL
--------------------------------------------------------------- */
function danAbrirModal(id) {
  danPontoAberto = id;
  const cfg   = DAN_DIAGRAMAS[danVeiculo][danVista];
  const ponto = cfg.pontos.find(p => p.id === id);
  const num   = cfg.pontos.indexOf(ponto) + 1;
  document.getElementById('dan-modal-title-g').textContent = `Ponto ${num} · ${DAN_VISTA_LABELS[danVista]} · ${ponto.label}`;
  document.getElementById('dan-modal-sub-g').textContent = `Selecione o tipo de dano observado nesta peça para registrar rapidamente no relatório.`;

  ['amassado','riscado','quebrado','trincado'].forEach(t => {
    const btn = document.getElementById('dan-opt-' + t + '-g');
    btn.className = 'dan-dmg-opt' + (danDanos[id] === t ? ' sel-' + t : '');
  });

  document.getElementById('dan-modal-global').classList.add('open');
}

function danFecharModal() {
  document.getElementById('dan-modal-global').classList.remove('open');
  danPontoAberto = null;
}

function danFecharModalFora(e) {
  if (e.target === document.getElementById('dan-modal-global')) danFecharModal();
}

function danSelecionarDano(tipo) {
  if (!danPontoAberto) return;
  danDanos[danPontoAberto] = tipo;
  danFecharModal();
  danRenderDiagrama();
  danAtualizarSummary();
}

function danRemoverDano() {
  if (!danPontoAberto) return;
  delete danDanos[danPontoAberto];
  danFecharModal();
  danRenderDiagrama();
  danAtualizarSummary();
}

function danCaminhaoSVGFallback(vista, W, H) {
  const flip = vista === 'direita' ? ` transform="translate(${W},0) scale(-1,1)"` : '';
  if (vista === 'frontal') {
    return `
    <rect x="${W*0.24}" y="${H*0.12}" width="${W*0.52}" height="${H*0.60}" rx="24" fill="#172338" stroke="#314868" stroke-width="6"/>
    <rect x="${W*0.32}" y="${H*0.17}" width="${W*0.36}" height="${H*0.18}" rx="12" fill="#20314c" stroke="#47668f" stroke-width="4"/>
    <rect x="${W*0.36}" y="${H*0.40}" width="${W*0.28}" height="${H*0.11}" rx="10" fill="#111a2b" stroke="#355073" stroke-width="4"/>
    <rect x="${W*0.20}" y="${H*0.57}" width="${W*0.60}" height="${H*0.10}" rx="14" fill="#101826" stroke="#314868" stroke-width="4"/>
    <rect x="${W*0.15}" y="${H*0.26}" width="${W*0.10}" height="${H*0.05}" rx="6" fill="#263753" stroke="#5a7ca9" stroke-width="3"/>
    <rect x="${W*0.75}" y="${H*0.26}" width="${W*0.10}" height="${H*0.05}" rx="6" fill="#263753" stroke="#5a7ca9" stroke-width="3"/>
    <rect x="${W*0.25}" y="${H*0.50}" width="${W*0.10}" height="${H*0.08}" rx="8" fill="#f1c40f" stroke="#d89b00" stroke-width="3"/>
    <rect x="${W*0.65}" y="${H*0.50}" width="${W*0.10}" height="${H*0.08}" rx="8" fill="#f1c40f" stroke="#d89b00" stroke-width="3"/>
    <circle cx="${W*0.30}" cy="${H*0.83}" r="${W*0.085}" fill="#0a0f1a" stroke="#24354f" stroke-width="6"/>
    <circle cx="${W*0.70}" cy="${H*0.83}" r="${W*0.085}" fill="#0a0f1a" stroke="#24354f" stroke-width="6"/>
    <circle cx="${W*0.30}" cy="${H*0.83}" r="${W*0.045}" fill="#111825" stroke="#314868" stroke-width="3"/>
    <circle cx="${W*0.70}" cy="${H*0.83}" r="${W*0.045}" fill="#111825" stroke="#314868" stroke-width="3"/>`;
  }
  if (vista === 'traseira') {
    return `
    <rect x="${W*0.23}" y="${H*0.12}" width="${W*0.54}" height="${H*0.58}" rx="16" fill="#172338" stroke="#314868" stroke-width="6"/>
    <line x1="${W*0.50}" y1="${H*0.13}" x2="${W*0.50}" y2="${H*0.70}" stroke="#47668f" stroke-width="3" stroke-dasharray="8 6"/>
    <rect x="${W*0.42}" y="${H*0.48}" width="${W*0.16}" height="${H*0.08}" rx="8" fill="#111a2b" stroke="#355073" stroke-width="4"/>
    <rect x="${W*0.21}" y="${H*0.59}" width="${W*0.58}" height="${H*0.09}" rx="14" fill="#101826" stroke="#314868" stroke-width="4"/>
    <rect x="${W*0.24}" y="${H*0.53}" width="${W*0.08}" height="${H*0.06}" rx="6" fill="#c0392b" stroke="#ef5350" stroke-width="3"/>
    <rect x="${W*0.68}" y="${H*0.53}" width="${W*0.08}" height="${H*0.06}" rx="6" fill="#c0392b" stroke="#ef5350" stroke-width="3"/>
    <circle cx="${W*0.32}" cy="${H*0.84}" r="${W*0.08}" fill="#0a0f1a" stroke="#24354f" stroke-width="6"/>
    <circle cx="${W*0.68}" cy="${H*0.84}" r="${W*0.08}" fill="#0a0f1a" stroke="#24354f" stroke-width="6"/>
    <circle cx="${W*0.32}" cy="${H*0.84}" r="${W*0.04}" fill="#111825" stroke="#314868" stroke-width="3"/>
    <circle cx="${W*0.68}" cy="${H*0.84}" r="${W*0.04}" fill="#111825" stroke="#314868" stroke-width="3"/>`;
  }
  return `<g${flip}>
    <rect x="${W*0.10}" y="${H*0.18}" width="${W*0.22}" height="${H*0.40}" rx="18" fill="#172338" stroke="#314868" stroke-width="5"/>
    <rect x="${W*0.13}" y="${H*0.22}" width="${W*0.13}" height="${H*0.10}" rx="10" fill="#20314c" stroke="#47668f" stroke-width="3"/>
    <rect x="${W*0.30}" y="${H*0.22}" width="${W*0.52}" height="${H*0.32}" rx="12" fill="#1c2a42" stroke="#355073" stroke-width="5"/>
    <rect x="${W*0.30}" y="${H*0.54}" width="${W*0.52}" height="${H*0.08}" rx="10" fill="#101826" stroke="#314868" stroke-width="4"/>
    <rect x="${W*0.18}" y="${H*0.60}" width="${W*0.07}" height="${H*0.08}" rx="6" fill="#101826" stroke="#314868" stroke-width="3"/>
    <rect x="${W*0.36}" y="${H*0.58}" width="${W*0.10}" height="${H*0.07}" rx="6" fill="#24354f" stroke="#47668f" stroke-width="3"/>
    <circle cx="${W*0.22}" cy="${H*0.82}" r="${W*0.075}" fill="#0a0f1a" stroke="#24354f" stroke-width="5"/>
    <circle cx="${W*0.70}" cy="${H*0.82}" r="${W*0.075}" fill="#0a0f1a" stroke="#24354f" stroke-width="5"/>
    <circle cx="${W*0.83}" cy="${H*0.82}" r="${W*0.075}" fill="#0a0f1a" stroke="#24354f" stroke-width="5"/>
    <circle cx="${W*0.22}" cy="${H*0.82}" r="${W*0.036}" fill="#111825" stroke="#314868" stroke-width="3"/>
    <circle cx="${W*0.70}" cy="${H*0.82}" r="${W*0.036}" fill="#111825" stroke="#314868" stroke-width="3"/>
    <circle cx="${W*0.83}" cy="${H*0.82}" r="${W*0.036}" fill="#111825" stroke="#314868" stroke-width="3"/> 
  </g>`;
}

function danFallbackSvg(tipo, vista, W, H) {
  if (tipo === 'caminhao') return danCaminhaoSVGFallback(vista, W, H);
  return danMotoSVGFallback(vista, W, H);
}

function danEditarResumo(vista, id) {
  danMudarVista(vista);
  setTimeout(() => danAbrirModal(id), 80);
}

/* ---------------------------------------------------------------
   DANOS — SUMMARY
--------------------------------------------------------------- */
function danAtualizarSummary() {
  const container = document.getElementById('dan-summary-tags');
  const ids = Object.keys(danDanos);
  if (!ids.length) {
    container.innerHTML = '<div style="font-size:13px;color:var(--label);text-align:center;padding:18px;border:1px dashed var(--border);border-radius:10px;">Nenhum dano registrado ainda.<br>Toque nos pontos do diagrama.</div>';
    return;
  }

  const porVista = {frontal:[],traseira:[],esquerda:[],direita:[]};
  ids.forEach(id => {
    const mapa = {F:'frontal',T:'traseira',E:'esquerda',D:'direita'};
    const v    = mapa[id.charAt(0)];
    if (v) porVista[v].push(id);
  });

  let html = '';
  Object.entries(porVista).forEach(([vista, pontos]) => {
    if (!pontos.length) return;
    html += `<div style="margin-bottom:10px;"><div style="font-size:11px;font-weight:700;color:var(--label);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;">${DAN_VISTA_LABELS[vista]}</div><div>`;
    pontos.forEach(id => {
      const cfg   = DAN_DIAGRAMAS[danVeiculo][vista];
      const ponto = cfg.pontos.find(p => p.id === id);
      if (!ponto) return;
      const tipo = danDanos[id];
      const num  = cfg.pontos.indexOf(ponto) + 1;
      html += `<span class="dan-tag dan-tag-${tipo}" data-click="danEditarResumo('${vista}','${id}')" title="Clique para editar">${DAN_DMG_EMOJI[tipo]} ${num}. ${ponto.label} — ${tipo}</span>`;
    });
    html += '</div></div>';
  });

  container.innerHTML = html;
}

/* ---------------------------------------------------------------
   DANOS — GERAR TEXTO
--------------------------------------------------------------- */
function danGerarTexto() {
  /* ── MOTO via v360 ── */
  if (danUsa360(danVeiculo)) {
    const txt = danGetReportModule()?.buildMotoReport?.(
      v360db,
      V360_NAMES,
      new Date().toLocaleDateString('pt-BR')
    ) || '';
    if (!txt) { alert('Inspecione ao menos uma peça antes de gerar o relatório.'); return; }

    document.getElementById('v360-result-text').textContent = txt;
    const ra = document.getElementById('v360-result-area');
    ra.style.display = 'block';
    ra.scrollIntoView({ behavior:'smooth', block:'nearest' });
    return;
  }

  /* ── CARRO / CAMINHÃO via diagrama SVG ── */
  const txt = danGetReportModule()?.buildDiagramReport?.({
    danos: danDanos,
    date: new Date().toLocaleDateString('pt-BR'),
    diagramas: DAN_DIAGRAMAS,
    getLabel: danGetLabel,
    tipo: danVeiculo,
    vistaLabels: DAN_VISTA_LABELS
  }) || '';
  if (!txt) { alert('Registre ao menos um dano antes de gerar o relatório.'); return; }

  document.getElementById('dan-result-text').textContent = txt;
  const ra = document.getElementById('dan-result-area');
  ra.style.display = 'block';
  ra.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function danCopiar(btn) {
  navigator.clipboard.writeText(document.getElementById('dan-result-text').textContent).then(() => {
    const old = btn.innerHTML; btn.innerHTML = '✅ Copiado!';
    setTimeout(() => btn.innerHTML = old, 2000);
  });
}

function danWhatsApp() {
  window.open('https://wa.me/?text=' + encodeURIComponent(document.getElementById('dan-result-text').textContent), '_blank');
}

/* ===============================================================
   VISTORIA 360° — MOTOCICLETA (v360)
   =============================================================== */
let v360tab = 'frente';
let v360editId = null;

const V360_TABS  = ['frente','tras','direita','esquerda'];
const V360_NAMES = {frente:'FRENTE',tras:'TRASEIRA',direita:'DIREITA',esquerda:'ESQUERDA'};

/* Catálogo de peças — 33 itens, agrupados para arrastar à foto */
const V360_MOTO_PARTES = [
  { n:"01", t:"Farol",                          g:"FRONTAL"       },
  { n:"02", t:"Paralama dianteiro",              g:"FRONTAL"       },
  { n:"03", t:"Pneu dianteiro",                  g:"FRONTAL"       },
  { n:"04", t:"Roda dianteira",                  g:"FRONTAL"       },
  { n:"05", t:"Suspensão dianteira — direita",   g:"FRONTAL"       },
  { n:"06", t:"Suspensão dianteira — esquerda",  g:"FRONTAL"       },
  { n:"07", t:"Seta dianteira — direita",        g:"FRONTAL"       },
  { n:"08", t:"Seta dianteira — esquerda",       g:"FRONTAL"       },
  { n:"09", t:"Retrovisor — direita",            g:"LADO DIREITO"  },
  { n:"10", t:"Manete — direita",                g:"LADO DIREITO"  },
  { n:"11", t:"Carenagem lateral — direita",     g:"LADO DIREITO"  },
  { n:"12", t:"Pedaleira — direita",             g:"LADO DIREITO"  },
  { n:"13", t:"Escapamento — direita",           g:"LADO DIREITO"  },
  { n:"14", t:"Pedal de freio — direita",        g:"LADO DIREITO"  },
  { n:"15", t:"Balança — direita",               g:"LADO DIREITO"  },
  { n:"16", t:"Retrovisor — esquerda",           g:"LADO ESQUERDO" },
  { n:"17", t:"Manete — esquerda",               g:"LADO ESQUERDO" },
  { n:"18", t:"Carenagem lateral — esquerda",    g:"LADO ESQUERDO" },
  { n:"19", t:"Pedaleira — esquerda",            g:"LADO ESQUERDO" },
  { n:"20", t:"Pedal de câmbio — esquerda",      g:"LADO ESQUERDO" },
  { n:"21", t:"Relação / corrente — esquerda",   g:"LADO ESQUERDO" },
  { n:"22", t:"Descanso lateral — esquerda",     g:"LADO ESQUERDO" },
  { n:"23", t:"Balança — esquerda",              g:"LADO ESQUERDO" },
  { n:"24", t:"Lanterna traseira",               g:"TRASEIRO"      },
  { n:"25", t:"Seta traseira — direita",         g:"TRASEIRO"      },
  { n:"26", t:"Seta traseira — esquerda",        g:"TRASEIRO"      },
  { n:"27", t:"Pneu traseiro",                   g:"TRASEIRO"      },
  { n:"28", t:"Roda traseira",                   g:"TRASEIRO"      },
  { n:"29", t:"Amortecedor",                     g:"TRASEIRO"      },
  { n:"30", t:"Alça do garupa",                  g:"TRASEIRO"      },
  { n:"31", t:"Placa / suporte",                 g:"TRASEIRO"      },
  { n:"32", t:"Tanque",                          g:"TRASEIRO"      },
  { n:"33", t:"Banco",                           g:"TRASEIRO"      }
];

let v360db = v360makeDb();

// Inicialização
danCarregarCoordenadasSalvas();

function v360makeDb(){
  const getP = n => V360_MOTO_PARTES.find(p=>parseInt(p.n,10)===n);
  const mk   = (num,x,y) => { const p=getP(num); return {id:num*1000,num,nome:p?p.t:'',grupo:p?p.g:'',dano:null,x,y}; };
  return {
    frente:   [mk(1,52.65,39.95), mk(2,52.65,60.29), mk(3,52.83,81.71), mk(5,39.75,53.15), mk(6,64.31,53.04), mk(7,30.74,40.71), mk(8,77.03,41.36)],
    tras:     [mk(9,13.78,6.53), mk(10,20.32,15.25), mk(12,76.5,53.89), mk(14,76.68,48.28), mk(16,91.87,6.71), mk(17,83.92,15.07), mk(19,27.21,53.18), mk(24,52.65,71.34), mk(25,67.49,70.18), mk(26,37.1,69.65), mk(27,52.83,89.5), mk(30,28,58), mk(32,52.3,23), mk(33,53.36,42.5)],
    direita:  [mk(11,52.83,30.96), mk(13,22.26,61.82), mk(28,12.37,69.92), mk(29,35.51,47.79), mk(31,7.95,40)],
    esquerda: [mk(4,8.13,71.11), mk(18,53.71,43.28), mk(20,46.82,75.35), mk(21,67.49,62.63)]
  };
}

function v360switchTab(el, t){
  danApplyState(
    danGetStateModule()?.setMotoTab?.(danBuildStatePayload(), t)
  );
  document.querySelectorAll('#dan-step-moto360 .dan-tab').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('#dan-step-moto360 .moto-img').forEach(i=>i.classList.remove('active'));
  document.getElementById('v360-img-'+t).classList.add('active');
  document.getElementById('v360-leg-vista').innerText = V360_NAMES[t];
  v360render();
}

function v360saveModal(dano){
  if(v360editId !== null){
    const item = v360db[v360tab].find(i=>i.id===v360editId);
    if(item) item.dano = dano;
  }
  v360closeModal(); v360render();
}

function v360clearDano(){
  if(v360editId !== null){
    const item = v360db[v360tab].find(i=>i.id===v360editId);
    if(item) item.dano = null;
  }
  v360closeModal(); v360render();
}

function v360closeModal(){
  document.getElementById('v360-overlay').classList.remove('show');
  danApplyState(
    danGetStateModule()?.setMotoEditId?.(danBuildStatePayload(), null)
  );
}

function v360closeModalOnBackdrop(event) {
  if (event.target === event.declarativeTarget) v360closeModal();
}

function v360openEdit(id){
  const item = v360db[v360tab].find(i=>i.id===id); if(!item) return;
  danApplyState(
    danGetStateModule()?.setMotoEditId?.(danBuildStatePayload(), id)
  );
  document.getElementById('v360-m-title').innerText = String(item.num).padStart(2,'0')+' — '+item.nome;
  document.getElementById('v360-m-sub').innerText   = item.grupo ? 'Grupo: '+item.grupo+'. Selecione a avaria.' : 'Selecione o tipo de avaria.';
  document.querySelectorAll('.v360-dbtn').forEach(b=>{
    b.classList.toggle('sel', b.dataset.val === item.dano);
  });
  const btnPend = document.getElementById('v360-btn-pend');
  if(btnPend) btnPend.style.display = item.dano !== null ? '' : 'none';
  document.getElementById('v360-overlay').classList.add('show');
}

function v360EditarResumo(tab, id) {
  v360switchTab(document.getElementById('v360-tab-' + tab), tab);
  setTimeout(() => v360openEdit(id), 80);
}

function v360render(){
  /* 1 — Limpar pinos do canvas */
  document.querySelectorAll('#v360-canvas .v360-pin').forEach(p=>p.remove());
  const activeImg = v360GetActiveImageEl();
  const zoomSrc = activeImg ? activeImg.getAttribute('src') : '';

  /* 2 — Desenhar pinos dos itens posicionados na aba atual */
  v360db[v360tab].forEach(item=>{
    const cor = v360corDano(item.dano);
    const ehAvaria = item.dano !== null;
    const pin = document.createElement('div');
    pin.id        = 'v360pin_' + item.id;
    pin.className = 'v360-pin' + (ehAvaria?' avaria':'');
    pin.style.background = cor;
    const pos = v360ImageToCanvasPosition(item.x, item.y);
    pin.style.left = pos.left+'%';
    pin.style.top  = pos.top+'%';
    pin.innerText  = item.num;
    pin.title      = item.num+' — '+item.nome+': '+(item.dano||'Pendente');
    pin.setAttribute('data-part-label', item.dano ? `${item.nome} — ${item.dano}` : item.nome);
    pin.setAttribute('data-zoom-src', zoomSrc);
    pin.setAttribute('data-zoom-x', item.x);
    pin.setAttribute('data-zoom-y', item.y);
    pin.setAttribute('data-zoom-scale', '300');

    pin.onclick = () => v360openEdit(item.id);

    document.getElementById('v360-canvas').appendChild(pin);
  });
  v360BindTooltips(document.getElementById('v360-canvas'), 'v360-part-readout');

  /* 3 — Atualizar paleta lateral e resumo */
  v360renderPalette();
  v360updateSummary();
}

/* ── Paleta: renderiza a lista de peças (status apenas) ──────────────────── */
function v360renderPalette(){
  const list = document.getElementById('v360-legend-list');
  if(!list) return;

  list.innerHTML = danGetRenderModule()?.buildV360PaletteHtml?.(
    V360_MOTO_PARTES,
    V360_TABS,
    v360db,
    {
      getDamageColor: v360corDano,
      tabNames: V360_NAMES
    }
  ) || '';
}

function v360corDano(d){
  if(d==='Quebrado')  return '#e74c3c';
  if(d==='Trincado')  return '#e67e22';
  if(d==='Riscado')   return '#c9a800';
  if(d==='Amassado')  return '#8e44ad';
  return '#F58220'; /* pendente */
}

function v360updateSummary(){
  const container = document.getElementById('v360-summary-tags');
  container.innerHTML = danGetRenderModule()?.buildV360SummaryHtml?.(
    V360_TABS,
    v360db,
    {
      getDamageColor: v360corDano,
      getDamageEmoji(damage) {
        if (damage === 'Quebrado') return '🔴';
        if (damage === 'Trincado') return '🟠';
        if (damage === 'Riscado') return '🟡';
        return '🟣';
      }
    }
  ) || '';
}

function v360limpar(){
  if(confirm('Resetar toda a vistoria? As posições e classificações serão apagadas.')){
    danApplyState(
      danGetStateModule()?.resetMotoInspection?.(danBuildStatePayload(), v360makeDb)
    );
    v360switchTab(document.getElementById('v360-tab-frente'),'frente');
    v360render();
  }
}

function v360Copiar(btn){
  navigator.clipboard.writeText(document.getElementById('v360-result-text').textContent).then(()=>{
    const old = btn.innerHTML; btn.innerHTML = '✅ Copiado!';
    setTimeout(()=> btn.innerHTML = old, 2000);
  });
}

function v360WhatsApp(){
  window.open('https://wa.me/?text=' + encodeURIComponent(document.getElementById('v360-result-text').textContent), '_blank');
}



