#!/usr/bin/env python3
"""
Adiciona suporte básico de Progressive Web App (PWA) ao `index.html` do
projeto PMRV‑4em1.  Este script realiza as seguintes tarefas:

1. Insere uma tag `<link rel="manifest" href="manifest.json">` no `<head>`
   se ainda não existir.
2. Insere um script para registrar o `service_worker.js` logo antes de
   `</body>` se ainda não existir um registro de service worker.  O
   script verifica se `navigator.serviceWorker` está disponível e
   registra o service worker quando a página carrega.

Uso:
    python add_pwa_support.py [caminho/do/index.html]

Se nenhum caminho for informado, assume `index.html` no diretório atual.

Antes de executar este script, certifique-se de que `manifest.json` e
`service_worker.js` estão na mesma pasta do HTML e que você já
gerou os ícones especificados no manifest.
"""

from __future__ import annotations

import sys
from pathlib import Path


def add_manifest_link(html: str) -> str:
    """Insere a tag de manifest se ela não existir."""
    if '<link rel="manifest"' in html:
        return html
    insertion = '    <link rel="manifest" href="manifest.json">\n'
    return html.replace('<head>', '<head>\n' + insertion, 1)


def add_service_worker_registration(html: str) -> str:
    """Insere o script de registro do service worker se não existir."""
    if 'navigator.serviceWorker.register' in html:
        return html
    script = (
        '\n    <script>\n'
        '      if (\'serviceWorker\' in navigator) {\n'
        '        window.addEventListener(\'load\', function() {\n'
        '          navigator.serviceWorker.register(\'./service_worker.js\')\n'
        '            .catch(function(err) {\n'
        '              console.log(\'Service Worker registration failed:\', err);\n'
        '            });\n'
        '        });\n'
        '      }\n'
        '    </script>\n'
    )
    # Inserir antes do último fechamento do body. Usamos rfind para evitar substituir
    # ocorrências de '</body>' dentro de strings ou scripts.
    pos = html.rfind('</body>')
    if pos != -1:
        return html[:pos] + script + html[pos:]
    else:
        # Caso não exista </body>, apenas anexa o script ao final
        return html + script


def patch_index(index_path: Path) -> None:
    html = index_path.read_text(encoding="utf-8")
    modified = add_manifest_link(html)
    modified = add_service_worker_registration(modified)
    if modified == html:
        print("ℹ️  Nenhuma modificação necessária: manifest e service worker já estão presentes.")
        return
    index_path.write_text(modified, encoding="utf-8")
    print(f"✅ {index_path} atualizado com suporte a PWA.")


def main() -> int:
    if len(sys.argv) > 1:
        index_file = Path(sys.argv[1])
    else:
        index_file = Path('index.html')
    if not index_file.exists():
        print(f"Erro: {index_file} não encontrado")
        return 1
    patch_index(index_file)
    return 0


if __name__ == '__main__':
    sys.exit(main())