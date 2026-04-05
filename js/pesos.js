/**
 * Módulo: Pesos e Dimensões (PBT + Dimensoes)
 * Desenvolvido para cálculos técnicos conforme Resoluções CONTRAN.
 */

const PES_LIMITES_EIXOS = {
    "simples_2": { nome: "Eixo Simples (2 pneus)", limite: 6000 },
    "simples_4": { nome: "Eixo Simples (4 pneus)", limite: 10000 },
    "tandem_duplo": { nome: "Tandem Duplo (8 pneus)", limite: 17000 },
    "tandem_triplo": { nome: "Tandem Triplo (12 pneus)", limite: 25500 },
    "direcional_duplo": { nome: "Direcional Duplo (4 pneus)", limite: 12000 }
};

function pes_init() {
    console.log("Módulo de Pesos e Dimensões inicializado.");
}

/**
 * Troca entre abas de Peso e Dimensões
 */
function pes_switchTab(tab) {
    document.getElementById('pes-content-pbt').classList.toggle('hidden', tab !== 'pbt');
    document.getElementById('pes-content-dim').classList.toggle('hidden', tab !== 'dim');
    
    document.getElementById('tab-pes-pbt').classList.toggle('btn-primary', tab === 'pbt');
    document.getElementById('tab-pes-dim').classList.toggle('btn-primary', tab === 'dim');
    
    // Limpa infração ao trocar de contexto para evitar confusão
    document.getElementById('pes_infracao_box').classList.add('hidden');
}

/**
 * LÓGICA DE PESO (PBT)
 */
function pes_onMetodoChange() {
    const metodo = document.getElementById('pes_metodo').value;
    document.getElementById('pes_row_nf').classList.toggle('hidden', metodo !== 'nf');
    document.getElementById('pes_row_balanca').classList.toggle('hidden', metodo !== 'balanca');
    pes_calcular();
}

function pes_onConfigChange() {
    const select = document.getElementById('pes_config');
    const manualInput = document.getElementById('pes_limite_manual');
    if (select.value === 'MANUAL') {
        manualInput.classList.remove('hidden');
        manualInput.focus();
    } else {
        manualInput.classList.add('hidden');
    }
    pes_calcular();
}

/**
 * GESTÃO DINÂMICA DE EIXOS
 */
function pes_adicionarEixo() {
    const lista = document.getElementById('pes_eixos_lista');
    const id = "eixo_" + Date.now();
    
    let htmlOptions = "";
    for (const key in PES_LIMITES_EIXOS) {
        htmlOptions += `<option value="${key}">${PES_LIMITES_EIXOS[key].nome}</option>`;
    }

    const item = document.createElement('div');
    item.id = id;
    item.className = "sub-box";
    item.style.padding = "8px";
    item.innerHTML = `
        <div class="flex gap-8 align-center">
            <select class="pes-eixo-tipo" style="flex:1; font-size:12px;" onchange="pes_calcular()">
                ${htmlOptions}
            </select>
            <input type="number" class="pes-eixo-peso" placeholder="Peso KG" style="flex:0 0 100px;" oninput="pes_calcular()">
            <button type="button" class="btn btn-sm btn-danger" onclick="pes_removerEixo('${id}')">🗑</button>
        </div>
        <div class="pes-eixo-res mt-4" style="font-size:11px; font-weight:700;"></div>
    `;
    lista.appendChild(item);
    pes_calcular();
}

function pes_removerEixo(id) {
    document.getElementById(id)?.remove();
    pes_calcular();
}

/**
 * CÁLCULO DE MULTA (Art. 231, V)
 * Base: Multa Média (R$ 130,16) + Adicionais a cada 200kg
 */
function pes_getValorMulta(excessoKG) {
    if (excessoKG <= 0) return 0;
    
    const baseMulta = 130.16;
    const frações = Math.ceil(excessoKG / 200);
    let valorAdicional = 0;

    if (excessoKG <= 600) valorAdicional = frações * 5.32;
    else if (excessoKG <= 800) valorAdicional = frações * 10.64;
    else if (excessoKG <= 1000) valorAdicional = frações * 21.28;
    else if (excessoKG <= 3000) valorAdicional = frações * 31.92;
    else if (excessoKG <= 5000) valorAdicional = frações * 42.56;
    else valorAdicional = frações * 53.20;

    return baseMulta + valorAdicional;
}

