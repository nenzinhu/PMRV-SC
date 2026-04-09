window.PMRV = window.PMRV || {};

PMRV.patrulhamentoReport = (function() {
  function build(veiculos) {
    if (!Array.isArray(veiculos) || !veiculos.length) return '';

    let txt = `PATRULHAMENTO RODOVIARIO - PMRv SC\nData: ${veiculos[0].data}\n--------------------------\n\n`;

    veiculos.forEach((veiculo, index) => {
      txt += `${index + 1}. [${veiculo.placa}] as ${veiculo.hora}\n`;
      txt += `${veiculo.infracao.nome} (${veiculo.infracao.codigo})\n`;
      txt += `${veiculo.local}\n`;
      if (veiculo.obs) txt += `Obs: ${veiculo.obs}\n`;
      txt += '--------------------------\n\n';
    });

    txt += 'Gerado via PMRv Operacional';
    return txt;
  }

  function buildFileDate(veiculos) {
    if (!Array.isArray(veiculos) || !veiculos.length) return '';
    return String(veiculos[0].data || '').replace(/\//g, '-');
  }

  return {
    build,
    buildFileDate
  };
})();
