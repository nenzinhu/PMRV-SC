/**
 * Modulo: Tacografo e Jornada (Lei 13.103/15)
 * Facilita a analise de disco/fita de cronotacografo.
 */

const TAC_STATE = {
    descansoIrregular: false,
    conducaoIrregular: false
};

function tac_init() {
    console.log("Modulo de Tacografo inicializado.");
}

/**
 * Troca entre abas de calculadora e guia.
 */
function tac_switchTab(tab) {
    document.getElementById('tac-content-calc').classList.toggle('hidden', tab !== 'calc');
    document.getElementById('tac-content-guia').classList.toggle('hidden', tab !== 'guia');

    document.getElementById('tab-tac-calc').classList.toggle('btn-primary', tab === 'calc');
    document.getElementById('tab-tac-guia').classList.toggle('btn-primary', tab === 'guia');
}

/**
 * Calcula tempo de descanso.
 */
function tac_calcDescanso() {
    const ini = document.getElementById('tac_desc_ini').value;
    const fim = document.getElementById('tac_desc_fim').value;
    const res = document.getElementById('tac_desc_res');

    if (!ini || !fim) {
        TAC_STATE.descansoIrregular = false;
        tac_limparInfracao();
        return;
    }

    const diff = tac_getDiffMinutes(ini, fim);
    const horas = Math.floor(diff / 60);
    const mins = diff % 60;

    let msg = `Duracao: ${horas}h ${mins}min`;

    if (diff >= 660) {
        res.style.color = "#10b981";
        msg += " OK";
        TAC_STATE.descansoIrregular = false;
        tac_limparInfracao();
    } else {
        res.style.color = "#ef4444";
        msg += " INSUFICIENTE (Min. 11h)";
        TAC_STATE.descansoIrregular = true;

        let resumo = `*INFRACAO: DESCANSO INSUFICIENTE*\n`;
        resumo += `Enquadramento: Art. 230, XXIII do CTB\n`;
        resumo += `Codigo da Infracao: 670-00\n`;
        resumo += `Lei Federal 13.103/15 (Lei do Motorista)\n`;
        resumo += `----------------------------\n`;
        resumo += `Duracao apurada: ${horas}h ${mins}min\n`;
        resumo += `Minimo exigido: 11h 00min\n`;
        resumo += `Deficit: ${Math.floor((660 - diff) / 60)}h ${(660 - diff) % 60}min\n`;
        resumo += `----------------------------\n`;
        resumo += `Medida adm: retencao para cumprimento do descanso.`;

        tac_montarInfracao(resumo);
    }

    res.innerText = msg;
}

/**
 * Calcula tempo de conducao continua.
 */
function tac_calcConducao() {
    const ini = document.getElementById('tac_cond_ini').value;
    const fim = document.getElementById('tac_cond_fim').value;
    const res = document.getElementById('tac_cond_res');

    if (!ini || !fim) {
        TAC_STATE.conducaoIrregular = false;
        tac_limparInfracao();
        return;
    }

    const diff = tac_getDiffMinutes(ini, fim);
    const horas = Math.floor(diff / 60);
    const mins = diff % 60;

    let msg = `Duracao: ${horas}h ${mins}min`;

    if (diff <= 330) {
        res.style.color = "#10b981";
        msg += " DENTRO DO LIMITE";
        TAC_STATE.conducaoIrregular = false;
        tac_limparInfracao();
    } else {
        res.style.color = "#ef4444";
        msg += " EXCEDEU 5H30 (Art. 67-C)";
        TAC_STATE.conducaoIrregular = true;

        let resumo = `*INFRACAO: EXCESSO DE DIRECAO CONTINUA*\n`;
        resumo += `Enquadramento: Art. 230, XXIII do CTB\n`;
        resumo += `Codigo da Infracao: 670-00\n`;
        resumo += `Norma: Art. 67-C do CTB (Lei 13.103/15)\n`;
        resumo += `----------------------------\n`;
        resumo += `Tempo em direcao: ${horas}h ${mins}min\n`;
        resumo += `Limite continuo: 5h 30min\n`;
        resumo += `Excesso: ${Math.floor((diff - 330) / 60)}h ${(diff - 330) % 60}min\n`;
        resumo += `----------------------------\n`;
        resumo += `Medida adm: retencao para descanso obrigatorio de 30min.`;

        tac_montarInfracao(resumo);
    }

    res.innerText = msg;
}

/**
 * Exibicao de infracao.
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
    const box = document.getElementById('tac_infracao_box');

    if (!TAC_STATE.descansoIrregular && !TAC_STATE.conducaoIrregular && box) {
        box.classList.add('hidden');
        box.style.display = 'none';
    }
}

function tac_copiarInfracao() {
    const text = document.getElementById('tac_infracao_text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('[data-click="tac_copiarInfracao()"]');
        const original = btn.innerText;
        btn.innerText = "Copiado!";
        setTimeout(() => btn.innerText = original, 2000);
    });
}

/**
 * Converte UTC para horario de Brasilia (-3h).
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
 * Diferenca em minutos com suporte a virada de dia.
 */
function tac_getDiffMinutes(start, end) {
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);

    let total1 = h1 * 60 + m1;
    let total2 = h2 * 60 + m2;

    if (total2 < total1) {
        total2 += 1440;
    }

    return total2 - total1;
}

window.tac_init = tac_init;
window.tac_switchTab = tac_switchTab;
window.tac_calcDescanso = tac_calcDescanso;
window.tac_calcConducao = tac_calcConducao;
window.tac_convUTC = tac_convUTC;

document.addEventListener('DOMContentLoaded', () => {
    tac_init();
    tac_switchTab('calc');
});
