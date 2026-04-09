/**
 * Modulo: Patrulhamento de Transito SC
 * Registro rapido de infracoes em lote com persistencia local.
 */

let patRelogioHandle = null;
let PAT_SPEECH_RECOGNITION = null;
const PAT_GPS_STATUS_LABEL = 'Sintonizando...';

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

const PAT_VOICE_TOKEN_MAP = {
  a: 'A', ah: 'A',
  be: 'B', b: 'B',
  ce: 'C', c: 'C',
  de: 'D', d: 'D',
  e: 'E',
  efe: 'F', f: 'F',
  ge: 'G', g: 'G',
  aga: 'H', ha: 'H', h: 'H',
  i: 'I',
  jota: 'J', j: 'J',
  ka: 'K', ca: 'K', k: 'K',
  ele: 'L', l: 'L',
  eme: 'M', m: 'M',
  ene: 'N', n: 'N',
  o: 'O',
  pe: 'P', p: 'P',
  que: 'Q', q: 'Q',
  erre: 'R', r: 'R',
  esse: 'S', s: 'S',
  te: 'T', t: 'T',
  u: 'U',
  ve: 'V', v: 'V',
  dobleve: 'W', dabliu: 'W', w: 'W',
  xis: 'X', x: 'X',
  ipsilon: 'Y', ypsilon: 'Y', y: 'Y',
  ze: 'Z', z: 'Z',
  zero: '0',
  um: '1', uma: '1',
  dois: '2',
  tres: '3',
  quatro: '4',
  cinco: '5',
  seis: '6', meia: '6',
  sete: '7',
  oito: '8',
  nove: '9'
};

function pat_escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function pat_getStore() {
  return PMRV.patrulhamentoStore;
}

function pat_getReport() {
  return PMRV.patrulhamentoReport;
}

function pat_getRender() {
  return PMRV.patrulhamentoRender;
}

function pat_getVeiculos() {
  return pat_getStore()?.getAll?.() || [];
}

function pat_init() {
  pat_carregarCache();
  pat_atualizarDataHora();
  if (!patRelogioHandle) {
    patRelogioHandle = setInterval(pat_atualizarDataHora, 30000);
  }
}

function pat_carregarCache() {
  const veiculos = pat_getStore()?.load?.() || [];
  pat_renderizarLista();
  if (veiculos.length > 0) {
    pat_setBoxVisible('pat_lista_card', true);
  }
}

function pat_setBoxVisible(id, visible) {
  const element = document.getElementById(id);
  if (!element) return;
  element.classList.toggle('hidden', !visible);
  element.classList.toggle('visible', visible);
}

