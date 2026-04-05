#!/usr/bin/env python3
"""
Adiciona um rodapé com assinatura ao `index.html` do projeto PMRV‑4em1.

Este script insere um elemento `<footer>` contendo um texto de autoria
(por padrão "Feito pelo cabo Jeferson") logo antes do fechamento
`</body>`.  Se o rodapé já existir (ou seja, se houver uma tag
`<footer` no HTML), o script não faz nada.

Também cria, se desejar, uma regra CSS básica para estilizar o
rodapé.  Adicione manualmente esta regra ao seu arquivo CSS
(`css/style.css` ou similar), ou edite conforme sua necessidade:

```
footer.footer-signature {
  font-size: 12px;
  color: var(--muted);
  text-align: center;
  margin-top: 24px;
  padding: 12px;
  border-top: 1px solid var(--border);
}
```

Uso:
    python add_footer_signature.py [caminho/do/index.html] [assinatura]

Se nenhum caminho for informado, assume `index.html` no diretório atual.
Se nenhuma assinatura for passada, utiliza "Feito pelo cabo Jeferson".

"""

from __future__ import annotations

import sys
from pathlib import Path


def add_footer(index_path: Path, signature: str) -> None:
    html = index_path.read_text(encoding="utf-8")
    # Verifica se já existe um rodapé
    if '<footer' in html.lower():
        print("ℹ️  Já existe um elemento <footer> no arquivo. Nenhuma modificação feita.")
        return
    # Constrói o HTML do rodapé
    footer_html = f'    <footer class="footer-signature">{signature}</footer>\n'
    # Insere antes do último </body>
    pos = html.lower().rfind('</body>')
    if pos != -1:
        new_html = html[:pos] + footer_html + html[pos:]
    else:
        # Caso não haja </body>, simplesmente adiciona ao final
        new_html = html + '\n' + footer_html
    index_path.write_text(new_html, encoding="utf-8")
    print(f"✅ Rodapé adicionado em {index_path}")


def main() -> int:
    args = sys.argv[1:]
    # Determina o caminho do index
    if args:
        index_file = Path(args[0])
        signature = ' '.join(args[1:]) if len(args) > 1 else "Feito pelo cabo Jeferson"
    else:
        index_file = Path('index.html')
        signature = "Feito pelo cabo Jeferson"
    if not index_file.exists():
        print(f"Erro: {index_file} não encontrado")
        return 1
    add_footer(index_file, signature)
    return 0


if __name__ == '__main__':
    sys.exit(main())