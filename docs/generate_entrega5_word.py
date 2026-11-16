import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DIAG_DIR = r"C:\Users\Lenovo\Downloads\tutorias-backend\docs\diagrams"
DOCX_PATH = r"C:\Users\Lenovo\Downloads\tutorias-backend\docs\Entrega5_Documento_Tecnico_Consolidado.docx"

doc = docx.Document()

# 1. Configuración de Página según Normas APA (Márgenes de 2.54 cm / 1 pulgada)
for section in doc.sections:
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)
    section.page_width = Inches(8.5)
    section.page_height = Inches(11.0)
    # Header & Footer
    header = section.header
    hp = header.paragraphs[0]
    hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    hrun = hp.add_run("SGTU — Documento Técnico Consolidado | UNIAJS")
    hrun.font.name = "Times New Roman"
    hrun.font.size = Pt(8.5)
    hrun.font.color.rgb = RGBColor(120, 120, 120)

# Helper functions
def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_shading(cell, color_hex):
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading)

def set_table_apa_borders(table):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="single" w:sz="10" w:space="0" w:color="1A202C"/>'
        f'  <w:bottom w:val="single" w:sz="10" w:space="0" w:color="1A202C"/>'
        f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>'
        f'  <w:insideV w:val="none"/>'
        f'  <w:left w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_p(text="", bold_prefix=None, space_after=6, space_before=0, align=WD_ALIGN_PARAGRAPH.LEFT, line_spacing=1.3):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    if bold_prefix:
        r_bold = p.add_run(bold_prefix)
        r_bold.font.name = "Times New Roman"
        r_bold.font.size = Pt(11)
        r_bold.bold = True
        r_bold.font.color.rgb = RGBColor(30, 41, 59)
    if text:
        r_text = p.add_run(text)
        r_text.font.name = "Times New Roman"
        r_text.font.size = Pt(11)
        r_text.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_bullet(text, bold_prefix=None):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.2
    if bold_prefix:
        r_bold = p.add_run(bold_prefix)
        r_bold.font.name = "Times New Roman"
        r_bold.font.size = Pt(11)
        r_bold.bold = True
        r_bold.font.color.rgb = RGBColor(30, 41, 59)
    if text:
        r_text = p.add_run(text)
        r_text.font.name = "Times New Roman"
        r_text.font.size = Pt(11)
        r_text.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_heading_1(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)
    return p

