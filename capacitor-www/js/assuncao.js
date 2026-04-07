/* ---------------------------------------------------------------
   INICIANDO O SERVICO - COMPATIVEL COM O HTML ATUAL
--------------------------------------------------------------- */
window.PMRV = window.PMRV || {};

PMRV.assuncao = (function() {
  const POLICIAIS_EFETIVO = [
    'Sub-Ten JORGE LUIZ', 'Sub-Ten OSORIO',
    '2º Sgt BARDT', '2º Sgt CAVALLAZZI', '3º Sgt DOUGLAS', '3º Sgt FIGUEIREDO',
    '3º Sgt FRANCISCO', '3º Sgt FRANCINE', '3º Sgt LEONARDO', '3º Sgt MARTINS',
    '3º Sgt WALTER', 'Cb ADEMIR', 'Cb ANDRADE', 'Cb CABRAL', 'Cb DIEGO',
    'Cb FABIANA', 'Cb JEFERSON', 'Cb JULIANA', 'Cb MATHEUS', 'Cb RODRIGUES',
    'Cb SANTOS', 'Cb SCARABELOT', 'Cb SILVA', 'Cb THIAGO'
  ];

  const state = {
    mesa: false,
    vtr: '',
    tipo: '',
    policiaisSelecionados: [],
    lotes: [],
    ultimoGrupo: ''
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function init() {
    const vtrInput = byId('ass_build_vtr_input');
    const tipoInput = byId('ass_build_tipo_input');

    if (vtrInput) {
      vtrInput.addEventListener('input', () => {
        vtrInput.value = vtrInput.value.replace(/\D/g, '').slice(0, 4);
        atualizarLabelVtr();
        atualizarTipoUI();
      });
    }

    if (tipoInput) {
      tipoInput.addEventListener('input', atualizarLabel);
    }

    renderPoliciaisSelecionados();
    renderLotes();
    atualizarModoMesa();
    atualizarLabelVtr();
    atualizarTipoUI();
  }

  function atualizarModoMesa() {
    const mesaBtn = byId('ass_mesa_btn');
    const vtrSection = byId('ass_build_vtr_section');
    const tipoSection = byId('ass_build_tipo_section');
    const polLabel = byId('ass_build_pol_label');
    const horLabel = byId('ass_build_hor_label');
    const confirmarBtn = byId('ass_build_confirmar_btn');

    if (mesaBtn) mesaBtn.classList.toggle('btn-primary', state.mesa);
    if (vtrSection) vtrSection.style.display = state.mesa ? 'none' : '';
    if (tipoSection && state.mesa) tipoSection.style.display = 'none';
    if (polLabel) polLabel.textContent = state.mesa ? 'Policiais da Recepção' : 'Policiais desta Viatura';
    if (horLabel) horLabel.textContent = state.mesa ? 'Horário da Recepção' : 'Horário desta Viatura';
    if (confirmarBtn) confirmarBtn.textContent = state.mesa ? '+ Confirmar Recepção' : '+ Confirmar Viatura';
  }

  function atualizarLabelVtr() {
    const label = byId('ass_build_vtr_label');
    if (!label) return;

    if (state.mesa) {
      label.style.display = 'none';
      return;
    }

    if (state.vtr) {
      label.style.display = 'block';
      label.textContent = 'Selecionado: PM-' + state.vtr;
    } else {
      label.style.display = 'none';
      label.textContent = '';
    }
  }

  function atualizarTipoUI() {
    const section = byId('ass_build_tipo_section');
    if (!section) return;

    section.style.display = !state.mesa && state.vtr ? 'block' : 'none';

    document.querySelectorAll('.ass-tipo-btn').forEach(btn => {
      const isActive = btn.getAttribute('data-click')?.includes("'" + state.tipo + "'");
      btn.classList.toggle('btn-primary', Boolean(isActive));
    });
  }

  function renderGrupoEfetivo() {
    const nomesGrid = byId('ass_build_nomes_grid');
    if (!nomesGrid) return;

    nomesGrid.style.display = 'flex';
    nomesGrid.innerHTML = '';

    POLICIAIS_EFETIVO.forEach(policial => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'vtr-btn';
      if (state.policiaisSelecionados.includes(policial)) {
        button.classList.add('btn-primary');
      }
      button.textContent = policial;
      button.addEventListener('click', () => alternarPolicial(policial));
      nomesGrid.appendChild(button);
    });
  }

  function alternarPolicial(nome) {
    const index = state.policiaisSelecionados.indexOf(nome);
    if (index >= 0) state.policiaisSelecionados.splice(index, 1);
    else state.policiaisSelecionados.push(nome);

    if (state.ultimoGrupo === 'efetivo') renderGrupoEfetivo();
    renderPoliciaisSelecionados();
  }

  function renderPoliciaisSelecionados() {
    const wrap = byId('ass_build_pol_chips_wrap');
    const chips = byId('ass_build_pol_chips');
    if (!wrap || !chips) return;

    if (!state.policiaisSelecionados.length) {
      wrap.style.display = 'none';
      chips.innerHTML = '';
      return;
    }

    wrap.style.display = 'block';
    chips.innerHTML = state.policiaisSelecionados.map(nome =>
      '<span class="brand-pill">' + escapeHtml(nome) + '</span>'
    ).join('');
  }

  function renderLotes() {
    const wrap = byId('ass_lotes_wrap');
    const lista = byId('ass_lotes_lista');
    if (!wrap || !lista) return;

    if (!state.lotes.length) {
      wrap.style.display = 'none';
      lista.innerHTML = '';
      return;
    }

    wrap.style.display = 'block';
    lista.innerHTML = state.lotes.map((lote, index) => {
      const titulo = lote.mesa
        ? 'Recepção do P19'
        : ('PM-' + escapeHtml(lote.vtr) + ' - ' + escapeHtml(lote.tipo));

      return (
        '<div class="lote-item">' +
          '<div style="flex:1;">' +
            '<div class="lote-title">' + titulo +
              '<span class="lote-horario">[' + escapeHtml(lote.horario) + ']</span>' +
            '</div>' +
            '<div class="lote-pols">' + escapeHtml(lote.policiais.join(' / ')) + '</div>' +
          '</div>' +
          '<button type="button" class="btn-remove" data-click="ass_removerLote(' + index + ')">x</button>' +
        '</div>'
      );
    }).join('');
  }

  function limparBuilder() {
    state.vtr = '';
    state.tipo = '';
    state.policiaisSelecionados = [];
    state.ultimoGrupo = '';

    const vtrInput = byId('ass_build_vtr_input');
    const tipoInput = byId('ass_build_tipo_input');
    const tipoManualWrap = byId('ass_build_tipo_manual_wrap');
    const nomesGrid = byId('ass_build_nomes_grid');
    const horario = byId('ass_build_horario');

    if (vtrInput) vtrInput.value = '';
    if (tipoInput) tipoInput.value = '';
    if (tipoManualWrap) tipoManualWrap.classList.add('hidden');
    if (nomesGrid) {
      nomesGrid.innerHTML = '';
      nomesGrid.style.display = 'none';
    }
    if (horario) horario.value = '06h às 18h';

    document.querySelectorAll('#ass_build_vtr_grid .vtr-btn').forEach(btn => btn.classList.remove('btn-primary'));
    document.querySelectorAll('.ass-tipo-btn').forEach(btn => btn.classList.remove('btn-primary'));

    atualizarLabelVtr();
    atualizarTipoUI();
    renderPoliciaisSelecionados();
  }

  function obterTipoAtual() {
    if (state.tipo === '__manual__') {
      return byId('ass_build_tipo_input')?.value.trim() || '';
    }
    return state.tipo;
  }

  function obterVtrAtual() {
    if (state.mesa) return 'MESA';
    const inputValue = byId('ass_build_vtr_input')?.value.replace(/\D/g, '').slice(0, 4) || '';
    if (state.vtr === '__manual__') return inputValue;
    return state.vtr;
  }

  function toggleMesa() {
    state.mesa = !state.mesa;
    limparBuilder();
    atualizarModoMesa();
  }

  function selecionarVtr(button, vtr) {
    state.mesa = false;
    state.vtr = vtr;

    const manualWrap = byId('ass_build_vtr_manual_wrap');
    if (manualWrap) manualWrap.classList.add('hidden');

    document.querySelectorAll('#ass_build_vtr_grid .vtr-btn').forEach(btn => btn.classList.remove('btn-primary'));
    button?.classList.add('btn-primary');

    atualizarModoMesa();
    atualizarLabelVtr();
    atualizarTipoUI();
  }

  function toggleVtrManual(button) {
    state.mesa = false;
    state.vtr = '__manual__';

    const manualWrap = byId('ass_build_vtr_manual_wrap');
    if (manualWrap) manualWrap.classList.toggle('hidden');

    document.querySelectorAll('#ass_build_vtr_grid .vtr-btn').forEach(btn => btn.classList.remove('btn-primary'));
    button?.classList.add('btn-primary');

    byId('ass_build_vtr_input')?.focus();

    atualizarModoMesa();
    atualizarLabelVtr();
    atualizarTipoUI();
  }

  function selecionarTipo(button, tipo) {
    state.tipo = tipo;
    document.querySelectorAll('.ass-tipo-btn').forEach(btn => btn.classList.remove('btn-primary'));
    button?.classList.add('btn-primary');

    const manualWrap = byId('ass_build_tipo_manual_wrap');
    if (manualWrap) manualWrap.classList.toggle('hidden', tipo !== '__manual__');
    if (tipo === '__manual__') byId('ass_build_tipo_input')?.focus();
  }

  function atualizarLabel() {
    atualizarLabelVtr();
    atualizarTipoUI();
  }

  function carregarGrupo(button, grupo) {
    state.ultimoGrupo = grupo;
    document.querySelectorAll('#ass_build_grupos_grid .vtr-btn').forEach(btn => btn.classList.remove('btn-primary'));
    button?.classList.add('btn-primary');

    if (grupo === 'efetivo') renderGrupoEfetivo();
  }

  function toggleManualPol() {
    byId('ass_build_manual_pol_wrap')?.classList.toggle('hidden');
  }

  function adicionarManual() {
    const grad = byId('ass_build_grad_manual')?.value || '';
    const nomeInput = byId('ass_build_nome_manual');
    if (!nomeInput) return;

    const nome = nomeInput.value.trim().toUpperCase();
    if (!nome) return;

    const completo = (grad + ' ' + nome).trim();
    if (!state.policiaisSelecionados.includes(completo)) {
      state.policiaisSelecionados.push(completo);
    }

    nomeInput.value = '';
    renderPoliciaisSelecionados();
    if (state.ultimoGrupo === 'efetivo') renderGrupoEfetivo();
  }

  function adicionarLote() {
    const vtr = obterVtrAtual();
    const tipo = obterTipoAtual();
    const horario = byId('ass_build_horario')?.value || '';

    if (!state.mesa && !vtr) {
      alert('Por favor, selecione ou informe a viatura.');
      return;
    }

    if (!state.mesa && !tipo) {
      alert('Por favor, selecione ou informe a escala.');
      return;
    }

    if (!state.policiaisSelecionados.length) {
      alert('Selecione ao menos um policial para esta guarnição.');
      return;
    }

    state.lotes.push({
      mesa: state.mesa,
      vtr,
      tipo: state.mesa ? 'Recepção' : tipo,
      horario,
      policiais: [...state.policiaisSelecionados]
    });

    renderLotes();
    limparBuilder();
    atualizarModoMesa();
  }

  function removerLote(index) {
    state.lotes.splice(index, 1);
    renderLotes();
  }

  function toggleManual() {
    const select = byId('ass_horario');
    const manual = byId('ass_horarioManual');
    if (!select || !manual) return;
    manual.classList.toggle('hidden', select.value !== 'MANUAL');
  }

  function gerarTexto() {
    const resultado = byId('ass_resultado');
    if (!resultado) return;

    if (!state.lotes.length) {
      resultado.textContent = 'Adicione ao menos uma viatura ou recepção antes de gerar o texto do serviço.';
      byId('ass_result')?.classList.add('visible');
      return;
    }

    const horarioSelect = byId('ass_horario')?.value || '';
    const horarioManual = byId('ass_horarioManual')?.value.trim() || '';
    const local = byId('ass_localManual')?.value.trim() || byId('ass_local')?.value || 'P19';
    const horarioServico = horarioSelect === 'MANUAL' ? horarioManual : horarioSelect;

    const linhas = [
      'Guarnição iniciando o serviço operacional.',
      ''
    ];

    state.lotes.forEach((lote, index) => {
      const titulo = lote.mesa
        ? 'Recepção do P19'
        : ('Viatura PM-' + lote.vtr + ' - ' + lote.tipo);

      const labelPol = lote.policiais.length > 1 ? 'Policiais: ' : 'Policial: ';
      linhas.push((index + 1) + '. ' + titulo);
      linhas.push(labelPol + lote.policiais.join(' / '));
      linhas.push('Horário: ' + lote.horario);
      linhas.push('');
    });

    resultado.textContent = linhas.join('\n');
    byId('ass_result')?.classList.add('visible');
  }

  return {
    init,
    toggleMesa,
    selecionarVtr,
    toggleVtrManual,
    selecionarTipo,
    atualizarLabel,
    carregarGrupo,
    toggleManualPol,
    adicionarManual,
    adicionarLote,
    removerLote,
    toggleManual,
    gerarTexto
  };
})();

window.ass_toggleMesa = PMRV.assuncao.toggleMesa;
window.ass_build_selecionarVtr = PMRV.assuncao.selecionarVtr;
window.ass_build_toggleVtrManual = PMRV.assuncao.toggleVtrManual;
window.ass_build_selecionarTipo = PMRV.assuncao.selecionarTipo;
window.ass_build_atualizarLabel = PMRV.assuncao.atualizarLabel;
window.ass_build_carregarGrupo = PMRV.assuncao.carregarGrupo;
window.ass_build_toggleManualPol = PMRV.assuncao.toggleManualPol;
window.ass_build_adicionarManual = PMRV.assuncao.adicionarManual;
window.ass_adicionarLote = PMRV.assuncao.adicionarLote;
window.ass_removerLote = PMRV.assuncao.removerLote;
window.ass_toggleManual = PMRV.assuncao.toggleManual;
window.ass_gerar = PMRV.assuncao.gerarTexto;

document.addEventListener('DOMContentLoaded', PMRV.assuncao.init);
