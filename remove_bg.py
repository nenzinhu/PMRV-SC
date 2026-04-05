import base64, re

folder = r'c:\Users\Nei\Downloads\Compressed\PMRV-4em1-main'

def b64(path):
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode()

imgs = {
    'v360-img-frente':   b64(folder + r'\frente_nobg.png'),
    'v360-img-tras':     b64(folder + r'\traseira_nobg.png'),
    'v360-img-direita':  b64(folder + r'\lateral_direita_nobg.png'),
    'v360-img-esquerda': b64(folder + r'\lateral_esquerda_nobg.png'),
}

with open(folder + r'\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

for img_id, b64data in imgs.items():
    html = re.sub(
        r'(src=")data:image/[^;]+;base64,[^"]*("\s[^>]*id="' + img_id + r'")',
        r'\g<1>data:image/png;base64,' + b64data + r'\g<2>',
        html
    )
    print(f'{img_id}: substituido')

with open(folder + r'\index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('CONCLUIDO')