def add_heading_2(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.bold = True
    r.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_heading_3(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(11.5)
    r.bold = True
    r.italic = True
    r.font.color.rgb = RGBColor(51, 65, 85)
    return p

def add_figure(img_filename, num, title, note="Diagrama arquitectónico generado a partir de la especificación técnica del sistema.", width_in=6.2):
    img_path = os.path.join(DIAG_DIR, img_filename)
    if not os.path.exists(img_path):
        print(f"Warning: image {img_path} not found")
        return
    
    # APA 7 Figure Label
    p_num = doc.add_paragraph()
    p_num.paragraph_format.space_before = Pt(12)
    p_num.paragraph_format.space_after = Pt(2)
    p_num.paragraph_format.keep_with_next = True
    r_num = p_num.add_run(f"Figura {num}")
    r_num.font.name = "Times New Roman"
    r_num.font.size = Pt(10.5)
    r_num.bold = True

    # APA 7 Figure Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(6)
    p_title.paragraph_format.keep_with_next = True
    r_title = p_title.add_run(title)
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(10.5)
    r_title.italic = True

    # Image
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(4)
    p_img.paragraph_format.space_after = Pt(6)
    p_img.paragraph_format.keep_with_next = True
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=Inches(width_in))

    # APA 7 Figure Note
    p_note = doc.add_paragraph()
    p_note.paragraph_format.space_before = Pt(0)
    p_note.paragraph_format.space_after = Pt(14)
    r_note_lbl = p_note.add_run("Nota. ")
    r_note_lbl.font.name = "Times New Roman"
    r_note_lbl.font.size = Pt(9.5)
    r_note_lbl.italic = True
    r_note_txt = p_note.add_run(note)
    r_note_txt.font.name = "Times New Roman"
    r_note_txt.font.size = Pt(9.5)
    r_note_txt.font.color.rgb = RGBColor(71, 85, 105)

def add_table_apa(headers, rows, num, title, note="Fuente: Elaboración propia del equipo de desarrollo del SGTU (2026).", col_widths=None):
    # APA 7 Table Label
    p_num = doc.add_paragraph()
    p_num.paragraph_format.space_before = Pt(12)
    p_num.paragraph_format.space_after = Pt(2)
    p_num.paragraph_format.keep_with_next = True
    r_num = p_num.add_run(f"Tabla {num}")
    r_num.font.name = "Times New Roman"
    r_num.font.size = Pt(10.5)
    r_num.bold = True

    # APA 7 Table Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(6)
    p_title.paragraph_format.keep_with_next = True
    r_title = p_title.add_run(title)
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(10.5)
    r_title.italic = True

    # Table
    table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_apa_borders(table)

    # Headers
    hdr_cells = table.rows[0].cells
    for i, header_text in enumerate(headers):
        hdr_cells[i].text = header_text
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
        set_cell_shading(hdr_cells[i], "F1F5F9")
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.runs[0].font.name = "Times New Roman"
        p.runs[0].font.size = Pt(9.5)
        p.runs[0].bold = True
        p.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    # Data Rows
    for r_idx, row_data in enumerate(rows):
        row_cells = table.rows[r_idx + 1].cells
        for c_idx, cell_value in enumerate(row_data):
            row_cells[c_idx].text = str(cell_value)
            set_cell_margins(row_cells[c_idx], top=70, bottom=70, left=120, right=120)
            p = row_cells[c_idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.15
            if len(p.runs) > 0:
                p.runs[0].font.name = "Times New Roman"
                p.runs[0].font.size = Pt(9.0)
                p.runs[0].font.color.rgb = RGBColor(51, 65, 85)

    # Apply col widths if provided
    if col_widths:
        for row in table.rows:
            for idx, w in enumerate(col_widths):
                row.cells[idx].width = Inches(w)

    # APA 7 Table Note
    p_note = doc.add_paragraph()
    p_note.paragraph_format.space_before = Pt(4)
    p_note.paragraph_format.space_after = Pt(14)
    r_note_lbl = p_note.add_run("Nota. ")
    r_note_lbl.font.name = "Times New Roman"
    r_note_lbl.font.size = Pt(9.0)
    r_note_lbl.italic = True
    r_note_txt = p_note.add_run(note)
    r_note_txt.font.name = "Times New Roman"
    r_note_txt.font.size = Pt(9.0)
    r_note_txt.font.color.rgb = RGBColor(71, 85, 105)

def add_code_block(code_text):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_shading(cell, "F8FAFC")
    set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'  <w:left w:val="single" w:sz="18" w:space="0" w:color="0284C7"/>'
        f'  <w:top w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
        f'  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
        f'  <w:right w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
        f'</w:tcBorders>'
    )
    cell._tc.get_or_add_tcPr().append(borders)
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    for line in code_text.strip().split('\n'):
        run = p.add_run(line + '\n')
        run.font.name = 'Consolas'
        run.font.size = Pt(8.5)
        run.font.color.rgb = RGBColor(15, 23, 42)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

print("Starting generation of Cover Page...")

# ==============================================================================
# PÁGINA 1: PORTADA ESTILO NORMAS APA 7 (INSTITUCIONAL / ESTUDIANTIL)
# ==============================================================================
p_cover_top = doc.add_paragraph()
p_cover_top.paragraph_format.space_before = Pt(36)
p_cover_top.paragraph_format.space_after = Pt(12)
p_cover_top.alignment = WD_ALIGN_PARAGRAPH.CENTER

r_inst = p_cover_top.add_run("CORPORACIÓN UNIVERSITARIA ANTONIO JOSÉ DE SUCRE\n")
r_inst.font.name = "Times New Roman"
r_inst.font.size = Pt(13)
r_inst.bold = True
r_inst.font.color.rgb = RGBColor(15, 23, 42)

r_fac = p_cover_top.add_run("FACULTAD DE CIENCIAS E INGENIERÍAS\nPROGRAMA DE INGENIERÍA DE SISTEMAS\n")
r_fac.font.name = "Times New Roman"
r_fac.font.size = Pt(11.5)
r_fac.font.color.rgb = RGBColor(51, 65, 85)

# Título Principal
p_title = doc.add_paragraph()
p_title.paragraph_format.space_before = Pt(48)
p_title.paragraph_format.space_after = Pt(12)
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER

r_t1 = p_title.add_run("SISTEMA DE GESTIÓN DE TUTORÍAS UNIVERSITARIAS (SGTU)\n")
r_t1.font.name = "Times New Roman"
r_t1.font.size = Pt(16)
r_t1.bold = True
r_t1.font.color.rgb = RGBColor(15, 23, 42)

r_t2 = p_title.add_run("Documento Técnico Consolidado y Memoria Final del Proyecto\nArquitectura Full-Stack, Persistencia en AWS RDS, Despliegue en la Nube y Frontend Integrado")
r_t2.font.name = "Times New Roman"
r_t2.font.size = Pt(12)
r_t2.font.color.rgb = RGBColor(71, 85, 105)

# Autores
p_autores = doc.add_paragraph()
p_autores.paragraph_format.space_before = Pt(48)
p_autores.paragraph_format.space_after = Pt(6)
p_autores.alignment = WD_ALIGN_PARAGRAPH.CENTER

r_aut_lbl = p_autores.add_run("Integrantes del Equipo de Desarrollo:\n")
r_aut_lbl.font.name = "Times New Roman"
r_aut_lbl.font.size = Pt(11)
r_aut_lbl.bold = True

autores_texto = (
    "Wadid Rivas Payares — Arquitectura, Backend e Integración\n"
    "Eduardo Julio Bettin Avilez — Líder Técnico de Frontend y UX\n"
    "Azael Espitia Toribio — Base de Datos, Persistencia y AWS RDS\n"
    "Jhon Jader Bertel Ortega — Control de Calidad (QA), Pruebas y Validación\n"
)
r_aut_txt = p_autores.add_run(autores_texto)
r_aut_txt.font.name = "Times New Roman"
r_aut_txt.font.size = Pt(10.5)

# Asignatura y Docente
p_meta = doc.add_paragraph()
p_meta.paragraph_format.space_before = Pt(36)
p_meta.paragraph_format.space_after = Pt(24)
p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER

meta_texto = (
    "Asignatura: Electiva Profesional II (Semana 12)\n"
    "Docente Evaluador: Ing. Jaider de la Rosa Bertel\n"
    "Semestre Académico: 2026-2\n\n"
    "Sincelejo, Sucre, Colombia\n"
    "Noviembre de 2026"
)
r_meta = p_meta.add_run(meta_texto)
r_meta.font.name = "Times New Roman"
r_meta.font.size = Pt(10.5)
r_meta.font.color.rgb = RGBColor(51, 65, 85)

doc.add_page_break()

# ==============================================================================
# PÁGINA 2: TABLA DE CONTENIDO (TOC) FORMAL APA 7
# ==============================================================================
add_heading_1("Tabla de Contenido")

toc_items = [
    ("1. Resumen Ejecutivo del Proyecto", "3"),
    ("    1.1 Producto Final Entregado", "3"),
    ("    1.2 Métricas Globales del Sistema", "4"),
    ("2. Entrega 1 — Requerimientos y Arquitectura del Sistema", "5"),
    ("    2.1 Descripción de la Problemática", "5"),
    ("    2.2 Solución Propuesta y Flujo General de Actores", "5"),
    ("    2.3 Requerimientos Funcionales (RF)", "6"),
    ("    2.4 Requerimientos No Funcionales (RNF)", "7"),
    ("    2.5 Arquitectura General del Sistema", "7"),
    ("3. Entrega 2 — Modelado de Base de Datos y Backend Inicial", "8"),
    ("    3.1 Modelo Entidad-Relación Normalizado (3FN)", "8"),
    ("    3.2 Diccionario de Datos — 9 Tablas del Sistema", "9"),
    ("    3.3 Despliegue en la Nube con Amazon Web Services (AWS RDS)", "13"),
    ("4. Entrega 3 — Backend Completo, Seguridad y Pruebas", "14"),
    ("    4.1 Ficha Técnica del Backend", "14"),
    ("    4.2 Arquitectura en Cuatro Capas", "15"),
    ("    4.3 Matriz de Control de Acceso RBAC", "16"),
    ("    4.4 Flujo de Autenticación Stateless y Token JWT", "17"),
    ("    4.5 Resultados de Pruebas Automatizadas (100% Aprobado)", "18"),
    ("    4.6 Manejo Centralizado de Excepciones (RFC 7807)", "19"),
    ("5. Entrega 4 — Frontend Angular Integrado", "20"),
    ("    5.1 Ficha Técnica del Frontend", "20"),
    ("    5.2 Arquitectura Modular de Carpetas", "20"),
    ("    5.3 Capa de Servicios Angular con HttpClient", "22"),
    ("    5.4 Pipeline de Seguridad en el Frontend (Guards e Interceptors)", "23"),
    ("    5.5 Vistas y Operaciones CRUD por Rol", "24"),
    ("    5.6 Evidencia de Integración Real con el Backend (Cero Mocks)", "25"),
    ("6. Estado Final del Sistema Desplegado", "26"),
    ("    6.1 Infraestructura en Producción", "26"),
    ("    6.2 Pipeline CI/CD Automatizado", "26"),
    ("    6.3 Correcciones y Estabilización de la Entrega Final", "27"),
    ("    6.4 Cuadro de Resultados Finales", "27"),
    ("7. Accesos Rápidos y Credenciales para el Evaluador", "28"),
    ("    7.1 Enlaces Oficiales de Producción", "28"),
    ("    7.2 Credenciales Institucionales de Demostración", "28"),
    ("    7.3 Ejecución de Pruebas Automatizadas con Newman", "29"),
    ("    7.4 Procedimiento de Verificación de Integración en Navegador", "29")
]

# Render TOC visually with dot leaders
tbl_toc = doc.add_table(rows=len(toc_items), cols=2)
tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
for idx, (title, page) in enumerate(toc_items):
    c_title = tbl_toc.cell(idx, 0)
    c_page = tbl_toc.cell(idx, 1)
    c_title.width = Inches(5.6)
    c_page.width = Inches(0.9)
    set_cell_margins(c_title, top=30, bottom=30, left=50, right=50)
    set_cell_margins(c_page, top=30, bottom=30, left=50, right=50)
    
    p0 = c_title.paragraphs[0]
    p0.paragraph_format.space_before = Pt(0)
    p0.paragraph_format.space_after = Pt(1)
    r0 = p0.add_run(title)
    r0.font.name = "Times New Roman"
    r0.font.size = Pt(10)
    if not title.startswith("    "):
        r0.bold = True
    
    p1 = c_page.paragraphs[0]
    p1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p1.paragraph_format.space_before = Pt(0)
    p1.paragraph_format.space_after = Pt(1)
    r1 = p1.add_run(page)
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(10)
    if not title.startswith("    "):
        r1.bold = True

add_p("", space_after=14)

# Lista de Figuras
add_heading_2("Lista de Figuras")
figuras_lista = [
    ("Figura 1", "Flujo General de Actores y Acompañamiento Académico en el SGTU", "5"),
    ("Figura 2", "Arquitectura General en Capas del Sistema SGTU", "7"),
    ("Figura 3", "Modelo Entidad-Relación Normalizado en Tercera Forma Normal (3FN)", "8"),
    ("Figura 4", "Arquitectura en Cuatro Capas del Backend REST Spring Boot", "15"),
    ("Figura 5", "Flujo de Autenticación Stateless y Emisión de Token JWT", "17"),
    ("Figura 6", "Pipeline de Seguridad, Guards e Interceptor HTTP en el Frontend Angular", "23"),
    ("Figura 7", "Topología de Despliegue en la Nube (Vercel, Render y AWS RDS)", "26"),
    ("Figura 8", "Evidencia de Tráfico en Tiempo Real en la Pestaña Network (Cero Mocks)", "25")
]
tbl_figs = doc.add_table(rows=len(figuras_lista), cols=3)
tbl_figs.alignment = WD_TABLE_ALIGNMENT.CENTER
for idx, (f_num, f_desc, f_page) in enumerate(figuras_lista):
    c0 = tbl_figs.cell(idx, 0)
    c1 = tbl_figs.cell(idx, 1)
    c2 = tbl_figs.cell(idx, 2)
    c0.width = Inches(1.0)
    c1.width = Inches(4.7)
    c2.width = Inches(0.8)
    set_cell_margins(c0, top=20, bottom=20, left=30, right=30)
    set_cell_margins(c1, top=20, bottom=20, left=30, right=30)
    set_cell_margins(c2, top=20, bottom=20, left=30, right=30)
    
    p0 = c0.paragraphs[0]
    r0 = p0.add_run(f_num)
    r0.font.name = "Times New Roman"; r0.font.size = Pt(9.5); r0.bold = True
    
    p1 = c1.paragraphs[0]
    r1 = p1.add_run(f_desc)
    r1.font.name = "Times New Roman"; r1.font.size = Pt(9.5); r1.italic = True
    
    p2 = c2.paragraphs[0]
    p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r2 = p2.add_run(f_page)
    r2.font.name = "Times New Roman"; r2.font.size = Pt(9.5)

doc.add_page_break()

# ==============================================================================
# SECCIÓN 1: RESUMEN EJECUTIVO DEL PROYECTO
# ==============================================================================
add_heading_1("1. Resumen Ejecutivo del Proyecto")

add_p(
    "El Sistema de Gestión de Tutorías Universitarias (SGTU) es una solución tecnológica integral de grado empresarial, "
    "diseñada y desarrollada durante el semestre académico 2026-2 en el marco de la asignatura Electiva Profesional II del "
    "programa de Ingeniería de Sistemas de la Corporación Universitaria Antonio José de Sucre (UNIAJS). "
    "Su misión primordial radica en digitalizar, centralizar, asegurar y optimizar el proceso de acompañamiento pedagógico "
    "entre estudiantes y docentes tutores, resolviendo las ineficiencias de los canales informales y garantizando la trazabilidad "
    "académica institucional."
)

add_p(
    "A lo largo de doce semanas de trabajo iterativo, el equipo de desarrollo cumplió satisfactoriamente con la totalidad de los "
    "hitos del cronograma curricular: levantamiento de requerimientos y diseño de arquitectura (Entrega 1), modelado relacional "
    "normalizado hasta la Tercera Forma Normal (3FN) y persistencia en la nube mediante AWS RDS (Entrega 2), construcción de un backend "
    "robusto en Spring Boot con autenticación stateless JWT y pruebas automatizadas (Entrega 3), e implementación de una Single Page "
    "Application (SPA) en Angular 21 con diseño responsivo Tailwind CSS e integración real con la API (Entrega 4)."
)

add_heading_2("1.1 Producto Final Entregado")
add_p(
    "El producto final se encuentra completamente desplegado en entornos productivos de la nube bajo protocolo seguro HTTPS, "
    "ofreciendo disponibilidad ininterrumpida y sincronización inmediata entre las capas cliente, servicio y datos:"
)

tbl_prod_headers = ["Componente", "Tecnología Principal", "Entorno / Servicio Cloud", "URL de Producción"]
tbl_prod_rows = [
    ["Frontend SPA", "Angular 21 + Tailwind CSS", "Vercel Cloud (Edge)", "https://sgtu-tutorias-universitarias.vercel.app"],
    ["Backend REST API", "Spring Boot 3 + Spring Security 6", "Render Cloud (Docker Alpine)", "https://sgtu-tutorias-universitarias.onrender.com"],
    ["Base de Datos Relacional", "MySQL 8.0 Community", "Amazon Web Services (AWS RDS)", "Endpoint us-east-2 (Puerto 3306)"],
    ["Documentación OpenAPI", "Springdoc + Swagger UI 3.0", "Render Cloud", "https://sgtu-tutorias-universitarias.onrender.com/swagger-ui/index.html"],
    ["Control de Versiones", "Git Monorepo", "GitHub", "https://github.com/WRivxs/SGTU-Tutorias-Universitarias"]
]
add_table_apa(tbl_prod_headers, tbl_prod_rows, 1, "Ficha técnica y topología de los componentes del producto final", col_widths=[1.3, 1.6, 1.6, 2.0])

add_heading_2("1.2 Métricas Globales del Sistema")
add_p("A continuación se resumen los indicadores clave de desarrollo, cobertura y calidad alcanzados en la solución final:")

add_bullet(" Nueve tablas relacionales normalizadas hasta 3FN con integridad referencial ON DELETE RESTRICT y auditoría temporal.", "Estructura de Base de Datos:")
add_bullet(" Nueve controladores REST con mapeo exhaustivo de operaciones CRUD para todas las entidades.", "Servicios Backend:")
add_bullet(" Tres perfiles claramente definidos (ADMINISTRADOR, DOCENTE, ESTUDIANTE) protegidos por filtros JWT y anotaciones declarativas @PreAuthorize.", "Seguridad y RBAC:")
add_bullet(" 53 aserciones ejecutadas con 100% de éxito (17 pruebas unitarias JUnit 5/Mockito y 36 pruebas de integración Postman/Newman).", "Pruebas Automatizadas:")
add_bullet(" Catorce módulos de vista cargados perezosamente (Lazy Loading) con formularios reactivos y feedback visual mediante Toasts y Modales.", "Frontend SPA:")
add_bullet(" Integración continua con auto-despliegue en cada confirmación (push) hacia la rama main del repositorio oficial.", "Flujo CI/CD:")

# ==============================================================================
# SECCIÓN 2: ENTREGA 1 — REQUERIMIENTOS Y ARQUITECTURA
# ==============================================================================
add_heading_1("2. Entrega 1 — Requerimientos y Arquitectura del Sistema")

add_heading_2("2.1 Descripción de la Problemática")
add_p(
    "Históricamente, los procesos de tutoría y asesoría académica en las instituciones universitarias han adolecido de una falta "
    "de sistematización formal. Los docentes publican horarios de atención en carteleras físicas o canales de mensajería instantánea, "
    "provocando cruces de horario, desconocimiento de los cupos disponibles por sesión, ausencia de seguimiento pedagógico y sobrecarga "
    "administrativa al momento de consolidar reportes semestrales de retención estudiantil. "
    "El proyecto SGTU nace como respuesta a esta problemática, proveyendo un ecosistema digital único donde la oferta académica de "
    "acompañamiento se vincule directamente a la estructura curricular formal de la institución."
)

add_heading_2("2.2 Solución Propuesta y Flujo General de Actores")
add_p(
    "La solución articula a los tres actores fundamentales de la comunidad educativa mediante interfaces personalizadas según su rol:"
)

add_figure("figura_1.png", 1, "Flujo General de Actores y Acompañamiento Académico en el SGTU", note="Diagrama de interacción entre los tres actores principales y el repositorio central de datos en AWS RDS.")

add_heading_2("2.3 Requerimientos Funcionales (RF)")
add_p("El sistema implementa de forma verificable los siguientes requerimientos funcionales prioritarios:")

tbl_rf_headers = ["Identificador", "Descripción Funcional del Requerimiento", "Rol Autorizado", "Prioridad"]
tbl_rf_rows = [
    ["RF-01", "Autenticación segura mediante correo electrónico institucional y contraseña cifrada con emisión de token JWT.", "Todos (Público)", "Alta"],
    ["RF-02", "Gestión administrativa de usuarios: listar, crear, editar perfiles, cambiar estado (activo/inactivo) y eliminar.", "ADMINISTRADOR", "Alta"],
    ["RF-03", "Gestión de la estructura académica institucional: catálogo de facultades, programas y asignaturas curriculares.", "ADMINISTRADOR", "Alta"],
    ["RF-04", "Publicación y programación de sesiones de tutoría especificando fecha, hora, modalidad (presencial/virtual) y cupo máximo.", "DOCENTE", "Alta"],
    ["RF-05", "Gestión de solicitudes de inscripción: los tutores pueden aceptar o rechazar postulaciones con descuento automático de cupos.", "DOCENTE", "Alta"],
    ["RF-06", "Búsqueda y filtrado dinámico de tutorías ofertadas por materia, docente titular o semestre lectivo.", "ESTUDIANTE", "Alta"],
    ["RF-07", "Radicación de solicitudes de acompañamiento académico con control automático de cupos disponibles.", "ESTUDIANTE", "Alta"],
    ["RF-08", "Seguimiento en tiempo real del estado de solicitudes radicadas (PENDIENTE, ACEPTADA, RECHAZADA, CANCELADA).", "ESTUDIANTE", "Alta"],
    ["RF-09", "Control concurrente de cupos máximos y transición atómica del estado de la tutoría a OCUPADA al llenarse el aforo.", "Sistema / Backend", "Alta"],
    ["RF-10", "Respuestas de error estandarizadas bajo el estándar RFC 7807 ante violaciones de validación o accesos denegados.", "Sistema / Backend", "Media"]
]
add_table_apa(tbl_rf_headers, tbl_rf_rows, 2, "Matriz de Requerimientos Funcionales del SGTU", col_widths=[0.8, 3.8, 1.2, 0.7])

add_heading_2("2.4 Requerimientos No Funcionales (RNF)")
add_bullet(" Autenticación stateless con JSON Web Tokens firmados criptográficamente mediante algoritmo HMAC-SHA256 (HS256) y contraseñas hasheadas con BCrypt (cost factor 10).", "Seguridad:")
add_bullet(" Infraestructura en la nube con disponibilidad 24/7 y certificados TLS/HTTPS forzados en todos los puntos de conexión.", "Disponibilidad:")
add_bullet(" Tiempos de respuesta inferiores a 500 ms en consultas transaccionales con el backend en estado activo.", "Rendimiento:")
add_bullet(" Separación estricta de responsabilidades en cuatro capas (Controlador, Servicio, Repositorio, Base de Datos) desacoplada del frontend.", "Mantenibilidad:")
add_bullet(" Interfaz responsiva adaptable a dispositivos móviles, tabletas y computadores de escritorio desarrollada con Tailwind CSS.", "Usabilidad y Accesibilidad:")

add_heading_2("2.5 Arquitectura General del Sistema")
add_p(
    "El sistema implementa una arquitectura distribuida y desacoplada cliente-servidor orientada a servicios RESTful. "
    "El frontend Angular interactúa con el backend Spring Boot exclusivamente a través de peticiones HTTP/JSON aseguradas con Bearer Tokens, "
    "mientras que el backend se comunica con la base de datos MySQL alojada en Amazon Web Services (AWS RDS):"
)

add_figure("figura_2.png", 2, "Arquitectura General en Capas del Sistema SGTU", note="Diagrama conceptual de la arquitectura de extremo a extremo, mostrando el aislamiento de capas.")

# ==============================================================================
# SECCIÓN 3: ENTREGA 2 — MODELADO DE BASE DE DATOS Y BACKEND INICIAL
# ==============================================================================
add_heading_1("3. Entrega 2 — Modelado de Base de Datos y Backend Inicial")

add_heading_2("3.1 Modelo Entidad-Relación Normalizado (3FN)")
add_p(
    "A partir de las observaciones docentes de la Entrega 1, el esquema relacional fue refactorizado y normalizado hasta la "
    "Tercera Forma Normal (3FN). Se eliminaron las redundancias de cadenas de texto libre, se introdujo la jerarquía académica formal "
    "(Facultad -> Programa -> Materia), se separó la identidad del usuario de su rol especializado mediante relaciones 1:1, "
    "y se implementó la relación muchos a muchos (N:M) entre docentes y las asignaturas que están facultados para impartir:"
)

add_figure("figura_3.png", 3, "Modelo Entidad-Relación Normalizado en Tercera Forma Normal (3FN)", note="Diagrama ER que describe las nueve entidades relacionales y sus cardinalidades formalmente implementadas.", width_in=5.8)

add_heading_2("3.2 Diccionario de Datos — 9 Tablas del Sistema")
add_p("A continuación se presenta la especificación exhaustiva de cada una de las 9 tablas que conforman la base de datos `tutorias_db`:")

# 3.2.1 facultades
add_heading_3("3.2.1 Tabla: facultades")
add_p("Catálogo institucional de las facultades de la universidad.")
tbl_fac_headers = ["Columna", "Tipo de Dato", "Restricciones", "Descripción Funcional"]
tbl_fac_rows = [
    ["id_facultad", "BIGINT", "PK, AUTO_INCREMENT", "Identificador único de la facultad."],
    ["nombre", "VARCHAR(120)", "NOT NULL, UNIQUE", "Nombre oficial de la facultad (ej. Facultad de Ciencias e Ingenierías)."],
    ["codigo", "VARCHAR(20)", "NOT NULL, UNIQUE", "Código mnemotécnico institucional (ej. FAC-ING)."],
    ["descripcion", "VARCHAR(255)", "NULL", "Reseña o campo del saber."],
    ["estado", "BOOLEAN", "NOT NULL, DEFAULT TRUE", "Estado operativo (activa/inactiva)."]
]
add_table_apa(tbl_fac_headers, tbl_fac_rows, 3, "Estructura de la tabla facultades", col_widths=[1.2, 1.2, 1.6, 2.5])

# 3.2.2 programas
add_heading_3("3.2.2 Tabla: programas")
add_p("Carreras profesionales adscritas a una facultad (Relación 1:N).")
tbl_prog_headers = ["Columna", "Tipo de Dato", "Restricciones", "Descripción Funcional"]
tbl_prog_rows = [
    ["id_programa", "BIGINT", "PK, AUTO_INCREMENT", "Identificador único del programa académico."],
    ["facultad_id", "BIGINT", "NOT NULL, FK -> facultades", "Facultad institucional a la cual pertenece."],
    ["nombre", "VARCHAR(120)", "NOT NULL", "Nombre del programa (ej. Ingeniería de Sistemas)."],
    ["codigo", "VARCHAR(20)", "NOT NULL, UNIQUE", "Código institucional de carrera (ej. PROG-SIS)."],
    ["descripcion", "VARCHAR(255)", "NULL", "Perfil ocupacional y enfoque curricular."],
    ["estado", "BOOLEAN", "NOT NULL, DEFAULT TRUE", "Estado operativo del programa."]
]
add_table_apa(tbl_prog_headers, tbl_prog_rows, 4, "Estructura de la tabla programas", col_widths=[1.2, 1.2, 1.6, 2.5])

# 3.2.3 materias
add_heading_3("3.2.3 Tabla: materias")
add_p("Asignaturas que componen el plan de estudios o malla curricular de un programa.")
tbl_mat_headers = ["Columna", "Tipo de Dato", "Restricciones", "Descripción Funcional"]
tbl_mat_rows = [
    ["id_materia", "BIGINT", "PK, AUTO_INCREMENT", "Identificador único de la asignatura."],
    ["programa_id", "BIGINT", "NOT NULL, FK -> programas", "Programa académico al que pertenece."],
    ["nombre", "VARCHAR(120)", "NOT NULL", "Nombre de la materia (ej. Estructuras de Datos)."],
    ["codigo", "VARCHAR(20)", "NOT NULL, UNIQUE", "Código curricular (ej. SIS-302)."],
    ["semestre", "INT", "NOT NULL, CHECK (1..12)", "Semestre en el que se ubica según la malla."],
    ["creditos", "INT", "NOT NULL, CHECK (1..6)", "Número de créditos académicos asignados."],
    ["descripcion", "VARCHAR(255)", "NULL", "Contenido sinóptico o resumen de la materia."],
    ["estado", "BOOLEAN", "NOT NULL, DEFAULT TRUE", "Estado activo en el catálogo."]
]
add_table_apa(tbl_mat_headers, tbl_mat_rows, 5, "Estructura de la tabla materias", col_widths=[1.1, 1.1, 1.6, 2.7])

# 3.2.4 usuarios
add_heading_3("3.2.4 Tabla: usuarios")
add_p("Entidad central de seguridad, credenciales de acceso y asignación de roles.")
tbl_usr_headers = ["Columna", "Tipo de Dato", "Restricciones", "Descripción Funcional"]
tbl_usr_rows = [
    ["id_usuario", "BIGINT", "PK, AUTO_INCREMENT", "Identificador único de la cuenta."],
    ["nombre", "VARCHAR(80)", "NOT NULL", "Nombre(s) de la persona."],
    ["apellido", "VARCHAR(80)", "NOT NULL", "Apellido(s) de la persona."],
    ["correo", "VARCHAR(120)", "NOT NULL, UNIQUE", "Correo electrónico institucional (credencial de acceso)."],
    ["password", "VARCHAR(255)", "NOT NULL", "Hash criptográfico de la contraseña (BCrypt cost 10)."],
    ["rol", "ENUM", "NOT NULL", "Valores permitidos: ADMINISTRADOR, DOCENTE, ESTUDIANTE."],
    ["estado", "BOOLEAN", "NOT NULL, DEFAULT TRUE", "Habilitación de acceso al sistema."],
    ["fecha_registro", "DATETIME", "NOT NULL, DEFAULT NOW()", "Timestamp de creación de la cuenta."]
]
add_table_apa(tbl_usr_headers, tbl_usr_rows, 6, "Estructura de la tabla usuarios", col_widths=[1.1, 1.1, 1.6, 2.7])

# 3.2.5 docentes
add_heading_3("3.2.5 Tabla: docentes")
add_p("Perfil académico especializado vinculado 1:1 con un usuario de rol DOCENTE.")
tbl_doc_headers = ["Columna", "Tipo de Dato", "Restricciones", "Descripción Funcional"]
tbl_doc_rows = [
    ["id_docente", "BIGINT", "PK, AUTO_INCREMENT", "Identificador único del perfil docente."],
    ["usuario_id", "BIGINT", "NOT NULL, UNIQUE, FK -> usuarios", "Vínculo unívoco con la cuenta de usuario."],
    ["especialidad", "VARCHAR(150)", "NULL", "Áreas de formación técnica y académica."],
    ["descripcion", "VARCHAR(255)", "NULL", "Reseña curricular del docente tutor."],
    ["disponibilidad", "VARCHAR(150)", "NULL", "Franjas horarias habituales de atención."]
]
add_table_apa(tbl_doc_headers, tbl_doc_rows, 7, "Estructura de la tabla docentes", col_widths=[1.1, 1.1, 1.8, 2.5])

# 3.2.6 docente_materias
add_heading_3("3.2.6 Tabla: docente_materias")
add_p("Tabla intermedia para la relación muchos a muchos (N:M) entre docentes y asignaturas habilitadas.")
tbl_dm_headers = ["Columna", "Tipo de Dato", "Restricciones", "Descripción Funcional"]
tbl_dm_rows = [
    ["docente_id", "BIGINT", "NOT NULL, FK -> docentes", "Identificador del docente."],
    ["materia_id", "BIGINT", "NOT NULL, FK -> materias", "Identificador de la asignatura."],
    ["PK Compuesta", "(docente_id, materia_id)", "PRIMARY KEY", "Garantiza unicidad de asignación evitando duplicados."]
]
add_table_apa(tbl_dm_headers, tbl_dm_rows, 8, "Estructura de la tabla docente_materias", col_widths=[1.2, 1.3, 1.8, 2.2])

# 3.2.7 estudiantes
add_heading_3("3.2.7 Tabla: estudiantes")
add_p("Perfil académico especializado vinculado 1:1 con un usuario de rol ESTUDIANTE.")
tbl_est_headers = ["Columna", "Tipo de Dato", "Restricciones", "Descripción Funcional"]
tbl_est_rows = [
    ["id_estudiante", "BIGINT", "PK, AUTO_INCREMENT", "Identificador del perfil de estudiante."],
    ["usuario_id", "BIGINT", "NOT NULL, UNIQUE, FK -> usuarios", "Vínculo unívoco con la cuenta de usuario."],
    ["programa_id", "BIGINT", "NOT NULL, FK -> programas", "Carrera universitaria matriculada."],
    ["semestre_actual", "INT", "NOT NULL, CHECK (1..12)", "Semestre lectivo en curso."],
    ["codigo_estudiantil", "VARCHAR(30)", "NOT NULL, UNIQUE", "Código oficial institucional de matrícula."]
]
add_table_apa(tbl_est_headers, tbl_est_rows, 9, "Estructura de la tabla estudiantes", col_widths=[1.3, 1.1, 1.7, 2.4])

# 3.2.8 tutorias
add_heading_3("3.2.8 Tabla: tutorias")
add_p("Sesiones de acompañamiento académico programadas y ofertadas por los docentes tutores.")
tbl_tut_headers = ["Columna", "Tipo de Dato", "Restricciones", "Descripción Funcional"]
tbl_tut_rows = [
    ["id_tutoria", "BIGINT", "PK, AUTO_INCREMENT", "Identificador de la sesión de tutoría."],
    ["docente_id", "BIGINT", "NOT NULL, FK -> docentes", "Tutor titular que imparte la sesión."],
    ["materia_id", "BIGINT", "NOT NULL, FK -> materias", "Asignatura reforzada en la sesión."],
    ["fecha", "DATE", "NOT NULL", "Fecha de programación."],
    ["hora", "TIME", "NOT NULL", "Hora de inicio estipulada."],
    ["modalidad", "ENUM", "NOT NULL", "Valores permitidos: PRESENCIAL, VIRTUAL."],
    ["lugar", "VARCHAR(150)", "NULL", "Aula física o enlace de videollamada."],
    ["cupo_maximo", "INT", "NOT NULL, DEFAULT 5", "Capacidad máxima de estudiantes autorizados."],
    ["cupos_ocupados", "INT", "NOT NULL, DEFAULT 0", "Contador de solicitudes aceptadas."],
    ["descripcion", "VARCHAR(255)", "NULL", "Temática o eje temático de la sesión."],
    ["estado", "ENUM", "NOT NULL, DEFAULT 'DISPONIBLE'", "Valores: DISPONIBLE, OCUPADA, CANCELADA, FINALIZADA."]
]
add_table_apa(tbl_tut_headers, tbl_tut_rows, 10, "Estructura de la tabla tutorias", col_widths=[1.1, 1.1, 1.6, 2.7])

# 3.2.9 solicitudes
add_heading_3("3.2.9 Tabla: solicitudes")
add_p("Peticiones de inscripción y reserva de cupo radicadas por los estudiantes.")
tbl_sol_headers = ["Columna", "Tipo de Dato", "Restricciones", "Descripción Funcional"]
tbl_sol_rows = [
    ["id_solicitud", "BIGINT", "PK, AUTO_INCREMENT", "Identificador de la solicitud."],
    ["estudiante_id", "BIGINT", "NOT NULL, FK -> estudiantes", "Estudiante que solicita el acompañamiento."],
    ["tutoria_id", "BIGINT", "NOT NULL, FK -> tutorias", "Sesión a la cual postula."],
    ["fecha_solicitud", "DATETIME", "NOT NULL, DEFAULT NOW()", "Timestamp de radicación de la petición."],
    ["estado", "ENUM", "NOT NULL, DEFAULT 'PENDIENTE'", "Valores: PENDIENTE, ACEPTADA, RECHAZADA, CANCELADA."],
    ["mensaje_estudiante", "VARCHAR(255)", "NULL", "Duda puntual o justificación del alumno."],
    ["respuesta_docente", "VARCHAR(255)", "NULL", "Observación o retroalimentación del tutor."]
]
add_table_apa(tbl_sol_headers, tbl_sol_rows, 11, "Estructura de la tabla solicitudes", col_widths=[1.3, 1.1, 1.6, 2.5])

add_heading_2("3.3 Despliegue en la Nube con Amazon Web Services (AWS RDS)")
add_p(
    "Para garantizar alta disponibilidad, aislamiento de red y cumplimiento con los estándares de la industria, "
    "la base de datos se encuentra alojada en una instancia administrada de Amazon Relational Database Service (AWS RDS):"
)
add_bullet(" MySQL Community Edition versión 8.0.x gestionada en AWS.", "Motor de Base de Datos:")
add_bullet(" db.t3.micro (Capa Gratuita de AWS), optimizada para cargas transaccionales ligeras con almacenamiento SSD gp2 de 20 GB.", "Clase de Instancia:")
add_bullet(" parcial1electiva.cd40okomwyz0.us-east-2.rds.amazonaws.com en el puerto 3306.", "Endpoint de Conexión:")
add_bullet(" Security Group configurado con reglas Inbound estrictas que permiten conexiones entrantes en el puerto 3306 exclusivamente para los servidores de Render y los entornos locales de prueba del equipo mediante variables de entorno cifradas.", "Seguridad de Red:")

# ==============================================================================
# SECCIÓN 4: ENTREGA 3 — BACKEND COMPLETO, SEGURIDAD Y PRUEBAS
# ==============================================================================
add_heading_1("4. Entrega 3 — Backend Completo, Seguridad y Pruebas")

add_heading_2("4.1 Ficha Técnica del Backend")
add_p(
    "El backend del SGTU fue construido siguiendo las mejores prácticas de la ingeniería de software moderna en el ecosistema Java Enterprise:"
)

tbl_tech_headers = ["Componente / Módulo", "Tecnología / Framework", "Versión", "Responsabilidad Principal en la Arquitectura"]
tbl_tech_rows = [
    ["Lenguaje de Programación", "Java OpenJDK LTS", "21 LTS", "Lenguaje fuertemente tipado para lógica de negocio y controladores."],
    ["Framework de Aplicación", "Spring Boot", "3.3.x", "Inversión de control (IoC), inyección de dependencias y autoconfiguración."],
    ["Seguridad y Filtros", "Spring Security", "6.x", "Cadena de filtros de seguridad, CORS, autenticación y autorización."],
    ["Generación y Validación JWT", "JJWT (Java JWT)", "0.11.5", "Firma criptográfica HMAC-SHA256 y decodificación de tokens de sesión."],
    ["Cifrado de Contraseñas", "BCryptPasswordEncoder", "10 rounds", "Función hash unidireccional resistente a ataques de fuerza bruta."],
    ["Capa de Persistencia ORM", "Spring Data JPA / Hibernate", "6.x", "Mapeo objeto-relacional, transaccionalidad y repositorios."],
    ["Documentación Dinámica", "Springdoc OpenAPI", "2.5.x", "Generación automática de especificación Swagger UI 3.0."],
    ["Validación Declarativa", "Jakarta Validation", "8.x", "Control de integridad de atributos de entrada en DTOs (@Valid)."]
]
add_table_apa(tbl_tech_headers, tbl_tech_rows, 12, "Ficha técnica de librerías y componentes del Backend", col_widths=[1.5, 1.4, 0.9, 2.7])

add_heading_2("4.2 Arquitectura en Cuatro Capas")
add_p(
    "El código del backend se organiza bajo una arquitectura en capas estrictamente desacoplada, asegurando alta cohesión y bajo acoplamiento:"
)

add_figure("figura_4.png", 4, "Arquitectura en Cuatro Capas del Backend REST Spring Boot", note="Diagrama de capas que ilustra el flujo de peticiones desde el cliente hasta la base de datos MySQL en AWS RDS.")

add_heading_2("4.3 Matriz de Control de Acceso Basado en Roles (RBAC)")
add_p(
    "El sistema no admite el registro anónimo de cuentas. Todo acceso a recursos protegidos se controla mediante la anotación "
    "declarativa `@PreAuthorize` evaluada antes de la ejecución de cada método del controlador:"
)

tbl_rbac_headers = ["Endpoint REST", "Método HTTP", "Roles Institucionales Autorizados", "Regla Evaluada (@PreAuthorize)"]
tbl_rbac_rows = [
    ["/api/auth/login", "POST", "Público", "permitAll()"],
    ["/api/usuarios", "GET, POST", "ADMINISTRADOR", "hasRole('ADMINISTRADOR')"],
    ["/api/usuarios/{id}", "PUT, DELETE", "ADMINISTRADOR", "hasRole('ADMINISTRADOR')"],
    ["/api/facultades", "GET", "ADMIN, DOCENTE, ESTUDIANTE", "isAuthenticated()"],
    ["/api/facultades/**", "POST, PUT, DELETE", "ADMINISTRADOR", "hasRole('ADMINISTRADOR')"],
    ["/api/programas", "GET", "ADMIN, DOCENTE, ESTUDIANTE", "isAuthenticated()"],
    ["/api/programas/**", "POST, PUT, DELETE", "ADMINISTRADOR", "hasRole('ADMINISTRADOR')"],
    ["/api/materias", "GET", "ADMIN, DOCENTE, ESTUDIANTE", "isAuthenticated()"],
    ["/api/materias/**", "POST, PUT, DELETE", "ADMINISTRADOR", "hasRole('ADMINISTRADOR')"],
    ["/api/tutorias", "GET", "ADMIN, DOCENTE, ESTUDIANTE", "isAuthenticated()"],
    ["/api/tutorias", "POST, PUT", "ADMINISTRADOR, DOCENTE", "hasRole('ADMINISTRADOR') or hasRole('DOCENTE')"],
    ["/api/solicitudes", "POST", "ESTUDIANTE", "hasRole('ESTUDIANTE')"],
    ["/api/solicitudes/{id}/responder", "PATCH", "ADMINISTRADOR, DOCENTE", "hasRole('ADMINISTRADOR') or hasRole('DOCENTE')"],
    ["/swagger-ui/**", "GET", "Público", "permitAll()"]
]
add_table_apa(tbl_rbac_headers, tbl_rbac_rows, 13, "Matriz de Permisos y Control de Acceso RBAC", col_widths=[1.8, 1.0, 1.8, 1.9])

add_heading_2("4.4 Flujo de Autenticación Stateless y Token JWT")
add_p(
    "El ciclo de autenticación opera bajo una arquitectura completamente sin estado (stateless), eliminando la dependencia de sesiones "
    "en el servidor (JSESSIONID) y permitiendo la escalabilidad horizontal en la nube:"
)

add_figure("figura_5.png", 5, "Flujo de Autenticación Stateless y Emisión de Token JWT", note="Mecanismo de verificación de credenciales con BCrypt y emisión de token firmado con expiración de 24 horas.")

add_p("Estructura JSON del payload empaquetado en el token JWT emitido:")
add_code_block(
    '{\n'
    '  "sub": "admin@tutorias.com",\n'
    '  "id": 1,\n'
    '  "rol": "ADMINISTRADOR",\n'
    '  "nombre": "Administrador",\n'
    '  "apellido": "del Sistema",\n'
    '  "iat": 1762624800,\n'
    '  "exp": 1762711200\n'
    '}'
)

add_heading_2("4.5 Resultados de Pruebas Automatizadas (100% Aprobado)")
add_p(
    "La integridad del backend fue validada exhaustivamente mediante dos baterías automatizadas de pruebas independientes, "
    "alcanzando un índice de éxito perfecto del 100%:"
)

tbl_tests_headers = ["Nivel de Prueba", "Framework / Herramienta", "Clases / Peticiones Evaluadas", "Aserciones Automatizadas", "Aprobadas", "% Éxito"]
tbl_tests_rows = [
    ["Pruebas Unitarias de Backend", "JUnit 5 + Mockito (Surefire)", "4 Clases de Servicio", "17 pruebas unitarias", "17", "100%"],
    ["Pruebas de Integración de API", "Postman Runner & Newman CLI", "17 Peticiones HTTP", "36 scripts pm.test", "36", "100%"],
    ["TOTAL CONSOLIDADO", "Maven + Newman", "21 Suites", "53 Aserciones", "53", "100%"]
]
add_table_apa(tbl_tests_headers, tbl_tests_rows, 14, "Resumen general de pruebas automatizadas aprobadas", col_widths=[1.8, 1.6, 1.2, 0.9, 0.5, 0.5])

add_heading_2("4.6 Manejo Centralizado de Excepciones (RFC 7807)")
add_p(
    "Todas las excepciones producidas en el sistema son interceptadas globalmente por la clase `GlobalExceptionHandler` "
    "anotada con `@RestControllerAdvice`, garantizando que el cliente reciba invariablemente una estructura JSON estandarizada "
    "según la especificación internacional RFC 7807:"
)

add_code_block(
    '{\n'
    '  "timestamp": "2026-11-16T14:30:00.125",\n'
    '  "status": 403,\n'
    '  "error": "Forbidden",\n'
    '  "message": "Acceso denegado: se requieren privilegios del rol ADMINISTRADOR",\n'
    '  "path": "/api/facultades"\n'
    '}'
)

# ==============================================================================
# SECCIÓN 5: ENTREGA 4 — FRONTEND ANGULAR INTEGRADO
# ==============================================================================
add_heading_1("5. Entrega 4 — Frontend Angular Integrado")

add_heading_2("5.1 Ficha Técnica del Frontend")
add_p("La interfaz de usuario fue diseñada como una Single Page Application (SPA) reactiva y moderna:")

tbl_fe_headers = ["Tecnología", "Versión", "Propósito en la Capa Cliente"]
tbl_fe_rows = [
    ["Angular", "21.x", "Framework principal basado en Standalone Components y control de flujo moderno (@if, @for)."],
    ["TypeScript", "5.x", "Tipado estático estricto para modelos de dominio, servicios e interfaces DTO."],
    ["Tailwind CSS", "3.x", "Diseño responsivo móvil-primero (mobile-first) mediante clases de utilidad."],
    ["RxJS", "7.x", "Programación reactiva con Observables para el consumo asíncrono de peticiones HTTP."],
    ["Angular Router", "21.x", "Enrutamiento dinámico con carga perezosa (Lazy Loading) y guardianes."],
    ["ReactiveFormsModule", "21.x", "Formularios reactivos con validaciones sincrónicas en tiempo real."]
]
add_table_apa(tbl_fe_headers, tbl_fe_rows, 15, "Ficha técnica de tecnologías implementadas en el Frontend", col_widths=[1.5, 1.0, 4.0])

add_heading_2("5.2 Arquitectura Modular de Carpetas")
add_p("El código fuente del frontend en `frontend/src/app` se organiza en tres dominios modulares limpios:")

add_bullet(" Núcleo de la aplicación. Aloja los guardianes de ruta (`auth.guard`, `role.guard`), interceptores HTTP (`jwt.interceptor`, `error.interceptor`) y servicios globales singulares (`AuthService`, `ToastService`, `DialogService`).", "core/:")
add_bullet(" Componentes visuales y modelos compartidos. Incluye las barras de navegación (`navbar`, `sidebar` específico para cada rol), componentes UI desacoplados (`ToastContainer`, `ConfirmDialog`) y las interfaces de datos TypeScript sincronizadas con las entidades JPA del backend.", "shared/:")
add_bullet(" Módulos funcionales cargados mediante Lazy Loading organizados por contexto de rol: autenticación (`auth`), administración (`admin`), docente (`tutor`) y estudiante (`estudiante`).", "modules/:")

add_heading_2("5.3 Capa de Servicios Angular con HttpClient")
add_p(
    "Todos los servicios del cliente consumen de forma tipada los endpoints de la API en Render, gestionando parámetros "
    "de consulta (`HttpParams`) y transformaciones con operadores RxJS (`map`, `tap`, `catchError`)."
)

add_heading_2("5.4 Pipeline de Seguridad en el Frontend (Guards e Interceptors)")
add_p(
    "La seguridad en el cliente opera de manera completamente transparente al usuario mediante una cadena de dos niveles: "
    "los guardianes de ruta validan el acceso antes de renderizar la vista, y el interceptor HTTP inyecta el token JWT en cada llamada saliente:"
)

add_figure("figura_6.png", 6, "Pipeline de Seguridad, Guards e Interceptor HTTP en el Frontend Angular", note="Flujo de verificación de rutas protegidas y adjunción automática de cabeceras de autorización.")

add_heading_2("5.5 Vistas y Operaciones CRUD por Rol")
add_p("A continuación se presenta la matriz de módulos y operaciones funcionales implementadas en la interfaz de usuario:")

tbl_crud_headers = ["Módulo / Rol", "Vista / Componente", "Operaciones CRUD Implementadas"]
tbl_crud_rows = [
    ["Público", "pages/login", "Autenticación mediante credenciales con validación reactiva y control de sesión."],
    ["Administrador", "gestion-usuarios", "Listar todos los usuarios, crear nuevos usuarios, editar contacto, suspender/activar estado y eliminar."],
    ["Administrador", "gestion-facultades", "Listar facultades, crear nuevas facultades y programas asociados."],
    ["Administrador", "gestion-materias", "Listar asignaturas con filtros por programa y semestre, crear y editar materias."],
    ["Docente Tutor", "mis-tutorias", "Listar asesorías ofertadas, crear nuevas sesiones (fecha, hora, modalidad, cupo) y cancelar."],
    ["Docente Tutor", "solicitudes", "Listar solicitudes recibidas en tiempo real, aceptar (con descuento de cupo) y rechazar con mensaje."],
    ["Estudiante", "buscar-tutorias", "Explorar y filtrar catálogo de asesorías disponibles y solicitar cupo con validación."],
    ["Estudiante", "mis-solicitudes", "Consultar historial de postulaciones (PENDIENTE, ACEPTADA, RECHAZADA) y cancelar."]
]
add_table_apa(tbl_crud_headers, tbl_crud_rows, 16, "Matriz de Vistas y Operaciones CRUD del Frontend", col_widths=[1.3, 1.8, 3.4])

add_heading_2("5.6 Evidencia de Integración Real con el Backend (Cero Mocks)")
add_p(
    "La aplicación web no utiliza ningún archivo JSON estático, datos mockeados ni servicios simulados. "
    "El frontend en Vercel consume exclusivamente la API REST en Render, la cual persiste y consulta la base de datos MySQL en AWS RDS. "
    "La siguiente captura de la herramienta de desarrollador (Browser DevTools -> Network) evidencia las llamadas HTTP en vivo "
    "con código de estado 200 OK y las cabeceras de autorización emitidas:"
)

add_figure("figura_8_network.png", 8, "Evidencia de Tráfico en Tiempo Real en la Pestaña Network (Cero Mocks)", note="Captura del navegador demostrando peticiones exitosas (200 OK) hacia el backend en Render y persistencia en AWS RDS.", width_in=6.4)

# ==============================================================================
# SECCIÓN 6: ESTADO FINAL DEL SISTEMA DESPLEGADO
# ==============================================================================
add_heading_1("6. Estado Final del Sistema Desplegado")

add_heading_2("6.1 Infraestructura en Producción")
add_p(
    "La topología final del sistema aprovecha un esquema multicloud que maximiza el rendimiento, la disponibilidad y la rentabilidad:"
)

add_figure("figura_7.png", 7, "Topología de Despliegue en la Nube (Vercel, Render y AWS RDS)", note="Diagrama de infraestructura en producción con conexiones cifradas TLS/HTTPS y puerto 3306 de MySQL.")

add_heading_2("6.2 Pipeline CI/CD Automatizado")
add_p(
    "El proyecto implementa un flujo de entrega continua totalmente automatizado. Cualquier confirmación (`git push`) "
    "hacia la rama `main` del monorepo en GitHub desencadena simultáneamente dos pipelines de construcción y despliegue:"
)
add_bullet(" El proveedor detecta cambios en la carpeta `/frontend`, ejecuta `ng build --configuration production` y publica los artefactos compilados en la red global de distribución de contenido (CDN) con compresión Gzip/Brotli.", "Pipeline Vercel (Frontend):")
add_bullet(" El servicio detecta cambios en `/backend`, descarga el código en un contenedor Docker con OpenJDK 21, ejecuta `mvn clean package -DskipTests` y levanta la aplicación Spring Boot exponiendo los endpoints bajo HTTPS.", "Pipeline Render (Backend):")

add_heading_2("6.3 Correcciones y Estabilización de la Entrega Final")
add_p("Durante la fase de integración final se abordaron y subsanaron los siguientes aspectos técnicos:")
add_bullet(" En la capa gratuita de Render, la instancia entra en suspensión tras 15 minutos de inactividad. Se documentó este comportamiento para el evaluador y se implementó un indicador visual en el frontend que informa al usuario durante el tiempo de calentamiento (cold start).", "Manejo del Cold Start:")
add_bullet(" Se configuró explícitamente la clase `WebConfig` en Spring Boot para autorizar las solicitudes de origen cruzado provenientes de `https://sgtu-tutorias-universitarias.vercel.app`, exponiendo la cabecera `Authorization`.", "Políticas CORS:")
add_bullet(" Se implementó la anotación `@Transactional` en el método `responderSolicitud` para asegurar que el incremento de cupos ocupados y la actualización del estado de la solicitud ocurran como una única operación atómica sin inconsistencias.", "Transacciones Atómicas:")

add_heading_2("6.4 Cuadro de Resultados Finales")

tbl_res_headers = ["Indicador de Desempeño / Métrica", "Valor Alcanzado", "Criterio de Evaluación"]
tbl_res_rows = [
    ["Controladores REST Implementados", "9 Controladores", "Cumple al 100% (CRUD completo en todas las entidades)."],
    ["Aserciones Automatizadas de Prueba", "53 de 53 Aprobadas (100%)", "Cumple al 100% (0 fallos en lógica, validaciones y RBAC)."],
    ["Entidades JPA y Tablas en Base de Datos", "9 Tablas Normalizadas (3FN)", "Cumple al 100% (Estructura académica universitaria completa)."],
    ["Seguridad y Protección de Endpoints", "Spring Security 6 + JWT", "Cumple al 100% (Stateless, BCrypt y autorización declarativa)."],
    ["Interfaz de Usuario y Responsividad", "Angular 21 + Tailwind CSS", "Cumple al 100% (Diseño adaptable a móviles y escritorios)."],
    ["Despliegue y Disponibilidad en la Nube", "Vercel + Render + AWS RDS", "Cumple al 100% (Operativo en vivo bajo protocolo seguro HTTPS)."]
]
add_table_apa(tbl_res_headers, tbl_res_rows, 17, "Cuadro de cumplimiento de objetivos y métricas del proyecto", col_widths=[2.2, 1.8, 2.5])

# ==============================================================================
# SECCIÓN 7: ACCESOS RÁPIDOS Y CREDENCIALES PARA EL EVALUADOR
# ==============================================================================
add_heading_1("7. Accesos Rápidos y Credenciales para el Evaluador")

add_heading_2("7.1 Enlaces Oficiales de Producción")
add_p("El evaluador docente puede acceder y verificar los componentes del proyecto mediante los siguientes enlaces oficiales:")

tbl_links_headers = ["Recurso / Entregable", "Ubicación / Enlace de Acceso"]
tbl_links_rows = [
    ["Aplicación Web Desplegada (Vercel)", "https://sgtu-tutorias-universitarias.vercel.app"],
    ["Backend REST API y Swagger UI (Render)", "https://sgtu-tutorias-universitarias.onrender.com/swagger-ui/index.html"],
    ["Repositorio Oficial en GitHub (Monorepo)", "https://github.com/WRivxs/SGTU-Tutorias-Universitarias"],
    ["Código Fuente del Frontend", "https://github.com/WRivxs/SGTU-Tutorias-Universitarias/tree/main/frontend"],
    ["Código Fuente del Backend", "https://github.com/WRivxs/SGTU-Tutorias-Universitarias/tree/main/backend"]
]
add_table_apa(tbl_links_headers, tbl_links_rows, 18, "Directorio de enlaces de acceso al proyecto", col_widths=[2.5, 4.0])

add_heading_2("7.2 Credenciales Institucionales de Demostración")
add_p("Cuentas de usuario precargadas en la base de datos de producción para pruebas inmediatas de cada rol:")

tbl_cred_headers = ["Rol Institucional", "Nombre Completo", "Correo Electrónico (Login)", "Contraseña de Acceso"]
tbl_cred_rows = [
    ["ADMINISTRADOR", "Administrador del Sistema", "admin@tutorias.com", "Admin123*"],
    ["DOCENTE TUTOR", "Prof. Wadid Rivas Payares", "wadid.docente@tutorias.com", "Docente123*"],
    ["ESTUDIANTE", "Ana Martínez (Ing. Sistemas)", "ana.estudiante@tutorias.com", "Estudiante123*"]
]
add_table_apa(tbl_cred_headers, tbl_cred_rows, 19, "Credenciales de acceso para evaluación de roles", col_widths=[1.5, 1.8, 2.0, 1.2])

add_heading_2("7.3 Ejecución de Pruebas Automatizadas con Newman")
add_p("Para reproducir de forma desatendida la suite completa de 36 pruebas de integración contra la API en la nube:")
add_code_block(
    '# 1. Clonar el repositorio oficial\n'
    'git clone https://github.com/WRivxs/SGTU-Tutorias-Universitarias.git\n'
    'cd SGTU-Tutorias-Universitarias\n\n'
    '# 2. Ejecutar la suite de pruebas contra el backend en Render\n'
    'npx newman run backend/postman/SGTU-API-Entrega3.postman_collection.json \\\n'
    '  -e backend/postman/SGTU-Render.postman_environment.json \\\n'
    '  --reporters cli'
)

add_heading_2("7.4 Procedimiento de Verificación de Integración en Navegador")
add_p("Para comprobar que no existen datos simulados ni mocks en la interfaz cliente:")
add_bullet(" Abra el enlace de producción: https://sgtu-tutorias-universitarias.vercel.app en un navegador web (Google Chrome o Microsoft Edge).", "Paso 1:")
add_bullet(" Abra las herramientas de desarrollador presionando la tecla F12 y diríjase a la pestaña Red (Network), filtrando por 'Fetch/XHR'.", "Paso 2:")
add_bullet(" Inicie sesión con cualquiera de las credenciales institucionales de la Tabla 19.", "Paso 3:")
add_bullet(" Verifique que todas las peticiones son dirigidas hacia el host `https://sgtu-tutorias-universitarias.onrender.com` con código de respuesta HTTP 200 OK o 201 Created.", "Paso 4:")
add_bullet(" Seleccione cualquier petición de catálogo (ej. `materias` o `tutorias`) y en la pestaña Headers confirme la presencia de la cabecera `Authorization: Bearer <token>` inyectada por el `JwtInterceptor`.", "Paso 5:")

# Conclusión final
p_fin = doc.add_paragraph()
p_fin.paragraph_format.space_before = Pt(24)
p_fin.paragraph_format.space_after = Pt(12)
p_fin.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_fin = p_fin.add_run("— Fin del Documento Técnico Consolidado —\nSGTU | Electiva Profesional II | UNIAJS | Noviembre 2026")
r_fin.font.name = "Times New Roman"
r_fin.font.size = Pt(10)
r_fin.italic = True
r_fin.font.color.rgb = RGBColor(100, 116, 139)

# Save document
doc.save(DOCX_PATH)
print(f"Document saved successfully at: {DOCX_PATH}")
