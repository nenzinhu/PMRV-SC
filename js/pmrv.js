/* ---------------------------------------------------------------
   PMRv
--------------------------------------------------------------- */
const PMRV_DINAMICAS = {
  '1.1': 'O veículo V1 transitava pela via quando ocorreu o atropelamento de pedestre.',
  '1.2': 'O veículo V1 transitava pela via quando ocorreu o atropelamento de animal.',
  '2.1': 'Os veículos transitavam no mesmo sentido quando ocorreu o abalroamento longitudinal.',
  '2.2': 'Os veículos transitavam em sentidos opostos quando ocorreu o abalroamento longitudinal.',
  '2.3': 'O veículo V1 abalroou transversalmente o veículo V2.',
  '3.1': 'Os veículos colidiram frontalmente.',
  '3.2': 'O veículo V1 colidiu na traseira do veículo V2.',
  '3.3': 'O veículo V1 colidiu com outros veículos, ocasionando engavetamento.',
  '4.1': 'O veículo V1 chocou-se contra um poste de iluminação pública.',
  '4.6': 'O veículo V1 chocou-se contra a defensa metálica.',
  '4.9': 'O veículo V1 chocou-se contra [OBJETO].',
  '5.1': 'O condutor do veículo V1 perdeu o controle direcional, vindo a sair da pista.',
  '5.3': 'O condutor do veículo V1 perdeu o controle direcional, saiu da pista e o veículo capotou.',
  '5.4': 'O condutor do veículo V1 perdeu o controle direcional, saiu da pista e o veículo tombou.',
  '6.1': 'O veículo V1 saiu da pista e chocou-se contra um poste.',
  '6.2': 'O veículo V1 saiu da pista e chocou-se contra um muro.',
  '6.3': 'O veículo V1 saiu da pista e chocou-se contra a defensa.',
  '6.4': 'O veículo V1 saiu da pista e chocou-se contra [OBJETO].',
  '7.1': 'Ocorrência registrada como [OUTROS].'
};

function pmrv_validarVtr(input) {
  input.value = input.value.replace(/\D/g, '').substring(0, 4);
  pmrv_atualizar();
}

function pmrv_verificarVitimas() {
  const mostrar = document.getElementById('pmrv_ocorrencia').value === 'Sinistro de trânsito com vítima(s)';
  document.getElementById('pmrv_box_vitimas').classList.toggle('hidden', !mostrar);
  pmrv_atualizar();
}

/**
 * Lógica dinâmica para cidades baseada na rodovia selecionada
 */
function pmrv_verificarRodovia() {
  const rod = document.getElementById('pmrv_rodovia').value;
  const cidade = document.getElementById('pmrv_cidade');
  const sel407 = document.getElementById('pmrv_cidade_407');
  const sel281 = document.getElementById('pmrv_cidade_281');
  
  // Rodovias típicas de Florianópolis (Posto 19)
  const floripaRodovias = ['SC-400','SC-401','SC-402','SC-403','SC-404','SC-405','SC-406'];

  sel407.classList.add('hidden');
  sel281.classList.add('hidden');

  if (floripaRodovias.includes(rod)) {
    cidade.value = 'Florianópolis/SC';
    cidade.readOnly = true;
    cidade.style.opacity = '.6';
  } else if (rod === 'SC-407') {
    sel407.classList.remove('hidden');
    cidade.value = sel407.value;
    cidade.readOnly = true;
    cidade.style.opacity = '.6';
  } else if (rod === 'SC-281') {
    sel281.classList.remove('hidden');
    cidade.value = sel281.value;
    cidade.readOnly = true;
    cidade.style.opacity = '.6';
  } else {
    cidade.readOnly = false;
    cidade.style.opacity = '1';
    if (!cidade.value || cidade.value === 'Florianópolis/SC') {
        cidade.value = '';
        cidade.placeholder = 'Cidade/UF';
    }
  }
  pmrv_atualizar();
}

function pmrv_selecionarCidade407() {
  document.getElementById('pmrv_cidade').value = document.getElementById('pmrv_cidade_407').value;
  pmrv_atualizar();
}

function pmrv_selecionarCidade281() {
  document.getElementById('pmrv_cidade').value = document.getElementById('pmrv_cidade_281').value;
  pmrv_atualizar();
}

function pmrv_formatarKM(val) {
  if (!val) return '---';
  const num = parseFloat(String(val).replace(',', '.').replace(/[^\d.]/g, ''));
  return isNaN(num) ? '---' : num.toLocaleString('pt-BR', { minimumFractionDigits: 3 });
}

