from __future__ import annotations

import json
import math
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
GPS_DATA_PATH = ROOT / "data" / "gps_data_sc.json"
INTERVAL_METERS = 150
INTERVAL_KM = INTERVAL_METERS / 1000
OUTPUT_SUFFIX = f"{INTERVAL_METERS}m"
JSON_OUT_PATH = ROOT / "data" / f"referencias_grande_florianopolis_{OUTPUT_SUFFIX}.json"
JS_OUT_PATH = ROOT / "data" / f"referencias_grande_florianopolis_{OUTPUT_SUFFIX}.js"
XLSX_OUT_PATH = ROOT / f"referencias-grande-florianopolis-{OUTPUT_SUFFIX}.xlsx"
ROW_TYPE_INTERVAL = "marco_intervalo"
EPSILON = 1e-9

ROAD_CONFIG = [
    {
        "key": "SC-281",
        "display_name": "SC-281 | Sao Jose -> Antonio Carlos",
        "segment_end_km": 18.2,
        "notes": "Trecho operacional da Grande Florianopolis; a base GPS completa segue alem deste ponto.",
    },
    {
        "key": "SC-400",
        "display_name": "SC-400 | Florianopolis",
        "segment_end_km": None,
        "notes": "Trecho integral disponivel na base GPS local.",
    },
    {
        "key": "SC-401",
        "display_name": "SC-401 | Florianopolis",
        "segment_end_km": None,
        "notes": "Trecho integral conforme a base GPS atualmente embarcada no app.",
    },
    {
        "key": "SC-402",
        "display_name": "SC-402 | Florianopolis",
        "segment_end_km": None,
        "notes": "Trecho integral disponivel na base GPS local.",
    },
    {
        "key": "SC-403",
        "display_name": "SC-403 | Florianopolis",
        "segment_end_km": None,
        "notes": "Trecho integral disponivel na base GPS local.",
    },
    {
        "key": "SC-404",
        "display_name": "SC-404 | Florianopolis",
        "segment_end_km": None,
        "notes": "Trecho integral disponivel na base GPS local.",
    },
    {
        "key": "SC-405",
        "display_name": "SC-405 | Florianopolis",
        "segment_end_km": None,
        "notes": "Trecho integral disponivel na base GPS local.",
    },
    {
        "key": "SC-406",
        "display_name": "SC-406 | Florianopolis",
        "segment_end_km": None,
        "notes": "Trecho integral disponivel na base GPS local.",
    },
    {
        "key": "SC-407",
        "display_name": "SC-407 | Biguacu -> Antonio Carlos",
        "segment_end_km": None,
        "notes": "Trecho limitado ao alcance disponivel na base GPS embarcada.",
    },
]

ASSUMPTIONS = [
    f"As referencias foram geradas a cada {INTERVAL_METERS} metros por interpolacao linear entre os pontos da base data/gps_data_sc.json.",
    "O recorte operacional usa as rodovias locais do app: SC-281 e SC-400 ate SC-407.",
    "A SC-281 foi limitada ao km 18,200 para manter apenas o trecho da Grande Florianopolis.",
    f"Quando o fim do trecho nao cai exatamente em um marco de {INTERVAL_METERS} m, o arquivo inclui uma linha final extra com o ponto terminal da base utilizada.",
]

