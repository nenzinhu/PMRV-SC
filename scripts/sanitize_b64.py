import base64
import os

input_js = r'C:\Users\Nei\Desktop\PMRV-main\js\infracoes-data.js'

with open(input_js, 'r', encoding='utf-8') as f:
    content = f.read()
    start = content.find("'") + 1
    end = content.rfind("'")
    b64_str = content[start:end]
    
    try:
        # Decodificar e verificar se tem BOM ou caracteres estranhos no início
        decoded_bytes = base64.b64decode(b64_str)
        # Se começar com BOM (UTF-8), remover
        if decoded_bytes.startswith(b'\xef\xbb\xbf'):
            decoded_bytes = decoded_bytes[3:]
            
        new_b64 = base64.b64encode(decoded_bytes).decode('utf-8')
        
        with open(input_js, 'w', encoding='utf-8') as f2:
            f2.write(f"window.INFRACOES_CSV_BASE64 = '{new_b64}';\n")
            
        print("Base64 de infrações higienizado com sucesso.")
                
    except Exception as e:
        print("Erro ao decodificar/limpar:", e)
