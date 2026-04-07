/**
 * Modulo: Croqui Dinamico de Sinistros
 * Motor de desenho tecnico para pericia rodoviaria
 */

let CROQUI_SELECTED = null;
let CROQUI_SVG = null;
let CROQUI_DRAGGING = false;
let CROQUI_DRAG_OFFSET_X = 0;
let CROQUI_DRAG_OFFSET_Y = 0;

const CROQUI_DEFAULT_TRANSFORM = {
  x: 150,
  y: 150,
  rotate: 0,
  scaleX: 1,
  scaleY: 1
};

const CROQUI_ICON_MAP = {
  v1: { emoji: '🚗', label: 'V1', fontSize: 40 },
  v2: { emoji: '🚘', label: 'V2', fontSize: 40 },
  moto: { emoji: '🏍️', label: 'MOTO', fontSize: 38 },
  caminhao: { emoji: '🚚', label: 'CAMINHAO', fontSize: 40 },
  carreta: { emoji: '🚛', label: 'CARRETA', fontSize: 44 },
  onibus: { emoji: '🚌', label: 'ONIBUS', fontSize: 40 },
  bicicleta: { emoji: '🚲', label: 'BIKE', fontSize: 36 },
  viatura: { emoji: '🚓', label: 'PMRV', fontSize: 40 },
  ambulancia: { emoji: '🚑', label: 'SAMU', fontSize: 40 },
  reboque: { emoji: '🛻', label: 'REBOQUE', fontSize: 38 },
  cone: { emoji: '⚠️', label: 'CONE', fontSize: 28 },
  pare: { emoji: '🛑', label: 'PARE', fontSize: 34 },
  preferencial: { emoji: '🔻', label: 'PREF.', fontSize: 34 },
  semaforo: { emoji: '🚦', label: 'SEMAFORO', fontSize: 34 },
  sem_verde: { emoji: '🟢', label: 'SEM. VERDE', fontSize: 28 },
  sem_vermelho: { emoji: '🔴', label: 'SEM. VERM.', fontSize: 28 },
  arvore: { emoji: '🌳', label: 'ARVORE', fontSize: 34 },
  poste: { emoji: '💡', label: 'POSTE', fontSize: 28 },
  norte: { emoji: '🧭', label: 'NORTE', fontSize: 34 },
  buraco: { emoji: '🕳️', label: 'DEFEITO', fontSize: 30 },
  animal_via: { emoji: '🐄', label: 'ANIMAL', fontSize: 36 },
  pedestre: { emoji: '🚶', label: 'PEDESTRE', fontSize: 34 },
  idoso: { emoji: '👨‍🦳', label: 'IDOSO', fontSize: 30 },
  crianca: { emoji: '🧒', label: 'CRIANCA', fontSize: 30 },
  cadeirante: { emoji: '👨‍🦽', label: 'PCD', fontSize: 30 },
  oleo: { emoji: '🛢️', label: 'OLEO', fontSize: 30 },
  vtr_emergencia: { emoji: '🚨', label: 'EMERG.', fontSize: 30 },
  frenagem: { emoji: '⬛', label: 'FRENAGEM', fontSize: 18, asRect: true }
};

function croqui_getLayer(id) {
  return document.getElementById(id);
}

function croqui_composeTransform({ x, y, rotate, scaleX, scaleY }) {
  return `translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(${rotate.toFixed(2)}) scale(${scaleX.toFixed(2)}, ${scaleY.toFixed(2)})`;
}

