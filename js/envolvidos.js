/* ---------------------------------------------------------------
   ENVOLVIDOS - REGISTRO DOS ENVOLVIDOS DO SINISTRO
--------------------------------------------------------------- */

// Função auxiliar para capitalizar nomes e frases
function env_capitalize(input) {
  let val = input.value;
  if (!val) return;

  // Se for o início de uma frase ou um nome
  // Capitaliza a primeira letra de cada palavra (para nomes/marcas) 
  // ou apenas a primeira da frase (para relatos).
  
  if (input.classList.contains('relato')) {
    // Apenas primeira letra da frase
    input.value = val.charAt(0).toUpperCase() + val.slice(1);
  } else {
    // Primeira letra de cada palavra (Nomes, Marcas, Ruas)
    input.value = val.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  }
}

function env_adicionar() {
  const lista = document.getElementById('env_lista');
  const n = lista.querySelectorAll('.person-card').length + 1;

  const card = document.createElement('div');
  card.className = 'person-card';
  card.innerHTML = `
    <div class="person-card-header">
      <span class="person-card-title">Envolvido ${n}</span>
      ${n > 1 ? `<button class="btn btn-danger" style="padding:5px 10px;font-size:12px;" data-click="env_removerCard(this)">✕ Remover</button>` : ''}
    </div>
    <div class="form-grid">
      <div class="form-row form-row-2">
        <div class="form-field">
          <label class="field-label">Tipo</label>
          <select class="tipo">
            <option value="ENVOLVIDO">ENVOLVIDO</option>
            <option value="TESTEMUNHA">TESTEMUNHA</option>
          </select>
        </div>
        <div class="form-field">
          <label class="field-label">Contato</label>
          <input type="tel" class="contato" data-input="mascaraTelefone(this)" placeholder="(00) 00000-0000" maxlength="15" autocomplete="tel">
        </div>
      </div>
      
      <div class="form-field">
        <label class="field-label">Nome Completo</label>
        <input type="text" class="nome" placeholder="Nome Completo" spellcheck="true" autocomplete="name" onblur="env_capitalize(this)">
      </div>

      <div class="form-field">
        <label class="field-label">Veículo (Marca / Modelo / Placa)</label>
        <input type="text" class="marca" placeholder="Ex: Vw Gol ABC-1234" spellcheck="false" onblur="env_capitalize(this)">
      </div>

      <!-- Endereço Estruturado -->
      <div class="space-y-3" style="border: 1px solid rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.1);">
        <label class="field-label-orange" style="margin-bottom:10px; display:block;">📍 Endereço de Residência</label>
        <div class="form-row" style="display:flex; gap:8px;">
          <div class="form-field" style="flex:3">
            <label class="field-label">Rua / Logradouro</label>
            <input type="text" class="end_rua" placeholder="Rua..." onblur="env_capitalize(this)">
          </div>
          <div class="form-field" style="flex:1">
            <label class="field-label">Nº</label>
            <input type="text" class="end_num" placeholder="000">
          </div>
        </div>
        <div class="form-field">
          <label class="field-label">Complemento / Apto</label>
          <input type="text" class="end_comp" placeholder="Bloco, Apto..." onblur="env_capitalize(this)">
        </div>
        <div class="form-row" style="display:flex; gap:8px;">
          <div class="form-field" style="flex:1">
            <label class="field-label">Bairro</label>
            <input type="text" class="end_bairro" placeholder="Bairro" onblur="env_capitalize(this)">
          </div>
          <div class="form-field" style="flex:1">
            <label class="field-label">Cidade</label>
            <input type="text" class="end_cidade" placeholder="Cidade" onblur="env_capitalize(this)">
          </div>
          <div class="form-field" style="flex:0 0 80px">
            <label class="field-label">UF</label>
            <select class="end_uf" style="width:100%; text-transform:uppercase;">
              <option value="AC">AC</option>
              <option value="AL">AL</option>
              <option value="AP">AP</option>
              <option value="AM">AM</option>
              <option value="BA">BA</option>
              <option value="CE">CE</option>
              <option value="DF">DF</option>
              <option value="ES">ES</option>
              <option value="GO">GO</option>
              <option value="MA">MA</option>
              <option value="MT">MT</option>
              <option value="MS">MS</option>
              <option value="MG">MG</option>
              <option value="PA">PA</option>
              <option value="PB">PB</option>
              <option value="PR">PR</option>
              <option value="PE">PE</option>
              <option value="PI">PI</option>
              <option value="RJ">RJ</option>
              <option value="RN">RN</option>
              <option value="RS">RS</option>
              <option value="RO">RO</option>
              <option value="RR">RR</option>
              <option value="SC" selected>SC</option>
              <option value="SP">SP</option>
              <option value="SE">SE</option>
              <option value="TO">TO</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-field">
        <label class="field-label">Relato / Dinâmica</label>
        <textarea class="relato" rows="3" placeholder="Descreva os fatos..." spellcheck="true" onblur="env_capitalize(this)"></textarea>
      </div>

      <label class="foto-label">
        📸 Tirar ou Anexar Fotos
        <input type="file" accept="image/*" multiple style="display:none;" data-change="env_miniatura(this)">
      </label>
      <div class="foto-grid"></div>
      <div class="foto-actions" style="display:none;gap:6px;flex-wrap:wrap;margin-top:4px;">
        <button type="button" class="btn btn-sm btn-whats" data-click="env_compartilharFotos(this)">📲 Enviar Fotos p/ WhatsApp</button>
        <button type="button" class="btn btn-sm btn-danger" data-click="env_limparFotos(this)">🗑 Remover Todas</button>
      </div>
    </div>
  `;

  lista.appendChild(card);
  if (n > 1) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function env_removerCard(btn) {
  btn.closest('.person-card').remove();
  env_renumerar();
}

function env_renumerar() {
  document.querySelectorAll('#env_lista .person-card').forEach((c, i) => {
    c.querySelector('.person-card-title').textContent = `Envolvido ${i + 1}`;
  });
}

function env_miniatura(input) {
  const card = input.closest('.person-card');
  const container = card.querySelector('.foto-grid');
  const actions = card.querySelector('.foto-actions');
  if (input.files) {
    Array.from(input.files).forEach(arquivo => {
      const r = new FileReader();
      r.onload = e => {
        const wrap = document.createElement('div');
        wrap.className = 'foto-wrap';
        const img = document.createElement('img');
        img.src = e.target.result;
        img.onclick = () => env_abrirGaleria(card);
        const del = document.createElement('button');
        del.className = 'foto-del';
        del.innerHTML = '✕';
        del.onclick = (ev) => {
          ev.stopPropagation();
          wrap.remove();
          if (!container.querySelectorAll('.foto-wrap').length) actions.style.display = 'none';
        };
        wrap.appendChild(img);
        wrap.appendChild(del);
        container.appendChild(wrap);
        actions.style.display = 'flex';
      };
      r.readAsDataURL(arquivo);
    });
  }
}

function env_abrirGaleria(card) {
  const fotos = Array.from(card.querySelectorAll('.foto-grid img'));
  if (!fotos.length) return;
  const nome    = (card.querySelector('.nome')?.value    || '').trim() || 'ENVOLVIDO';
  const veiculo = (card.querySelector('.marca')?.value   || '').trim();
  const overlay = document.getElementById('foto-galeria-overlay');
  overlay.querySelector('.foto-galeria-titulo').textContent = '📸 ' + nome;
  const grid = overlay.querySelector('.foto-galeria-grid');
  grid.innerHTML = '';
  fotos.forEach(f => {
    const img = document.createElement('img');
    img.src = f.src;
    img.onclick = () => env_verFoto(f.src);
    grid.appendChild(img);
  });
  overlay.dataset.nome    = nome;
  overlay.dataset.veiculo = veiculo;
  overlay.dataset.qtd     = fotos.length;
  overlay._fotos = fotos.map(f => f.src);
  overlay.classList.add('open');
}

function env_fecharGaleria() {
  document.getElementById('foto-galeria-overlay').classList.remove('open');
}

function env_verFoto(src) {
  const w = window.open('', '_blank');
  w.document.write(`<html><body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;"><img src="${src}" style="max-width:100%;max-height:100vh;border-radius:8px;"></body></html>`);
}

function env_whatsappFotos() {
  const overlay = document.getElementById('foto-galeria-overlay');
  const nome    = overlay.dataset.nome    || 'ENVOLVIDO';
  const veiculo = overlay.dataset.veiculo || '';
  const srcs = overlay._fotos || [];
  if (!srcs.length) return;

  const arquivos = srcs.map((src, i) => {
    const arr = src.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let j = 0; j < bstr.length; j++) u8arr[j] = bstr.charCodeAt(j);
    return new File([u8arr], `${nome.replace(/\s+/g,'_')}_foto${i+1}.jpg`, { type: mime });
  });

  const linhas = [
    `*📸 Registros Fotográficos — Sinistro de Trânsito*`,
    `👤 *Envolvido:* ${nome}`,
    veiculo ? `🚗 *Veículo:* ${veiculo}` : '',
    `🗓️ *Data:* ${new Date().toLocaleDateString('pt-BR')}`,
    `📷 *Fotos:* ${srcs.length} imagem(ns) registrada(s)`
  ].filter(Boolean).join('\n');
  const txt = linhas;

  if (navigator.canShare && navigator.canShare({ files: arquivos })) {
    navigator.share({
      title: `Fotos — ${nome}`,
      text: txt,
      files: arquivos
    }).catch(() => {});
    return;
  }

  arquivos.forEach(f => {
    const url = URL.createObjectURL(f);
    const a = document.createElement('a');
    a.href = url;
    a.download = f.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  setTimeout(() => window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank'), 900);
}

function env_compartilharFotos(btn) {
  const card = btn.closest('.person-card');
  env_abrirGaleria(card);
}

function env_limparFotos(btn) {
  const card = btn.closest('.person-card');
  card.querySelector('.foto-grid').innerHTML = '';
  btn.closest('.foto-actions').style.display = 'none';
}

function env_montarTexto() {
  const cards = document.querySelectorAll('#env_lista .person-card');
  let txt = '*RELATÓRIO DOS ENVOLVIDOS DO SINISTRO*\n';
  txt += 'Data: ' + new Date().toLocaleDateString('pt-BR') + '\n';
  txt += '--------------------------\n';

  cards.forEach((c, i) => {
    const nome     = (c.querySelector('.nome')?.value     || '').trim();
    const marca    = (c.querySelector('.marca')?.value    || '').trim();
    const contato  = (c.querySelector('.contato')?.value  || '').trim();
    const relato   = (c.querySelector('.relato')?.value   || '').trim();
    const tipo     = (c.querySelector('.tipo')?.value     || 'ENVOLVIDO').toUpperCase();

    // Montar endereço consolidado
    const rua    = (c.querySelector('.end_rua')?.value    || '').trim();
    const num    = (c.querySelector('.end_num')?.value    || '').trim();
    const comp   = (c.querySelector('.end_comp')?.value   || '').trim();
    const bairro = (c.querySelector('.end_bairro')?.value || '').trim();
    const cid    = (c.querySelector('.end_cidade')?.value || '').trim();
    const uf     = (c.querySelector('.end_uf')?.value     || '').trim().toUpperCase();

    let endereco = '';
    if (rua) endereco += rua;
    if (num) endereco += `, nº ${num}`;
    if (comp) endereco += ` (${comp})`;
    if (bairro) endereco += ` - ${bairro}`;
    if (cid) endereco += ` - ${cid}/${uf || 'SC'}`;

    txt += `*${tipo} ${i + 1}*\n`;
    if (nome)     txt += `- Nome: ${nome}\n`;
    if (marca)    txt += `- Veículo: ${marca}\n`;
    if (contato)  txt += `- Contato: ${contato}\n`;
    if (endereco) txt += `- Residência: ${endereco}\n`;
    if (relato)   txt += `- Relato: ${relato}\n`;
    txt += '\n';
  });

  return txt.trim();
}

function env_copiar() {
  navigator.clipboard.writeText(env_montarTexto()).then(() => {
    const btn = document.querySelector('#screen-envolvidos .btn-success');
    const old = btn.innerHTML;
    btn.innerHTML = '✅ Copiado!';
    setTimeout(() => btn.innerHTML = old, 2000);
  });
}

function env_whatsapp() {
  window.open('https://wa.me/?text=' + encodeURIComponent(env_montarTexto()), '_blank');
}
