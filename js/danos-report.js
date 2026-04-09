window.PMRV = window.PMRV || {};

PMRV.danosReport = (function() {
  const MOTO_TABS = ['frente', 'tras', 'direita', 'esquerda'];
  const ID_TO_VIEW = { F: 'frontal', T: 'traseira', E: 'esquerda', D: 'direita' };
  const DEFAULT_MOTO_TAB_NAMES = {
    frente: 'FRENTE',
    tras: 'TRASEIRA',
    direita: 'DIREITA',
    esquerda: 'ESQUERDA'
  };

  function hasMotoAvaria(v360db) {
    return MOTO_TABS.some(tab => (v360db?.[tab] || []).some(item => item.dano !== null));
  }

  function countMotoAvarias(v360db) {
    return MOTO_TABS.reduce((sum, tab) => {
      return sum + (v360db?.[tab] || []).filter(item => item.dano !== null).length;
    }, 0);
  }

  function countVehicleAvarias(vehicle, uses360) {
    if (!vehicle) return 0;
    return uses360(vehicle.tipo)
      ? countMotoAvarias(vehicle.v360db)
      : Object.keys(vehicle.danos || {}).length;
  }

  function cloneMotoSnapshot(v360db) {
    return JSON.parse(JSON.stringify(v360db));
  }

  function buildMotoReport(v360db, tabNames, date) {
    if (!hasMotoAvaria(v360db)) return '';

    const names = tabNames || DEFAULT_MOTO_TAB_NAMES;
    const avarias = countMotoAvarias(v360db);
    let txt = `*VISTORIA DE MOTOCICLETA*\nData: ${date}`;
    txt += `\nAvarias registradas: ${avarias}`;
    txt += '\n---------------------------';

    MOTO_TABS.forEach(tab => {
      const itens = (v360db?.[tab] || []).filter(item => item.dano !== null);
      if (!itens.length) return;

      txt += `\n\n${names[tab] || tab}:`;
      [...itens].sort((a, b) => a.num - b.num).forEach(item => {
        txt += `\n• ${item.nome}: ${item.dano}`;
      });
    });

    txt += '\n\nObs.: relato baseado em condições visíveis no local, sem caráter pericial.';
    return txt;
  }

  function buildDiagramReport(options) {
    const {
      danos,
      date,
      diagramas,
      getLabel,
      tipo,
      vistaLabels
    } = options;

    const ids = Object.keys(danos || {});
    if (!ids.length) return '';

    let txt = `*RELATÓRIO DE DANOS APARENTES*\nTipo de veículo: ${getLabel(tipo).toUpperCase()}\nData: ${date}\n---------------------------`;
    const porVista = { frontal: [], traseira: [], esquerda: [], direita: [] };

    ids.forEach(id => {
      const vista = ID_TO_VIEW[id.charAt(0)];
      if (vista) porVista[vista].push(id);
    });

    Object.entries(porVista).forEach(([vista, pontos]) => {
      if (!pontos.length) return;
      txt += `\n\n${vistaLabels[vista].toUpperCase()}:`;
      pontos.forEach(id => {
        const cfg = diagramas[tipo][vista];
        const ponto = cfg.pontos.find(item => item.id === id);
        if (!ponto) return;
        const tipoDano = danos[id];
        txt += `\n• ${ponto.label}: ${tipoDano.charAt(0).toUpperCase() + tipoDano.slice(1)}`;
      });
    });

    txt += '\n\nObservação: relato baseado em avarias visíveis no local, sem caráter pericial.';
    return txt;
  }

  function buildMultipleReport(options) {
    const {
      date,
      diagramas,
      getLabel,
      motoTabNames,
      uses360,
      vehicles,
      vistaLabels
    } = options;

    if (!Array.isArray(vehicles) || !vehicles.length) return '';

    let txt = `*RELATÓRIO DE DANOS — MÚLTIPLOS VEÍCULOS*\nData: ${date}`;
    txt += `\nVeículos analisados: ${vehicles.length}`;
    txt += '\n===========================';

    vehicles.forEach((vehicle, index) => {
      txt += `\n\n*Veículo ${index + 1} — ${getLabel(vehicle.tipo)}*`;
      txt += '\n---------------------------';

      if (uses360(vehicle.tipo)) {
        MOTO_TABS.forEach(tab => {
          const itens = (vehicle.v360db?.[tab] || []).filter(item => item.dano !== null);
          if (!itens.length) return;

          txt += `\n\n${motoTabNames[tab] || tab}:`;
          [...itens].sort((a, b) => a.num - b.num).forEach(item => {
            txt += `\n• ${item.nome}: ${item.dano}`;
          });
        });
        return;
      }

      const porVista = { frontal: [], traseira: [], esquerda: [], direita: [] };
      Object.keys(vehicle.danos || {}).forEach(id => {
        const vista = ID_TO_VIEW[id.charAt(0)];
        if (vista) porVista[vista].push(id);
      });

      Object.entries(porVista).forEach(([vista, pontos]) => {
        if (!pontos.length) return;
        const cfg = diagramas[vehicle.tipo][vista];
        txt += `\n\n${vistaLabels[vista]}:`;
        pontos.forEach(id => {
          const ponto = cfg.pontos.find(item => item.id === id);
          if (!ponto) return;
          txt += `\n• ${ponto.label}: ${vehicle.danos[id]}`;
        });
      });
    });

    txt += '\n\nObs.: relato baseado em condições visíveis no local, sem caráter pericial.';
    return txt;
  }

  return {
    buildDiagramReport,
    buildMotoReport,
    buildMultipleReport,
    cloneMotoSnapshot,
    countVehicleAvarias,
    hasMotoAvaria
  };
})();