function croqui_parseTransform(element) {
  const transform = element?.getAttribute('transform') || '';
  const translateMatch = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(transform);
  const rotateMatch = /rotate\(([-\d.]+)\)/.exec(transform);
  const scaleMatch = /scale\(([-\d.]+)(?:[ ,]+([-\d.]+))?\)/.exec(transform);

  const scaleX = scaleMatch ? parseFloat(scaleMatch[1]) : CROQUI_DEFAULT_TRANSFORM.scaleX;
  const scaleY = scaleMatch && scaleMatch[2] ? parseFloat(scaleMatch[2]) : scaleX;

  return {
    x: translateMatch ? parseFloat(translateMatch[1]) : CROQUI_DEFAULT_TRANSFORM.x,
    y: translateMatch ? parseFloat(translateMatch[2]) : CROQUI_DEFAULT_TRANSFORM.y,
    rotate: rotateMatch ? parseFloat(rotateMatch[1]) : CROQUI_DEFAULT_TRANSFORM.rotate,
    scaleX,
    scaleY
  };
}

function croqui_applyTransform(element, patch) {
  const current = croqui_parseTransform(element);
  const next = { ...current, ...patch };
  element.setAttribute('transform', croqui_composeTransform(next));
}

function croqui_createGroup(idPrefix, type, transform) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  element.setAttribute('id', `${idPrefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  element.setAttribute('data-type', type);
  element.setAttribute('transform', croqui_composeTransform(transform));
  element.style.cursor = 'move';
  return element;
}

function croqui_init() {
  CROQUI_SVG = document.getElementById('croqui-svg');
  if (!CROQUI_SVG || CROQUI_SVG.dataset.bound === 'true') return;

  CROQUI_SVG.dataset.bound = 'true';
  CROQUI_SVG.addEventListener('mousedown', croqui_onStart);
  CROQUI_SVG.addEventListener('mousemove', croqui_onMove);
  CROQUI_SVG.addEventListener('mouseup', croqui_onEnd);
  CROQUI_SVG.addEventListener('mouseleave', croqui_onEnd);

  CROQUI_SVG.addEventListener('touchstart', croqui_onStart, { passive: false });
  CROQUI_SVG.addEventListener('touchmove', croqui_onMove, { passive: false });
  CROQUI_SVG.addEventListener('touchend', croqui_onEnd, { passive: false });
  CROQUI_SVG.addEventListener('touchcancel', croqui_onEnd, { passive: false });
}

function croqui_adicionarVia(tipo) {
  const layer = croqui_getLayer('croqui-vias');
  if (!layer) return null;

  let element = null;

  if (tipo === 'reta') {
    element = croqui_createGroup('via', 'via', { x: 50, y: 150, rotate: 0, scaleX: 1, scaleY: 1 });
    element.innerHTML = `
      <rect width="300" height="100" fill="#333" />
      <line x1="0" y1="50" x2="300" y2="50" stroke="yellow" stroke-width="2" stroke-dasharray="10,10" />
      <line x1="0" y1="5" x2="300" y2="5" stroke="white" stroke-width="2" />
      <line x1="0" y1="95" x2="300" y2="95" stroke="white" stroke-width="2" />
    `;
  } else if (tipo === 'curva') {
    element = croqui_createGroup('via', 'via', { x: 100, y: 100, rotate: 0, scaleX: 1, scaleY: 1 });
    element.innerHTML = `
      <path d="M 0 200 Q 0 0 200 0" fill="none" stroke="#333" stroke-width="100" />
      <path d="M 0 200 Q 0 0 200 0" fill="none" stroke="yellow" stroke-width="2" stroke-dasharray="10,10" />
    `;
  } else if (tipo === 'cruzamento') {
    element = croqui_createGroup('via', 'via', { x: 100, y: 100, rotate: 0, scaleX: 1, scaleY: 1 });
    element.innerHTML = `
      <rect x="80" y="0" width="100" height="260" fill="#333" />
      <rect x="0" y="80" width="260" height="100" fill="#333" />
      <line x1="130" y1="0" x2="130" y2="260" stroke="yellow" stroke-width="2" stroke-dasharray="10,10" />
      <line x1="0" y1="130" x2="260" y2="130" stroke="yellow" stroke-width="2" stroke-dasharray="10,10" />
    `;
  }

  if (!element) return null;
  layer.appendChild(element);
  croqui_selecionar(element);
  return element;
}

function croqui_abrirModalIcones() {
  const modal = document.getElementById('croqui-modal-icones');
  if (!modal) return;
  modal.classList.remove('hidden');
  croqui_filtrarIcones('veiculo');
}

function croqui_fecharModal() {
  document.getElementById('croqui-modal-icones')?.classList.add('hidden');
}

function croqui_fecharModalOnBackdrop(event) {
  if (event.target.id === 'croqui-modal-icones') croqui_fecharModal();
}

function croqui_filtrarIcones(category) {
  document.querySelectorAll('.croqui-icon-item').forEach(item => {
    item.classList.toggle('hidden', !item.classList.contains(category));
  });

  document.querySelectorAll('.croqui-icon-tabs .btn').forEach(btn => {
    const isActive = btn.getAttribute('data-click') === `croqui_filtrarIcones('${category}')`;
    btn.classList.toggle('btn-primary', isActive);
  });
}

function croqui_buildIconContent(config) {
  if (config.asRect) {
    return '<rect x="-18" y="0" width="36" height="6" fill="#555" rx="2" />';
  }

  return `<text y="10" font-size="${config.fontSize}" text-anchor="middle">${config.emoji}</text>`;
}

function croqui_inserirIcone(tipo) {
  const layer = croqui_getLayer('croqui-objetos');
  if (!layer) return null;

  const config = CROQUI_ICON_MAP[tipo];
  if (!config) {
    console.warn(`[Croqui] Icone nao mapeado: ${tipo}`);
    alert(`Icone indisponivel: ${tipo}`);
    return null;
  }

  const element = croqui_createGroup('obj', 'objeto', { ...CROQUI_DEFAULT_TRANSFORM });
  element.innerHTML = `
    <g class="icon-body">
      ${croqui_buildIconContent(config)}
    </g>
    <text y="-25" font-size="10" font-weight="bold" fill="rgba(255,255,255,0.8)" text-anchor="middle" class="icon-label">${config.label}</text>
  `;

  layer.appendChild(element);
  croqui_fecharModal();
  croqui_selecionar(element);
  return element;
}

async function croqui_loadSvgMarkup(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Falha ao carregar ${path}: HTTP ${response.status}`);
  }

  const svgText = await response.text();
  if (!svgText.includes('<svg')) {
    throw new Error(`Arquivo SVG invalido: ${path}`);
  }

  return svgText.replace(/<svg[^>]*>/i, '').replace(/<\/svg>/i, '').trim();
}