function pmrv_atualizarLocal() {
  const rodovia = document.getElementById('pmrv_rodovia')?.value || '---';
  const km = pmrv_formatarKM(document.getElementById('pmrv_km')?.value);
  const campoLocal = document.getElementById('pmrv_local');
  const textoLocal = `${rodovia}, km ${km}`;
  if (campoLocal) campoLocal.value = textoLocal;
  const footerLocal = document.getElementById('pmrv_local_footer');
  if (footerLocal) footerLocal.textContent = textoLocal;
}

function pmrv_aplicarLocalNoTexto(texto) {
  const rodovia = document.getElementById('pmrv_rodovia')?.value || '---';
  const km = pmrv_formatarKM(document.getElementById('pmrv_km')?.value);
  const local = document.getElementById('pmrv_local')?.value || `${rodovia}, km ${km}`;
  const linhaRodovia = `Rodovia: ${rodovia} / KM: ${km}`;
  const linhaRodoviaNegrito = `*Rodovia:* ${rodovia} / *KM:* ${km}`;

  return texto
    .replace(linhaRodoviaNegrito, `${linhaRodoviaNegrito}\n*Local:* ${local}`)
    .replace(linhaRodovia, `${linhaRodovia}\nLocal: ${local}`)
    .replace(
      `para atendimento de sinistro na rodovia ${rodovia}, km ${km}`,
      `para atendimento de sinistro de trânsito no local ${local}`
    );
}

function pmrv_atualizarBotaoAvancado() {
  const secao = document.getElementById('pmrv_advanced_section');
  const botao = document.getElementById('pmrv_advanced_toggle');
  if (!secao || !botao) return;
  const aberto = secao.classList.contains('open');
  botao.textContent = aberto ? 'Ocultar Detalhes' : 'Mais Detalhes';
  botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
}

function pmrv_toggleAvancado(forceOpen) {
  const secao = document.getElementById('pmrv_advanced_section');
  if (!secao) return;
  const abrir = typeof forceOpen === 'boolean'
    ? forceOpen
    : !secao.classList.contains('open');
  secao.classList.toggle('open', abrir);
  pmrv_atualizarBotaoAvancado();
}

function pmrv_toggleSentidoManual() {
  document.getElementById('pmrv_sentido_manual')
    .classList.toggle('hidden', document.getElementById('pmrv_sentido').value !== 'MANUAL');
  pmrv_atualizar();
}

function pmrv_mudarSubtipo() {
  const cod     = document.getElementById('pmrv_subtipo').value;
  const objeto  = document.getElementById('pmrv_nome_objeto').value  || 'objeto fixo';
  const outros  = document.getElementById('pmrv_descricao_outros').value || 'natureza não especificada';

  document.getElementById('pmrv_box_objeto').classList.toggle('hidden', cod !== '4.9' && cod !== '6.4');
  document.getElementById('pmrv_box_outros').classList.toggle('hidden', cod !== '7.1');

  let texto = PMRV_DINAMICAS[cod] || '';
  if (cod === '4.9' || cod === '6.4') texto = texto.replace('[OBJETO]', objeto);
  if (cod === '7.1')                  texto = texto.replace('[OUTROS]', outros);

  document.getElementById('pmrv_dinamica_texto').value = texto;
  pmrv_atualizar();
}

function pmrv_init() {
  const rodovia = document.getElementById('pmrv_rodovia');
  const subtipo = document.getElementById('pmrv_subtipo');
  if (!rodovia || !subtipo) return;

  if (!rodovia.value) {
    const fallback = ['SC-400', 'SC-401', 'SC-402', 'SC-403', 'SC-405', 'SC-406', 'SC-281', 'SC-407']
      .find(value => Array.from(rodovia.options).some(opt => opt.value === value));
    if (fallback) rodovia.value = fallback;
  }

  if (!subtipo.value) subtipo.value = '1.1';
  pmrv_toggleAvancado(window.innerWidth > 520);
  pmrv_verificarRodovia();
  pmrv_verificarVitimas();
  pmrv_toggleSentidoManual();
  pmrv_mudarSubtipo();
}

