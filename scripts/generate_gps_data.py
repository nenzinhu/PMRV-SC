import shapefile
import json
import os
import math
from pyproj import Transformer

# Configuração de Projeção: UTM Zona 22S (SIRGAS 2000) para WGS84 (Lat/Lng)
# EPSG:31982 (SIRGAS 2000 / UTM zone 22S) -> EPSG:4326 (WGS 84)
transformer = Transformer.from_crs("epsg:31982", "epsg:4326", always_xy=True)

def utm_to_wgs84(x, y):
    """Converte UTM (X, Y) para (Longitude, Latitude)"""
    return transformer.transform(x, y)

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Raio da Terra em km
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat / 2) * math.sin(dLat / 2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dLon / 2) * math.sin(dLon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def interpolate_points(points_utm, start_km, end_km, step_km=0.5):
    """
    Interpola pontos ao longo de uma lista de coordenadas UTM (x, y)
    a cada step_km (padrao 500 metros para não sobrecarregar o JS).
    """
    if not points_utm or len(points_utm) < 2:
        return []
    
    # Converter todos os pontos para WGS84 primeiro
    points_wgs = [utm_to_wgs84(p[0], p[1]) for p in points_utm]
    
    # Calcular distancias acumuladas entre os pontos originais (em KM)
    segment_distances = []
    total_dist = 0
    for i in range(len(points_wgs) - 1):
        d = haversine_distance(points_wgs[i][1], points_wgs[i][0], points_wgs[i+1][1], points_wgs[i+1][0])
        segment_distances.append(d)
        total_dist += d
        
    if total_dist == 0:
        # Se a distância calculada for 0, mas o KM diz que tem extensão, 
        # apenas retornamos os pontos de início e fim convertidos
        return [
            {"km": round(start_km, 3), "lat": points_wgs[0][1], "lng": points_wgs[0][0]},
            {"km": round(end_km, 3), "lat": points_wgs[-1][1], "lng": points_wgs[-1][0]}
        ]

    interpolated = []
    
    # Adicionar o primeiro ponto sempre
    interpolated.append({"km": round(start_km, 3), "lat": points_wgs[0][1], "lng": points_wgs[0][0]})
    
    # Se o segmento for muito curto, apenas o início e fim bastam
    if end_km - start_km < step_km:
        interpolated.append({"km": round(end_km, 3), "lat": points_wgs[-1][1], "lng": points_wgs[-1][0]})
        return interpolated

    current_dist_km = 0
    next_target_km = math.ceil(start_km / step_km) * step_km
    if next_target_km <= start_km: next_target_km += step_km
    
    accumulated_dist = 0
    # Escalar a distância real percorrida para o intervalo de KM definido no SHP
    # (Pois nem sempre a geometria bate exato com o KM informado)
    km_range = end_km - start_km
    
    for i in range(len(points_wgs) - 1):
        p1 = points_wgs[i]
        p2 = points_wgs[i+1]
        seg_dist = segment_distances[i]
        
        while accumulated_dist + seg_dist >= (next_target_km - start_km) and next_target_km < end_km:
            # Fração do segmento onde o ponto alvo está
            target_dist_from_start = (next_target_km - start_km)
            target_within_seg = target_dist_from_start - accumulated_dist
            fraction = target_within_seg / seg_dist if seg_dist > 0 else 0
            
            # Interpolação linear de coordenadas
            interp_lat = p1[1] + (p2[1] - p1[1]) * fraction
            interp_lng = p1[0] + (p2[0] - p1[0]) * fraction
            
            interpolated.append({
                "km": round(next_target_km, 3),
                "lat": interp_lat,
                "lng": interp_lng
            })
            next_target_km += step_km
            
        accumulated_dist += seg_dist
    
    # Adicionar o último ponto sempre
    interpolated.append({"km": round(end_km, 3), "lat": points_wgs[-1][1], "lng": points_wgs[-1][0]})
        
    return interpolated

shp_path = r'C:\Users\Nei\Desktop\PMRV-main\Rodovias_SC_04.24\Rodovias_SC.shp'
output_path = r'C:\Users\Nei\Desktop\PMRV-main\js\gps_data_sc.js'

rodovias_dict = {}

try:
    with shapefile.Reader(shp_path) as sf:
        print(f"Lendo {len(sf.records())} registros...")
        for i, shape_rec in enumerate(sf.shapeRecords()):
            rec = shape_rec.record
            name = str(rec[0]).strip()
            # Normalizar nome: Remover "ACESSO ", "SC-" se houver duplicidade, etc.
            # O padrão parece ser "SC-XXX" ou "ACESSO XXX"
            
            try:
                km_ini = float(rec[3])
                km_fim = float(rec[4])
            except:
                continue
                
            points_utm = shape_rec.shape.points 
            
            if not name or len(points_utm) < 2:
                continue
                
            # Interpola pontos a cada 500m (0.5 km) para equilibrar precisão e tamanho do arquivo
            interp = interpolate_points(points_utm, km_ini, km_fim, 0.5)
            
            if name not in rodovias_dict:
                rodovias_dict[name] = []
            
            rodovias_dict[name].extend(interp)

    # Limpeza final por rodovia
    total_pontos = 0
    for name in list(rodovias_dict.keys()):
        # Ordenar por KM
        points = sorted(rodovias_dict[name], key=lambda x: x['km'])
        
        # Remover duplicados exatos de KM (mantendo o primeiro)
        unique_points = []
        last_km = -9999
        for p in points:
            if abs(p['km'] - last_km) > 0.001:
                unique_points.append(p)
                last_km = p['km']
        
        rodovias_dict[name] = unique_points
        total_pontos += len(unique_points)

    # Gerar arquivo JS
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("/* Dados de Rodovias de SC - Gerado automaticamente via Shapefile */\n")
        f.write("window.GPS_RODOVIAS_SC = ")
        json.dump(rodovias_dict, f, separators=(',', ':'), ensure_ascii=False)
        f.write(";\n")
        
    print(f"Sucesso! Gerado {output_path}")
    print(f"Total de rodovias: {len(rodovias_dict)}")
    print(f"Total de pontos de referência: {total_pontos}")

except Exception as e:
    import traceback
    print(f"Erro no processamento: {e}")
    traceback.print_exc()
