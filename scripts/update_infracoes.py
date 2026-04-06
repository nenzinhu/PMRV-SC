import base64
import os
import csv
import io
import json
from datetime import datetime

# Tabela de preços atualizada com base na Lei 13.281/16 e vigência 2024/2025
PRECOS = {
    "Leve": "88,38",
    "Média": "130,16",
    "Grave": "195,23",
    "Gravíssima": "293,47",
    "7 - Gravíssima": "293,47",
    "5 - Grave": "195,23",
    "4 - Média": "130,16",
    "3 - Leve": "88,38",
    "Gravíss": "293,47",
    "Gravíssima 2X": "586,94",
    "Gravíssima 3X": "880,41",
    "Gravíssima 5X": "1467,35",
    "Gravíssima 10X": "2934,70",
    "7 - Gravíss 3X": "880,41",
    "7 - Gravíss 5X": "1467,35",
    "7 - Gravíss 10X": "2934,70",
    "Gravíssima 20X": "5869,40",
    "Gravíssima 60X": "17608,20"
}

# Caminhos baseados na estrutura do projeto
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
input_path = os.path.join(BASE_DIR, 'scripts', 'infracoes_original.csv')
output_json_path = os.path.join(BASE_DIR, 'data', 'infracoes.json')

def read_content(path):
    for enc in ['utf-8', 'utf-16', 'latin-1']:
        try:
            with open(path, 'r', encoding=enc) as f:
                return f.read()
        except:
            continue
    return None

def update_database():
    content = read_content(input_path)
    if not content:
        print(f"❌ Erro ao ler arquivo original em: {input_path}")
        return

    # Limpeza de BOM
    if content.startswith('\ufeff'):
        content = content[1:]

    lines = content.strip().splitlines()
    reader = csv.reader(lines)
    new_rows = []

    try:
        headers = next(reader)
        new_rows.append(headers)
        
        count = 0
        for row in reader:
            if not row or len(row) < 6: continue
            
            codigo = row[0]
            desc = row[1]
            cat = row[5]
            
            # 1. Inteligência Legal: Atualizar descrição para conformidade com Res. 1020/25 (ACC)
            original_desc = desc
            if "CNH ou Permissão" in desc:
                desc = desc.replace("CNH ou Permissão", "CNH, PPD ou ACC")
            if "CNH/PPD" in desc:
                desc = desc.replace("CNH/PPD", "CNH, PPD ou ACC")
                
            # 2. Atualização de Valores (Multiplicadores do CTB)
            valor = "0,00"
            sorted_keys = sorted(PRECOS.keys(), key=len, reverse=True)
            for k in sorted_keys:
                if k in cat:
                    valor = PRECOS[k]
                    break
            
            if codigo == "5002":
                valor = "NIC"
                
            row[1] = desc
            row[4] = valor
            new_rows.append(row)
            count += 1

        # Gerar o CSV final em memória
        output = io.StringIO()
        writer = csv.writer(output, lineterminator='\n')
        writer.writerows(new_rows)
        csv_content = output.getvalue()

        # Converter para Base64 (UTF-8)
        b64_content = base64.b64encode(csv_content.encode('utf-8')).decode('utf-8')

        # Criar objeto JSON com metadados para a Fase 3
        data_packet = {
            "version": datetime.now().strftime("%Y.%m.%d.%H%M"),
            "updated_at": datetime.now().isoformat(),
            "count": count,
            "b64": b64_content
        }

        # Salvar no novo padrão assíncrono (data/infracoes.json)
        os.makedirs(os.path.dirname(output_json_path), exist_ok=True)
        with open(output_json_path, 'w', encoding='utf-8') as f:
            json.dump(data_packet, f, separators=(',', ':'))

        print(f"✅ Sucesso! {count} infrações processadas.")
        print(f"📦 Arquivo gerado: {output_json_path}")
        print(f"📅 Versão: {data_packet['version']}")

    except Exception as e:
        print(f"❌ Erro no processamento: {e}")

if __name__ == "__main__":
    update_database()
