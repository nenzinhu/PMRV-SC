/**
 * Modulo: Patrulhamento de Transito SC
 * Registro rapido de infracoes em lote com persistencia local.
 */

let PAT_VEICULOS = [];
let patRelogioHandle = null;

const PAT_QUICK_INFRACOES = {
  '518-51': { nome: 'Cinto - Condutor sem cinto', codigo: '518-51', gravidade: 'Grave', artigo: 'Art. 167' },
  '518-52': { nome: 'Cinto - Passageiro sem cinto', codigo: '518-52', gravidade: 'Grave', artigo: 'Art. 167' },
  '663-71': { nome: 'Equipam. em Desacordo', codigo: '663-71', gravidade: 'Grave', artigo: 'Art. 230, X' },
  '581-96': { nome: 'Desobedecer Agente', codigo: '581-96', gravidade: 'Grave', artigo: 'Art. 195' },
  '659-92': { nome: 'Nao Licenciado/Registrado', codigo: '659-92', gravidade: 'Gravissima', artigo: 'Art. 230, V' },
  '736-62': { nome: 'Celular - Utilizando telefone celular', codigo: '736-62', gravidade: 'Media', artigo: 'Art. 252, VI' },
  '763-31': { nome: 'Celular - Segurando aparelho', codigo: '763-31', gravidade: 'Gravissima', artigo: 'Art. 252, P.U.' },
  '763-32': { nome: 'Celular - Manuseando/teclando', codigo: '763-32', gravidade: 'Gravissima', artigo: 'Art. 252, P.U.' },
  '596-70': { nome: 'Ultrapassar Linha Continua', codigo: '596-70', gravidade: 'Gravissima (5x)', artigo: 'Art. 203, V' },
  '544-40': { nome: 'Estacionar no acostamento', codigo: '544-40', gravidade: 'Leve', artigo: 'Art. 181, VII' },
  '545-27': { nome: 'Estacionar em gramado/jardim publico', codigo: '545-27', gravidade: 'Grave', artigo: 'Art. 181, VIII' },
  '734-01': { nome: 'Calcado que nao se firme nos pes', codigo: '734-01', gravidade: 'Media', artigo: 'Art. 252, IV' },
  '577-01': { nome: 'Nao dar preferencia a viatura', codigo: '577-01', gravidade: 'Grave', artigo: 'Art. 189' },
  '605-01': { nome: 'Avancar sinal vermelho', codigo: '605-01', gravidade: 'Gravissima', artigo: 'Art. 208' },
  '682-32': { nome: 'Restricao Peso/Dimensao', codigo: '682-32', gravidade: 'Grave', artigo: 'Art. 231, IV' },
  '667-00': { nome: 'Lanterna/Luz Placa Queimada', codigo: '667-00', gravidade: 'Media', artigo: 'Art. 230, XXII' },
  '658-00': { nome: 'Placa Ilegivel/Sem Visib.', codigo: '658-00', gravidade: 'Gravissima', artigo: 'Art. 230, VI' }
};

function pat_escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function pat_init() {
  pat_carregarCache();
  pat_atualizarDataHora();
  if (!patRelogioHandle) {
    patRelogioHandle = setInterval(pat_atualizarDataHora, 30000);
  }
}

function pat_carregarCache() {
  const salvo = localStorage.getItem('pmrv_pat_lote');
  if (!salvo) return;

  try {
    PAT_VEICULOS = JSON.parse(salvo);
    pat_renderizarLista();
    if (PAT_VEICULOS.length > 0) {
      document.getElementById('pat_lista_card')?.classList.remove('hidden');
    }
  } catch (e) {
    console.error('Erro ao carregar cache de patrulhamento', e);
  }
}

function pat_salvarCache() {
  localStorage.setItem('pmrv_pat_lote', JSON.stringify(PAT_VEICULOS));
}

async function pat_simularOCR(input) {
  if (!input?.files || !input.files[0]) return;

  const label = input.closest('label');
  const originalText = label?.innerHTML;
  if (label) {
    label.innerHTML = 'Processando placa...';
    label.classList.add('loading');
  }

  try {
    const result = await Tesseract.recognize(input.files[0], 'eng', {
      logger: m => console.log(m)
    });

    const plate = result.data.text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const match = plate.match(/[A-Z]{3}[0-9][A-Z0-9][0-9]{2}/);
    if (match) {
      const placaEl = document.getElementById('pat_placa');
      if (placaEl) {
        placaEl.value = match[0];
        pat_formatarPlaca(placaEl);
      }
      pat_setModoPlaca('manual');
      if (navigator.vibrate) navigator.vibrate(100);
    } else {
      alert('Nao foi possivel identificar a placa com clareza.');
    }
  } catch (err) {
    alert('Erro no OCR: ' + err.message);
  } finally {
    if (label && typeof originalText === 'string') {
      label.innerHTML = originalText;
      label.classList.remove('loading');
    }
  }
}

