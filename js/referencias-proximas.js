/**
 * Módulo: Referências Próximas via TomTom Along Route Search + Marcos 150m
 */

(function() {
  const TOMTOM_KEY = '3g2ZOIEsJUN2VTkHi6dYW8PuV4kiBTUu';
  const MAX_DETOUR_TIME = 900; // 15 minutos de desvio máximo
  
  let selectedCategories = ['7311', '7322', '7324', '7323', '9113', '9361009', '7321', '7326', '7315', '9361'];

  window.ref_prox_init = function() {
    ref_prox_atualizarGPS();
  };

  window.ref_prox_atualizarGPS = function() {
    const roadInput = document.getElementById('ref_prox_rodovia');
    const rodoviaAtual = window.GPS_MONITOR_STATE?.currentRoad;
    
    if (rodoviaAtual) {
      roadInput.value = rodoviaAtual;
    } else {
      roadInput.value = "Não detectada";
    }
  };

  window.ref_prox_toggleCat = function(btn, catId) {
    if (selectedCategories.includes(catId)) {
      selectedCategories = selectedCategories.filter(c => c !== catId);
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline');
    } else {
      selectedCategories.push(catId);
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-outline');
    }
  };

  window.ref_prox_buscar = async function() {
    const rodovia = document.getElementById('ref_prox_rodovia').value;
    const resultsContainer = document.getElementById('ref_prox_results');
    const statusEl = document.getElementById('ref_prox_status');
    const btnBusca = document.getElementById('btn-ref-prox-buscar');

    if (!rodovia || rodovia === "Não detectada") {
      alert("Selecione ou detecte uma rodovia via GPS primeiro.");
      return;
    }

    if (selectedCategories.length === 0) {
      alert("Selecione pelo menos uma categoria.");
      return;
    }

    btnBusca.disabled = true;
    btnBusca.innerText = "🔍 Buscando...";
    resultsContainer.innerHTML = "";
    statusEl.innerText = "Construindo rota e consultando TomTom...";

    try {
      const routePoints = buildRoutePoints(rodovia);
      if (!routePoints || routePoints.length < 2) {
        throw new Error("Geometria da rodovia não encontrada ou insuficiente para esta rodovia.");
      }

      const results = await fetchTomTomAlongRoute(routePoints, selectedCategories);
      renderResults(results, rodovia);
      statusEl.innerText = `Encontradas ${results.length} referências próximas.`;
    } catch (error) {
      console.error(error);
      statusEl.innerText = "Erro na busca: " + error.message;
      resultsContainer.innerHTML = `<p style="color:red; text-align:center;">${error.message}</p>`;
    } finally {
      btnBusca.disabled = false;
      btnBusca.innerText = "🔍 Buscar ao longo da rota";
    }
  };

  function buildRoutePoints(roadName) {
    const allData = window.GPS_RODOVIAS_SC || {};
    const points = allData[roadName];
    if (!points) return null;

    const step = Math.max(1, Math.floor(points.length / 1000));
    const sampled = [];
    for (let i = 0; i < points.length; i += step) {
      sampled.push({ lat: points[i].lat, lon: points[i].lng });
    }
    
    const last = points[points.length - 1];
    if (sampled[sampled.length - 1].lat !== last.lat) {
      sampled.push({ lat: last.lat, lon: last.lng });
    }

    return sampled;
  }

  async function fetchTomTomAlongRoute(points, categories) {
    const url = `https://api.tomtom.com/search/2/alongRoute/search.json?key=${TOMTOM_KEY}&maxDetourTime=${MAX_DETOUR_TIME}&limit=20&categorySet=${categories.join(',')}`;

    const body = {
      route: {
        points: points
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Erro API TomTom: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  }

  function findNearest150mReference(lat, lon, roadName) {
    const refsData = window.GRANDE_FLORIANOPOLIS_REFERENCIAS?.rows;
    if (!refsData) return null;

    let nearest = null;
    let minDist = Infinity;

    // Filtra referências apenas para a rodovia atual (opcional, mas recomendado)
    const filteredRefs = refsData.filter(r => r.rodovia === roadName);
    const source = filteredRefs.length > 0 ? filteredRefs : refsData;

    source.forEach(ref => {
      const d = haversineDistance(lat, lon, ref.latitude, ref.longitude);
      if (d < minDist) {
        minDist = d;
        nearest = ref;
      }
    });

    return { ref: nearest, distance: minDist };
  }

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function renderResults(results, roadName) {
    const container = document.getElementById('ref_prox_results');
    
    if (results.length === 0) {
      container.innerHTML = `<div class="card" style="text-align:center; padding:20px; color:var(--muted);">Nenhuma referência encontrada para as categorias selecionadas nesta rodovia via TomTom.</div>`;
      return;
    }

    results.sort((a, b) => a.dist - b.dist);

    results.forEach(poi => {
      const name = poi.poi.name;
      const address = poi.address.freeformAddress;
      const distRoute = poi.dist;
      const detour = poi.detourTime;
      const category = poi.poi.categories ? poi.poi.categories[0] : 'POI';
      
      const nearest = findNearest150mReference(poi.position.lat, poi.position.lon, roadName);
      let refHtml = "";
      if (nearest && nearest.ref) {
        refHtml = `
          <div style="margin-top:8px; padding-top:8px; border-top:1px dashed var(--border); font-size:11px; color:var(--text);">
            <strong>📍 Marco mais próximo (150m):</strong><br>
            ${nearest.ref.rodovia} km ${nearest.ref.km_label} - ${nearest.ref.nome_local}<br>
            <span style="color:var(--muted);">Distância do POI até o marco: ${Math.round(nearest.distance)}m</span>
          </div>
        `;
      }

      const card = document.createElement('div');
      card.className = 'poi-card';
      card.style = `
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      `;

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <strong style="font-size:15px; color:var(--text);">${name}</strong>
          <span style="font-size:10px; padding:2px 6px; border-radius:4px; background:rgba(59,130,246,0.1); color:var(--primary); font-weight:700;">${category}</span>
        </div>
        <div style="font-size:12px; color:var(--label);">${address}</div>
        <div style="margin-top:6px; display:flex; gap:12px; font-size:11px; font-weight:600;">
          <span style="color:var(--success);">🛣️ Na rota: ${(distRoute/1000).toFixed(1)} km</span>
          <span style="color:var(--amber);">⏱️ Desvio: ${Math.round(detour/60)} min</span>
        </div>
        ${refHtml}
        <button class="btn btn-sm" style="margin-top:10px; width:100%;" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${poi.position.lat},${poi.position.lon}', '_blank')">🗺️ Abrir no Google Maps</button>
      `;
      container.appendChild(card);
    });
  }

  const originalGo = window.go;
  window.go = function(screenId) {
    if (originalGo) originalGo(screenId);
    if (screenId === 'referencias-proximas') {
      ref_prox_init();
    }
  };

})();
