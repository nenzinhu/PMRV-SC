import json
import math
import os

# Caminho dos dados gerados
DATA_PATH = r'C:\Users\Nei\Desktop\PMRV-main\js\gps_data_sc.js'

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Raio da Terra em km
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat / 2) * math.sin(dLat / 2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dLon / 2) * math.sin(dLon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def projetar_ponto(px, py, ax, ay, bx, by):
    r2 = (bx-ax)**2 + (by-ay)**2
    if r2 == 0: return ax, ay
    t = ((px-ax)*(bx-ax) + (py-ay)*(by-ay)) / r2
    t = max(0, min(1, t))
    return ax + t * (bx-ax), ay + t * (by-ay)

def converter_lat_lng_para_km(lat_alvo, lng_alvo):
    # Carregar dados (limpando o prefixo JS)
    if not os.path.exists(DATA_PATH):
        return "Erro: Base de dados não encontrada. Gere os dados primeiro."

    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        json_str = content.split('window.GPS_RODOVIAS_SC = ')[1].rstrip(';\n')
        banco = json.loads(json_str)

    melhor_rodovia = None
    melhor_km = 0
    menor_distancia = float('inf')

    for rodovia, pontos in banco.items():
        for i in range(len(pontos) - 1):
            p1 = pontos[i]
            p2 = pontos[i+1]

            # Projeta o ponto na reta entre p1 e p2
            proj_lat, proj_lng = projetar_ponto(lat_alvo, lng_alvo, p1['lat'], p1['lng'], p2['lat'], p2['lng'])
            dist = haversine_distance(lat_alvo, lng_alvo, proj_lat, proj_lng)

            if dist < menor_distancia:
                menor_distancia = dist
                melhor_rodovia = rodovia
                
                # Interpolação do KM
                d12 = haversine_distance(p1['lat'], p1['lng'], p2['lat'], p2['lng'])
                d1p = haversine_distance(p1['lat'], p1['lng'], proj_lat, proj_lng)
                proporcao = d1p / d12 if d12 > 0 else 0
                melhor_km = p1['km'] + (p2['km'] - p1['km']) * proporcao

    if menor_distancia < 1.0: # Limite de 1km de tolerância
        return {
            "rodovia": melhor_rodovia,
            "km": round(melhor_km, 3),
            "distancia_metros": round(menor_distancia * 1000, 2)
        }
    else:
        return f"Ponto muito distante de qualquer rodovia mapeada ({round(menor_distancia, 2)} km de distância)."

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Uso: python converter_gps.py <latitude> <longitude>")
        print("Exemplo: python converter_gps.py -27.5815 -48.5134")
    else:
        lat = float(sys.argv[1].replace(',', '.'))
        lng = float(sys.argv[2].replace(',', '.'))
        res = converter_lat_lng_para_km(lat, lng)
        if isinstance(res, dict):
            print(f"\n📍 Localização Identificada!")
            print(f"🛣️  Rodovia: {res['rodovia']}")
            print(f"🏁 KM: {res['km']}")
            print(f"📏 Distância lateral da pista: {res['distancia_metros']} metros")
        else:
            print(f"\n❌ {res}")
