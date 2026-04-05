import json
import csv
import base64
import os

json_path = r'C:\Users\JEFERSON\Documents\WindowsPowerShell\converter\infrações_renainf.json'
output_js_path = r'C:\Users\JEFERSON\Documents\WindowsPowerShell\PMRV-4em1-main\js\infracoes-data.js'

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Sort keys to maintain order if they are string numbers
keys = sorted(data.keys(), key=lambda x: int(x))

# CSV Header based on mapRecords in infracoes.js
# codigo, descricao, artigo, infrator, valor, categoria, medida
header = ["Código Infração", "Descrição da Infração", "Art.CTB/Decreto", "Infrator", "Valor Real(R$)", "Categoria", "Medida Administrativa"]

csv_rows = []
csv_rows.append(header)

for k in keys:
    item = data[k]
    # Map JSON fields to CSV columns
    # JSON fields: "Código da Infração", "Desdob.", "Descrição da Infração", "Amparo Legal (CTB)", "Infrator", "Gravidade", "Órgão Competente"
    
    code = str(item.get("Código da Infração", ""))
    desdob = str(item.get("Desdob.", ""))
    full_code = f"{code}-{desdob}" if desdob and desdob != "0" else code
    
    desc = item.get("Descrição da Infração", "")
    art = item.get("Amparo Legal (CTB)", "")
    infrator = item.get("Infrator", "")
    # Gravity needs to be mapped to "Leve", "Média", "Grave", "Gravíssima" for category
    grav = item.get("Gravidade", "")
    
    # Values are not in JSON, using 0 or placeholder
    valor = "0,00"
    
    # Attempt to detect measure from description as per infracoes.js logic if needed, 
    # but the app seems to expect it in a column.
    medida = ""
    if "remoção" in desc.lower(): medida = "Remoção"
    elif "retenção" in desc.lower(): medida = "Retenção"

    csv_rows.append([
        full_code,
        desc,
        art,
        infrator,
        valor,
        grav,
        medida
    ])

# Convert to CSV string
import io
output = io.StringIO()
writer = csv.writer(output, quoting=csv.QUOTE_ALL, lineterminator='\r\n')
writer.writerows(csv_rows)
csv_text = output.getvalue()

# Encode to Base64
b64_encoded = base64.b64encode(csv_text.encode('utf-8')).decode('utf-8')

# Write to infracoes-data.js
with open(output_js_path, 'w', encoding='utf-8') as f:
    f.write(f"window.INFRACOES_CSV_BASE64 = '{b64_encoded}';")

print(f"Successfully converted {len(csv_rows)-1} records to {output_js_path}")