async function croqui_inserirSvg(filename, fromRoot = false) {
  const layer = croqui_getLayer('croqui-objetos');
  if (!layer) return null;

  const element = croqui_createGroup('svg', 'objeto', { ...CROQUI_DEFAULT_TRANSFORM });
  const path = fromRoot ? filename : `img/sinistros/${filename}`;

  try {
    const markup = await croqui_loadSvgMarkup(path);
    element.innerHTML = `
      <g class="icon-body" transform="translate(-18, -18) scale(1.6, 1.6)" style="filter: invert(1); transform-origin: center;">
        ${markup}
      </g>
    `;
    layer.appendChild(element);
    croqui_fecharModal();
    croqui_selecionar(element);
    return element;
  } catch (err) {
    console.error('[Croqui] Erro ao inserir SVG.', err);
    alert(`Nao foi possivel carregar o SVG: ${filename}`);
    return null;
  }
}

async function croqui_inserirPistaSvg(filename) {
  const layer = croqui_getLayer('croqui-vias');
  if (!layer) return null;

  const element = croqui_createGroup('pista', 'via', { x: 210, y: 160, rotate: 0, scaleX: 0.5, scaleY: 0.5 });

  try {
    const markup = await croqui_loadSvgMarkup(filename);
    element.innerHTML = `
      <g class="pista-body" style="filter: brightness(0.8); transform-origin: center;">
        ${markup}
      </g>
    `;
    layer.appendChild(element);
    croqui_fecharModal();
    croqui_selecionar(element);
    return element;
  } catch (err) {
    console.error('[Croqui] Erro ao inserir pista SVG.', err);
    alert(`Nao foi possivel carregar a pista: ${filename}`);
    return null;
  }
}