function pmrv_gerarTexto(negrito = false) {
  const b   = negrito ? '*' : '';
  const sade    = document.getElementById('pmrv_sade').value    || '---';
  const vtr     = document.getElementById('pmrv_vtr').value     || '---';
  const cidade  = document.getElementById('pmrv_cidade').value  || '---';
  const rodovia = document.getElementById('pmrv_rodovia').value || '---';
  const km      = pmrv_formatarKM(document.getElementById('pmrv_km').value);
  const local   = document.getElementById('pmrv_local')?.value  || `${rodovia}, km ${km}`;
  const conhc   = document.getElementById('pmrv_conhecimento').value;
  const ocorr   = document.getElementById('pmrv_ocorrencia').value;
  const dinamica= document.getElementById('pmrv_dinamica_texto').value;

  const sentido = document.getElementById('pmrv_sentido').value === 'MANUAL'
    ? document.getElementById('pmrv_sentido_manual').value
    : document.getElementById('pmrv_sentido').value;

  const sel = document.getElementById('pmrv_subtipo');
  let tipoLabel = sel.options[sel.selectedIndex].text.split(' ').slice(1).join(' ');
  if (sel.value === '7.1' && document.getElementById('pmrv_descricao_outros').value)
    tipoLabel = document.getElementById('pmrv_descricao_outros').value;

  let infoV = '';
  if (ocorr === 'Sinistro de trânsito com vítima(s)') {
    const l  = Number(document.getElementById('pmrv_qtd_leve').value       || 0);
    const g  = Number(document.getElementById('pmrv_qtd_grave').value      || 0);
    const gs = Number(document.getElementById('pmrv_qtd_gravissima').value || 0);
    const partes = [];
    if (l  > 0) partes.push(`${String(l).padStart(2,'0')} leve(s)`);
    if (g  > 0) partes.push(`${String(g).padStart(2,'0')} grave(s)`);
    if (gs > 0) partes.push(`${String(gs).padStart(2,'0')} gravíssima(s)`);
    infoV = '\n' + b + 'Vítimas:' + b + ' ' + (partes.length ? partes.join(', ') : 'Quantidade não informada');
  }

  const hora = document.getElementById('pmrv_hora_manual').checked
    ? (document.getElementById('pmrv_input_hora').value || '---')
    : new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const data = new Date().toLocaleDateString('pt-BR');

  return (
    `${b}COMANDO DE POLÍCIA MILITAR RODOVIÁRIA${b}\n` +
    `${b}1º BPMRv / 1ª CIA / Posto 19${b}\n` +
    `${b}Protocolo SADE:${b} ${sade}\n` +
    `${b}Data:${b} ${data}\n` +
    `${b}Hora:${b} ${hora}\n` +
    `${b}Rodovia:${b} ${rodovia} / ${b}KM:${b} ${km}\n` +
    `${b}Local:${b} ${local}\n` +
    `${b}Cidade:${b} ${cidade}\n` +
    `${b}Tipo de ocorrência:${b} ${ocorr}\n` +
    `${b}Tipo de sinistro:${b} ${tipoLabel}${infoV}\n` +
    `\n` +
    `A equipe policial militar rodoviária foi acionada ${conhc} para atendimento de ocorrência de sinistro de trânsito na rodovia ${rodovia}, km ${km}, sentido ${sentido || '---'}, sendo empenhada a Viatura PM-${vtr}.\n` +
    `${dinamica}\n` +
    `\n` +
    `Foram adotadas as providências administrativas cabíveis.`
  );
}

function pmrv_atualizar() {
  pmrv_atualizarLocal();
  const el = document.getElementById('pmrv_relatorio');
  if (el) el.textContent = pmrv_aplicarLocalNoTexto(pmrv_gerarTexto(false));
}

function pmrv_enviarWhatsApp() {
  window.open('https://wa.me/?text=' + encodeURIComponent(pmrv_aplicarLocalNoTexto(pmrv_gerarTexto(true))), '_blank');
}

function pmrv_limpar() {
  ['pmrv_sade','pmrv_vtr','pmrv_km','pmrv_sentido_manual','pmrv_nome_objeto','pmrv_descricao_outros','pmrv_dinamica_texto']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

  document.getElementById('pmrv_ocorrencia').value   = 'Sinistro de trânsito com danos materiais';
  document.getElementById('pmrv_conhecimento').value = 'pela Central';
  document.getElementById('pmrv_sentido').value      = 'Centro–Bairro';
  document.getElementById('pmrv_subtipo').value      = '1.1';
  document.getElementById('pmrv_hora_auto').checked  = true;
  ['pmrv_qtd_leve','pmrv_qtd_grave','pmrv_qtd_gravissima'].forEach(id => document.getElementById(id).value = 0);

  pmrv_verificarRodovia();
  pmrv_verificarVitimas();
  pmrv_toggleSentidoManual();
  pmrv_mudarSubtipo();
}

window.pmrv_init = pmrv_init;

document.addEventListener('DOMContentLoaded', pmrv_init);
