#!/usr/bin/env python3
"""
Adiciona suporte básico de Progressive Web App (PWA) ao `index.html` do
projeto PMRV 4 em 1.

Este script é idempotente: ele verifica a presença de uma tag `<link rel="manifest">`
e de um registro de service worker antes de inserir os trechos necessários.
Ele realiza as seguintes tarefas:

1. Garante que existe `<link rel="manifest" href="manifest.json">` dentro de `<head>`.
2. Garante que existe um script de registro de service worker (`service_worker.js`)
   imediatamente antes da tag `</body>`.

Uso:
    python add_pwa_support.py [caminho/do/index.html]

Se nenhum caminho for informado, assume `index.html` no diretório atual.

Antes de executar este script, certifique‑se de que `manifest.json` e
`service_worker.js` estão na mesma pasta do HTML e que os ícones referenciados
no manifesto existem.
"""

from __future__ import annotations

import sys
from pathlib import Path

MANIFEST_TAG = '<link rel="manifest" href="manifest.json">'
SERVICE_WORKER_SNIPPET = """
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('service_worker.js')
            .catch(function(err) {
              console.log('Service Worker registration failed:', err);
            });
        });
      }
    </script>
"""

def ensure_manifest(html: str) -> str:
    """Insere a tag do manifest se não existir."""
    if '<link rel="manifest' in html:
        return html
    return html.replace('<head>', '<head>\n    ' + MANIFEST_TAG + '\n', 1)

def ensure_service_worker(html: str) -> str:
    """Insere o script de registro do service worker se não existir."""
    if 'navigator.serviceWorker.register' in html:
        return html
    # Procura o último </body> para evitar substituir ocorrências dentro de scripts/strings.
    pos = html.rfind('</body>')
    if pos != -1:
        return html[:pos] + SERVICE_WORKER_SNIPPET + html[pos:]
    # Caso não exista </body>, apenas adiciona ao final.
    return html + SERVICE_WORKER_SNIPPET

def patch_index(index_path: Path) -> None:
    html = index_path.read_text(encoding='utf-8')
    modified = ensure_manifest(html)
    modified = ensure_service_worker(modified)
    if modified != html:
        index_path.write_text(modified, encoding='utf-8')
        print(f'✅ {index_path} atualizado com suporte PWA.')
    else:
        print('ℹ️  Nenhuma modificação necessária: PWA já habilitado.')

def main() -> int:
    args = sys.argv[1:]
    index_file = Path(args[0]) if args else Path('index.html')
    if not index_file.exists():
        print(f'Erro: {index_file} não encontrado')
        return 1
    patch_index(index_file)
    return 0

if __name__ == '__main__':
    sys.exit(main())