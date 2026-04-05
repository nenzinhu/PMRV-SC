#!/usr/bin/env python3
"""
Script to extract embedded base64 images from `index.html` and save
them as separate files.

This script looks for `<img>` tags whose `src` attribute contains a
base64-encoded PNG or JPEG (data URI) and decodes each image to a
file in a specified output directory (default: `img`).  It then
replaces the `src` attribute in the HTML with the path to the new
file.  The files are named `extracted_1.png`, `extracted_2.jpg`,
etc., based on their order of appearance.

Usage:

    python extract_base64_images.py [caminho/para/index.html] [diretorio_de_saída]

If no index path is provided, it assumes `index.html` in the current
directory.  If no output directory is provided, it defaults to `img`.

Note: This script will overwrite the original HTML file.  Make
backups as needed.  Also, it only handles images encoded as
`data:image/png` or `data:image/jpeg`.
"""

from __future__ import annotations

import base64
import os
import re
import sys
from pathlib import Path


def extract_images(index_path: Path, output_dir: Path) -> None:
    html = index_path.read_text(encoding="utf-8")

    # Regex to match data URI images with capturing groups for pre/post attributes.
    pattern = re.compile(
        r'<img([^>]*?)src="data:image/(?P<fmt>png|jpeg);base64,(?P<data>[A-Za-z0-9+/=]+)"([^>]*)>',
        flags=re.IGNORECASE,
    )

    matches = list(pattern.finditer(html))
    if not matches:
        print("ℹ️  Nenhuma imagem em Base64 encontrada em", index_path)
        return

    output_dir.mkdir(parents=True, exist_ok=True)
    new_html = html

    for idx, m in enumerate(matches, start=1):
        fmt = m.group('fmt').lower()
        ext = 'png' if fmt == 'png' else 'jpg'
        data_b64 = m.group('data')
        try:
            img_bytes = base64.b64decode(data_b64)
        except Exception as e:
            print(f"⚠️  Falha ao decodificar imagem {idx}: {e}")
            continue
        filename = f"extracted_{idx}.{ext}"
        file_path = output_dir / filename
        with open(file_path, 'wb') as f:
            f.write(img_bytes)
        # Reconstruct <img> tag with file reference
        pre_attrs = m.group(1)
        post_attrs = m.group(4)
        replacement = f'<img{pre_attrs}src="{output_dir.as_posix()}/{filename}"{post_attrs}>'
        new_html = new_html.replace(m.group(0), replacement, 1)
        print(f"✅ Extraída imagem {idx}: {file_path}")

    # Write updated HTML
    index_path.write_text(new_html, encoding="utf-8")
    print(f"✨ {len(matches)} imagens extraídas e {index_path} atualizado.")


def main() -> int:
    # Args: index file path and output directory
    args = sys.argv[1:]
    index_file = Path(args[0]) if args else Path('index.html')
    out_dir = Path(args[1]) if len(args) > 1 else Path('img')
    if not index_file.exists():
        print(f"Erro: {index_file} não encontrado")
        return 1
    extract_images(index_file, out_dir)
    return 0


if __name__ == '__main__':
    sys.exit(main())