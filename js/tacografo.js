/**
 * Módulo: Tacógrafo & Jornada (Lei 13.103/15)
 * Desenvolvido para facilitar a análise de discos e fitas de cronotacógrafo.
 */

function tac_init() {
    console.log("Módulo de Tacógrafo inicializado.");
}

/**
 * Troca entre abas de Calculadora e Guia
 */
function tac_switchTab(tab) {
    document.getElementById('tac-content-calc').classList.toggle('hidden', tab !== 'calc');
    document.getElementById('tac-content-guia').classList.toggle('hidden', tab !== 'guia');
    
    document.getElementById('tab-tac-calc').classList.toggle('btn-primary', tab === 'calc');
    document.getElementById('tab-tac-guia').classList.toggle('btn-primary', tab === 'guia');
}

/**
 * Calcula o tempo de descanso
 */
function tac_calcDescanso() {
    const ini = document.getElementById('tac_desc_ini').value;
    const fim = document.getElementById('tac_desc_fim').value;
    const res = document.getElementById('tac_desc_res');

    if (!ini || !fim) return;

    const diff = tac_getDiffMinutes(ini, fim);
    const horas = Math.floor(diff / 60);
    const mins = diff % 60;

    let msg = `Duração: ${horas}h ${mins}min`;
    
    if (diff >= 660) { // 11 horas = 660 min
        res.style.color = "#10b981";
        msg += " ✅ DESCANSO OK";
    } else {
        res.style.color = "#ef4444";
        msg += " ⚠️ INSUFICIENTE (Mín. 11h)";
    }
    
    res.innerText = msg;
}

/**
 * Calcula o tempo de condução contínua
 */
function tac_calcConducao() {
    const ini = document.getElementById('tac_cond_ini').value;
    const fim = document.getElementById('tac_cond_fim').value;
    const res = document.getElementById('tac_cond_res');

    if (!ini || !fim) return;

    const diff = tac_getDiffMinutes(ini, fim);
    const horas = Math.floor(diff / 60);
    const mins = diff % 60;

    let msg = `Duração: ${horas}h ${mins}min`;
    
    if (diff <= 330) { // 5h30min = 330 min
        res.style.color = "#10b981";
        msg += " ✅ DENTRO DO LIMITE";
    } else {
        res.style.color = "#ef4444";
        msg += " ⚠️ EXCEDEU 5H30 (Art. 67-C)";
    }
    
    res.innerText = msg;
}

/**
 * Converte UTC para Horário de Brasília (-3h)
 */
function tac_convUTC() {
    const val = document.getElementById('tac_utc_inp').value;
    const res = document.getElementById('tac_utc_res');

    if (!val) return;

    const [h, m] = val.split(':').map(Number);
    let nh = h - 3;
    if (nh < 0) nh += 24;

    const hStr = String(nh).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');

    res.value = `${hStr}:${mStr} BRT`;
}

/**
 * Auxiliar: Calcula diferença em minutos suportando virada de dia
 */
function tac_getDiffMinutes(start, end) {
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);

    let total1 = h1 * 60 + m1;
    let total2 = h2 * 60 + m2;

    if (total2 < total1) {
        total2 += 1440; // Adiciona 24h
    }

    return total2 - total1;
}

// Global
window.tac_init = tac_init;
window.tac_switchTab = tac_switchTab;
window.tac_calcDescanso = tac_calcDescanso;
window.tac_calcConducao = tac_calcConducao;
window.tac_convUTC = tac_convUTC;

document.addEventListener('DOMContentLoaded', () => { tac_init(); tac_switchTab('calc'); });