function croqui_selecionar(element) {
  if (CROQUI_SELECTED) {
    CROQUI_SELECTED.classList.remove('selected');
  }

  CROQUI_SELECTED = element;
  if (CROQUI_SELECTED) {
    CROQUI_SELECTED.classList.add('selected');
  }
}

function croqui_clearSelection() {
  if (CROQUI_SELECTED) {
    CROQUI_SELECTED.classList.remove('selected');
  }
  CROQUI_SELECTED = null;
}

function croqui_getCoords(event) {
  if (!CROQUI_SVG) return { x: 0, y: 0 };

  const ctm = CROQUI_SVG.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };

  const point = event.touches ? event.touches[0] : event;
  return {
    x: (point.clientX - ctm.e) / ctm.a,
    y: (point.clientY - ctm.f) / ctm.d
  };
}

function croqui_onStart(event) {
  if (event.cancelable) {
    event.preventDefault();
  }

  const target = event.target.closest('g[id]');
  if (!target) {
    croqui_clearSelection();
    return;
  }

  croqui_selecionar(target);
  CROQUI_DRAGGING = true;

  const coords = croqui_getCoords(event);
  const transform = croqui_parseTransform(target);
  CROQUI_DRAG_OFFSET_X = coords.x - transform.x;
  CROQUI_DRAG_OFFSET_Y = coords.y - transform.y;
}

function croqui_onMove(event) {
  if (!CROQUI_DRAGGING || !CROQUI_SELECTED) return;
  event.preventDefault();

  const coords = croqui_getCoords(event);
  croqui_applyTransform(CROQUI_SELECTED, {
    x: coords.x - CROQUI_DRAG_OFFSET_X,
    y: coords.y - CROQUI_DRAG_OFFSET_Y
  });
}

function croqui_onEnd() {
  CROQUI_DRAGGING = false;
}

function croqui_girar() {
  if (!CROQUI_SELECTED) return;
  const transform = croqui_parseTransform(CROQUI_SELECTED);
  croqui_applyTransform(CROQUI_SELECTED, { rotate: (transform.rotate + 15) % 360 });
}

function croqui_escala(delta) {
  if (!CROQUI_SELECTED) return;
  const transform = croqui_parseTransform(CROQUI_SELECTED);
  croqui_applyTransform(CROQUI_SELECTED, {
    scaleX: Math.max(0.2, transform.scaleX + delta),
    scaleY: Math.max(0.2, transform.scaleY + delta)
  });
}

function croqui_espelhar() {
  if (!CROQUI_SELECTED) return;
  const transform = croqui_parseTransform(CROQUI_SELECTED);
  croqui_applyTransform(CROQUI_SELECTED, { scaleX: transform.scaleX * -1 });
}

function croqui_camada(dir) {
  if (!CROQUI_SELECTED || !CROQUI_SELECTED.parentNode) return;

  const parent = CROQUI_SELECTED.parentNode;
  if (dir === 'frente') {
    const next = CROQUI_SELECTED.nextElementSibling;
    if (next) {
      parent.insertBefore(next, CROQUI_SELECTED);
    }
  } else if (dir === 'tras') {
    const previous = CROQUI_SELECTED.previousElementSibling;
    if (previous) {
      parent.insertBefore(CROQUI_SELECTED, previous);
    }
  }
}

function croqui_limpar() {
  if (!confirm('Deseja limpar todo o croqui?')) return;
  croqui_getLayer('croqui-vias').innerHTML = '';
  croqui_getLayer('croqui-objetos').innerHTML = '';
  croqui_clearSelection();
}

