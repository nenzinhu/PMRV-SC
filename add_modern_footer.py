#!/usr/bin/env python3
"""
Insere um rodapé com assinatura personalizada no `index.html` e adiciona
as regras de estilo correspondentes em uma folha de estilos externa.

O rodapé terá a estrutura:

    <footer class="footer-signature">
      Sistema criado por <span class="author">Cb. Jeferson</span>
    </footer>

O CSS adicionado ao arquivo especificado (por padrão `css/style.css`)
será:

```
footer.footer-signature {
  font-size: 12px;
  color: var(--muted);
  text-align: center;
  margin-top: 24px;
  padding: 12px;
  border-top: 1px solid var(--border);
  background: rgba(0,0,0,0.03);
}
footer.footer-signature .author {
  font-weight: 600;
  color: var(--primary);
}
```

Uso:

    python add_modern_footer.py [caminho/do/index.html] [caminho/do/css] [texto]

* `caminho/do/index.html` – caminho do HTML (padrão: `index.html`)
* `caminho/do/css` – caminho da folha de estilos a ser modificada
  (padrão: `css/style.css`)
* `texto` – texto do rodapé (padrão: `Sistema criado por <span class="author">Cb. Jeferson</span>`)

Se já existir uma tag `<footer>` ou as regras CSS, o script não
duplica o conteúdo.
"""

from __future__ import annotations

import sys
from pathlib import Path


DEFAULT_TEXT = "Sistema criado por <span class=\"author\">Cb. Jeferson</span>"


def insert_footer(html: str, text: str) -> str:
    lower_html = html.lower()
    if '<footer' in lower_html:
        # Não insere se já houver um footer
        return html
    footer = f'    <footer class="footer-signature">{text}</footer>\n'
    pos = lower_html.rfind('</body>')
    if pos != -1:
        return html[:pos] + footer + html[pos:]
    return html + '\n' + footer


def insert_css(css_content: str) -> str:
    snippet = (
        'footer.footer-signature {\n'
        '  font-size: 12px;\n'
        '  color: var(--muted);\n'
        '  text-align: center;\n'
        '  margin-top: 24px;\n'
        '  padding: 12px;\n'
        '  border-top: 1px solid var(--border);\n'
        '  background: rgba(0,0,0,0.03);\n'
        '}\n\n'
        'footer.footer-signature .author {\n'
        '  font-weight: 600;\n'
        '  color: var(--primary);\n'
        '}\n'
    )
    if 'footer.footer-signature' in css_content:
        return css_content
    return css_content + '\n' + snippet


def main() -> int:
    args = sys.argv[1:]
    index_file = Path(args[0]) if args else Path('index.html')
    css_file = Path(args[1]) if len(args) > 1 else Path('css/style.css')
    text = args[2] if len(args) > 2 else DEFAULT_TEXT

    if not index_file.exists():
        print(f"Erro: {index_file} não encontrado")
        return 1
    # Carrega e atualiza HTML
    html = index_file.read_text(encoding='utf-8')
    new_html = insert_footer(html, text)
    index_file.write_text(new_html, encoding='utf-8')
    print(f"✅ Rodapé inserido em {index_file}")

    # Carrega e atualiza CSS
    css_file.parent.mkdir(parents=True, exist_ok=True)
    if css_file.exists():
        css_content = css_file.read_text(encoding='utf-8')
    else:
        css_content = ''
    new_css = insert_css(css_content)
    css_file.write_text(new_css, encoding='utf-8')
    print(f"✅ Estilos adicionados em {css_file}")

    return 0


if __name__ == '__main__':
    sys.exit(main())