LANDMARKS = {
    "SC-281": [
        {"km": 0.0, "name": "Entroncamento BR-101 (Sao Jose)"},
        {"km": 6.8, "name": "Hospital Custodio (Colonia Santana)"},
        {"km": 18.2, "name": "Centro de Antonio Carlos"},
    ],
    "SC-400": [
        {"km": 0.0, "name": "Inicio do trecho SC-400"},
        {"km": 3.662, "name": "Fim do trecho SC-400"},
    ],
    "SC-401": [
        {"km": 0.0, "name": "Teatro do CIC / Trevo do CIC"},
        {"km": 1.2, "name": "Viaduto de acesso ao Joao Paulo"},
        {"km": 2.5, "name": "Floripa Shopping / Tok&Stok"},
        {"km": 3.8, "name": "Passeio Primavera / ACATE"},
        {"km": 5.3, "name": "Trevo de Cacupe"},
        {"km": 6.5, "name": "Bairro Santo Antonio de Lisboa"},
        {"km": 9.2, "name": "Posto PMRv (P19) / Comando"},
        {"km": 12.0, "name": "Posto Galo SC-401"},
        {"km": 13.5, "name": "Viaduto de Ratones"},
        {"km": 15.0, "name": "Teatro Pedro Ivo / Centro Administrativo"},
        {"km": 17.2, "name": "Trevo de Jurere / Vargem Pequena"},
        {"km": 19.3, "name": "Trevo de Canasvieiras"},
    ],
    "SC-402": [
        {"km": 0.0, "name": "Inicio do trecho SC-402"},
        {"km": 4.436, "name": "Fim do trecho SC-402"},
    ],
    "SC-403": [
        {"km": 0.0, "name": "Entroncamento com SC-401"},
        {"km": 1.5, "name": "Viaduto de Vargem do Bom Jesus"},
        {"km": 3.2, "name": "Posto de Combustivel (Entrada Ingleses)"},
        {"km": 6.1, "name": "Praia dos Ingleses"},
    ],
    "SC-404": [
        {"km": 0.0, "name": "Inicio do trecho SC-404"},
        {"km": 6.239, "name": "Fim do trecho SC-404"},
    ],
    "SC-405": [
        {"km": 0.0, "name": "Trevo da Seta / Inicio"},
        {"km": 1.8, "name": "Trevo do Novo Aeroporto"},
        {"km": 3.5, "name": "Trevo do Rio Tavares"},
        {"km": 5.2, "name": "Elevado do Rio Tavares"},
    ],
    "SC-406": [
        {"km": 0.0, "name": "Itacorubi"},
        {"km": 2.5, "name": "Mirante do Morro da Lagoa"},
        {"km": 4.8, "name": "Centrinho da Lagoa"},
        {"km": 10.5, "name": "Barra da Lagoa"},
    ],
    "SC-407": [
        {"km": 0.0, "name": "Entroncamento BR-101 (Biguacu)"},
        {"km": 11.434, "name": "Fim do trecho base embarcada da SC-407"},
    ],
}


def load_gps_data() -> dict[str, list[dict[str, float]]]:
    return json.loads(GPS_DATA_PATH.read_text(encoding="utf-8"))


def round_km(value: float) -> float:
    return round(value + 1e-10, 3)


def is_multiple_of_interval(value: float) -> bool:
    scaled = value / INTERVAL_KM
    return abs(scaled - round(scaled)) < 1e-7


def build_target_kms(segment_end_km: float) -> list[float]:
    total_steps = int(math.floor(segment_end_km / INTERVAL_KM + EPSILON))
    kms = [round_km(step * INTERVAL_KM) for step in range(total_steps + 1)]
    segment_end_km = round_km(segment_end_km)

    if not kms or abs(kms[-1] - segment_end_km) > 1e-7:
        kms.append(segment_end_km)

    return kms


def interpolate_point(points: list[dict[str, float]], target_km: float) -> tuple[float, float]:
    if target_km <= points[0]["km"] + EPSILON:
        return points[0]["lat"], points[0]["lng"]

    for index in range(1, len(points)):
        previous_point = points[index - 1]
        current_point = points[index]
        if target_km <= current_point["km"] + EPSILON:
            km_delta = current_point["km"] - previous_point["km"]
            if abs(km_delta) < EPSILON:
                return current_point["lat"], current_point["lng"]

            factor = (target_km - previous_point["km"]) / km_delta
            latitude = previous_point["lat"] + (current_point["lat"] - previous_point["lat"]) * factor
            longitude = previous_point["lng"] + (current_point["lng"] - previous_point["lng"]) * factor
            return latitude, longitude

    return points[-1]["lat"], points[-1]["lng"]


def format_km_label(value: float) -> str:
    return f"{value:.3f}".replace(".", ",")


def build_marco_label(value: float) -> str:
    total_meters = int(round(value * 1000))
    km_part = total_meters // 1000
    meter_part = total_meters % 1000
    return f"{km_part:03d}+{meter_part:03d}"


def build_row_description(km_value: float, segment_end_km: float, is_last_row: bool) -> tuple[str, str]:
    if abs(km_value) < 1e-7:
        return "inicio_trecho", "Inicio do trecho operacional"

    if is_last_row and not is_multiple_of_interval(segment_end_km):
        return "fim_trecho", "Fim do trecho operacional (ponto terminal da base)"

    if is_last_row:
        return ROW_TYPE_INTERVAL, f"Marco operacional de {INTERVAL_METERS} m no limite final do trecho"

    return ROW_TYPE_INTERVAL, f"Marco operacional a cada {INTERVAL_METERS} m ({build_marco_label(km_value)})"


def get_road_landmarks(road_key: str, display_name: str, segment_end_km: float) -> list[dict[str, object]]:
    landmarks = [
        {"km": round_km(item["km"]), "name": item["name"]}
        for item in LANDMARKS.get(road_key, [])
        if item["km"] <= segment_end_km + EPSILON
    ]

    if not landmarks or abs(landmarks[0]["km"]) > 1e-7:
        landmarks.insert(0, {"km": 0.0, "name": f"Inicio do trecho {road_key}"})

    if abs(landmarks[-1]["km"] - segment_end_km) > 1e-7:
        landmarks.append({"km": segment_end_km, "name": f"Fim do trecho {road_key}"})

    deduped = []
    seen = set()
    for landmark in landmarks:
        key = (landmark["km"], landmark["name"])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(landmark)

    return deduped or [{"km": 0.0, "name": display_name}]


