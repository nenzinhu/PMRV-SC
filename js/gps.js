/**
 * Lógica de GPS para identificação de Rodovia e KM (PMRv SC)
 * Utiliza base de dados gerada a partir de Shapefile oficial
 */

// Fallback caso a base de dados externa não carregue
const GPS_RODOVIAS_BASE = {
    "SC-401": [
        { km: 0, lat: -27.581512, lng: -48.513470 },
        { km: 19.3, lat: -27.434800, lng: -48.463500 }
    ]
};

function gps_setResultado(payload) {
    const box = document.getElementById('pmrv_gps_result');
    if (!box) return;

    const latitude = payload && typeof payload.latitude === 'number' ? payload.latitude.toFixed(6) : '---';
    const longitude = payload && typeof payload.longitude === 'number' ? payload.longitude.toFixed(6) : '---';
    const accuracy = payload && typeof payload.accuracy === 'number' ? `${payload.accuracy.toFixed(0)} m` : '---';
    const rodovia = payload && payload.encontrado ? payload.rodovia : 'Não identificada';
    const km = payload && payload.encontrado && typeof payload.km === 'number'
        ? payload.km.toFixed(3).replace('.', ',')
        : '---';

    document.getElementById('pmrv_gps_lat').textContent = latitude;
    document.getElementById('pmrv_gps_lng').textContent = longitude;
    document.getElementById('pmrv_gps_acc').textContent = accuracy;
    document.getElementById('pmrv_gps_rodovia').textContent = rodovia || '---';
    document.getElementById('pmrv_gps_km').textContent = km;
    document.getElementById('pmrv_gps_msg').textContent = payload && payload.mensagem ? payload.mensagem : '';
    box.classList.remove('hidden');
}

/**
 * Preenche os selects de rodovias do sistema com os dados carregados de SC.
 */
function gps_preencherSelects() {
    const banco = window.GPS_RODOVIAS_SC || GPS_RODOVIAS_BASE;
    if (!banco) return;

    const selectIds = ['pmrv_rodovia', 'pat_manual_rodovia'];
    const rodovias = Object.keys(banco).sort((a, b) => {
        // Ordenação inteligente: SC-XXX primeiro, depois Acessos
        if (a.startsWith('SC-') && !b.startsWith('SC-')) return -1;
        if (!a.startsWith('SC-') && b.startsWith('SC-')) return 1;
        return a.localeCompare(b);
    });

    selectIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        const valorAtual = el.value;
        el.innerHTML = '';

        // Adicionar opção vazia/padrão se for o caso
        if (id === 'pmrv_rodovia') {
            const optNone = document.createElement('option');
            optNone.value = "";
            optNone.textContent = "-- Selecione a Rodovia --";
            el.appendChild(optNone);
        }

        rodovias.forEach(rod => {
            const opt = document.createElement('option');
            opt.value = rod;
            opt.textContent = rod;
            el.appendChild(opt);
        });

        if (id === 'pat_manual_rodovia') {
            const optOutra = document.createElement('option');
            optOutra.value = 'OUTRA';
            optOutra.textContent = '✏️ Outra...';
            el.appendChild(optOutra);
        }

        // Tentar restaurar valor anterior se ainda existir
        if (valorAtual) el.value = valorAtual;
    });
}

/**
 * Obtém localização atual e tenta identificar Rodovia/KM
 */
