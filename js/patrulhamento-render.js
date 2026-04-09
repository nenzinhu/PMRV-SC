window.PMRV = window.PMRV || {};

PMRV.patrulhamentoRender = (function() {
  function buildListItemHtml(vehicle, index, total, escapeHtml) {
    const number = total - index;

    return `
      <div style="background:var(--primary); color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:900; flex-shrink:0;">
        ${number}
      </div>
      <div style="flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="font-size:18px; color:var(--primary); font-family:monospace; letter-spacing:1px;">${escapeHtml(vehicle.placa)}</strong>
          <span style="font-size:10px; color:var(--muted);">${vehicle.hora}</span>
        </div>
        <div style="font-size:13px; color:#fff; font-weight:600; margin:2px 0;">${escapeHtml(vehicle.infracao.nome)}</div>
        <div style="font-size:11px; color:var(--muted);">${escapeHtml(vehicle.local)}</div>
      </div>
      <button class="btn btn-sm btn-danger" style="padding:6px 10px; border-radius:8px;" onclick="pat_removerVeiculo(${index})">✕</button>
    `;
  }

  return {
    buildListItemHtml
  };
})();
