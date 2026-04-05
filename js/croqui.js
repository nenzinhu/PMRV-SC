/**
 * Módulo: Croqui Dinâmico de Sinistros
 * Motor de desenho técnico para perícia rodoviária
 */

let CROQUI_ELEMENTS = [];
let CROQUI_SELECTED = null;
let CROQUI_SVG = null;

// Configurações de Arraste
let isDragging = false;
let startX, startY;
let currentX, currentY;

/**
 * Inicializa o Croqui
 */
function croqui_init() {
    CROQUI_SVG = document.getElementById('croqui-svg');
    if (!CROQUI_SVG) return;

    // Eventos de Mouse/Touch para o SVG
    CROQUI_SVG.addEventListener('mousedown', croqui_onStart);
    CROQUI_SVG.addEventListener('mousemove', croqui_onMove);
    CROQUI_SVG.addEventListener('mouseup', croqui_onEnd);

    CROQUI_SVG.addEventListener('touchstart', croqui_onStart, { passive: false });
    CROQUI_SVG.addEventListener('touchmove', croqui_onMove, { passive: false });
    CROQUI_SVG.addEventListener('touchend', croqui_onEnd, { passive: false });
}

/**
 * Adiciona uma geometria de via ao croqui
 */
function croqui_adicionarVia(tipo) {
    const g = document.getElementById('croqui-vias');
    const id = 'via-' + Date.now();
    let element = null;

    if (tipo === 'reta') {
        element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        element.setAttribute('id', id);
        element.setAttribute('transform', 'translate(50, 150) scale(1, 1)');
        element.innerHTML = `
            <rect width="300" height="100" fill="#333" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="yellow" stroke-width="2" stroke-dasharray="10,10" />
            <line x1="0" y1="5" x2="300" y2="5" stroke="white" stroke-width="2" />
            <line x1="0" y1="95" x2="300" y2="95" stroke="white" stroke-width="2" />
        `;
    } else if (tipo === 'curva') {
        element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        element.setAttribute('id', id);
        element.setAttribute('transform', 'translate(100, 100) scale(1, 1)');
        element.innerHTML = `
            <path d="M 0 200 Q 0 0 200 0" fill="none" stroke="#333" stroke-width="100" />
            <path d="M 0 200 Q 0 0 200 0" fill="none" stroke="yellow" stroke-width="2" stroke-dasharray="10,10" />
        `;
    } else if (tipo === 'cruzamento') {
        element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        element.setAttribute('id', id);
        element.setAttribute('transform', 'translate(100, 100) scale(1, 1)');
        element.innerHTML = `
            <rect x="80" y="0" width="100" height="260" fill="#333" />
            <rect x="0" y="80" width="260" height="100" fill="#333" />
            <line x1="130" y1="0" x2="130" y2="260" stroke="yellow" stroke-width="2" stroke-dasharray="10,10" />
            <line x1="0" y1="130" x2="260" y2="130" stroke="yellow" stroke-width="2" stroke-dasharray="10,10" />
        `;
    }

    if (element) {
        element.style.cursor = 'move';
        element.setAttribute('data-type', 'via');
        g.appendChild(element);
        croqui_selecionar(element);
    }
}

/**
 * Abre o modal de ícones
 */
function croqui_abrirModalIcones() {
    const modal = document.getElementById('croqui-modal-icones');
    if (modal) modal.classList.remove('hidden');
}

function croqui_fecharModal() {
    const modal = document.getElementById('croqui-modal-icones');
    if (modal) modal.classList.add('hidden');
}

function croqui_fecharModalOnBackdrop(e) {
    if (e.target.id === 'croqui-modal-icones') croqui_fecharModal();
}

function croqui_filtrarIcones(cat) {
    document.querySelectorAll('.croqui-icon-item').forEach(el => {
        el.classList.toggle('hidden', !el.classList.contains(cat));
    });
    document.querySelectorAll('.croqui-icon-tabs .btn').forEach(btn => {
        btn.classList.toggle('btn-primary', btn.getAttribute('data-click').includes(`'${cat}'`));
    });
}

