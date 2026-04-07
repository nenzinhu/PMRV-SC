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
        tac_limparInfracao();
    } else {
        res.style.color = "#ef4444";
        msg += " ⚠️ INSUFICIENTE (Mín. 11h)";
        
        let resumo = `*INFRAÇÃO: DESCANSO INSUFICIENTE*\n`;
        resumo += `Enquadramento: Art. 230, XXIII do CTB\n`;
        resumo += `Código da Infração: 670-00\n`;
        resumo += `Lei Federal nº 13.103/15 (Lei do Motorista)\n`;
        resumo += `----------------------------\n`;
        resumo += `Duração Apurada: ${horas}h ${mins}min\n`;
        resumo += `Mínimo Exigido: 11h 00min\n`;
        resumo += `Déficit: ${Math.floor((660 - diff) / 60)}h ${(660 - diff) % 60}min\n`;
        resumo += `----------------------------\n`;
        resumo += `Medida Adm: Retenção para cumprimento do descanso.`;
        
        tac_montarInfracao(resumo);
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
        tac_limparInfracao();
    } else {
        res.style.color = "#ef4444";
        msg += " ⚠️ EXCEDEU 5H30 (Art. 67-C)";
        
        let resumo = `*INFRAÇÃO: EXCESSO DE DIREÇÃO CONTÍNUA*\n`;
        resumo += `Enquadramento: Art. 230, XXIII do CTB\n`;
        resumo += `Código da Infração: 670-00\n`;
        resumo += `Norma: Art. 67-C do CTB (Lei 13.103/15)\n`;
        resumo += `----------------------------\n`;
        resumo += `Tempo em Direção: ${horas}h ${mins}min\n`;
        resumo += `Limite Contínuo: 5h 30min\n`;
        resumo += `Excesso: ${Math.floor((diff - 330) / 60)}h ${(diff - 330) % 60}min\n`;
        resumo += `----------------------------\n`;
        resumo += `Medida Adm: Retenção para descanso de 30min obrigatório.`;
        
        tac_montarInfracao(resumo);
    }
    
    res.innerText = msg;
}

/**
 * Funções de exibição de infração (Padronizadas)
 */
function tac_montarInfracao(detalhes) {
    const box = document.getElementById('tac_infracao_box');
    const text = document.getElementById('tac_infracao_text');
    if (box && text) {
        text.innerText = detalhes;
        box.classList.remove('hidden');
        box.style.display = 'block';
    }
}

function tac_limparInfracao() {
    // Só limpa se ambas as calculadoras estiverem regulares
    const descRes = document.getElementById('tac_desc_res');
    const condRes = document.getElementById('tac_cond_res');
    const box = document.getElementById('tac_infracao_box');
    
    const descIrregular = descRes && descRes.style.color === 'rgb(239, 68, 68)';
    const condIrregular = condRes && condRes.style.color === 'rgb(239, 68, 68)';
    
    if (!descIrregular && !condIrregular && box) {
        box.classList.add('hidden');
        box.style.display = 'none';
    }
}

function tac_copiarInfracao() {
    const text = document.getElementById('tac_infracao_text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('[data-click="tac_copiarInfracao()"]');
        const original = btn.innerText;
        btn.innerText = "✅ Copiado!";
        setTimeout(() => btn.innerText = original, 2000);
    });
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