function pes_calcular() {
    const metodo = document.getElementById('pes_metodo').value;
    const configSelect = document.getElementById('pes_config');
    const manualInput = document.getElementById('pes_limite_manual');
    
    let limiteLegalPBT = configSelect.value === 'MANUAL' ? 
                         parseFloat(manualInput.value || 0) : 
                         parseFloat(configSelect.value);

    let pbtApurado = 0;
    if (metodo === 'nf') {
        const tara = parseFloat(document.getElementById('pes_tara').value || 0);
        const cargaNF = parseFloat(document.getElementById('pes_carga').value || 0);
        pbtApurado = tara + cargaNF;
    } else {
        pbtApurado = parseFloat(document.getElementById('pes_medido').value || 0);
    }

    // Tolerância PBT: 5%
    const tolPBT = Math.floor(limiteLegalPBT * 0.05);
    const limiteMaxPBT = limiteLegalPBT + tolPBT;
    const excessoPBT = pbtApurado - limiteLegalPBT;

    document.getElementById('res_pbt_apurado').innerText = pbtApurado.toLocaleString('pt-BR') + " kg";
    document.getElementById('res_pbt_limite').innerText = limiteLegalPBT.toLocaleString('pt-BR') + " kg";
    document.getElementById('res_pbt_tolerancia').innerText = limiteMaxPBT.toLocaleString('pt-BR') + " kg";

    let eixosExcedentes = [];
    let maiorExcessoEixo = 0;

    // Cálculo de Eixos (apenas se houver eixos adicionados)
    if (metodo === 'balanca') {
        const eixosDOM = document.querySelectorAll('#pes_eixos_lista .sub-box');
        eixosDOM.forEach(el => {
            const tipoKey = el.querySelector('.pes-eixo-tipo').value;
            const pesoInp = parseFloat(el.querySelector('.pes-eixo-peso').value || 0);
            const resEl = el.querySelector('.pes-eixo-res');
            
            if (pesoInp > 0) {
                const limitLegalEixo = PES_LIMITES_EIXOS[tipoKey].limite;
                const tolEixo = Math.floor(limitLegalEixo * 0.125); // Tolerância 12,5%
                const maxEixo = limitLegalEixo + tolEixo;
                
                if (pesoInp > maxEixo) {
                    const excEixo = pesoInp - limitLegalEixo;
                    if (excEixo > maiorExcessoEixo) maiorExcessoEixo = excEixo;
                    resEl.innerHTML = `<span style="color:#D82A2E">⚠️ EXCESSO: ${excEixo.toLocaleString('pt-BR')}kg (Máx: ${maxEixo.toLocaleString('pt-BR')}kg)</span>`;
                    eixosExcedentes.push(`${PES_LIMITES_EIXOS[tipoKey].nome}: ${pesoInp}kg (Exc: ${excEixo}kg)`);
                } else {
                    resEl.innerHTML = `<span style="color:#10b981">✅ LEGAL (Máx c/ tol: ${maxEixo.toLocaleString('pt-BR')}kg)</span>`;
                }
            } else {
                resEl.innerText = "";
            }
        });
    }

    const alerta = document.getElementById('pes_alerta');
    if (pbtApurado <= 0 && eixosExcedentes.length === 0) { 
        alerta.classList.add('hidden'); 
        document.getElementById('pes_infracao_box').classList.add('hidden');
        return; 
    }
    
    alerta.classList.remove('hidden');

    const excessoPBTOcorre = pbtApurado > limiteMaxPBT;
    const excessoEixoOcorre = eixosExcedentes.length > 0;

    if (!excessoPBTOcorre && !excessoEixoOcorre) {
        pes_setAlerta(alerta, 'legal', "DENTRO DO LIMITE", "Pesagem em conformidade (considerando tolerâncias).");
        document.getElementById('pes_infracao_box').classList.add('hidden');
    } else {
        let tit = "EXCESSO DETECTADO!";
        let desc = "";
        let detalhesInfra = "";
        let transbordo = 0;
        let remanejamento = 0;

        // Cálculo da Multa: Baseia-se no maior excesso (PBT ou Eixo)
        const excessoParaMulta = Math.max(excessoPBT, maiorExcessoEixo);
        const valorMulta = pes_getValorMulta(excessoParaMulta);

        if (excessoPBTOcorre) {
            transbordo = pbtApurado - limiteLegalPBT;
            desc += `<strong>PBT:</strong> +${excessoPBT.toLocaleString('pt-BR')} kg (Acima da tolerância)<br>`;
            desc += `🚚 <strong>TRANSBORDO OBRIGATÓRIO:</strong> Retirar ${transbordo.toLocaleString('pt-BR')} kg<br>`;
            detalhesInfra += `EXCESSO PBT (Art. 231, V)\nLimite: ${limiteLegalPBT.toLocaleString('pt-BR')}kg | Apurado: ${pbtApurado.toLocaleString('pt-BR')}kg\nExcesso: ${excessoPBT.toLocaleString('pt-BR')}kg\nTransbordo: ${transbordo.toLocaleString('pt-BR')}kg\n`;
        }
        
        if (excessoEixoOcorre) {
            if (!excessoPBTOcorre) {
                remanejamento = eixosExcedentes.reduce((acc, curr) => {
                    const match = curr.match(/Exc: (\d+)kg/);
                    return acc + (match ? parseInt(match[1]) : 0);
                }, 0);
                desc += `<strong>EIXOS:</strong> ${eixosExcedentes.length} irregularidades<br>`;
                desc += `⚖️ <strong>REMANEJAMENTO:</strong> Mover ${remanejamento.toLocaleString('pt-BR')} kg entre eixos<br>`;
            } else {
                desc += `<strong>EIXOS:</strong> Verifique também a distribuição após transbordo.<br>`;
            }
            detalhesInfra += `\nEXCESSO NOS EIXOS (Art. 231, V):\n${eixosExcedentes.join('\n')}`;
        }

        desc += `<br>💰 <strong>MULTA ESTIMADA: R$ ${valorMulta.toFixed(2).replace('.', ',')}</strong>`;

        pes_setAlerta(alerta, 'excesso', tit, desc);
        const metodoTxt = metodo === 'balanca' ? 'BALANÇA' : 'NOTA FISCAL';
        pes_montarInfracao('PESO', `Método: ${metodoTxt}\nCódigo: 682-31\n${detalhesInfra}\nValor Est.: R$ ${valorMulta.toFixed(2).replace('.', ',')}`);
    }
}

