from pathlib import Path
import json


ROOT = Path(r"C:\Users\Nei\Desktop\Projetos final 1.0\PMRV-4em1-main")
OUT_DIR = ROOT / "img" / "sinistros"
WIDTH = 1600
HEIGHT = 900


def svg_wrap(title: str, content: str) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" width="{WIDTH}" height="{HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#08131f"/>
      <stop offset="100%" stop-color="#12263a"/>
    </linearGradient>
    <linearGradient id="road" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#243341"/>
      <stop offset="100%" stop-color="#1a2733"/>
    </linearGradient>
    <linearGradient id="carBlue" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#55b7ff"/>
      <stop offset="100%" stop-color="#1d6fd6"/>
    </linearGradient>
    <linearGradient id="carAmber" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffcf66"/>
      <stop offset="100%" stop-color="#f58220"/>
    </linearGradient>
    <linearGradient id="warn" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff8a70"/>
      <stop offset="100%" stop-color="#ff4d4f"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <title>{title}</title>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="28" y="28" width="{WIDTH-56}" height="{HEIGHT-56}" rx="36" fill="none" stroke="rgba(255,255,255,.08)"/>
  {content}
</svg>
"""


def card_header(code: str, title: str) -> str:
    return f"""
  <g filter="url(#shadow)">
    <rect x="72" y="70" width="570" height="150" rx="28" fill="#0d1723" stroke="#24425f"/>
    <text x="110" y="128" fill="#9bc7ff" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700">TIPO DE SINISTRO</text>
    <text x="110" y="180" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="54" font-weight="800">{code} · {title}</text>
  </g>
"""


def road_horizontal(y=540, h=220) -> str:
    return f"""
  <g filter="url(#shadow)">
    <rect x="80" y="{y}" width="1440" height="{h}" rx="44" fill="url(#road)"/>
    <rect x="80" y="{y+10}" width="1440" height="8" rx="4" fill="#5f7388" opacity="0.35"/>
    <rect x="80" y="{y+h-18}" width="1440" height="8" rx="4" fill="#5f7388" opacity="0.35"/>
    <rect x="180" y="{y+h/2-8:.0f}" width="160" height="16" rx="8" fill="#ffe082"/>
    <rect x="420" y="{y+h/2-8:.0f}" width="160" height="16" rx="8" fill="#ffe082"/>
    <rect x="660" y="{y+h/2-8:.0f}" width="160" height="16" rx="8" fill="#ffe082"/>
    <rect x="900" y="{y+h/2-8:.0f}" width="160" height="16" rx="8" fill="#ffe082"/>
    <rect x="1140" y="{y+h/2-8:.0f}" width="160" height="16" rx="8" fill="#ffe082"/>
  </g>
"""


def road_vertical(x=640, w=320) -> str:
    return f"""
  <g filter="url(#shadow)">
    <rect x="{x}" y="170" width="{w}" height="630" rx="44" fill="url(#road)"/>
    <rect x="{x+10}" y="170" width="8" height="630" rx="4" fill="#5f7388" opacity="0.35"/>
    <rect x="{x+w-18}" y="170" width="8" height="630" rx="4" fill="#5f7388" opacity="0.35"/>
    <rect x="{x+w/2-8:.0f}" y="220" width="16" height="100" rx="8" fill="#ffe082"/>
    <rect x="{x+w/2-8:.0f}" y="370" width="16" height="100" rx="8" fill="#ffe082"/>
    <rect x="{x+w/2-8:.0f}" y="520" width="16" height="100" rx="8" fill="#ffe082"/>
    <rect x="{x+w/2-8:.0f}" y="670" width="16" height="70" rx="8" fill="#ffe082"/>
  </g>
"""


def road_curve() -> str:
    return """
  <g filter="url(#shadow)">
    <path d="M120 650 C 420 650, 540 520, 740 520 L 1120 520 C 1310 520, 1400 450, 1470 310" fill="none" stroke="#243341" stroke-width="210" stroke-linecap="round"/>
    <path d="M120 650 C 420 650, 540 520, 740 520 L 1120 520 C 1310 520, 1400 450, 1470 310" fill="none" stroke="#ffe082" stroke-width="14" stroke-linecap="round" stroke-dasharray="70 52"/>
  </g>
"""


def road_exit() -> str:
    return """
  <g filter="url(#shadow)">
    <rect x="90" y="485" width="1130" height="230" rx="40" fill="url(#road)"/>
    <rect x="180" y="592" width="140" height="16" rx="8" fill="#ffe082"/>
    <rect x="390" y="592" width="140" height="16" rx="8" fill="#ffe082"/>
    <rect x="600" y="592" width="140" height="16" rx="8" fill="#ffe082"/>
    <path d="M970 575 C 1150 560, 1260 500, 1420 355" fill="none" stroke="#243341" stroke-width="170" stroke-linecap="round"/>
    <path d="M970 575 C 1150 560, 1260 500, 1420 355" fill="none" stroke="#ffe082" stroke-width="12" stroke-linecap="round" stroke-dasharray="55 38"/>
  </g>
"""


def car(x, y, angle=0, color="url(#carBlue)", label="V1", scale=1.0) -> str:
    w = 150 * scale
    h = 82 * scale
    return f"""
  <g transform="translate({x} {y}) rotate({angle})" filter="url(#shadow)">
    <rect x="{-w/2:.1f}" y="{-h/2:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{24*scale:.1f}" fill="{color}" stroke="#dff2ff" stroke-width="{3*scale:.1f}"/>
    <rect x="{-w/4:.1f}" y="{-h/3.2:.1f}" width="{w/2:.1f}" height="{h/1.6:.1f}" rx="{18*scale:.1f}" fill="#d9f2ff" opacity="0.86"/>
    <rect x="{-w/2+18*scale:.1f}" y="{-h/2+14*scale:.1f}" width="{16*scale:.1f}" height="{h-28*scale:.1f}" rx="{8*scale:.1f}" fill="#11304a" opacity="0.45"/>
    <rect x="{w/2-34*scale:.1f}" y="{-h/2+14*scale:.1f}" width="{16*scale:.1f}" height="{h-28*scale:.1f}" rx="{8*scale:.1f}" fill="#11304a" opacity="0.45"/>
    <text x="0" y="10" text-anchor="middle" fill="#08131f" font-family="Segoe UI, Arial, sans-serif" font-size="{28*scale:.1f}" font-weight="900">{label}</text>
  </g>
"""


def impact(x, y, scale=1.0) -> str:
    return f"""
  <g transform="translate({x} {y}) scale({scale})" filter="url(#shadow)">
    <circle r="34" fill="url(#warn)" opacity="0.22"/>
    <path d="M0 -44 L12 -14 L42 -18 L22 6 L42 34 L8 24 L-8 52 L-20 20 L-50 22 L-28 -2 L-48 -30 L-14 -22 Z" fill="url(#warn)" stroke="#ffd6d2" stroke-width="4"/>
  </g>
"""


def arrow(x1, y1, x2, y2, color="#b7d7ff") -> str:
    return f"""
  <g>
    <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="10" stroke-linecap="round"/>
    <polygon points="{x2},{y2} {x2-22},{y2-16} {x2-14},{y2} {x2-22},{y2+16}" fill="{color}"/>
  </g>
"""


def pedestrian(x, y, scale=1.0) -> str:
    return f"""
  <g transform="translate({x} {y}) scale({scale})" filter="url(#shadow)">
    <circle cx="0" cy="-38" r="18" fill="#ffe0b2"/>
    <path d="M0 -20 L0 32 M0 2 L-34 34 M0 2 L32 28 M0 32 L-26 84 M0 32 L24 82" fill="none" stroke="#eaf4ff" stroke-width="12" stroke-linecap="round"/>
    <rect x="-18" y="-10" width="36" height="48" rx="14" fill="#2bd0b0"/>
  </g>
"""


def animal(x, y, scale=1.0) -> str:
    return f"""
  <g transform="translate({x} {y}) scale({scale})" filter="url(#shadow)">
    <ellipse cx="0" cy="0" rx="58" ry="32" fill="#c48b5a"/>
    <circle cx="54" cy="-10" r="22" fill="#c48b5a"/>
    <polygon points="62,-34 72,-54 82,-32" fill="#c48b5a"/>
    <polygon points="40,-30 50,-50 58,-28" fill="#c48b5a"/>
    <rect x="-34" y="20" width="10" height="42" rx="5" fill="#9b6842"/>
    <rect x="-6" y="20" width="10" height="42" rx="5" fill="#9b6842"/>
    <rect x="22" y="20" width="10" height="42" rx="5" fill="#9b6842"/>
    <path d="M-62 -12 C -86 -30, -92 -2, -72 10" fill="none" stroke="#9b6842" stroke-width="8" stroke-linecap="round"/>
  </g>
"""


def pole(x, y) -> str:
    return f"""
  <g filter="url(#shadow)">
    <rect x="{x}" y="{y-170}" width="28" height="190" rx="12" fill="#c9d6e2"/>
    <rect x="{x-46}" y="{y-170}" width="120" height="18" rx="9" fill="#dfe9f2"/>
    <rect x="{x+10}" y="{y-154}" width="22" height="28" rx="8" fill="#ffd36b"/>
  </g>
"""


def barrier(x, y, w=260) -> str:
    return f"""
  <g filter="url(#shadow)">
    <rect x="{x}" y="{y}" width="{w}" height="34" rx="17" fill="#cbd5df"/>
    <rect x="{x}" y="{y+34}" width="{w}" height="14" rx="7" fill="#f58220"/>
    <rect x="{x+26}" y="{y+48}" width="18" height="48" rx="8" fill="#9aa9b8"/>
    <rect x="{x+w-44}" y="{y+48}" width="18" height="48" rx="8" fill="#9aa9b8"/>
  </g>
"""


def wall(x, y, w=250, h=150) -> str:
    return f"""
  <g filter="url(#shadow)">
    <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" fill="#8b6f61"/>
    <path d="M{x} {y+40} H{x+w}" stroke="#b19282" stroke-width="6"/>
    <path d="M{x} {y+82} H{x+w}" stroke="#b19282" stroke-width="6"/>
    <path d="M{x+40} {y} V{y+h}" stroke="#b19282" stroke-width="6"/>
    <path d="M{x+122} {y} V{y+h}" stroke="#b19282" stroke-width="6"/>
    <path d="M{x+204} {y} V{y+h}" stroke="#b19282" stroke-width="6"/>
  </g>
"""


def object_box(x, y, label="OBJETO") -> str:
    return f"""
  <g filter="url(#shadow)">
    <rect x="{x}" y="{y}" width="170" height="130" rx="20" fill="#6d7f92"/>
    <text x="{x+85}" y="{y+75}" text-anchor="middle" fill="#f4f8fb" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="800">{label}</text>
  </g>
"""


def caption(text: str) -> str:
    return f"""
  <g filter="url(#shadow)">
    <rect x="72" y="788" width="1456" height="78" rx="24" fill="#0d1723" stroke="#24425f"/>
    <text x="110" y="838" fill="#d8e8f8" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="600">{text}</text>
  </g>
"""


def scene_atropelamento_pedestre():
    return (
        card_header("1.1", "Atropelamento de Pedestre")
        + road_horizontal()
        + car(620, 650, 0, "url(#carBlue)", "V1")
        + pedestrian(890, 648, 1.05)
        + impact(760, 648, 1.15)
        + arrow(470, 650, 560, 650)
        + caption("Veículo em deslocamento atinge pedestre em travessia da pista.")
    )


def scene_atropelamento_animal():
    return (
        card_header("1.2", "Atropelamento de Animal")
        + road_horizontal()
        + car(610, 650, 0, "url(#carBlue)", "V1")
        + animal(915, 655, 0.9)
        + impact(760, 652, 1.1)
        + arrow(460, 650, 548, 650)
        + caption("Veículo em deslocamento atinge animal sobre a pista.")
    )


def scene_abal_long_mesmo():
    return (
        card_header("2.1", "Abalroamento Longitudinal (Mesmo Sentido)")
        + road_horizontal()
        + car(610, 650, 0, "url(#carBlue)", "V1")
        + car(790, 650, 0, "url(#carAmber)", "V2")
        + impact(700, 650, 1.0)
        + arrow(450, 650, 540, 650)
        + arrow(950, 650, 1040, 650, "#ffd5a6")
        + caption("Dois veículos seguem no mesmo sentido e se tocam lateralmente.")
    )


def scene_abal_long_oposto():
    return (
        card_header("2.2", "Abalroamento Longitudinal (Sentido Oposto)")
        + road_horizontal()
        + car(610, 595, 0, "url(#carBlue)", "V1")
        + car(810, 705, 180, "url(#carAmber)", "V2")
        + impact(710, 650, 1.0)
        + arrow(440, 595, 538, 595)
        + arrow(980, 705, 882, 705, "#ffd5a6")
        + caption("Veículos em sentidos opostos realizam contato longitudinal entre si.")
    )


def scene_abal_transversal():
    return (
        card_header("2.3", "Abalroamento Transversal")
        + road_horizontal(540, 180)
        + road_vertical(670, 260)
        + car(500, 630, 0, "url(#carBlue)", "V1")
        + car(800, 430, 90, "url(#carAmber)", "V2")
        + impact(720, 540, 1.1)
        + caption("Veículos se interceptam em ângulo transversal.")
    )


def scene_colisao_frontal():
    return (
        card_header("3.1", "Colisão Frontal")
        + road_horizontal()
        + car(580, 650, 0, "url(#carBlue)", "V1")
        + car(860, 650, 180, "url(#carAmber)", "V2")
        + impact(720, 650, 1.2)
        + arrow(420, 650, 520, 650)
        + arrow(1020, 650, 920, 650, "#ffd5a6")
        + caption("Veículos em sentidos opostos colidem de frente.")
    )


def scene_colisao_traseira():
    return (
        card_header("3.2", "Colisão Traseira")
        + road_horizontal()
        + car(650, 650, 0, "url(#carAmber)", "V2")
        + car(495, 650, 0, "url(#carBlue)", "V1")
        + impact(575, 650, 1.0)
        + arrow(350, 650, 430, 650)
        + caption("Veículo V1 colide na parte traseira do veículo V2.")
    )


def scene_colisao_engavetamento():
    return (
        card_header("3.3", "Colisão Engavetamento")
        + road_horizontal()
        + car(470, 650, 0, "url(#carBlue)", "V1")
        + car(650, 650, 0, "url(#carAmber)", "V2")
        + car(830, 650, 0, "#6fe3c5", "V3")
        + impact(560, 650, 0.95)
        + impact(740, 650, 0.95)
        + caption("Sequência de colisões entre múltiplos veículos no mesmo alinhamento.")
    )


def scene_choque_poste():
    return (
        card_header("4.1", "Choque em Poste")
        + road_curve()
        + pole(1220, 460)
        + car(1120, 520, -18, "url(#carBlue)", "V1")
        + impact(1185, 505, 1.05)
        + caption("Veículo sai da trajetória linear e atinge um poste fixo.")
    )


def scene_choque_defensa():
    return (
        card_header("4.6", "Choque em Defensa")
        + road_curve()
        + barrier(1120, 405, 290)
        + car(1065, 500, -18, "url(#carBlue)", "V1")
        + impact(1160, 490, 1.0)
        + caption("Veículo colide contra a defensa metálica de proteção.")
    )


def scene_choque_objeto():
    return (
        card_header("4.9", "Choque em Objeto")
        + road_curve()
        + object_box(1185, 400)
        + car(1070, 515, -18, "url(#carBlue)", "V1")
        + impact(1170, 500, 1.0)
        + caption("Veículo colide contra objeto fixo ou identificado no local.")
    )


def scene_saida_simples():
    return (
        card_header("5.1", "Saída de Pista Simples")
        + road_exit()
        + car(1190, 458, -24, "url(#carBlue)", "V1")
        + arrow(1010, 540, 1140, 470)
        + caption("Veículo perde o controle direcional e abandona a pista sem capotar.")
    )


def scene_saida_capotamento():
    return (
        card_header("5.3", "Saída de Pista com Capotamento")
        + road_exit()
        + car(1225, 438, -64, "url(#carBlue)", "V1")
        + impact(1188, 490, 1.0)
        + arrow(1015, 545, 1142, 472)
        + caption("Veículo sai da pista e gira sobre o próprio eixo, capotando.")
    )


def scene_saida_tombamento():
    return (
        card_header("5.4", "Saída de Pista com Tombamento")
        + road_exit()
        + car(1220, 454, -90, "url(#carBlue)", "V1")
        + impact(1186, 508, 0.95)
        + arrow(1015, 545, 1142, 472)
        + caption("Veículo abandona a pista e tomba lateralmente fora da faixa de rolamento.")
    )


def scene_saida_choque_poste():
    return (
        card_header("6.1", "Saída + Choque em Poste")
        + road_exit()
        + pole(1315, 366)
        + car(1235, 430, -28, "url(#carBlue)", "V1")
        + impact(1282, 404, 1.0)
        + caption("Após sair da pista, o veículo colide contra um poste.")
    )


def scene_saida_choque_muro():
    return (
        card_header("6.2", "Saída + Choque em Muro")
        + road_exit()
        + wall(1260, 320, 240, 180)
        + car(1185, 442, -26, "url(#carBlue)", "V1")
        + impact(1260, 420, 1.0)
        + caption("Após sair da pista, o veículo colide contra um muro.")
    )


def scene_saida_choque_defensa():
    return (
        card_header("6.3", "Saída + Choque em Defensa")
        + road_exit()
        + barrier(1235, 382, 250)
        + car(1170, 450, -26, "url(#carBlue)", "V1")
        + impact(1240, 430, 1.0)
        + caption("Após sair da pista, o veículo colide contra uma defensa.")
    )


def scene_saida_choque_objeto():
    return (
        card_header("6.4", "Saída + Choque em Objeto")
        + road_exit()
        + object_box(1275, 340)
        + car(1185, 445, -26, "url(#carBlue)", "V1")
        + impact(1265, 424, 1.0)
        + caption("Após sair da pista, o veículo colide contra objeto especificado.")
    )


def scene_outros():
    return (
        card_header("7.1", "Outros")
        + """
  <g filter="url(#shadow)">
    <rect x="170" y="300" width="1260" height="390" rx="40" fill="#132131" stroke="#234661"/>
    <circle cx="430" cy="495" r="110" fill="rgba(85,183,255,.12)" stroke="#55b7ff" stroke-width="12"/>
    <text x="430" y="535" text-anchor="middle" fill="#55b7ff" font-family="Segoe UI, Arial, sans-serif" font-size="140" font-weight="900">?</text>
    <text x="640" y="440" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="800">Natureza do sinistro não padronizada</text>
    <text x="640" y="510" fill="#d8e8f8" font-family="Segoe UI, Arial, sans-serif" font-size="34">Use esta ilustração quando o evento exigir descrição livre.</text>
    <text x="640" y="568" fill="#9bc7ff" font-family="Segoe UI, Arial, sans-serif" font-size="30">Exemplo: incêndio, derramamento, evento atípico ou combinação não prevista.</text>
  </g>
"""
        + caption("Categoria reservada para sinistro não enquadrado nas demais classificações.")
    )


SCENES = [
    ("1.1", "atropelamento-pedestre", "Atropelamento de Pedestre", scene_atropelamento_pedestre),
    ("1.2", "atropelamento-animal", "Atropelamento de Animal", scene_atropelamento_animal),
    ("2.1", "abalroamento-longitudinal-mesmo-sentido", "Abalroamento Longitudinal (Mesmo Sentido)", scene_abal_long_mesmo),
    ("2.2", "abalroamento-longitudinal-sentido-oposto", "Abalroamento Longitudinal (Sentido Oposto)", scene_abal_long_oposto),
    ("2.3", "abalroamento-transversal", "Abalroamento Transversal", scene_abal_transversal),
    ("3.1", "colisao-frontal", "Colisão Frontal", scene_colisao_frontal),
    ("3.2", "colisao-traseira", "Colisão Traseira", scene_colisao_traseira),
    ("3.3", "colisao-engavetamento", "Colisão Engavetamento", scene_colisao_engavetamento),
    ("4.1", "choque-poste", "Choque em Poste", scene_choque_poste),
    ("4.6", "choque-defensa", "Choque em Defensa", scene_choque_defensa),
    ("4.9", "choque-objeto", "Choque em Objeto", scene_choque_objeto),
    ("5.1", "saida-pista-simples", "Saída de Pista Simples", scene_saida_simples),
    ("5.3", "saida-pista-capotamento", "Saída de Pista com Capotamento", scene_saida_capotamento),
    ("5.4", "saida-pista-tombamento", "Saída de Pista com Tombamento", scene_saida_tombamento),
    ("6.1", "saida-choque-poste", "Saída + Choque em Poste", scene_saida_choque_poste),
    ("6.2", "saida-choque-muro", "Saída + Choque em Muro", scene_saida_choque_muro),
    ("6.3", "saida-choque-defensa", "Saída + Choque em Defensa", scene_saida_choque_defensa),
    ("6.4", "saida-choque-objeto", "Saída + Choque em Objeto", scene_saida_choque_objeto),
    ("7.1", "outros", "Outros", scene_outros),
]


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = []

    for code, slug, title, factory in SCENES:
        filename = f"{code}-{slug}.svg"
        path = OUT_DIR / filename
        path.write_text(svg_wrap(title, factory()), encoding="utf-8")
        manifest.append(
            {
                "code": code,
                "title": title,
                "file": f"img/sinistros/{filename}",
            }
        )

    (OUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"Gerados {len(manifest)} SVGs em {OUT_DIR}")


if __name__ == "__main__":
    main()
