#!/usr/bin/env python3
"""
Este script extrai o bloco `<style>` incorporado do `index.html` para um
arquivo CSS externo.  Ele cria a pasta `css` caso não exista,
salva o conteúdo do estilo em `css/inlined.css` e substitui o bloco
interno por um link para o novo arquivo.

Como utilizar:

    python3 extract_inline_css.py [caminho/do/index.html]

Se nenhum caminho for informado, assume que `index.html` está no
diretório atual.  O CSS extraído é salvo em `css/inlined.css`.

Importante: Faça um backup do arquivo `index.html` antes de rodar o
script, principalmente se estiver em um repositório de controle de
versão.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path


def extract_inline_css(index_path: Path, css_path: Path) -> None:
    """Extrai o primeiro bloco <style> do HTML e grava no arquivo CSS."""
    html = index_path.read_text(encoding="utf-8")
    # Procurar o primeiro bloco <style> ... </style>
    match = re.search(r'<style[^>]*>(.*?)</style>', html, flags=re.DOTALL)
    if not match:
        print("ℹ️  Nenhum bloco <style> encontrado em", index_path)
        return

    css_content = match.group(1).strip()
    # Escrever o CSS extraído
    css_path.parent.mkdir(parents=True, exist_ok=True)
    css_path.write_text(css_content + "\n", encoding="utf-8")

    # Remover o bloco <style> do HTML
    new_html = html[: match.start()] + html[match.end() :]

    # Adicionar o link para o CSS externo antes do fechamento do </head>
    link_tag = f'    <link rel="stylesheet" href="{css_path.as_posix()}">\n'
    if '</head>' in new_html:
        new_html = new_html.replace('</head>', link_tag + '</head>', 1)
    else:
        # Se não encontrar </head>, apenas insere no início
        new_html = link_tag + new_html

    index_path.write_text(new_html, encoding="utf-8")
    print(f"✅ CSS extraído para {css_path} e {index_path} atualizado.")


def main() -> int:
    # Determinar caminho do index
    if len(sys.argv) > 1:
        index_file = Path(sys.argv[1])
    else:
        index_file = Path("index.html")
    if not index_file.exists():
        print(f"Erro: {index_file} não encontrado")
        return 1

    css_file = Path("css/inlined.css")
    extract_inline_css(index_file, css_file)
    return 0


if __name__ == '__main__':
    sys.exit(main())