/**
 * LÓGICA DE DIMENSÕES
 */
function pes_calcDimensoes() {
    const tipo = document.getElementById('dim_tipo');
    const larg = parseFloat(document.getElementById('dim_largura').value || 0);
    const alt = parseFloat(document.getElementById('dim_altura').value || 0);
    const comp = parseFloat(document.getElementById('dim_comprimento').value || 0);
    const eixos = parseFloat(document.getElementById('dim_entre_eixos').value || 0);
    const balMed = parseFloat(document.getElementById('dim_balanco_medido').value || 0);

    const limComp = parseFloat(tipo.value);
    const limLarg = 2.60;
    const limAlt = 4.40;
    
    // Balanço: 60% do entre-eixos, máximo 3.50m
    const limBal = Math.min(eixos * 0.6, 3.50);
    if (eixos > 0) {
        document.getElementById('dim_balanco_res').innerHTML = `Limite Balanço: <strong>${limBal.toFixed(2)}m</strong> (60% de ${eixos}m)`;
    }

    const alerta = document.getElementById('dim_alerta');
    if (larg === 0 && alt === 0 && comp === 0) { alerta.classList.add('hidden'); return; }
    alerta.classList.remove('hidden');

    let erros = [];
    if (larg > limLarg) erros.push(`Largura excedente (${larg}m > ${limLarg}m)`);
    if (alt > limAlt) erros.push(`Altura excedente (${alt}m > ${limAlt}m)`);
    if (comp > limComp) erros.push(`Comprimento excedente (${comp}m > ${limComp}m)`);
    if (balMed > limBal && eixos > 0) erros.push(`Balanço excedente (${balMed}m > ${limBal.toFixed(2)}m)`);

    if (erros.length === 0) {
        pes_setAlerta(alerta, 'legal', "DIMENSÕES LEGAIS", "Veículo dentro dos limites da Res. 210/06.");
        document.getElementById('pes_infracao_box').classList.add('hidden');
    } else {
        pes_setAlerta(alerta, 'excesso', "DIMENSÃO EXCEDENTE!", erros.join('<br>'));
        pes_montarInfracao('DIMENSÕES', `Código: 682-32 | Art. 231, IV\nMotivo: ${erros.join(', ')}\nMedida: Retenção para regularização.`);
    }
}

/**
 * Auxiliares de UI
 */
function pes_setAlerta(el, status, titulo, desc) {
    el.style.background = status === 'legal' ? "rgba(16, 185, 129, 0.15)" : "rgba(216, 42, 46, 0.15)";
    el.style.border = status === 'legal' ? "1px solid #10b981" : "1px solid #D82A2E";
    el.style.color = status === 'legal' ? "#10b981" : "#D82A2E";
    el.querySelector('[id$="_alerta_icon"]').innerText = status === 'legal' ? "✅" : "⚠️";
    el.querySelector('[id$="_alerta_titulo"]').innerText = titulo;
    el.querySelector('[id$="_alerta_desc"]').innerHTML = desc;
}

function pes_montarInfracao(tipo, detalhes) {
    const box = document.getElementById('pes_infracao_box');
    const text = document.getElementById('pes_infracao_text');
    text.innerText = `*INFRAÇÃO DETECTADA: ${tipo}*\n${detalhes}`;
    box.classList.remove('hidden');
}

function pes_copiarInfracao() {
    const text = document.getElementById('pes_infracao_text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('[data-click="pes_copiarInfracao()"]');
        const original = btn.innerText;
        btn.innerText = "✅ Copiado!";
        setTimeout(() => btn.innerText = original, 2000);
    });
}

// Global
window.pes_switchTab = pes_switchTab;
window.pes_onMetodoChange = pes_onMetodoChange;
window.pes_onConfigChange = pes_onConfigChange;
window.pes_adicionarEixo = pes_adicionarEixo;
window.pes_removerEixo = pes_removerEixo;
window.pes_calcular = pes_calcular;
window.pes_calcDimensoes = pes_calcDimensoes;
window.pes_copiarInfracao = pes_copiarInfracao;

document.addEventListener('DOMContentLoaded', () => { pes_init(); pes_switchTab('pbt'); });
