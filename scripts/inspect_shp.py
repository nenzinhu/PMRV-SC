import shapefile
import os

shp_path = r'C:\Users\Nei\Desktop\PMRV-main\Rodovias_SC_04.24\Rodovias_SC.shp'

try:
    with shapefile.Reader(shp_path) as sf:
        print(f"Campos disponiveis: {[field[0] for field in sf.fields]}")
        print(f"Total de registros: {len(sf.records())}")
        
        # Mostrar os primeiros 5 registros para entender os dados
        for i in range(min(5, len(sf.records()))):
            print(f"Registro {i}: {sf.record(i)}")
            
except Exception as e:
    print(f"Erro ao ler Shapefile: {e}")