function gps_obterLocalizacao() {
    if (!navigator.geolocation) {
        alert("GPS não suportado pelo seu dispositivo.");
        return;
    }

    const btnHome = document.querySelector('.btn-gps-minimal[data-click="gps_obterLocalizacao()"]');
    const btnPmrv = document.getElementById('btn-gps-localizar-pmrv');
    const activeBtn = btnPmrv || btnHome;
    
    let originalText = "";
    if (activeBtn) {
        originalText = activeBtn.innerHTML;
        activeBtn.innerHTML = '⌛ Localizando...';
        activeBtn.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            console.log(`GPS: Lat ${latitude}, Lng ${longitude}, Precisão ${accuracy}m`);

            const resultado = gps_identificarRodoviaKM(latitude, longitude);
            
            if (resultado) {
                const rodoviaEl = document.getElementById('pmrv_rodovia');
                const kmEl = document.getElementById('pmrv_km');
                const kmStr = resultado.km.toFixed(3).replace('.', ',');

                if (rodoviaEl) {
                    rodoviaEl.value = resultado.rodovia;
                    if (typeof pmrv_verificarRodovia === 'function') pmrv_verificarRodovia();
                }
                if (kmEl) {
                    kmEl.value = kmStr;
                    if (typeof pmrv_atualizar === 'function') pmrv_atualizar();
                }

                gps_setResultado({
                    latitude,
                    longitude,
                    accuracy,
                    rodovia: resultado.rodovia,
                    km: resultado.km,
                    encontrado: true,
                    mensagem: 'Rodovia e KM mais próximos identificados e preenchidos automaticamente.'
                });
                alert(`📍 Localização Identificada!\n\n🛣️ Rodovia: ${resultado.rodovia}\n🏁 KM: ${kmStr}\n\n🎯 Precisão: ${accuracy.toFixed(0)} metros.`);
            } else {
                gps_setResultado({
                    latitude,
                    longitude,
                    accuracy,
                    encontrado: false,
                    mensagem: 'Nenhuma rodovia estadual de SC foi identificada em um raio aproximado de 1 km.'
                });
                alert(`Você está em:\nLat: ${latitude.toFixed(5)}\nLng: ${longitude.toFixed(5)}\n\nNenhuma rodovia estadual de SC foi identificada num raio de 1km.`);
            }

            if (activeBtn) {
                activeBtn.innerHTML = originalText;
                activeBtn.disabled = false;
            }
        },
        (err) => {
            let msg = "Erro ao obter GPS";
            if (err.code === 1) msg = "Permissão de GPS negada.";
            else if (err.code === 2) msg = "Posição indisponível.";
            else if (err.code === 3) msg = "Tempo esgotado.";
            
            gps_setResultado({
                encontrado: false,
                mensagem: msg
            });
            alert(msg);
            if (activeBtn) {
                activeBtn.innerHTML = originalText;
                activeBtn.disabled = false;
            }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
}

/**
 * Identifica a rodovia e interpola o KM baseado nas coordenadas.
 * Otimizado para grandes bases de dados.
 */
function gps_identificarRodoviaKM(lat, lng) {
    let melhorRodovia = null;
    let melhorKm = 0;
    let menorDistanciaSq = Infinity; // Usar distância ao quadrado para performance

    const bancoRodovias = window.GPS_RODOVIAS_SC || GPS_RODOVIAS_BASE;
    
    // Limite aproximado de 1km em graus (aproximadamente 0.01 graus)
    const thresholdDeg = 0.015; 

    for (const rodovia in bancoRodovias) {
        const pontos = bancoRodovias[rodovia];
        
        for (let i = 0; i < pontos.length - 1; i++) {
            const p1 = pontos[i];
            const p2 = pontos[i+1];

            // Filtro rápido por Bounding Box do segmento + margem
            const minLat = Math.min(p1.lat, p2.lat) - thresholdDeg;
            const maxLat = Math.max(p1.lat, p2.lat) + thresholdDeg;
            const minLng = Math.min(p1.lng, p2.lng) - thresholdDeg;
            const maxLng = Math.max(p1.lng, p2.lng) + thresholdDeg;

            if (lat < minLat || lat > maxLat || lng < minLng || lng > maxLng) continue;

            // Projeção do ponto no segmento
            const projetado = gps_projetarPonto(lat, lng, p1.lat, p1.lng, p2.lat, p2.lng);
            
            // Distância Euclidiana ao quadrado (mais rápido que Haversine para comparação)
            const dLat = lat - projetado.lat;
            const dLng = lng - projetado.lng;
            const distSq = dLat * dLat + dLng * dLng;

            if (distSq < menorDistanciaSq) {
                menorDistanciaSq = distSq;
                melhorRodovia = rodovia;
                
                // Interpolação do KM
                const d12Sq = (p2.lat-p1.lat)*(p2.lat-p1.lat) + (p2.lng-p1.lng)*(p2.lng-p1.lng);
                const d1pSq = (projetado.lat-p1.lat)*(projetado.lat-p1.lat) + (projetado.lng-p1.lng)*(projetado.lng-p1.lng);
                
                const proporcao = d12Sq > 0 ? Math.sqrt(d1pSq / d12Sq) : 0;
                melhorKm = p1.km + (p2.km - p1.km) * proporcao;
            }
        }
    }

    // Converter menorDistanciaSq para KM real (Haversine) apenas no final para o veredito
    if (melhorRodovia) {
        const projetadoFinal = gps_projetarPontoParaKm(lat, lng, melhorRodovia, melhorKm);
        const distReal = gps_distancia(lat, lng, projetadoFinal.lat, projetadoFinal.lng);
        
        if (distReal < 1.0) { // Limite de 1km
            return { rodovia: melhorRodovia, km: melhorKm };
        }
    }
    
    return null;
}

function gps_distancia(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function gps_projetarPonto(px, py, ax, ay, bx, by) {
    const r2 = (bx-ax)*(bx-ax) + (by-ay)*(by-ay);
    if (r2 === 0) return { lat: ax, lng: ay };
    let t = ((px-ax)*(bx-ax) + (py-ay)*(by-ay)) / r2;
    t = Math.max(0, Math.min(1, t));
    return {
        lat: ax + t * (bx-ax),
        lng: ay + t * (by-ay)
    };
}

// Auxiliar para pegar o ponto exato da rodovia/km identificado (aproximado)
function gps_projetarPontoParaKm(lat, lng, rodovia, km) {
    const pontos = (window.GPS_RODOVIAS_SC || GPS_RODOVIAS_BASE)[rodovia];
    if (!pontos) return { lat, lng };
    
    // Apenas busca o ponto de referência mais próximo ao KM identificado
    let melhorPonto = pontos[0];
    let menorDiff = Math.abs(pontos[0].km - km);
    
    for (const p of pontos) {
        const diff = Math.abs(p.km - km);
        if (diff < menorDiff) {
            menorDiff = diff;
            melhorPonto = p;
        }
    }
    return melhorPonto;
}

function gps_simularLocalizacao() {
    const pontosTeste = [
        { lat: -27.5000, lng: -48.4900, msg: 'Simulando SC-401 próximo ao Square' },
        { lat: -27.6550, lng: -48.4980, msg: 'Simulando SC-405 Rio Tavares' },
        { lat: -28.4800, lng: -49.0000, msg: 'Simulando Rodovia no Sul de SC' }
    ];

    const ponto = pontosTeste[Math.floor(Math.random() * pontosTeste.length)];
    const resultado = gps_identificarRodoviaKM(ponto.lat, ponto.lng);
    
    if (resultado) {
        const rodoviaEl = document.getElementById('pmrv_rodovia');
        const kmEl = document.getElementById('pmrv_km');
        if (rodoviaEl) {
            rodoviaEl.value = resultado.rodovia;
            if (typeof pmrv_verificarRodovia === 'function') pmrv_verificarRodovia();
        }
        if (kmEl) {
            kmEl.value = resultado.km.toFixed(3).replace('.', ',');
            if (typeof pmrv_atualizar === 'function') pmrv_atualizar();
        }
        gps_setResultado({
            latitude: ponto.lat,
            longitude: ponto.lng,
            accuracy: 0,
            rodovia: resultado.rodovia,
            km: resultado.km,
            encontrado: true,
            mensagem: ponto.msg
        });
        alert('🧪 MODO TESTE\n\n' + ponto.msg + '\n\nRodovia: ' + resultado.rodovia + '\nKM: ' + resultado.km.toFixed(3));
    } else {
        gps_setResultado({
            latitude: ponto.lat,
            longitude: ponto.lng,
            accuracy: 0,
            encontrado: false,
            mensagem: 'Nenhuma rodovia identificada para o ponto de teste.'
        });
        alert('🧪 MODO TESTE\n\nNenhuma rodovia identificada para os pontos de teste.');
    }
}

window.gps_preencherSelects = gps_preencherSelects;
window.gps_obterLocalizacao = gps_obterLocalizacao;
window.gps_identificarRodoviaKM = gps_identificarRodoviaKM;
window.gps_simularLocalizacao = gps_simularLocalizacao;

document.addEventListener('DOMContentLoaded', gps_preencherSelects);
