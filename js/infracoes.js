(function () {
  const state = {
    initialized: false,
    loading: false,
    records: [],
    categories: [],
    measures: [],
    elements: null
  };

  const SEARCH_SYNONYM_GROUPS = [
    ['licenciamento', 'licen', 'licenca', 'licença', 'crlv', 'crlv-e', 'crlv e', 'documento', 'documentos', 'doc', 'docu', 'regularizacao', 'regularização'],
    ['placa', 'placas', 'identificacao', 'identificação', 'sinal identificador'],
    ['cnh', 'habilitacao', 'habilitação', 'carteira', 'motorista', 'condutor', 'permissao', 'permissão', 'ppd', 'acc'],
    ['documento', 'documentos', 'porte', 'obrigatorio', 'obrigatório', 'apresentacao', 'apresentação'],
    ['veiculo', 'veículo', 'carro', 'automovel', 'automóvel', 'moto', 'motocicleta', 'motoneta', 'ciclomotor'],
    ['capacete', 'viseira', 'oculos', 'óculos', 'protecao', 'proteção'],
    ['estacionar', 'estacionamento', 'parar', 'parada'],
    ['alcool', 'álcool', 'embriaguez', 'bebida', 'etilometro', 'etilômetro', 'bafometro', 'bafômetro'],
    ['celular', 'telefone', 'smartphone', 'aparelho'],
    ['farol', 'farois', 'faróis', 'luz', 'lanterna', 'iluminacao', 'iluminação'],
    ['ultrapassagem', 'ultrapassar', 'passagem'],
    ['pedestre', 'faixa', 'travessia', 'passarela'],
    ['remocao', 'remoção', 'guincho', 'recolhimento'],
    ['retencao', 'retenção', 'reter']
  ];

  const SEARCH_INTENT_RULES = [
    {
      triggers: ['nao pagou', 'não pagou', 'licenciamento atrasado', 'licenciamento vencido', 'nao licenciou', 'não licenciou'],
      expansions: ['licenciamento', 'crlv', 'documento']
    },
    {
      triggers: ['recusou', 'recusou bafometro', 'recusou teste', 'nao soprou'],
      expansions: ['recusa', 'etilometro', 'bafometro', 'teste']
    },
    {
      triggers: ['nao habilitado', 'sem habilitacao', 'sem cnh', 'sem acc'],
      expansions: ['habilitacao', 'cnh', 'acc', 'permissao']
    }
  ];

  const SEARCH_CODE_SHORTCUTS = [
    { code: '7366-2', terms: ['7366-2', '736-62', 'celular'] },
    { code: '5185-1', terms: ['5185-1', '518-51', 'cinto'] },
    { code: '5010-1', terms: ['5010-0', '501-00', 'sem cnh', 'sem acc'] },
    { code: '5169-1', terms: ['7579-0', '757-90', 'recusa', 'bafometro'] }
  ];

  function getElements() {
    if (state.elements) return state.elements;
    state.elements = {
      search: document.getElementById('infra_search'),
      category: document.getElementById('infra_category'),
      measure: document.getElementById('infra_measure'),
      clear: document.getElementById('infra_clear'),
      tabConsulta: document.getElementById('infra_tab_consulta'),
      tabFrequentes: document.getElementById('infra_tab_frequentes'),
      panelConsulta: document.getElementById('infra_panel_consulta'),
      panelFrequentes: document.getElementById('infra_panel_frequentes'),
      totalCount: document.getElementById('infra_totalCount'),
      filteredCount: document.getElementById('infra_filteredCount'),
      categoryCount: document.getElementById('infra_categoryCount'),
      status: document.getElementById('infra_status'),
      summary: document.getElementById('infra_summary'),
      tableBody: document.getElementById('infra_tableBody'),
      emptyState: document.getElementById('infra_emptyState')
    };
    return state.elements;
  }

  function repairBrokenText(text) {
    return String(text || '').trim();
  }

  function safeText(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    return repairBrokenText(text);
  }

  function normalizeHeader(value) {
    return safeText(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function normalizeSearchText(value) {
    return safeText(value)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function resolveCodeShortcut(term) {
    const normalizedTerm = normalizeSearchText(term);
    if (!normalizedTerm) return '';
    for (let entry of SEARCH_CODE_SHORTCUTS) {
      if (entry.terms.some(t => normalizeSearchText(t) === normalizedTerm)) return entry.code;
    }
    return '';
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];
      if (char === '"') {
        if (quoted && next === '"') { cell += '"'; i++; }
        else { quoted = !quoted; }
        continue;
      }
      if (char === ',' && !quoted) { row.push(cell); cell = ''; continue; }
      if ((char === '\n' || char === '\r') && !quoted) {
        if (char === '\r' && next === '\n') i++;
        row.push(cell);
        if (row.some(c => c.trim() !== '')) rows.push(row);
        row = []; cell = '';
        continue;
      }
      cell += char;
    }
    if (cell.length || row.length) {
      row.push(cell);
      if (row.some(c => c.trim() !== '')) rows.push(row);
    }
    return rows;
  }

  function findHeaderIndex(headers, options) {
    for (let i = 0; i < headers.length; i++) {
      if (options.some(opt => headers[i] === opt)) return i;
    }
    return -1;
  }

  function normalizeCategory(value) {
    const normalized = normalizeHeader(value);
    if (!normalized) return 'Sem categoria';
    if (normalized.includes('gravissima') || normalized.includes('graviss')) return 'Gravíssima';
    if (normalized.includes('grave')) return 'Grave';
    if (normalized.includes('media')) return 'Média';
    if (normalized.includes('leve')) return 'Leve';
    return 'Sem categoria';
  }

  function categoryClass(value) {
    const normalized = normalizeHeader(value);
    if (normalized.includes('gravissima')) return 'gravissima';
    if (normalized.includes('grave')) return 'grave';
    if (normalized.includes('media')) return 'media';
    if (normalized.includes('leve')) return 'leve';
    return 'sem-categoria';
  }

  function normalizeMeasure(value) {
    const normalized = normalizeHeader(value);
    if (!normalized) return '';
    if (normalized.includes('remoc')) return 'REMOÇÃO';
    if (normalized.includes('retenc')) return 'RETENÇÃO';
    return safeText(value).toUpperCase();
  }

  function measureClass(value) {
    const normalized = normalizeHeader(value);
    if (normalized.includes('remoc')) return 'remocao';
    if (normalized.includes('retenc')) return 'retencao';
    return 'none';
  }

  function parseValue(value) {
    if (String(value).includes('NIC')) return 'NIC';
    const text = safeText(value).replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
    const parsed = Number(text);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function formatCurrency(value) {
    if (value === 'NIC') return 'Multa NIC';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function escapeHtml(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function fillSelect(select, values, emptyLabel) {
    const current = select.value;
    select.innerHTML = '<option value="">' + emptyLabel + '</option>' + values.map(v => '<option value="' + escapeHtml(v) + '">' + escapeHtml(v) + '</option>').join('');
    select.value = values.indexOf(current) >= 0 ? current : '';
  }

  function buildSearchIndex(record) {
    return normalizeSearchText([record.codigo, record.descricao, record.artigo, record.infrator, record.categoria, record.medida].join(' '));
  }

  function expandSearchIntent(term) {
    const expanded = [term];
    SEARCH_INTENT_RULES.forEach(rule => {
      if (rule.triggers.some(t => term.indexOf(normalizeSearchText(t)) >= 0)) {
        rule.expansions.forEach(item => expanded.push(normalizeSearchText(item)));
      }
    });
    return Array.from(new Set(expanded.join(' ').split(/\s+/).filter(Boolean)));
  }

  function mapRecords(rows) {
    if (!rows.length) return [];
    
    // Mapeamento baseado nos cabeçalhos detectados ou índices fixos (fallback)
    const headers = rows[0].map(normalizeHeader);
    console.log('[Infra] Cabeçalhos normalizados:', headers);
    
    const idx = {
      codigo: findHeaderIndex(headers, ['codigo infracao', 'codigo', 'cod']),
      descricao: findHeaderIndex(headers, ['descricao da infracao', 'descricao infracao', 'descricao']),
      artigo: findHeaderIndex(headers, ['art ctb decreto', 'artigo', 'art']),
      infrator: findHeaderIndex(headers, ['infrator']),
      valor: findHeaderIndex(headers, ['valor real r', 'valor real rs', 'valor']),
      categoria: findHeaderIndex(headers, ['categoria']),
      medida: findHeaderIndex(headers, ['medida administrativa', 'medida'])
    };

    // Índices de garantia (baseados na estrutura padrão: Cod, Desc, Art, Inf, Val, Cat, Med)
    const COD_IDX = idx.codigo !== -1 ? idx.codigo : 0;
    const DSC_IDX = idx.descricao !== -1 ? idx.descricao : 1;
    const ART_IDX = idx.artigo !== -1 ? idx.artigo : 2;
    const INF_IDX = idx.infrator !== -1 ? idx.infrator : 3;
    const VAL_IDX = idx.valor !== -1 ? idx.valor : 4;
    const CAT_IDX = idx.categoria !== -1 ? idx.categoria : 5;
    const MED_IDX = idx.medida !== -1 ? idx.medida : 6;

    const records = rows.slice(1).map((row, i) => {
      if (!row || row.length < 2) return null;
      
      const record = {
        codigo: safeText(row[COD_IDX] || ''),
        descricao: safeText(row[DSC_IDX] || ''),
        artigo: safeText(row[ART_IDX] || ''),
        infrator: safeText(row[INF_IDX] || ''),
        categoria: normalizeCategory(row[CAT_IDX] || ''),
        medida: normalizeMeasure(row[MED_IDX] || ''),
        valor: parseValue(row[VAL_IDX] || '')
      };
      record.search = buildSearchIndex(record);
      return record;
    }).filter(r => r !== null && (r.codigo || r.descricao));

    console.log(`[Infra] Mapeamento concluído: ${records.length} registros processados.`);
    return records;
  }

  function render(records) {
    const elements = getElements();
    if (!elements.tableBody) return;

    elements.totalCount.textContent = state.records.length.toLocaleString('pt-BR');
    elements.filteredCount.textContent = records.length.toLocaleString('pt-BR');
    elements.categoryCount.textContent = state.categories.length;

    if (!records.length) {
      elements.tableBody.innerHTML = '';
      elements.emptyState.hidden = false;
      return;
    }

    elements.emptyState.hidden = true;
    elements.tableBody.innerHTML = records.map(record => {
      const catClass = categoryClass(record.categoria);
      const medClass = measureClass(record.medida);
      return `<tr>
        <td class="infra-code">${escapeHtml(record.codigo)}</td>
        <td class="infra-description">${escapeHtml(record.descricao)}</td>
        <td class="infra-muted-cell">${escapeHtml(record.artigo || '-')}</td>
        <td class="infra-muted-cell">${escapeHtml(record.infrator || '-')}</td>
        <td><span class="infra-badge ${catClass}">${escapeHtml(record.categoria)}</span></td>
        <td><span class="infra-measure ${medClass}">${escapeHtml(record.medida || 'Sem medida')}</span></td>
        <td class="infra-code">${escapeHtml(formatCurrency(record.valor))}</td>
      </tr>`;
    }).join('');
  }

  function applyFilters() {
    const elements = getElements();
    const term = normalizeSearchText(elements.search.value);
    const category = elements.category.value;
    const measure = elements.measure.value;
    
    const filtered = state.records.filter(r => {
      if (term && r.search.indexOf(term) === -1) {
        // Tenta expansão de sinônimos se a busca direta falhar
        const termParts = expandSearchIntent(term);
        if (!termParts.every(p => r.search.indexOf(p) >= 0)) return false;
      }
      if (category && r.categoria !== category) return false;
      if (measure && r.medida !== measure) return false;
      return true;
    });
    render(filtered);
  }

  function decodeEmbeddedBase64(base64) {
    try {
      const binaryString = atob(base64.trim());
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new TextDecoder('utf-8').decode(bytes);
    } catch (e) { 
      console.error('[Infra] Erro na decodificação Base64:', e);
      return ''; 
    }
  }

  async function infra_init() {
    const elements = getElements();
    if (!elements.search) return;
    
    // Evita reinicialização múltipla de listeners
    if (state.initialized) {
        // Se já inicializado, apenas garante que a tabela esteja renderizada
        if (state.records.length > 0) render(state.records);
        return;
    }
    
    elements.search.addEventListener('input', applyFilters);
    elements.category.addEventListener('change', applyFilters);
    elements.measure.addEventListener('change', applyFilters);
    
    if (elements.clear) {
        elements.clear.addEventListener('click', () => {
            elements.search.value = ''; 
            elements.category.value = ''; 
            elements.measure.value = '';
            render(state.records);
        });
    }

    try {
        if (elements.status) elements.status.innerText = 'Carregando base...';
        
        // Carrega via dataManager
        const data = await PMRV.dataManager.loadResource('infracoes', 'data/infracoes.json');
        
        if (data && data.b64) {
            const csvText = decodeEmbeddedBase64(data.b64);
            const rows = parseCsv(csvText);
            
            state.records = mapRecords(rows);
            state.categories = Array.from(new Set(state.records.map(r => r.categoria).filter(Boolean))).sort();
            state.measures = Array.from(new Set(state.records.map(r => r.medida).filter(Boolean))).sort();
            
            fillSelect(elements.category, state.categories, 'Todas');
            fillSelect(elements.measure, state.measures, 'Todas');
            
            state.initialized = true;
            if (elements.status) elements.status.innerText = 'Base carregada';
            render(state.records);
        } else {
            throw new Error("Base de dados vazia ou inválida.");
        }
    } catch (err) {
      console.error('Erro ao carregar base de infrações:', err);
      if (elements.status) elements.status.innerText = 'Erro ao carregar base de dados.';
    }
  }

  window.infra_init = infra_init;
  window.infra_applyShortcut = (term) => {
    const elements = getElements();
    if (elements.search) { elements.search.value = term; applyFilters(); }
    window.infra_showTab('consulta');
  };
  window.infra_showTab = (tab) => {
    const isConsulta = tab !== 'frequentes';
    document.getElementById('infra_tab_consulta').classList.toggle('active', isConsulta);
    document.getElementById('infra_tab_frequentes').classList.toggle('active', !isConsulta);
    document.getElementById('infra_panel_consulta').hidden = !isConsulta;
    document.getElementById('infra_panel_frequentes').hidden = isConsulta;
  };
})();