/**
 * Insere um ícone de emoji (Veículo ou Objeto)
 */
function croqui_inserirIcone(tipo) {
    const g = document.getElementById('croqui-objetos');
    const id = 'obj-' + Date.now();
    const element = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    let emoji = "🚗";
    let color = "";
    let label = tipo.toUpperCase();
    let fontSize = 40;

    // Mapeamento de Emojis
    const mapa = {
        'v1': { e: "🚗", l: "V1" },
        'v2': { e: "🚗", l: "V2", c: "filter: hue-rotate(90deg);" },
        'moto': { e: "🏍️", l: "MOTO" },
        'caminhao': { e: "🚚", l: "CAMINHÃO" },
        'onibus': { e: "🚌", l: "ÔNIBUS" },
        'bicicleta': { e: "🚲", l: "BIKE" },
        'viatura': { e: "🚓", l: "PMRV" },
        'ambulancia': { e: "🚑", l: "SAMU" },
        'reboque': { e: "🚛", l: "CARGA" },
        'cone': { e: "⚠️", l: "CONE", fs: 30 },
        'pare': { e: "🛑", l: "PARE", fs: 35 },
        'arvore': { e: "🌳", l: "ÁRVORE", fs: 35 },
        'poste': { e: "💡", l: "POSTE", fs: 30 },
        'norte': { e: "🧭", l: "NORTE", fs: 35 },
        'frenagem': { e: "⬛", l: "FRENAGEM", fs: 10 }
    };

    if (mapa[tipo]) {
        emoji = mapa[tipo].e;
        label = mapa[tipo].l;
        color = mapa[tipo].c || "";
        fontSize = mapa[tipo].fs || 40;
    }

    element.setAttribute('id', id);
    element.setAttribute('transform', 'translate(150, 150) rotate(0) scale(1, 1)');
    
    // Especial para frenagem (forma geométrica em vez de texto se preferir, mas vamos manter simples)
    let content = `<text y="10" font-size="${fontSize}" text-anchor="middle" style="${color}">${emoji}</text>`;
    if (tipo === 'frenagem') {
        content = `<rect x="-15" y="0" width="30" height="5" fill="#555" rx="2" />`;
    }

    element.innerHTML = `
        <g class="icon-body">
            ${content}
        </g>
        <text y="-25" font-size="10" font-weight="bold" fill="rgba(255,255,255,0.8)" text-anchor="middle" class="icon-label">${label}</text>
    `;
    
    element.style.cursor = 'move';
    element.setAttribute('data-type', 'objeto');
    g.appendChild(element);
    croqui_fecharModal();
    croqui_selecionar(element);
}

/**
 * Insere um ícone SVG (Sinistro)
 */
function croqui_inserirSvg(filename) {
    const g = document.getElementById('croqui-objetos');
    const id = 'svg-' + Date.now();
    const element = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    element.setAttribute('id', id);
    element.setAttribute('transform', 'translate(150, 150) rotate(0) scale(1, 1)');
    
    fetch(`img/sinistros/${filename}`)
        .then(response => response.text())
        .then(svgText => {
            const cleanSvg = svgText.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '');
            element.innerHTML = `
                <g class="icon-body" transform="translate(-15, -15) scale(1.5, 1.5)" style="filter: invert(1);">
                    ${cleanSvg}
                </g>
            `;
        });

    element.style.cursor = 'move';
    element.setAttribute('data-type', 'objeto');
    g.appendChild(element);
    croqui_fecharModal();
    croqui_selecionar(element);
}

/**
 * Lógica de Seleção e Arraste
 */
function croqui_selecionar(el) {
    if (CROQUI_SELECTED) {
        CROQUI_SELECTED.classList.remove('selected');
    }
    CROQUI_SELECTED = el;
    CROQUI_SELECTED.classList.add('selected');
}

