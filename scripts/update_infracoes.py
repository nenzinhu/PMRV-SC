import base64
import os
import csv
import io

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

input_path = r'C:\Users\Nei\Desktop\PMRV-main\scripts\infracoes_original.csv'
output_js_path = r'C:\Users\Nei\Desktop\PMRV-main\js\infracoes-data.js'

# Função para detectar encoding
def read_content(path):
    for enc in ['utf-8', 'utf-16', 'latin-1']:
        try:
            with open(path, 'r', encoding=enc) as f:
                return f.read()
        except:
            continue
    return None

content = read_content(input_path)
if not content:
    print("Erro ao ler arquivo original.")
    exit(1)

# Se for UTF-16, o primeiro char pode ser BOM
if content.startswith('\ufeff'):
    content = content[1:]

lines = content.strip().splitlines()
reader = csv.reader(lines)
new_rows = []

try:
    headers = next(reader)
    new_rows.append(headers)
    
    for row in reader:
        if not row or len(row) < 6: continue
        
        codigo = row[0]
        desc = row[1]
        cat = row[5]
        
        # 1. Atualizar descrição para incluir ACC conforme Resolução 1020/25
        if "CNH ou Permissão" in desc:
            desc = desc.replace("CNH ou Permissão", "CNH, PPD ou ACC")
        if "CNH/PPD" in desc:
            desc = desc.replace("CNH/PPD", "CNH, PPD ou ACC")
            
        # 2. Atualizar Valor baseado na Categoria (Multiplicadores)
        valor = "0,00"
        found_price = False
        
        # Tentar primeiro multiplicadores maiores para não bater em "Gravíssima" simples antes
        sorted_keys = sorted(PRECOS.keys(), key=len, reverse=True)
        for k in sorted_keys:
            if k in cat:
                valor = PRECOS[k]
                found_price = True
                break
        
        if codigo == "5002":
            valor = "NIC"
            
        row[1] = desc
        row[4] = valor
        new_rows.append(row)

    # Gerar o CSV final
    output = io.StringIO()
    writer = csv.writer(output, lineterminator='\n')
    writer.writerows(new_rows)
    csv_content = output.getvalue()

    # Converter para Base64
    b64_content = base64.b64encode(csv_content.encode('utf-8')).decode('utf-8')

    # Salvar no arquivo JS
    with open(output_js_path, 'w', encoding='utf-8') as f:
        f.write("window.INFRACOES_CSV_BASE64 = '")
        f.write(b64_content)
        f.write("';\n")

    print(f"Sucesso! {len(new_rows)-1} infrações atualizadas com valores e normas de 2025.")

except Exception as e:
    print(f"Erro no processamento: {e}")
