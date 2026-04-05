/**
 * Módulo: Relatório Completo (Consolidação de Todos os Módulos)
 */

function relFull_gerarTexto() {
  const data = new Date().toLocaleDateString('pt-BR');
  let txt = '📋 *RELATÓRIO OPERACIONAL CONSOLIDADO — PMRv SC*\n';
  txt += 'Data: ' + data + '\n';
  txt += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

  // ── 🚔 PATRULHAMENTO (Lote de Infrações) ───────────────────
  if (typeof PAT_VEICULOS !== 'undefined' && PAT_VEICULOS.length > 0) {
    txt += '\n🚔 *INFRAÇÕES EM LOTE (PATRULHAMENTO)*\n';
    PAT_VEICULOS.forEach((v, i) => {
      txt += `${i+1}. [${v.placa}] - ${v.infracao.nome} (${v.hora})\n`;
    });
    txt += '──────────────────────────\n';
  }

  // ── 👥 ENVOLVIDOS (Sinistro) ────────────────────────────────
  txt += '\n👥 *ENVOLVIDOS NO SINISTRO*\n';
  const cards = document.querySelectorAll('#env_lista .person-card');
  if (!cards.length) {
    txt += '(nenhum envolvido registrado)\n';
  } else {
    cards.forEach(function(c, i) {
      const nome     = (c.querySelector('.nome')?.value     || '').trim().toUpperCase();
      const marca    = (c.querySelector('.marca')?.value    || '').trim().toUpperCase();
      const relato   = (c.querySelector('.relato')?.value   || '').trim();
      const tipo     = (c.querySelector('.tipo')?.value     || 'ENVOLVIDO').toUpperCase();
      txt += `\n*${tipo} ${i+1}:* ${nome || 'N/I'}\n`;
      if (marca)  txt += `- Veículo: ${marca}\n`;
      if (relato) txt += `- Relato: ${relato}\n`;
    });
  }

  // ── 🚗 DANOS APARENTES ──────────────────────────────────────
  if (typeof danVeiculosSalvos !== 'undefined' && danVeiculosSalvos.length > 0) {
    txt += '\n🚗 *DANOS APARENTES*\n';
    danVeiculosSalvos.forEach(function(v, idx) {
      txt += `\n*V${idx+1} (${v.tipo.toUpperCase()}):* `;
      let danosArr = [];
      if (v.tipo === 'moto' && v.v360db) {
        ['frente', 'tras', 'direita', 'esquerda'].forEach(tab => {
          (v.v360db[tab] || []).forEach(item => {
            if (item.dano !== null) danosArr.push(`${item.nome}:${item.dano}`);
          });
        });
      } else {
        danosArr = Object.entries(v.danos || {}).map(([id, tipo]) => `${id}:${tipo}`);
      }
      txt += danosArr.length ? danosArr.join(', ') : 'Sem avarias registradas.';
      txt += '\n';
    });
  }

  // ── ⚖️ PESOS E DIMENSÕES ────────────────────────────────────
  const pbtVal = document.getElementById('res_pbt_apurado')?.innerText;
  if (pbtVal && pbtVal !== '0 kg') {
    txt += '\n⚖️ *PESOS E DIMENSÕES*\n';
    txt += `- PBT Apurado: ${pbtVal}\n`;
    const alertaDesc = document.getElementById('pes_alerta_desc')?.innerText;
    if (alertaDesc) txt += `- Status: ${alertaDesc.split('\n')[0]}\n`;
  }

  // ── ⏱️ TACÓGRAFO E JORNADA ──────────────────────────────────
  const tacDesc = document.getElementById('tac_desc_res')?.innerText;
  const tacCond = document.getElementById('tac_cond_res')?.innerText;
  if (tacDesc || tacCond) {
    txt += '\n⏱️ *ANÁLISE DE TACÓGRAFO*\n';
    if (tacDesc) txt += `- Descanso: ${tacDesc}\n`;
    if (tacCond) txt += `- Condução: ${tacCond}\n`;
  }

  txt += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  txt += '_Gerado via App PMRv Operacional_';
  return txt;
}

function relFull_gerar() {
  const texto = relFull_gerarTexto();
  const resText = document.getElementById('rel-result-text');
  const resArea = document.getElementById('rel-result-area');
  
  if (resText) resText.textContent = texto;
  if (resArea) {
    resArea.style.display = 'block';
    resArea.scrollIntoView({ behavior: 'smooth' });
  }
}

function relFull_copiar(btn) {
  const text = document.getElementById('rel-result-text').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const old = btn.innerHTML;
    btn.innerHTML = '✅ Copiado!';
    setTimeout(() => btn.innerHTML = old, 2000);
  });
}

function relFull_whatsapp() {
  const texto = document.getElementById('rel-result-text').textContent || relFull_gerarTexto();
  window.open('https://wa.me/?text=' + encodeURIComponent(texto), '_blank');
}

// Funções de fotos mantidas conforme original para compatibilidade
window.relFull_gerar = relFull_gerar;
window.relFull_copiar = relFull_copiar;
window.relFull_whatsapp = relFull_whatsapp;
window.relFull_gerarTexto = relFull_gerarTexto;
