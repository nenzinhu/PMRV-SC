
import json
import base64
import os

def extract_gps():
    input_path = r'C:\Users\JEFERSON\Documents\PMRV-main\js\gps_data_sc.js'
    output_path = r'C:\Users\JEFERSON\Documents\PMRV-main\data\gps_data_sc.json'
    
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
        # Localiza o JSON após a atribuição window.GPS_RODOVIAS_SC = 
        start = content.find('{')
        end = content.rfind('}') + 1
        data_str = content[start:end]
        
        # Valida se é um JSON válido e salva
        try:
            data = json.loads(data_str)
            with open(output_path, 'w', encoding='utf-8') as f_out:
                json.dump(data, f_out, separators=(',', ':'))
            print(f"✅ GPS Data extraído: {os.path.getsize(output_path)} bytes")
        except Exception as e:
            print(f"❌ Erro ao extrair GPS: {e}")

def extract_infracoes():
    input_path = r'C:\Users\JEFERSON\Documents\PMRV-main\js\infracoes-data.js'
    output_path = r'C:\Users\JEFERSON\Documents\PMRV-main\data\infracoes.json'
    
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
        # Localiza a string entre aspas simples
        start = content.find("'") + 1
        end = content.rfind("'")
        b64_str = content[start:end]
        
        # Salva como um objeto JSON simples {"b64": "..."}
        data = {"b64": b64_str}
        with open(output_path, 'w', encoding='utf-8') as f_out:
            json.dump(data, f_out, separators=(',', ':'))
        print(f"✅ Infrações Data extraído: {os.path.getsize(output_path)} bytes")

if __name__ == "__main__":
    extract_gps()
    extract_infracoes()