def build_local_name(road_key: str, display_name: str, km_value: float, segment_end_km: float) -> str:
    landmarks = get_road_landmarks(road_key, display_name, segment_end_km)

    for landmark in landmarks:
        if abs(km_value - landmark["km"]) < 0.011:
            return str(landmark["name"])

    previous_landmark = None
    next_landmark = None

    for landmark in landmarks:
        if landmark["km"] <= km_value + EPSILON:
            previous_landmark = landmark
            continue
        next_landmark = landmark
        break

    if previous_landmark and next_landmark:
        previous_name = str(previous_landmark["name"])
        next_name = str(next_landmark["name"])
        if previous_name == next_name:
            return previous_name
        return f"Entre {previous_name} e {next_name}"

    if previous_landmark:
        return str(previous_landmark["name"])

    if next_landmark:
        return str(next_landmark["name"])

    return display_name


def build_payload() -> dict[str, object]:
    gps_data = load_gps_data()
    generated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    summary_rows: list[dict[str, object]] = []
    all_rows: list[dict[str, object]] = []

    for order, config in enumerate(ROAD_CONFIG, start=1):
        road_key = config["key"]
        points = gps_data[road_key]
        gps_end_km = round_km(points[-1]["km"])
        segment_end_km = round_km(min(config["segment_end_km"], gps_end_km) if config["segment_end_km"] is not None else gps_end_km)
        target_kms = build_target_kms(segment_end_km)

        road_rows = []
        for row_index, km_value in enumerate(target_kms, start=1):
            latitude, longitude = interpolate_point(points, km_value)
            is_last_row = row_index == len(target_kms)
            row_type, description = build_row_description(km_value, segment_end_km, is_last_row)
            local_name = build_local_name(road_key, config["display_name"], km_value, segment_end_km)
            total_meters = int(round(km_value * 1000))

            row = {
                "road_order": order,
                "row_order": row_index,
                "rodovia": road_key,
                "trecho": config["display_name"],
                "nome_local": local_name,
                "km": round_km(km_value),
                "km_label": format_km_label(km_value),
                "marco": build_marco_label(km_value),
                "metragem_m": total_meters,
                "latitude": round(latitude, 6),
                "longitude": round(longitude, 6),
                "tipo": row_type,
                "descricao": description,
                "observacoes": config["notes"],
            }
            road_rows.append(row)
            all_rows.append(row)

        summary_rows.append(
            {
                "rodovia": road_key,
                "trecho": config["display_name"],
                "km_inicial": 0.0,
                "km_final": segment_end_km,
                "km_final_label": format_km_label(segment_end_km),
                "quantidade_referencias": len(road_rows),
                "pontos_gps_base": len(points),
                "observacoes": config["notes"],
            }
        )

    return {
        "title": f"Referencias a cada {INTERVAL_METERS} m - Rodovias da Grande Florianopolis",
        "generated_at": generated_at,
        "interval_m": INTERVAL_METERS,
        "source_file": str(GPS_DATA_PATH.relative_to(ROOT)).replace("\\", "/"),
        "assumptions": ASSUMPTIONS,
        "roads": summary_rows,
        "rows": all_rows,
    }


def column_letter(index: int) -> str:
    result = []
    while index > 0:
        index, remainder = divmod(index - 1, 26)
        result.append(chr(65 + remainder))
    return "".join(reversed(result))


def xml_cell(cell_ref: str, value: object, style_id: int = 0) -> str:
    style_attr = f' s="{style_id}"' if style_id else ""

    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return f'<c r="{cell_ref}"{style_attr}><v>{value}</v></c>'

    escaped = escape("" if value is None else str(value))
    return f'<c r="{cell_ref}" t="inlineStr"{style_attr}><is><t>{escaped}</t></is></c>'


def build_sheet_xml(rows: list[list[object]]) -> str:
    xml_rows = []
    for row_number, row_values in enumerate(rows, start=1):
        style_id = 1 if row_number == 1 else 0
        cells = [
            xml_cell(f"{column_letter(column_number)}{row_number}", cell_value, style_id)
            for column_number, cell_value in enumerate(row_values, start=1)
        ]
        xml_rows.append(f'<row r="{row_number}">{"".join(cells)}</row>')

    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        "<sheetViews><sheetView workbookViewId=\"0\"/></sheetViews>"
        f"<sheetData>{''.join(xml_rows)}</sheetData>"
        "</worksheet>"
    )