async function croqui_exportar() {
  if (!CROQUI_SVG) return;

  const svgData = new XMLSerializer().serializeToString(CROQUI_SVG);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const image = new Image();

  canvas.width = CROQUI_SVG.clientWidth * 2;
  canvas.height = CROQUI_SVG.clientHeight * 2;

  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  image.onload = () => {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `Croqui_PMRv_${Date.now()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  image.onerror = () => {
    URL.revokeObjectURL(url);
    alert('Nao foi possivel exportar o croqui.');
  };

  image.src = url;
}

function croqui_whatsapp() {
  alert("Dica: use 'Salvar PNG' e anexe a imagem no WhatsApp.");
}

function croqui_resetCanvas() {
  croqui_getLayer('croqui-vias').innerHTML = '';
  croqui_getLayer('croqui-objetos').innerHTML = '';
  croqui_clearSelection();
}

function croqui_placeSelected(transform) {
  if (!CROQUI_SELECTED) return;
  croqui_applyTransform(CROQUI_SELECTED, transform);
}

function croqui_placeElement(element, transform) {
  if (!element) return null;
  croqui_applyTransform(element, transform);
  return element;
}

async function croqui_aplicarModelo(tipo) {
  if (!confirm('Isso ira limpar o desenho atual para aplicar o modelo. Continuar?')) return;

  croqui_resetCanvas();

  if (tipo === 'frontal') {
    croqui_adicionarVia('reta');
    const v1 = croqui_inserirIcone('v1');
    croqui_placeElement(v1, { x: 80, y: 185 });
    const v2 = croqui_inserirIcone('v2');
    croqui_placeElement(v2, { x: 220, y: 185, rotate: 180 });
    const impacto = await croqui_inserirSvg('3.1-colisao-frontal.svg');
    croqui_placeElement(impacto, { x: 150, y: 185 });
  } else if (tipo === 'traseira') {
    croqui_adicionarVia('reta');
    const v1 = croqui_inserirIcone('v1');
    croqui_placeElement(v1, { x: 200, y: 185 });
    const v2 = croqui_inserirIcone('v2');
    croqui_placeElement(v2, { x: 100, y: 185 });
    const impacto = await croqui_inserirSvg('3.2-colisao-traseira.svg');
    croqui_placeElement(impacto, { x: 180, y: 185 });
  } else if (tipo === 'transversal') {
    croqui_adicionarVia('cruzamento');
    const v1 = croqui_inserirIcone('v1');
    croqui_placeElement(v1, { x: 130, y: 220, rotate: -90 });
    const v2 = croqui_inserirIcone('v2');
    croqui_placeElement(v2, { x: 220, y: 130, rotate: 180 });
    const impacto = await croqui_inserirSvg('2.3-abalroamento-transversal.svg');
    croqui_placeElement(impacto, { x: 130, y: 130 });
  } else if (tipo === 'saida') {
    croqui_adicionarVia('curva');
    const v1 = croqui_inserirIcone('v1');
    croqui_placeElement(v1, { x: 100, y: 100, rotate: 45 });
    const impacto = await croqui_inserirSvg('5.3-saida-pista-capotamento.svg');
    croqui_placeElement(impacto, { x: 120, y: 120 });
  }

  croqui_fecharModal();
}

window.croqui_init = croqui_init;
window.croqui_adicionarVia = croqui_adicionarVia;
window.croqui_abrirModalIcones = croqui_abrirModalIcones;
window.croqui_fecharModal = croqui_fecharModal;
window.croqui_fecharModalOnBackdrop = croqui_fecharModalOnBackdrop;
window.croqui_filtrarIcones = croqui_filtrarIcones;
window.croqui_inserirIcone = croqui_inserirIcone;
window.croqui_inserirSvg = croqui_inserirSvg;
window.croqui_inserirPistaSvg = croqui_inserirPistaSvg;
window.croqui_girar = croqui_girar;
window.croqui_escala = croqui_escala;
window.croqui_espelhar = croqui_espelhar;
window.croqui_camada = croqui_camada;
window.croqui_limpar = croqui_limpar;
window.croqui_exportar = croqui_exportar;
window.croqui_whatsapp = croqui_whatsapp;
window.croqui_aplicarModelo = croqui_aplicarModelo;

document.addEventListener('DOMContentLoaded', croqui_init);