function pat_atualizarDataHora() {
  const dataInput = document.getElementById('pat_data');
  const horaInput = document.getElementById('pat_hora');
  if (!dataInput || !horaInput) return;

  const agora = new Date();
  dataInput.value = agora.toLocaleDateString('pt-BR');
  horaInput.value = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function pat_formatarPlaca(el) {
  if (!el) return;
  let val = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (val.length > 7) val = val.substring(0, 7);
  el.value = val;

  const badge = document.getElementById('pat_placa_tipo');
  if (!badge) return;

  if (val.length === 7) {
    const isMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(val);
    badge.innerText = isMercosul ? 'MERCOSUL' : 'BRASIL (ANTIGA)';
    badge.style.background = isMercosul ? '#003399' : '#555';
  } else {
    badge.innerText = 'DIGITANDO...';
    badge.style.background = '#999';
  }
}

function pat_selectQuick(codigo) {
  const display = document.getElementById('pat_infracao_display');
  const dataInput = document.getElementById('pat_infracao_data');
  const manualBox = document.getElementById('pat_infra_manual_box');
  const cintoBox = document.getElementById('pat_quick_cinto_box');
  const celularBox = document.getElementById('pat_quick_celular_box');
  if (!display || !dataInput) return;

  document.querySelectorAll('.infra-quick-card').forEach(c => c.classList.remove('active'));
  cintoBox?.classList.add('hidden');
  celularBox?.classList.add('hidden');

  if (codigo === 'MANUAL') {
    manualBox?.classList.remove('hidden');
    display.value = 'Infracao Manual';
    dataInput.value = '';
    document.getElementById('pat_manual_infra_nome')?.focus();
    return;
  }

  if (codigo === 'CINTO') {
    manualBox?.classList.add('hidden');
    display.value = 'Selecione: Cinto - condutor ou passageiro';
    dataInput.value = '';
    cintoBox?.classList.remove('hidden');
    const btn = document.querySelector(`[data-click="pat_selectQuick('CINTO')"]`);
    if (btn) btn.classList.add('active');
    return;
  }

  if (codigo === 'CELULAR') {
    manualBox?.classList.add('hidden');
    display.value = 'Selecione o tipo de uso de celular';
    dataInput.value = '';
    celularBox?.classList.remove('hidden');
    const btn = document.querySelector(`[data-click="pat_selectQuick('CELULAR')"]`);
    if (btn) btn.classList.add('active');
    return;
  }

  manualBox?.classList.add('hidden');
  const infra = PAT_QUICK_INFRACOES[codigo];
  if (!infra) return;

  display.value = `${infra.nome} (${infra.codigo})`;
  dataInput.value = JSON.stringify(infra);
  const btn = document.querySelector(`[data-click="pat_selectQuick('${codigo}')"]`);
  if (btn) btn.classList.add('active');
}

function pat_salvarVeiculo() {
  const placaInput = document.getElementById('pat_placa');
  const infracaoDataInput = document.getElementById('pat_infracao_data');
  if (!placaInput || !infracaoDataInput) return;

  const agora = new Date();
  const placa = placaInput.value.trim();
  const data = document.getElementById('pat_data')?.value || agora.toLocaleDateString('pt-BR');
  const hora = document.getElementById('pat_hora')?.value || agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const obs = document.getElementById('pat_obs')?.value.trim() || '';

  let local = '';
  const gpsBox = document.getElementById('pat_local_gps_box');
  if (gpsBox && !gpsBox.classList.contains('hidden')) {
    local = document.getElementById('pat_local')?.value || 'GPS nao obtido';
  } else {
    const rod = document.getElementById('pat_manual_rodovia')?.value;
    const km = document.getElementById('pat_manual_km')?.value;
    local = rod || km ? `${rod || 'Rodovia nao informada'}, KM ${km || 's/n'}` : 'Local nao informado';
  }

  if (!placa || placa.length < 7) {
    alert('Placa invalida.');
    return;
  }

  let infracaoObj = null;
  if (infracaoDataInput.value) {
    try {
      infracaoObj = JSON.parse(infracaoDataInput.value);
    } catch (err) {
      alert('Dados da infracao invalidos. Selecione novamente.');
      return;
    }
  } else {
    const mNome = document.getElementById('pat_manual_infra_nome')?.value.trim();
    const mCod = document.getElementById('pat_manual_infra_codigo')?.value.trim();
    if (mNome && mCod) {
      infracaoObj = { nome: mNome, codigo: mCod, artigo: '' };
    }
  }

  if (!infracaoObj) {
    alert('Selecione a infracao.');
    return;
  }

  PAT_VEICULOS.unshift({ id: Date.now(), placa, data, hora, local, obs, infracao: infracaoObj });
  pat_salvarCache();
  pat_renderizarLista();
  document.getElementById('pat_lista_card')?.classList.remove('hidden');
  placaInput.value = '';

  const obsInput = document.getElementById('pat_obs');
  if (obsInput) obsInput.value = '';
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
}

function pat_renderizarLista() {
  const container = document.getElementById('pat_lista_container');
  if (!container) return;
  container.innerHTML = '';

  PAT_VEICULOS.forEach((v, index) => {
    const item = document.createElement('div');
    item.className = 'lote-item card-inner';
    item.style.marginBottom = '10px';
    item.style.padding = '12px';
    item.style.borderLeft = '5px solid var(--primary)';
    item.style.background = 'rgba(255,255,255,0.05)';
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:start;">
        <div style="flex:1">
          <strong style="font-size:18px; color:var(--primary); font-family:monospace;">${pat_escapeHtml(v.placa)}</strong>
          <div style="font-size:12px; color:var(--muted); font-weight:bold;">${pat_escapeHtml(v.local)}</div>
          <div style="margin-top:6px; font-size:13px; color:#fff;">${pat_escapeHtml(v.infracao.nome)}</div>
        </div>
        <button class="btn btn-sm btn-danger" onclick="pat_removerVeiculo(${index})">x</button>
      </div>
    `;
    container.appendChild(item);
  });
}

function pat_removerVeiculo(index) {
  if (!confirm('Remover este registro?')) return;
  PAT_VEICULOS.splice(index, 1);
  pat_salvarCache();
  pat_renderizarLista();
  if (PAT_VEICULOS.length === 0) {
    document.getElementById('pat_lista_card')?.classList.add('hidden');
  }
}

function pat_limparTudo() {
  if (!confirm('Apagar todo o lote?')) return;
  PAT_VEICULOS = [];
  pat_salvarCache();
  pat_renderizarLista();
  document.getElementById('pat_lista_card')?.classList.add('hidden');
}

function pat_gerarRelatorio() {
  if (PAT_VEICULOS.length === 0) return;
  let txt = `PATRULHAMENTO RODOVIARIO - PMRv SC\nData: ${PAT_VEICULOS[0].data}\n--------------------------\n\n`;
  PAT_VEICULOS.forEach((v, i) => {
    txt += `${i + 1}. [${v.placa}] as ${v.hora}\n${v.infracao.nome} (${v.infracao.codigo})\n${v.local}\n`;
    if (v.obs) txt += `Obs: ${v.obs}\n`;
    txt += '--------------------------\n\n';
  });
  txt += 'Gerado via PMRv Operacional';

  const resultText = document.getElementById('pat_result_text');
  const resultArea = document.getElementById('pat_result_area');
  if (resultText) resultText.innerText = txt;
  resultArea?.classList.remove('hidden');
}

function pat_setModoPlaca(modo) {
  document.getElementById('pat_placa_manual_wrap')?.classList.toggle('hidden', modo !== 'manual');
  document.getElementById('pat_placa_ocr_wrap')?.classList.toggle('hidden', modo !== 'ocr');
  document.getElementById('btn-pat-placa-manual')?.classList.toggle('btn-primary', modo === 'manual');
  document.getElementById('btn-pat-placa-ocr')?.classList.toggle('btn-primary', modo === 'ocr');
}

function pat_setModoLocal(modo) {
  document.getElementById('pat_local_gps_box')?.classList.toggle('hidden', modo !== 'gps');
  document.getElementById('pat_local_manual_box')?.classList.toggle('hidden', modo !== 'manual');
  document.getElementById('btn-pat-local-gps')?.classList.toggle('btn-primary', modo === 'gps');
  document.getElementById('btn-pat-local-manual')?.classList.toggle('btn-primary', modo === 'manual');
}

function pat_obterGPS() {
  const localInput = document.getElementById('pat_local');
  if (!localInput) return;
  localInput.value = 'Sintonizando...';

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      localInput.value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    },
    err => {
      alert('Erro GPS: ' + err.message);
    },
    { enableHighAccuracy: true, timeout: 5000 }
  );
}

window.pat_init = pat_init;
window.pat_formatarPlaca = pat_formatarPlaca;
window.pat_selectQuick = pat_selectQuick;
window.pat_salvarVeiculo = pat_salvarVeiculo;
window.pat_removerVeiculo = pat_removerVeiculo;
window.pat_limparTudo = pat_limparTudo;
window.pat_gerarRelatorio = pat_gerarRelatorio;
window.pat_setModoPlaca = pat_setModoPlaca;
window.pat_setModoLocal = pat_setModoLocal;
window.pat_obterGPS = pat_obterGPS;
window.pat_simularOCR = pat_simularOCR;

document.addEventListener('DOMContentLoaded', pat_init);