function croqui_onStart(e) {
    const target = e.target.closest('g[id]');
    if (!target) {
        if (CROQUI_SELECTED) CROQUI_SELECTED.classList.remove('selected');
        CROQUI_SELECTED = null;
        return;
    }
    croqui_selecionar(target);
    isDragging = true;
    const coords = croqui_getCoords(e);
    startX = coords.x;
    startY = coords.y;
    
    const transform = target.getAttribute('transform') || 'translate(0,0)';
    const match = /translate\(([^, ]+)[, ]*([^)]+)\)/.exec(transform);
    if (match) {
        currentX = parseFloat(match[1]);
        currentY = parseFloat(match[2]);
    }
}

function croqui_onMove(e) {
    if (!isDragging || !CROQUI_SELECTED) return;
    e.preventDefault();
    const coords = croqui_getCoords(e);
    const dx = coords.x - startX;
    const dy = coords.y - startY;
    const newX = currentX + dx;
    const newY = currentY + dy;
    
    const currentTransform = CROQUI_SELECTED.getAttribute('transform') || '';
    const otherTransforms = currentTransform.replace(/translate\([^)]+\)/, '').trim();
    CROQUI_SELECTED.setAttribute('transform', `translate(${newX}, ${newY}) ${otherTransforms}`);
}

function croqui_onEnd() {
    isDragging = false;
}

function croqui_getCoords(e) {
    const svg = CROQUI_SVG;
    const CTM = svg.getScreenCTM();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: (clientX - CTM.e) / CTM.a,
        y: (clientY - CTM.f) / CTM.d
    };
}

/**
 * Transformações (Girar, Escalar, Espelhar)
 */
function croqui_girar() {
    if (!CROQUI_SELECTED) return;
    const transform = CROQUI_SELECTED.getAttribute('transform') || '';
    const rotateMatch = /rotate\(([^)]+)\)/.exec(transform);
    let angle = rotateMatch ? parseFloat(rotateMatch[1]) : 0;
    angle = (angle + 15) % 360;
    const otherTransforms = transform.replace(/rotate\([^)]+\)/, '').trim();
    CROQUI_SELECTED.setAttribute('transform', `${otherTransforms} rotate(${angle})`);
}

function croqui_escala(delta) {
    if (!CROQUI_SELECTED) return;
    const transform = CROQUI_SELECTED.getAttribute('transform') || '';
    const scaleMatch = /scale\(([^, )]+)[, ]*([^)]+)?\)/.exec(transform);
    
    let sx = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    let sy = (scaleMatch && scaleMatch[2]) ? parseFloat(scaleMatch[2]) : sx;
    
    sx = Math.max(0.2, sx + delta);
    sy = Math.max(0.2, sy + delta);
    
    const otherTransforms = transform.replace(/scale\([^)]+\)/, '').trim();
    CROQUI_SELECTED.setAttribute('transform', `${otherTransforms} scale(${sx.toFixed(2)}, ${sy.toFixed(2)})`);
}

function croqui_espelhar() {
    if (!CROQUI_SELECTED) return;
    const transform = CROQUI_SELECTED.getAttribute('transform') || '';
    const scaleMatch = /scale\(([^, )]+)[, ]*([^)]+)?\)/.exec(transform);
    
    let sx = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    let sy = (scaleMatch && scaleMatch[2]) ? parseFloat(scaleMatch[2]) : sx;
    
    sx = sx * -1;
    const otherTransforms = transform.replace(/scale\([^)]+\)/, '').trim();
    CROQUI_SELECTED.setAttribute('transform', `${otherTransforms} scale(${sx.toFixed(2)}, ${sy.toFixed(2)})`);
}

/**
 * Controle de Camadas (Z-Index)
 */
