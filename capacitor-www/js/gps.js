/**
 * Logica de GPS para identificacao de rodovia/KM e descricao legivel do local.
 * Quando nao houver rodovia mapeada, tenta obter endereco aproximado por reverse geocoding.
 */

const GPS_RODOVIAS_BASE = {
    "SC-401": [
        { km: 0, lat: -27.581512, lng: -48.513470 },
        { km: 19.3, lat: -27.434800, lng: -48.463500 }
    ]
};

const GPS_REVERSE_CACHE = new Map();

function gps_formatarKm(km) {
    return typeof km === 'number' ? km.toFixed(3).replace('.', ',') : '---';
}

function gps_formatarRodoviaKm(rodovia, km) {
    if (!rodovia || typeof km !== 'number') {
        return 'Local nao identificado';
    }

    return `${rodovia}, km ${gps_formatarKm(km)}`;
}

function gps_montarEnderecoLegivel(data) {
    const address = data?.address || {};
    const via = address.road || address.pedestrian || address.cycleway || address.footway || '';
    const numero = address.house_number || '';
    const bairro = address.suburb || address.neighbourhood || address.city_district || address.village || '';
    const cidade = address.city || address.town || address.village || address.municipality || '';
    const uf = address.state_code || address.state || '';

    const linhaVia = [via, numero].filter(Boolean).join(', ');
    const linhaCidade = [bairro, cidade, uf].filter(Boolean).join(' - ');
    const texto = [linhaVia, linhaCidade].filter(Boolean).join(' | ');

    return texto || data?.display_name || 'Endereco aproximado indisponivel';
}