function pat_resetFormulario() {
  const placaInput = document.getElementById('pat_placa');
  const obsInput = document.getElementById('pat_obs');
  const localInput = document.getElementById('pat_local');
  const infraDisplay = document.getElementById('pat_infracao_display');
  const infraData = document.getElementById('pat_infracao_data');
  const manualNome = document.getElementById('pat_manual_infra_nome');
  const manualCodigo = document.getElementById('pat_manual_infra_codigo');

  if (placaInput) {
    placaInput.value = '';
    pat_formatarPlaca(placaInput);
    placaInput.focus();
  }
  if (obsInput) obsInput.value = '';
  if (localInput) localInput.value = '';
  if (infraDisplay) infraDisplay.value = '';
  if (infraData) infraData.value = '';
  if (manualNome) manualNome.value = '';
  if (manualCodigo) manualCodigo.value = '';

  document.getElementById('pat_infra_manual_box')?.classList.add('hidden');
  document.getElementById('pat_quick_cinto_box')?.classList.add('hidden');
  document.getElementById('pat_quick_celular_box')?.classList.add('hidden');
  document.querySelectorAll('.infra-quick-card').forEach(c => c.classList.remove('active'));
  pat_atualizarDataHora();
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

function pat_setBotaoVoz(state, text) {
  const btn = document.getElementById('btn-pat-placa-voz');
  if (!btn) return;

  btn.disabled = state === 'loading';
  btn.textContent = text;
}

function pat_normalizarTextoVoz(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pat_converterFalaEmPlaca(texto) {
  const normalizado = pat_normalizarTextoVoz(texto);
  if (!normalizado) return '';

  const tokens = normalizado
    .split(' ')
    .filter(token => token && !['placa', 'mercosul', 'brasil', 'antiga', 'modelo', 'letra', 'numero', 'número'].includes(token));

  let convertido = '';

  tokens.forEach(token => {
    if (PAT_VOICE_TOKEN_MAP[token]) {
      convertido += PAT_VOICE_TOKEN_MAP[token];
      return;
    }

    if (/^[a-z]$/.test(token)) {
      convertido += token.toUpperCase();
      return;
    }

    if (/^\d$/.test(token)) {
      convertido += token;
      return;
    }

    convertido += token.toUpperCase().replace(/[^A-Z0-9]/g, '');
  });

  const match = convertido.match(/[A-Z]{3}[0-9][A-Z0-9][0-9]{2}/);
  if (match) return match[0];

  const fallback = convertido.replace(/[^A-Z0-9]/g, '');
  return fallback.length >= 7 ? fallback.slice(0, 7) : fallback;
}

function pat_aplicarPlacaReconhecida(placa) {
  const placaEl = document.getElementById('pat_placa');
  if (!placaEl) return false;

  const valor = String(placa || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
  if (valor.length < 7) {
    return false;
  }

  placaEl.value = valor;
  pat_formatarPlaca(placaEl);
  pat_setModoPlaca('manual');
  if (navigator.vibrate) navigator.vibrate(80);
  return true;
}

function pat_iniciarVozPlaca() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Reconhecimento de voz nao suportado neste navegador.');
    return;
  }

  if (PAT_SPEECH_RECOGNITION) {
    try {
      PAT_SPEECH_RECOGNITION.stop();
    } catch (error) {
      console.warn('Falha ao interromper reconhecimento anterior:', error);
    }
    PAT_SPEECH_RECOGNITION = null;
  }

  const recognition = new SpeechRecognition();
  PAT_SPEECH_RECOGNITION = recognition;

  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 3;

  pat_setBotaoVoz('loading', '🎙️ Ouvindo...');

  recognition.onresult = (event) => {
    const resultados = [];
    for (let i = event.resultIndex; i < event.results.length; i++) {
      resultados.push(event.results[i][0].transcript || '');
    }

    const textoFalado = resultados.join(' ').trim();
    const placaConvertida = pat_converterFalaEmPlaca(textoFalado);

    if (event.results[event.results.length - 1]?.isFinal) {
      if (!pat_aplicarPlacaReconhecida(placaConvertida)) {
        alert(`Nao foi possivel montar a placa com clareza.\n\nReconhecido: ${textoFalado || '---'}`);
      }
    } else {
      const btn = document.getElementById('btn-pat-placa-voz');
      if (btn) {
        btn.textContent = placaConvertida ? `🎙️ ${placaConvertida}` : '🎙️ Ouvindo...';
      }
    }
  };

  recognition.onerror = (event) => {
    const erro = event?.error || 'desconhecido';
    if (erro !== 'no-speech' && erro !== 'aborted') {
      alert(`Erro no reconhecimento de voz: ${erro}`);
    }
  };

  recognition.onend = () => {
    PAT_SPEECH_RECOGNITION = null;
    pat_setBotaoVoz('idle', '🎙️ Voz');
  };

  recognition.start();
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
    local = pat_normalizarLocalGps(document.getElementById('pat_local')?.value);
  } else {
    const rod = document.getElementById('pat_manual_rodovia')?.value;
    const kmInput = document.getElementById('pat_manual_km');
    if (kmInput) core_formatarKM(kmInput);
    const km = kmInput?.value || '0,000';
    local = rod ? `${rod}, KM ${km}` : `KM ${km}`;
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

  pat_getStore()?.add?.({ id: Date.now(), placa, data, hora, local, obs, infracao: infracaoObj });
  pat_renderizarLista();
  pat_setBoxVisible('pat_lista_card', true);
  pat_setBoxVisible('pat_result_area', false);
  pat_resetFormulario();
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
}

function pat_renderizarLista() {
  const container = document.getElementById('pat_lista_container');
  const card = document.getElementById('pat_lista_card');
  const totalEl = document.getElementById('pat_total_turno');
  const veiculos = pat_getVeiculos();
  if (!container || !card) return;

  if (veiculos.length === 0) {
    pat_setBoxVisible('pat_lista_card', false);
    if (totalEl) totalEl.textContent = 'Total de abordagens: 0';
    return;
  }

  pat_setBoxVisible('pat_lista_card', true);
  if (totalEl) totalEl.textContent = `Total de abordagens: ${veiculos.length}`;
  container.innerHTML = '';

  veiculos.forEach((v, index) => {
    const num = veiculos.length - index;
    const item = document.createElement('div');
    item.className = 'pat-item';
    item.style.cssText = 'display:flex; align-items:center; gap:12px; padding:12px; border-radius:12px; background:rgba(255,255,255,0.05); margin-bottom:8px; border-left:4px solid var(--primary);';
    const renderedHtml = pat_getRender()?.buildListItemHtml?.(v, index, veiculos.length, pat_escapeHtml);
    if (renderedHtml) {
      item.innerHTML = renderedHtml;
      container.appendChild(item);
      return;
    }
    
    item.innerHTML = `
      <div style="background:var(--primary); color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:900; flex-shrink:0;">
        ${num}
      </div>
      <div style="flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="font-size:18px; color:var(--primary); font-family:monospace; letter-spacing:1px;">${pat_escapeHtml(v.placa)}</strong>
          <span style="font-size:10px; color:var(--muted);">${v.hora}</span>
        </div>
        <div style="font-size:13px; color:#fff; font-weight:600; margin:2px 0;">${pat_escapeHtml(v.infracao.nome)}</div>
        <div style="font-size:11px; color:var(--muted);">${pat_escapeHtml(v.local)}</div>
      </div>
      <button class="btn btn-sm btn-danger" style="padding:6px 10px; border-radius:8px;" onclick="pat_removerVeiculo(${index})">✕</button>
    `;
    container.appendChild(item);
  });
}

function pat_removerVeiculo(index) {
  if (!confirm('Remover este registro?')) return;
  pat_getStore()?.removeAt?.(index);
  pat_renderizarLista();
  if (pat_getVeiculos().length === 0) {
    pat_setBoxVisible('pat_lista_card', false);
  }
}

function pat_limparTudo() {
  if (!confirm('Apagar todo o lote?')) return;
  pat_getStore()?.clear?.();
  pat_renderizarLista();
  pat_setBoxVisible('pat_lista_card', false);
  pat_setBoxVisible('pat_result_area', false);
}

function pat_gerarRelatorio() {
  const txt = pat_getReport()?.build?.(pat_getVeiculos()) || '';
  if (!txt) return;

  const resultText = document.getElementById('pat_result_text');
  const resultArea = document.getElementById('pat_result_area');
  if (resultText) resultText.innerText = txt;
  pat_setBoxVisible('pat_result_area', true);
}

function pat_encerrarPatrulhamento() {
  if (pat_getVeiculos().length === 0) {
    alert('Nenhum registro foi adicionado ao patrulhamento.');
    return;
  }

  pat_gerarRelatorio();
  document.getElementById('pat_result_area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function pat_baixarTxt() {
  const resultText = document.getElementById('pat_result_text');
  const texto = resultText?.innerText?.trim();

  if (!texto) {
    alert('Finalize o patrulhamento antes de gerar o TXT.');
    return;
  }

  const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dataArquivo = pat_getReport()?.buildFileDate?.(pat_getVeiculos()) || new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');

  link.href = url;
  link.download = `Patrulhamento_PMrv_${dataArquivo}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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

function pat_normalizarLocalGps(valor) {
  const texto = String(valor || '').trim();
  if (!texto || texto === PAT_GPS_STATUS_LABEL) return 'GPS nao obtido';
  return texto;
}

function pat_obterGPS() {
  const localInput = document.getElementById('pat_local');
  if (!localInput) return;
  if (!navigator.geolocation) {
    localInput.value = 'GPS nao suportado';
    alert('GPS nao suportado neste dispositivo.');
    return;
  }

  localInput.value = PAT_GPS_STATUS_LABEL;

  navigator.geolocation.getCurrentPosition(
    async pos => {
      const { latitude, longitude } = pos.coords;
      if (typeof window.gps_descreverLocal === 'function') {
        const resultado = await window.gps_descreverLocal(latitude, longitude);
        localInput.value = resultado.descricao;
      } else {
        localInput.value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      }
    },
    err => {
      localInput.value = 'GPS nao obtido';
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
window.pat_encerrarPatrulhamento = pat_encerrarPatrulhamento;
window.pat_baixarTxt = pat_baixarTxt;
window.pat_setModoPlaca = pat_setModoPlaca;
window.pat_setModoLocal = pat_setModoLocal;
window.pat_obterGPS = pat_obterGPS;
window.pat_simularOCR = pat_simularOCR;
window.pat_iniciarVozPlaca = pat_iniciarVozPlaca;

document.addEventListener('DOMContentLoaded', pat_init);
