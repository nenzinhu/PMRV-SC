window.PMRV = window.PMRV || {};

PMRV.danosRender = (function() {
  function buildSavedVehiclesHtml(savedVehicles, helpers) {
    return savedVehicles.map((vehicle, index) => {
      const emoji = helpers.getEmoji(vehicle.tipo);
      const label = helpers.getLabel(vehicle.tipo);
      const count = helpers.countVehicleAvarias(vehicle, helpers.uses360);

      return '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--surface);border:1px solid var(--border);border-radius:10px;margin-bottom:8px;">'
        + '<span style="font-size:26px;">' + emoji + '</span>'
        + '<div style="flex:1;">'
        + '<div style="font-weight:700;font-size:14px;">' + label + ' ' + (index + 1) + '</div>'
        + '<div style="font-size:12px;color:var(--label);">' + count + ' dano' + (count !== 1 ? 's' : '') + ' registrado' + (count !== 1 ? 's' : '') + '</div>'
        + '</div>'
        + '<button data-click="danRemoverSalvo(' + index + ')" style="font-size:12px;padding:4px 8px;color:#D82A2E;border:1px solid #D82A2E;border-radius:6px;background:transparent;cursor:pointer;">✕</button>'
        + '</div>';
    }).join('');
  }

  function buildV360PaletteHtml(parts, tabs, motoDb, helpers) {
    const placed = {};
    tabs.forEach(tab => {
      motoDb[tab].forEach(item => {
        placed[item.num] = { tab, item };
      });
    });

    const groups = {};
    const groupOrder = [];
    parts.forEach(part => {
      if (!groups[part.g]) {
        groups[part.g] = [];
        groupOrder.push(part.g);
      }
      groups[part.g].push(part);
    });

    let html = '';
    groupOrder.forEach(groupName => {
      html += `<div class="v360-pal-group"><div class="v360-pal-ghdr">${groupName}</div>`;
      groups[groupName].forEach(part => {
        const num = parseInt(part.n, 10);
        const placedItem = placed[num];
        if (!placedItem) return;

        const color = helpers.getDamageColor(placedItem.item.dano);
        const statusLabel = placedItem.item.dano || 'Pendente';
        const tabLabel = helpers.tabNames[placedItem.tab];

        html += `<div class="v360-pal-item" data-click="v360EditarResumo('${placedItem.tab}',${placedItem.item.id})" title="${part.t} — em ${tabLabel}">
          <div class="v360-pal-chip" style="background:${color};color:#fff;">${part.n}</div>
          <div class="v360-pal-name">${part.t}</div>
          <div class="v360-pal-badge" style="background:${color};color:#fff;">${statusLabel}</div>
        </div>`;
      });
      html += '</div>';
    });

    return html;
  }

  function buildV360SummaryHtml(tabs, motoDb, helpers) {
    const total = tabs.reduce((sum, tab) => sum + motoDb[tab].length, 0);
    const inspected = tabs.reduce((sum, tab) => sum + motoDb[tab].filter(item => item.dano !== null).length, 0);
    const avarias = tabs.reduce((sum, tab) => sum + motoDb[tab].filter(item => item.dano !== null).length, 0);
    const progress = total ? Math.round((inspected / total) * 100) : 0;

    let html = `<div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:4px;">
        <span>📋 Posicionadas: <b style="color:var(--text)">${total}/${total}</b> &nbsp;·&nbsp; Inspecionadas: <b style="color:var(--text)">${inspected}</b></span>
        <span>🚨 Avarias: <b style="color:${avarias ? '#ef4444' : '#22c55e'}">${avarias}</b></span>
      </div>
      <div style="height:6px;background:var(--border);border-radius:4px;overflow:hidden;">
        <div style="height:100%;width:${progress}%;background:${avarias ? '#e67e22' : '#22c55e'};border-radius:4px;transition:width .3s"></div>
      </div>
    </div>`;

    const damageTags = [];
    tabs.forEach(tab => {
      motoDb[tab].filter(item => item.dano !== null).forEach(item => {
        const color = helpers.getDamageColor(item.dano);
        const emoji = helpers.getDamageEmoji(item.dano);
        damageTags.push(`<span class="dan-tag" style="background:${color};color:#fff;cursor:pointer;" data-click="v360EditarResumo('${tab}',${item.id})" title="Clique para editar">${emoji} ${item.num}. ${item.nome} — ${item.dano}</span>`);
      });
    });

    if (damageTags.length) {
      html += `<div style="font-size:11px;font-weight:700;color:var(--label);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;">⚠️ Avarias detectadas</div><div>${damageTags.join('')}</div>`;
    } else if (inspected > 0) {
      html += '<div style="font-size:13px;color:#22c55e;text-align:center;padding:8px 0;">✅ Nenhuma avaria registrada.</div>';
    } else {
      html += '<div style="font-size:13px;color:var(--label);text-align:center;padding:8px 0;">Clique nos círculos na foto para classificar o dano.</div>';
    }

    return html;
  }

  return {
    buildSavedVehiclesHtml,
    buildV360PaletteHtml,
    buildV360SummaryHtml
  };
})();
