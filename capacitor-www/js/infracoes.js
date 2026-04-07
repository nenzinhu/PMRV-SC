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
    ['licenciamento', 'licen', 'licenca', 'licenÃ§a', 'crlv', 'crlv-e', 'crlv e', 'documento', 'documentos', 'doc', 'docu', 'regularizacao', 'regularizaÃ§Ã£o'],
    ['placa', 'placas', 'identificacao', 'identificaÃ§Ã£o', 'sinal identificador'],
    ['cnh', 'habilitacao', 'habilitaÃ§Ã£o', 'carteira', 'motorista', 'condutor', 'permissao', 'permissÃ£o', 'ppd', 'acc'],
    ['documento', 'documentos', 'porte', 'obrigatorio', 'obrigatÃ³rio', 'apresentacao', 'apresentaÃ§Ã£o'],
    ['veiculo', 'veÃ­culo', 'carro', 'automovel', 'automÃ³vel', 'moto', 'motocicleta', 'motoneta', 'ciclomotor'],
    ['capacete', 'viseira', 'oculos', 'Ã³culos', 'protecao', 'proteÃ§Ã£o'],
    ['estacionar', 'estacionamento', 'parar', 'parada'],
    ['alcool', 'Ã¡lcool', 'embriaguez', 'bebida', 'etilometro', 'etilÃ´metro', 'bafometro', 'bafÃ´metro'],
    ['celular', 'telefone', 'smartphone', 'aparelho'],
    ['farol', 'farois', 'farÃ³is', 'luz', 'lanterna', 'iluminacao', 'iluminaÃ§Ã£o'],
    ['ultrapassagem', 'ultrapassar', 'passagem'],
    ['pedestre', 'faixa', 'travessia', 'passarela'],
    ['remocao', 'remoÃ§Ã£o', 'guincho', 'recolhimento'],
    ['retencao', 'retenÃ§Ã£o', 'reter']
  ];

  const SEARCH_INTENT_RULES = [
    {
      triggers: ['nao pagou', 'nÃ£o pagou', 'licenciamento atrasado', 'licenciamento vencido', 'nao licenciou', 'nÃ£o licenciou'],
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
    
    // Mapeamento baseado nos cabeÃ§alhos detectados ou Ã­ndices fixos (fallback)
    const headers = rows[0].map(normalizeHeader);
    console.log('[Infra] CabeÃ§alhos normalizados:', headers);
    
    const idx = {
      codigo: findHeaderIndex(headers, ['codigo infracao', 'codigo', 'cod']),
      descricao: findHeaderIndex(headers, ['descricao da infracao', 'descricao infracao', 'descricao']),
      artigo: findHeaderIndex(headers, ['art ctb decreto', 'artigo', 'art']),
      infrator: findHeaderIndex(headers, ['infrator']),
      valor: findHeaderIndex(headers, ['valor real r', 'valor real rs', 'valor']),
      categoria: findHeaderIndex(headers, ['categoria']),
      medida: findHeaderIndex(headers, ['medida administrativa', 'medida'])
    };

    // Ãndices de garantia (baseados na estrutura padrÃ£o: Cod, Desc, Art, Inf, Val, Cat, Med)
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

    console.log(`[Infra] Mapeamento concluÃ­do: ${records.length} registros processados.`);
    return records;
  }

  function render(records) {
    const elements = getElements();
    const container = document.getElementById('infra_list_container');
    if (!container) return;

    elements.totalCount.textContent = state.records.length.toLocaleString('pt-BR');
    elements.filteredCount.textContent = records.length.toLocaleString('pt-BR');
    elements.categoryCount.textContent = state.categories.length;

    if (!records.length) {
      container.innerHTML = '';
      elements.emptyState.hidden = false;
      return;
    }

    elements.emptyState.hidden = true;
    container.innerHTML = records.map((record, index) => {
      const catClass = categoryClass(record.categoria);
      const medClass = measureClass(record.medida);
      const cardId = `infra-card-${index}`;
      
      return `
        <div class="infra-card" id="${cardId}" data-cat="${record.categoria}" onclick="infra_toggleCard('${cardId}')">
          <div class="infra-card-header">
            <div class="infra-card-main">
              <span class="infra-card-code">${escapeHtml(record.codigo)}</span>
              <div class="infra-card-title">${escapeHtml(record.descricao)}</div>
            </div>
            <div class="infra-card-chevron">▼</div>
          </div>
          
          <div class="infra-card-content">
            <div class="infra-detail-row">
              <div class="infra-detail-item">
                <span class="infra-detail-label">Amparo Legal</span>
                <span class="infra-detail-value">${escapeHtml(record.artigo || 'Não informado')}</span>
              </div>
              <div class="infra-detail-item">
                <span class="infra-detail-label">Infrator</span>
                <span class="infra-detail-value">${escapeHtml(record.infrator || 'Não informado')}</span>
              </div>
              <div class="infra-detail-item">
                <span class="infra-detail-label">Valor da Multa</span>
                <span class="infra-detail-value" style="color:var(--primary); font-weight:800;">${escapeHtml(formatCurrency(record.valor))}</span>
              </div>
            </div>
            
            <div class="infra-badge-row">
              <span class="infra-badge ${catClass}">${escapeHtml(record.categoria)}</span>
              <span class="infra-measure ${medClass}">${escapeHtml(record.medida || 'Sem medida')}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  window.infra_toggleCard = (id) => {
    const card = document.getElementById(id);
    if (!card) return;
    
    // Fecha outros cards abertos (opcional, para foco Ãºnico)
    document.querySelectorAll('.infra-card.expanded').forEach(c => {
      if (c.id !== id) c.classList.remove('expanded');
    });
    
    card.classList.toggle('expanded');
    if (card.classList.contains('expanded')) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  function applyFilters() {
    const elements = getElements();
    const term = normalizeSearchText(elements.search.value);
    const category = elements.category.value;
    const measure = elements.measure.value;
    
    const filtered = state.records.filter(r => {
      if (term && r.search.indexOf(term) === -1) {
        // Tenta expansÃ£o de sinÃ´nimos se a busca direta falhar
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
      console.error('[Infra] Erro na decodificaÃ§Ã£o Base64:', e);
      return ''; 
    }
  }

  async function infra_init() {
    const elements = getElements();
    if (!elements.search) return;
    
    // Evita reinicializaÃ§Ã£o mÃºltipla de listeners
    if (state.initialized) {
        // Se jÃ¡ inicializado, apenas garante que a tabela esteja renderizada
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
            throw new Error("Base de dados vazia ou invÃ¡lida.");
        }
    } catch (err) {
      console.error('Erro ao carregar base de infraÃ§Ãµes:', err);
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