def build_xlsx(payload: dict[str, object]) -> None:
    generated_at = payload["generated_at"]
    summary_rows = payload["roads"]
    reference_rows = payload["rows"]

    sheet1_rows = [
        ["Rodovia", "Trecho", "KM inicial", "KM final", "Qtde referencias", "Pontos base GPS", "Observacoes"]
    ]
    for row in summary_rows:
        sheet1_rows.append(
            [
                row["rodovia"],
                row["trecho"],
                row["km_inicial"],
                row["km_final"],
                row["quantidade_referencias"],
                row["pontos_gps_base"],
                row["observacoes"],
            ]
        )

    sheet2_rows = [
        ["Rodovia", "Trecho", "Nome do local", "KM", "Marco", "Metragem (m)", "Latitude", "Longitude", "Tipo", "Descricao", "Observacoes"]
    ]
    for row in reference_rows:
        sheet2_rows.append(
            [
                row["rodovia"],
                row["trecho"],
                row["nome_local"],
                row["km"],
                row["marco"],
                row["metragem_m"],
                row["latitude"],
                row["longitude"],
                row["tipo"],
                row["descricao"],
                row["observacoes"],
            ]
        )

    styles_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        "<fonts count=\"2\">"
        "<font><sz val=\"11\"/><name val=\"Calibri\"/></font>"
        "<font><b/><sz val=\"11\"/><name val=\"Calibri\"/></font>"
        "</fonts>"
        "<fills count=\"2\">"
        "<fill><patternFill patternType=\"none\"/></fill>"
        "<fill><patternFill patternType=\"solid\"><fgColor rgb=\"FF1F2937\"/><bgColor indexed=\"64\"/></patternFill></fill>"
        "</fills>"
        "<borders count=\"1\"><border><left/><right/><top/><bottom/><diagonal/></border></borders>"
        "<cellStyleXfs count=\"1\"><xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\"/></cellStyleXfs>"
        "<cellXfs count=\"2\">"
        "<xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\"/>"
        "<xf numFmtId=\"0\" fontId=\"1\" fillId=\"1\" borderId=\"0\" xfId=\"0\" applyFont=\"1\" applyFill=\"1\"/>"
        "</cellXfs>"
        "</styleSheet>"
    )

    workbook_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        "<sheets>"
        '<sheet name="Resumo" sheetId="1" r:id="rId1"/>'
        '<sheet name="Referencias" sheetId="2" r:id="rId2"/>'
        "</sheets>"
        "</workbook>"
    )

    workbook_rels_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>'
        '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
        "</Relationships>"
    )

    package_rels_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
        '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
        "</Relationships>"
    )

    content_types_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        '<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
        '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
        "</Types>"
    )

    core_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
        'xmlns:dc="http://purl.org/dc/elements/1.1/" '
        'xmlns:dcterms="http://purl.org/dc/terms/" '
        'xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
        "<dc:creator>Codex</dc:creator>"
        "<cp:lastModifiedBy>Codex</cp:lastModifiedBy>"
        "<dc:title>Referencias Grande Florianopolis</dc:title>"
        f"<dc:description>Referencias operacionais a cada {INTERVAL_METERS} metros</dc:description>"
        f'<dcterms:created xsi:type="dcterms:W3CDTF">{generated_at}</dcterms:created>'
        f'<dcterms:modified xsi:type="dcterms:W3CDTF">{generated_at}</dcterms:modified>'
        "</cp:coreProperties>"
    )

    app_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
        'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
        "<Application>Codex</Application>"
        "</Properties>"
    )

    with zipfile.ZipFile(XLSX_OUT_PATH, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", content_types_xml)
        archive.writestr("_rels/.rels", package_rels_xml)
        archive.writestr("docProps/core.xml", core_xml)
        archive.writestr("docProps/app.xml", app_xml)
        archive.writestr("xl/workbook.xml", workbook_xml)
        archive.writestr("xl/_rels/workbook.xml.rels", workbook_rels_xml)
        archive.writestr("xl/styles.xml", styles_xml)
        archive.writestr("xl/worksheets/sheet1.xml", build_sheet_xml(sheet1_rows))
        archive.writestr("xl/worksheets/sheet2.xml", build_sheet_xml(sheet2_rows))


def main() -> None:
    payload = build_payload()

    JSON_OUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    JS_OUT_PATH.write_text(
        "window.GRANDE_FLORIANOPOLIS_REFERENCIAS = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    build_xlsx(payload)

    print(f"Arquivo JSON gerado em: {JSON_OUT_PATH}")
    print(f"Arquivo JS gerado em: {JS_OUT_PATH}")
    print(f"Arquivo XLSX gerado em: {XLSX_OUT_PATH}")


if __name__ == "__main__":
    main()