async function gps_resolverEndereco(latitude, longitude) {
    const cacheKey = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
    if (GPS_REVERSE_CACHE.has(cacheKey)) {
        return GPS_REVERSE_CACHE.get(cacheKey);
    }

    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&zoom=18&addressdetails=1&accept-language=pt-BR`;
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const endereco = gps_montarEnderecoLegivel(data);
        GPS_REVERSE_CACHE.set(cacheKey, endereco);
        return endereco;
    } catch (error) {
        console.warn('Falha ao resolver endereco por GPS:', error);
        return 'Endereco aproximado indisponivel';
    }
}

function gps_atualizarHeaderLocal(texto) {
    const header = document.getElementById('header-gps-txt');
    if (header) {
        header.textContent = texto || 'Local indisponivel';
    }
}

function gps_setResultado(payload) {
    const box = document.getElementById('pmrv_gps_result');
    if (!box) return;

    const accuracy = payload && typeof payload.accuracy === 'number' ? `${payload.accuracy.toFixed(0)} m` : '---';
    const rotuloLocal = payload?.rotuloLocal || 'Nao identificado';
    const km = payload?.encontrado && typeof payload.km === 'number' ? gps_formatarKm(payload.km) : '---';
    const descricao = payload?.descricao || '---';

    document.getElementById('pmrv_gps_rodovia').textContent = rotuloLocal;
    document.getElementById('pmrv_gps_km').textContent = km;
    document.getElementById('pmrv_gps_acc').textContent = accuracy;
    document.getElementById('pmrv_gps_desc').textContent = descricao;
    document.getElementById('pmrv_gps_msg').textContent = payload?.mensagem || '';
    box.classList.remove('hidden');
}

async function gps_preencherSelects() {
    let banco = GPS_RODOVIAS_BASE;
    try {
        const data = await PMRV.dataManager.loadResource('gps_data', 'data/gps_data_sc.json');
        if (data) {
            window.GPS_RODOVIAS_SC = data;
            banco = data;
        }
    } catch (err) {
        console.error('Erro ao carregar base de GPS, usando fallback:', err);
    }

    if (!banco) return;

    const selectIds = ['pmrv_rodovia', 'pat_manual_rodovia'];
    const rodovias = Object.keys(banco).sort((a, b) => {
        if (a.startsWith('SC-') && !b.startsWith('SC-')) return -1;
        if (!a.startsWith('SC-') && b.startsWith('SC-')) return 1;
        return a.localeCompare(b);
    });

    selectIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        const valorAtual = el.value;
        el.innerHTML = '';

        if (id === 'pmrv_rodovia') {
            const optNone = document.createElement('option');
            optNone.value = '';
            optNone.textContent = '-- Selecione a Rodovia --';
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
            optOutra.textContent = 'Outra...';
            el.appendChild(optOutra);
        }

        if (valorAtual) {
            el.value = valorAtual;
        }
    });
}

async function gps_descreverLocal(latitude, longitude) {
    const resultadoRodovia = gps_identificarRodoviaKM(latitude, longitude);

    if (resultadoRodovia) {
        return {
            encontrado: true,
            rodovia: resultadoRodovia.rodovia,
            km: resultadoRodovia.km,
            rotuloLocal: resultadoRodovia.rodovia,
            descricao: gps_formatarRodoviaKm(resultadoRodovia.rodovia, resultadoRodovia.km),
            mensagem: 'Rodovia e KM mais proximos identificados automaticamente.'
        };
    }

    const endereco = await gps_resolverEndereco(latitude, longitude);
    return {
        encontrado: false,
        rodovia: null,
        km: null,
        rotuloLocal: 'Endereco',
        descricao: endereco,
        mensagem: 'Endereco aproximado obtido a partir do GPS.'
    };
}

function gps_obterLocalizacao() {
    if (!navigator.geolocation) {
        alert('GPS nao suportado pelo seu dispositivo.');
        return;
    }

    const btnHome = document.querySelector('.btn-gps-minimal[data-click="gps_obterLocalizacao()"]');
    const btnPmrv = document.getElementById('btn-gps-localizar-pmrv');
    const activeBtn = btnPmrv || btnHome;

    let originalText = '';
    if (activeBtn) {
        originalText = activeBtn.innerHTML;
        activeBtn.innerHTML = 'Localizando...';
        activeBtn.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            const resultado = await gps_descreverLocal(latitude, longitude);

            if (resultado.encontrado) {
                const rodoviaEl = document.getElementById('pmrv_rodovia');
                const kmEl = document.getElementById('pmrv_km');

                if (rodoviaEl) {
                    rodoviaEl.value = resultado.rodovia;
                    if (typeof pmrv_verificarRodovia === 'function') pmrv_verificarRodovia();
                }

                if (kmEl) {
                    kmEl.value = gps_formatarKm(resultado.km);
                    if (typeof pmrv_atualizar === 'function') pmrv_atualizar();
                }
            }

            gps_setResultado({
                accuracy,
                rotuloLocal: resultado.rotuloLocal,
                rodovia: resultado.rodovia,
                km: resultado.km,
                descricao: resultado.descricao,
                encontrado: resultado.encontrado,
                mensagem: resultado.mensagem
            });
            gps_atualizarHeaderLocal(resultado.descricao);

            alert(`📍 Localizacao identificada!\n\n${resultado.descricao}\n\nPrecisao: ${accuracy.toFixed(0)} metros.`);

            if (activeBtn) {
                activeBtn.innerHTML = originalText;
                activeBtn.disabled = false;
            }
        },
        (err) => {
            let msg = 'Erro ao obter GPS';
            if (err.code === 1) msg = 'Permissao de GPS negada.';
            else if (err.code === 2) msg = 'Posicao indisponivel.';
            else if (err.code === 3) msg = 'Tempo esgotado.';

            gps_setResultado({
                encontrado: false,
                rotuloLocal: 'GPS',
                descricao: 'Local indisponivel',
                mensagem: msg
            });
            gps_atualizarHeaderLocal('GPS indisponivel');
            alert(msg);

            if (activeBtn) {
                activeBtn.innerHTML = originalText;
                activeBtn.disabled = false;
            }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
}

function gps_identificarRodoviaKM(lat, lng) {
    let melhorRodovia = null;
    let melhorKm = 0;
    let menorDistanciaSq = Infinity;

    const bancoRodovias = window.GPS_RODOVIAS_SC || GPS_RODOVIAS_BASE;
    const thresholdDeg = 0.015;

    for (const rodovia in bancoRodovias) {
        const pontos = bancoRodovias[rodovia];

        for (let i = 0; i < pontos.length - 1; i++) {
            const p1 = pontos[i];
            const p2 = pontos[i + 1];

            const minLat = Math.min(p1.lat, p2.lat) - thresholdDeg;
            const maxLat = Math.max(p1.lat, p2.lat) + thresholdDeg;
            const minLng = Math.min(p1.lng, p2.lng) - thresholdDeg;
            const maxLng = Math.max(p1.lng, p2.lng) + thresholdDeg;

            if (lat < minLat || lat > maxLat || lng < minLng || lng > maxLng) continue;

            const projetado = gps_projetarPonto(lat, lng, p1.lat, p1.lng, p2.lat, p2.lng);
            const dLat = lat - projetado.lat;
            const dLng = lng - projetado.lng;
            const distSq = dLat * dLat + dLng * dLng;

            if (distSq < menorDistanciaSq) {
                menorDistanciaSq = distSq;
                melhorRodovia = rodovia;

                const d12Sq = (p2.lat - p1.lat) * (p2.lat - p1.lat) + (p2.lng - p1.lng) * (p2.lng - p1.lng);
                const d1pSq = (projetado.lat - p1.lat) * (projetado.lat - p1.lat) + (projetado.lng - p1.lng) * (projetado.lng - p1.lng);
                const proporcao = d12Sq > 0 ? Math.sqrt(d1pSq / d12Sq) : 0;
                melhorKm = p1.km + (p2.km - p1.km) * proporcao;
            }
        }
    }

    if (melhorRodovia) {
        const projetadoFinal = gps_projetarPontoParaKm(lat, lng, melhorRodovia, melhorKm);
        const distReal = gps_distancia(lat, lng, projetadoFinal.lat, projetadoFinal.lng);
        if (distReal < 1.0) {
            return { rodovia: melhorRodovia, km: melhorKm };
        }
    }

    return null;
}

function gps_distancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function gps_projetarPonto(px, py, ax, ay, bx, by) {
    const r2 = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
    if (r2 === 0) return { lat: ax, lng: ay };
    let t = ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / r2;
    t = Math.max(0, Math.min(1, t));
    return {
        lat: ax + t * (bx - ax),
        lng: ay + t * (by - ay)
    };
}

function gps_projetarPontoParaKm(lat, lng, rodovia, km) {
    const pontos = (window.GPS_RODOVIAS_SC || GPS_RODOVIAS_BASE)[rodovia];
    if (!pontos) return { lat, lng };

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
        { lat: -27.5000, lng: -48.4900, msg: 'Simulando SC-401 proximo ao Square' },
        { lat: -27.6550, lng: -48.4980, msg: 'Simulando SC-405 Rio Tavares' },
        { lat: -28.4800, lng: -49.0000, msg: 'Simulando rodovia no Sul de SC' }
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
            kmEl.value = gps_formatarKm(resultado.km);
            if (typeof pmrv_atualizar === 'function') pmrv_atualizar();
        }

        const descricao = gps_formatarRodoviaKm(resultado.rodovia, resultado.km);
        gps_setResultado({
            accuracy: 0,
            rotuloLocal: resultado.rodovia,
            rodovia: resultado.rodovia,
            km: resultado.km,
            descricao,
            encontrado: true,
            mensagem: ponto.msg
        });
        gps_atualizarHeaderLocal(descricao);
        alert(`MODO TESTE\n\n${ponto.msg}\n\n${descricao}`);
    } else {
        gps_setResultado({
            accuracy: 0,
            rotuloLocal: 'Endereco',
            descricao: 'Endereco aproximado indisponivel no modo teste.',
            encontrado: false,
            mensagem: 'Nenhuma rodovia identificada para o ponto de teste.'
        });
        gps_atualizarHeaderLocal('Endereco aproximado indisponivel no modo teste.');
        alert('MODO TESTE\n\nNenhuma rodovia identificada para os pontos de teste.');
    }
}

function gps_iniciarMonitoramentoRodape() {
    if (!navigator.geolocation) {
        console.warn('Geolocalizacao nao suportada para o rodape.');
        return;
    }

    navigator.geolocation.watchPosition(
        async (pos) => {
            const { latitude, longitude } = pos.coords;
            const resultado = await gps_descreverLocal(latitude, longitude);
            gps_atualizarHeaderLocal(resultado.descricao);
        },
        (err) => {
            console.warn('Monitoramento GPS (cabecalho):', err.message);
            gps_atualizarHeaderLocal('GPS indisponivel');
        },
        {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 20000
        }
    );
}

window.gps_preencherSelects = gps_preencherSelects;
window.gps_obterLocalizacao = gps_obterLocalizacao;
window.gps_identificarRodoviaKM = gps_identificarRodoviaKM;
window.gps_simularLocalizacao = gps_simularLocalizacao;
window.gps_descreverLocal = gps_descreverLocal;

document.addEventListener('DOMContentLoaded', () => {
    gps_preencherSelects();
    setTimeout(gps_iniciarMonitoramentoRodape, 1500);
});