function croqui_camada(dir) {
    if (!CROQUI_SELECTED) return;
    const parent = CROQUI_SELECTED.parentNode;
    if (dir === 'frente' && CROQUI_SELECTED.nextElementSibling) {
        parent.appendChild(CROQUI_SELECTED); // Mover para o final = topo
    } else if (dir === 'tras' && CROQUI_SELECTED.previousElementSibling) {
        parent.insertBefore(CROQUI_SELECTED, parent.firstChild); // Mover para o início = fundo
    }
}

function croqui_limpar() {
    if (confirm("Deseja limpar todo o croqui?")) {
        document.getElementById('croqui-vias').innerHTML = '';
        document.getElementById('croqui-objetos').innerHTML = '';
        CROQUI_SELECTED = null;
    }
}

/**
 * Exportação e WhatsApp
 */
async function croqui_exportar() {
    const svg = CROQUI_SVG;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    // Alta qualidade (2x)
    canvas.width = svg.clientWidth * 2;
    canvas.height = svg.clientHeight * 2;
    
    const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = function() {
        ctx.fillStyle = "#222"; // Fundo escuro do croqui
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "Croqui_PMRv_" + new Date().getTime() + ".png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };
    img.src = url;
}

function croqui_whatsapp() {
    alert("Dica: Use 'Salvar Imagem' e anexe a foto no WhatsApp da Central/Grupo.");
}

/**
 * Modelos Prontos
 */
function croqui_aplicarModelo(tipo) {
    if (!confirm("Isso irá limpar o desenho atual para aplicar o modelo. Continuar?")) return;
    
    document.getElementById('croqui-vias').innerHTML = '';
    document.getElementById('croqui-objetos').innerHTML = '';
    
    if (tipo === 'frontal') {
        croqui_adicionarVia('reta');
        croqui_inserirIcone('v1');
        CROQUI_SELECTED.setAttribute('transform', 'translate(80, 185) rotate(0)');
        croqui_inserirIcone('v2');
        CROQUI_SELECTED.setAttribute('transform', 'translate(220, 185) rotate(180)');
        croqui_inserirSvg('3.1-colisao-frontal.svg');
        setTimeout(() => { if (CROQUI_SELECTED) CROQUI_SELECTED.setAttribute('transform', 'translate(150, 185)'); }, 200);
    } 
    else if (tipo === 'traseira') {
        croqui_adicionarVia('reta');
        croqui_inserirIcone('v1');
        CROQUI_SELECTED.setAttribute('transform', 'translate(200, 185) rotate(0)');
        croqui_inserirIcone('v2');
        CROQUI_SELECTED.setAttribute('transform', 'translate(100, 185) rotate(0)');
        croqui_inserirSvg('3.2-colisao-traseira.svg');
        setTimeout(() => { if (CROQUI_SELECTED) CROQUI_SELECTED.setAttribute('transform', 'translate(180, 185)'); }, 200);
    }
    else if (tipo === 'engavetamento') {
        croqui_adicionarVia('reta');
        croqui_inserirIcone('v1');
        CROQUI_SELECTED.setAttribute('transform', 'translate(250, 185) rotate(0)');
        croqui_inserirIcone('v2');
        CROQUI_SELECTED.setAttribute('transform', 'translate(150, 185) rotate(0)');
        croqui_inserirIcone('reboque');
        CROQUI_SELECTED.setAttribute('transform', 'translate(50, 185) rotate(0)');
        croqui_inserirSvg('3.3-colisao-engavetamento.svg');
        setTimeout(() => { if (CROQUI_SELECTED) CROQUI_SELECTED.setAttribute('transform', 'translate(150, 185)'); }, 200);
    }
    else if (tipo === 'atropelamento') {
        croqui_adicionarVia('reta');
        croqui_inserirIcone('v1');
        CROQUI_SELECTED.setAttribute('transform', 'translate(120, 185) rotate(0)');
        croqui_inserirSvg('1.1-atropelamento-pedestre.svg');
        setTimeout(() => { if (CROQUI_SELECTED) CROQUI_SELECTED.setAttribute('transform', 'translate(180, 185)'); }, 200);
    }
    else if (tipo === 'animal') {
        croqui_adicionarVia('reta');
        croqui_inserirIcone('v1');
        CROQUI_SELECTED.setAttribute('transform', 'translate(120, 185) rotate(0)');
        croqui_inserirSvg('1.2-atropelamento-animal.svg');
        setTimeout(() => { if (CROQUI_SELECTED) CROQUI_SELECTED.setAttribute('transform', 'translate(180, 185)'); }, 200);
    }
    else if (tipo === 'transversal') {
        croqui_adicionarVia('cruzamento');
        croqui_inserirIcone('v1');
        CROQUI_SELECTED.setAttribute('transform', 'translate(130, 220) rotate(-90)');
        croqui_inserirIcone('v2');
        CROQUI_SELECTED.setAttribute('transform', 'translate(220, 130) rotate(180)');
        croqui_inserirSvg('2.3-abalroamento-transversal.svg');
        setTimeout(() => { if (CROQUI_SELECTED) CROQUI_SELECTED.setAttribute('transform', 'translate(130, 130)'); }, 200);
    }
    else if (tipo === 'longitudinal') {
        croqui_adicionarVia('reta');
        croqui_inserirIcone('v1');
        CROQUI_SELECTED.setAttribute('transform', 'translate(150, 175) rotate(0)');
        croqui_inserirIcone('v2');
        CROQUI_SELECTED.setAttribute('transform', 'translate(150, 195) rotate(0)');
        croqui_inserirSvg('2.1-abalroamento-longitudinal-mesmo-sentido.svg');
        setTimeout(() => { if (CROQUI_SELECTED) CROQUI_SELECTED.setAttribute('transform', 'translate(150, 185)'); }, 200);
    }
    else if (tipo === 'poste') {
        croqui_adicionarVia('reta');
        croqui_inserirIcone('poste');
        CROQUI_SELECTED.setAttribute('transform', 'translate(150, 140)');
        croqui_inserirIcone('v1');
        CROQUI_SELECTED.setAttribute('transform', 'translate(150, 160) rotate(-90)');
        croqui_inserirSvg('4.1-choque-poste.svg');
        setTimeout(() => { if (CROQUI_SELECTED) CROQUI_SELECTED.setAttribute('transform', 'translate(150, 150)'); }, 200);
    }
    else if (tipo === 'saida') {
        croqui_adicionarVia('curva');
        croqui_inserirIcone('v1');
        CROQUI_SELECTED.setAttribute('transform', 'translate(100, 100) rotate(45)');
        croqui_inserirSvg('5.3-saida-pista-capotamento.svg');
        setTimeout(() => { if (CROQUI_SELECTED) CROQUI_SELECTED.setAttribute('transform', 'translate(120, 120)'); }, 200);
    }

    croqui_fecharModal();
}

// Exposição Global
window.croqui_init = croqui_init;
window.croqui_adicionarVia = croqui_adicionarVia;
window.croqui_abrirModalIcones = croqui_abrirModalIcones;
window.croqui_fecharModal = croqui_fecharModal;
window.croqui_fecharModalOnBackdrop = croqui_fecharModalOnBackdrop;
window.croqui_filtrarIcones = croqui_filtrarIcones;
window.croqui_inserirIcone = croqui_inserirIcone;
window.croqui_inserirSvg = croqui_inserirSvg;
window.croqui_girar = croqui_girar;
window.croqui_escala = croqui_escala;
window.croqui_espelhar = croqui_espelhar;
window.croqui_camada = croqui_camada;
window.croqui_limpar = croqui_limpar;
window.croqui_exportar = croqui_exportar;
window.croqui_whatsapp = croqui_whatsapp;
window.croqui_aplicarModelo = croqui_aplicarModelo;

document.addEventListener('DOMContentLoaded', croqui_init);
