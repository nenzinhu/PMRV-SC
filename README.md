# PMRV 4 em 1 – repositório melhorado

This repositório contém a versão melhorada do projeto **PMRV 4 em 1**, uma ferramenta para registro de danos veiculares e geração de relatórios. As principais melhorias incluem:

* **Documentação** – esta `README` explica o propósito do projeto, como configurar o ambiente e utilizar os scripts de automação.
* **Service Worker** – adicionado `service_worker.js` com cache simples para permitir instalação como Progressive Web App (PWA).
* **Manifesto corrigido** – `manifest.json` agora referencia corretamente os ícones presentes no repositório e inclui campos PWA recomendados.
* **Consolidação de estilos** – o conteúdo de `style (1).css` foi movido para `css/style.css` para centralizar os estilos e evitar duplicação.
* **Scripts unificados** – removido o arquivo duplicado `add_pwa_support (1).py` e aprimorado `add_pwa_support.py` para ser idempotente e mais robusto.
* **Compatibilidade de plataforma** – `patch_carro360.py` utiliza `pathlib` para construir caminhos relativos de forma portável.
* **Gerenciamento de dependências** – `requirements.txt` lista as dependências necessárias (apenas a biblioteca padrão).

## Pré‑requisitos

* Python 3.8 ou superior.
* Nenhuma biblioteca externa é necessária; todos os scripts utilizam apenas a biblioteca padrão.

## Como utilizar

1. **Clonar este repositório** e navegar até o diretório raiz.
2. Se desejar extrair imagens base64 embutidas no `index.html`, execute:

```sh
python extract_base64_images.py index.html img
```

3. Para extrair estilos inline para o diretório `css/`, execute:

```sh
python extract_inline_css.py index.html
```

4. Para adicionar suporte PWA (manifesto e service worker) ao arquivo `index.html`:

```sh
python add_pwa_support.py index.html
```

Certifique‑se de que `manifest.json` e `service_worker.js` estejam presentes na raiz.

5. Utilize `patch_carro360.py` para incorporar o módulo de vistoria 360º de carro ao `index.html`. O script modifica o HTML in place:

```sh
python patch_carro360.py
```

Faça um backup do seu `index.html` antes de rodar esse patch.

## Manual

O manual funcional do aplicativo esta em [MANUAL_DE_USO.md](C:\Users\Nei\Desktop\Projetos\PMRV-4em1-main\MANUAL_DE_USO.md).

## Sobre

Este projeto é mantido por Nei. Para sugestões e contribuições, abra issues ou pull requests no GitHub.
