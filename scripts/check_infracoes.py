import base64
import os

input_file = r'C:\Users\Nei\Desktop\PMRV-main\js\infracoes-data.js'

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()
    start = content.find("'") + 1
    end = content.rfind("'")
    b64_str = content[start:end]
    
    try:
        decoded = base64.b64decode(b64_str).decode('utf-8')
        print(decoded)
                
    except Exception as e:
        print("Erro ao decodificar:", e)
