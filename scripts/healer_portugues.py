import base64
import os

input_js = r'C:\Users\Nei\Desktop\PMRV-main\js\infracoes-data.js'

# Mapa de correções gramaticais e ortográficas para Mojibake comum
CORRECOES = {
    'nÒo': 'não',
    'þÒo': 'ção',
    'þÒ': 'çã',
    'Ó ': 'à ',
    'jurÝdica': 'jurídica',
    'veÝculo': 'veículo',
    'InfraþÒo': 'Infração',
    'Infrator': 'Infrator',
    'publ': 'públ',
    'Ý': 'í',
    'Ò': 'ã',
    'þ': 'ç',
    'Ó': 'à',
    'Ú': 'é',
    ' ': ' ', # Espaço fino
}

with open(input_js, 'r', encoding='utf-8') as f:
    content = f.read()
    start = content.find("'") + 1
    end = content.rfind("'")
    b64_str = content[start:end]
    
    try:
        # Tenta decodificar o que está lá
        decoded = base64.b64decode(b64_str).decode('utf-8', errors='ignore')
        
        # Aplica as correções linguísticas
        texto_limpo = decoded
        for errado, correto in CORRECOES.items():
            texto_limpo = texto_limpo.replace(errado, correto)
            
        # Re-codifica para Base64 (UTF-8 Garantido)
        new_b64 = base64.b64encode(texto_limpo.encode('utf-8')).decode('utf-8')
        
        with open(input_js, 'w', encoding='utf-8') as f2:
            f2.write(f"window.INFRACOES_CSV_BASE64 = '{new_b64}';\n")
            
        print("✅ Base de dados higienizada gramaticalmente com sucesso!")
                
    except Exception as e:
        print("Erro ao higienizar:", e)
