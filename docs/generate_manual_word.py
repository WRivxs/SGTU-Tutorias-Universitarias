import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DIAG_DIR = r"C:\Users\Lenovo\Downloads\tutorias-backend\docs\diagrams"
DOCX_PATH = r"C:\Users\Lenovo\Downloads\tutorias-backend\docs\Entrega5_Manual_de_Usuario.docx"

doc = docx.Document()

# Configuración de márgenes APA (1 pulgada / 2.54 cm)
for section in doc.sections:
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)
    section.page_width = Inches(8.5)
    section.page_height = Inches(11.0)
    # Header
    header = section.header
    hp = header.paragraphs[0]
    hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    hrun = hp.add_run("SGTU — Manual de Usuario Oficial | UNIAJS")
    hrun.font.name = "Times New Roman"
    hrun.font.size = Pt(8.5)
    hrun.font.color.rgb = RGBColor(120, 120, 120)

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

def add_callout(text, title="Nota Importante"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_shading(cell, "EFF6FF")
    set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'  <w:left w:val="single" w:sz="24" w:space="0" w:color="2563EB"/>'
        f'  <w:top w:val="none"/>'
        f'  <w:bottom w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    cell._tc.get_or_add_tcPr().append(borders)
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.2
    
    r_tit = p.add_run(f"📌 {title}: ")
    r_tit.font.name = "Times New Roman"
    r_tit.font.size = Pt(10)
    r_tit.bold = True
    r_tit.font.color.rgb = RGBColor(29, 78, 216)
    
    r_txt = p.add_run(text)
    r_txt.font.name = "Times New Roman"
    r_txt.font.size = Pt(10)
    r_txt.font.color.rgb = RGBColor(30, 58, 138)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def add_table_apa(headers, rows, num, title, note="Fuente: Equipo de desarrollo del SGTU (2026).", col_widths=None):
    p_num = doc.add_paragraph()
    p_num.paragraph_format.space_before = Pt(12)
    p_num.paragraph_format.space_after = Pt(2)
    p_num.paragraph_format.keep_with_next = True
    r_num = p_num.add_run(f"Tabla {num}")
    r_num.font.name = "Times New Roman"; r_num.font.size = Pt(10.5); r_num.bold = True

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(6)
    p_title.paragraph_format.keep_with_next = True
    r_title = p_title.add_run(title)
    r_title.font.name = "Times New Roman"; r_title.font.size = Pt(10.5); r_title.italic = True

    table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_apa_borders(table)

    hdr_cells = table.rows[0].cells
    for i, header_text in enumerate(headers):
        hdr_cells[i].text = header_text
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
        set_cell_shading(hdr_cells[i], "F1F5F9")
        p = hdr_cells[i].paragraphs[0]
        p.runs[0].font.name = "Times New Roman"; p.runs[0].font.size = Pt(9.5); p.runs[0].bold = True
        p.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    for r_idx, row_data in enumerate(rows):
        row_cells = table.rows[r_idx + 1].cells
        for c_idx, cell_value in enumerate(row_data):
            row_cells[c_idx].text = str(cell_value)
            set_cell_margins(row_cells[c_idx], top=70, bottom=70, left=120, right=120)
            p = row_cells[c_idx].paragraphs[0]
            if len(p.runs) > 0:
                p.runs[0].font.name = "Times New Roman"; p.runs[0].font.size = Pt(9.0)
                p.runs[0].font.color.rgb = RGBColor(51, 65, 85)

    if col_widths:
        for row in table.rows:
            for idx, w in enumerate(col_widths):
                row.cells[idx].width = Inches(w)

    p_note = doc.add_paragraph()
    p_note.paragraph_format.space_before = Pt(4)
    p_note.paragraph_format.space_after = Pt(14)
    r_note_lbl = p_note.add_run("Nota. ")
    r_note_lbl.font.name = "Times New Roman"; r_note_lbl.font.size = Pt(9.0); r_note_lbl.italic = True
    r_note_txt = p_note.add_run(note)
    r_note_txt.font.name = "Times New Roman"; r_note_txt.font.size = Pt(9.0)
    r_note_txt.font.color.rgb = RGBColor(71, 85, 105)

def add_figure(img_filename, num, title, note="Captura de pantalla de la interfaz de usuario en producción.", width_in=5.5):
    img_path = os.path.join(DIAG_DIR, img_filename)
    if not os.path.exists(img_path):
        return
    p_num = doc.add_paragraph()
    p_num.paragraph_format.space_before = Pt(12); p_num.paragraph_format.space_after = Pt(2)
    p_num.paragraph_format.keep_with_next = True
    r_num = p_num.add_run(f"Figura {num}")
    r_num.font.name = "Times New Roman"; r_num.font.size = Pt(10.5); r_num.bold = True

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0); p_title.paragraph_format.space_after = Pt(6)
    p_title.paragraph_format.keep_with_next = True
    r_title = p_title.add_run(title)
    r_title.font.name = "Times New Roman"; r_title.font.size = Pt(10.5); r_title.italic = True

    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(4); p_img.paragraph_format.space_after = Pt(6)
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=Inches(width_in))

    p_note = doc.add_paragraph()
    p_note.paragraph_format.space_before = Pt(0); p_note.paragraph_format.space_after = Pt(14)
    r_note_lbl = p_note.add_run("Nota. ")
    r_note_lbl.font.name = "Times New Roman"; r_note_lbl.font.size = Pt(9.0); r_note_lbl.italic = True
    r_note_txt = p_note.add_run(note)
    r_note_txt.font.name = "Times New Roman"; r_note_txt.font.size = Pt(9.0)
    r_note_txt.font.color.rgb = RGBColor(71, 85, 105)

# ==============================================================================
# PÁGINA 1: PORTADA APA 7
# ==============================================================================
p_cover_top = doc.add_paragraph()
p_cover_top.paragraph_format.space_before = Pt(40)
p_cover_top.paragraph_format.space_after = Pt(12)
p_cover_top.alignment = WD_ALIGN_PARAGRAPH.CENTER

r_inst = p_cover_top.add_run("CORPORACIÓN UNIVERSITARIA ANTONIO JOSÉ DE SUCRE\n")
r_inst.font.name = "Times New Roman"; r_inst.font.size = Pt(13); r_inst.bold = True
r_inst.font.color.rgb = RGBColor(15, 23, 42)

r_fac = p_cover_top.add_run("FACULTAD DE CIENCIAS E INGENIERÍAS\nPROGRAMA DE INGENIERÍA DE SISTEMAS\n")
r_fac.font.name = "Times New Roman"; r_fac.font.size = Pt(11.5)
r_fac.font.color.rgb = RGBColor(51, 65, 85)

p_title = doc.add_paragraph()
p_title.paragraph_format.space_before = Pt(48)
p_title.paragraph_format.space_after = Pt(12)
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER

r_t1 = p_title.add_run("MANUAL DE USUARIO DEL SISTEMA DE GESTIÓN DE TUTORÍAS UNIVERSITARIAS (SGTU)\n")
r_t1.font.name = "Times New Roman"; r_t1.font.size = Pt(16); r_t1.bold = True
r_t1.font.color.rgb = RGBColor(15, 23, 42)

r_t2 = p_title.add_run("Guía Oficial de Operación y Procedimientos para Administradores, Docentes y Estudiantes\nEntrega 5 — Proyecto Final Integrado")
r_t2.font.name = "Times New Roman"; r_t2.font.size = Pt(12)
r_t2.font.color.rgb = RGBColor(71, 85, 105)

p_autores = doc.add_paragraph()
p_autores.paragraph_format.space_before = Pt(48)
p_autores.paragraph_format.space_after = Pt(6)
p_autores.alignment = WD_ALIGN_PARAGRAPH.CENTER

r_aut_lbl = p_autores.add_run("Equipo de Desarrollo:\n")
r_aut_lbl.font.name = "Times New Roman"; r_aut_lbl.font.size = Pt(11); r_aut_lbl.bold = True

autores_texto = (
    "Wadid Rivas Payares\n"
    "Eduardo Julio Bettin Avilez\n"
    "Azael Espitia Toribio\n"
    "Jhon Jader Bertel Ortega\n"
)
r_aut_txt = p_autores.add_run(autores_texto)
r_aut_txt.font.name = "Times New Roman"; r_aut_txt.font.size = Pt(10.5)

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
r_meta.font.name = "Times New Roman"; r_meta.font.size = Pt(10.5)

doc.add_page_break()

# ==============================================================================
# PÁGINA 2: TABLA DE CONTENIDO
# ==============================================================================
add_heading_1("Tabla de Contenido")

toc_items = [
    ("1. Introducción y Propósito del Manual", "3"),
    ("2. Requisitos de Acceso y Compatibilidad", "3"),
    ("    2.1 Requisitos de Hardware y Navegadores", "3"),
    ("    2.2 Enlace de Acceso Oficial al Sistema", "4"),
    ("3. Módulo de Autenticación y Control de Sesión", "4"),
    ("    3.1 Inicio de Sesión (Login con Validación Reactiva)", "4"),
    ("    3.2 Cierre de Sesión Seguro (Logout)", "5"),
    ("4. Guía del Rol: Administrador del Sistema", "5"),
    ("    4.1 Dashboard Administrativo con Métricas en Tiempo Real", "5"),
    ("    4.2 Gestión de Cuentas de Usuario", "6"),
    ("    4.3 Gestión de Facultades y Programas Académicos", "7"),
    ("    4.4 Gestión del Catálogo Curricular de Materias", "7"),
    ("5. Guía del Rol: Docente Tutor", "8"),
    ("    5.1 Portal del Docente y Navegación", "8"),
    ("    5.2 Creación y Programación de Sesiones de Tutoría", "8"),
    ("    5.3 Gestión de Solicitudes y Control Automático de Aforo", "9"),
    ("6. Guía del Rol: Estudiante", "10"),
    ("    6.1 Búsqueda y Filtrado Reactivo de Tutorías Ofertadas", "10"),
    ("    6.2 Radicación de Solicitud de Cupo", "10"),
    ("    6.3 Seguimiento en Tiempo Real en Mis Solicitudes", "11"),
    ("7. Preguntas Frecuentes (FAQ) y Solución de Incidencias", "12"),
    ("8. Directorio de Cuentas Institucionales de Demostración", "13")
]

tbl_toc = doc.add_table(rows=len(toc_items), cols=2)
tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
for idx, (title, page) in enumerate(toc_items):
    c0 = tbl_toc.cell(idx, 0)
    c1 = tbl_toc.cell(idx, 1)
    c0.width = Inches(5.6); c1.width = Inches(0.9)
    set_cell_margins(c0, top=25, bottom=25, left=40, right=40)
    set_cell_margins(c1, top=25, bottom=25, left=40, right=40)
    
    p0 = c0.paragraphs[0]; r0 = p0.add_run(title)
    r0.font.name = "Times New Roman"; r0.font.size = Pt(10)
    if not title.startswith("    "):
        r0.bold = True
    
    p1 = c1.paragraphs[0]; p1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r1 = p1.add_run(page); r1.font.name = "Times New Roman"; r1.font.size = Pt(10)
    if not title.startswith("    "):
        r1.bold = True

doc.add_page_break()

# ==============================================================================
# CONTENIDO DEL MANUAL
# ==============================================================================
add_heading_1("1. Introducción y Propósito del Manual")
add_p(
    "El presente Manual de Usuario constituye la guía oficial de referencia y entrenamiento para la operación del "
    "Sistema de Gestión de Tutorías Universitarias (SGTU). La plataforma tiene como propósito centralizar la oferta y demanda "
    "de acompañamiento académico en la Corporación Universitaria Antonio José de Sucre (UNIAJS), reemplazando los canales "
    "informales mediante un entorno web seguro, transparente y accesible las 24 horas."
)
add_p(
    "Este manual detalla paso a paso los flujos de interacción correspondientes a los tres roles del sistema: "
    "Administrador (auditoría, usuarios y catálogo curricular), Docente Tutor (programación de asesorías y gestión de cupos) "
    "y Estudiante (exploración de tutorías, radicación de solicitudes y seguimiento académico)."
)

add_heading_1("2. Requisitos de Acceso y Compatibilidad")

add_heading_2("2.1 Requisitos de Hardware y Navegadores")
add_p("El sistema está desarrollado con arquitectura web responsiva y es compatible con cualquier dispositivo estándar:")
add_bullet(" Computadores de escritorio, portátiles, tablets y smartphones (pantallas a partir de 360 px de ancho).", "Dispositivos:")
add_bullet(" Google Chrome (v100+), Microsoft Edge (v100+), Mozilla Firefox (v100+) o Safari (v15+).", "Navegadores recomendados:")
add_bullet(" Conexión activa a Internet con capacidad para tráfico seguro HTTPS.", "Conectividad:")
add_bullet(" No requiere descargas de instaladores ni configuraciones adicionales. Puede ejecutarse directamente o añadirse como PWA a la pantalla de inicio móvil.", "Instalación:")

add_heading_2("2.2 Enlace de Acceso Oficial al Sistema")
add_p("Para ingresar a la plataforma en producción, abra el siguiente enlace seguro con certificado SSL:")
add_callout(
    "URL Oficial del Sistema Web: https://sgtu-tutorias-universitarias.vercel.app\n"
    "Documentación Interactiva Swagger: https://sgtu-tutorias-universitarias.onrender.com/swagger-ui/index.html",
    title="Enlaces Oficiales en la Nube"
)

add_heading_1("3. Módulo de Autenticación y Control de Sesión")

add_heading_2("3.1 Inicio de Sesión (Login con Validación Reactiva)")
add_p("Para autenticarse en el sistema, siga los siguientes pasos:")
add_bullet(" Ingrese a https://sgtu-tutorias-universitarias.vercel.app.", "Paso 1:")
add_bullet(" Digite su correo institucional y su contraseña personal asignada.", "Paso 2:")
add_bullet(" El sistema valida en tiempo real la consistencia de los datos (correo válido y contraseña de al menos 6 caracteres). Si los datos son inválidos, el formulario indicará el error con bordes rojos explicativos.", "Paso 3:")
add_bullet(" Haga clic en el botón Iniciar Sesión. El backend validará las credenciales contra la base de datos MySQL en AWS RDS mediante el algoritmo hash BCrypt.", "Paso 4:")
add_bullet(" Al ser exitoso, se emitirá un token criptográfico seguro (JWT) y el sistema redirigirá al usuario directamente al panel correspondiente a su rol institucional.", "Paso 5:")

add_callout(
    "En la capa gratuita de Render, si el servidor ha permanecido inactivo más de 15 minutos, puede entrar en modo suspensión. "
    "El primer inicio de sesión puede tardar entre 20 y 30 segundos mientras despierta la API. Las peticiones siguientes "
    "responderán de manera instantánea (< 500 ms).",
    title="Aviso sobre el tiempo de inicio (Cold Start)"
)

add_heading_2("3.2 Cierre de Sesión Seguro (Logout)")
add_p(
    "Para garantizar la privacidad y seguridad de la información, el usuario puede cerrar su sesión en cualquier momento:"
)
add_bullet(" En la parte inferior del menú lateral o en la barra superior, presione el botón Cerrar Sesión.", "Paso 1:")
add_bullet(" Se presentará un cuadro de diálogo modal de confirmación: '¿Desea cerrar la sesión actual?'.", "Paso 2:")
add_bullet(" Al presionar Confirmar, se destruyen todos los tokens de autenticación almacenados en el navegador (localStorage.clear()) y se bloquea la navegación hacia atrás.", "Paso 3:")

add_heading_1("4. Guía del Rol: Administrador del Sistema")

add_heading_2("4.1 Dashboard Administrativo con Métricas en Tiempo Real")
add_p(
    "Al autenticarse con el rol ADMINISTRADOR, el usuario accede al panel principal de monitoreo institucional, "
    "el cual consulta en tiempo real el estado de la base de datos:"
)

add_figure("manual_dashboard.png", 1, "Panel de Control Administrativo del SGTU con Métricas en Vivo", note="Visualización del total de usuarios (10), materias catalogadas (12), tutorías activas (6) y solicitudes registradas (7).")

add_p("El dashboard ofrece indicadores clave de desempeño:")
add_bullet(" Muestra el aforo de cuentas discriminado en estudiantes, tutores y administradores.", "Total Usuarios:")
add_bullet(" Contador de asignaturas activas vinculadas a programas académicos.", "Materias Registradas:")
add_bullet(" Sesiones académicas ofertadas en el período lectivo.", "Tutorías Creadas:")
add_bullet(" Histórico de solicitudes radicadas por estudiantes a la espera de resolución o confirmadas.", "Total Solicitudes:")

add_heading_2("4.2 Gestión de Cuentas de Usuario")
add_p("Ubicado en el menú lateral en la sección Gestión de Usuarios (/admin/usuarios):")
add_bullet(" Visualice una tabla con nombres, apellidos, correo, rol y estado de cuenta.", "Listar Usuarios:")
add_bullet(" Presione el botón '+ Nuevo Usuario', complete los campos requeridos (Nombre, Apellido, Correo, Contraseña inicial y Rol) y guarde. La contraseña se almacenará con cifrado BCrypt.", "Crear Usuario:")
add_bullet(" Puede activar o suspender el acceso de cualquier cuenta mediante el interruptor de estado sin eliminar el histórico del usuario.", "Cambiar Estado:")
add_bullet(" Presione el ícono de papelera para dar de baja un usuario tras confirmar la advertencia del modal.", "Eliminar:")

add_heading_2("4.3 Gestión de Facultades y Programas Académicos")
add_p("Desde la sección Estructura Académica (/admin/facultades):")
add_bullet(" Permite registrar las facultades de la universidad ingresando nombre y código institucional (ej. FAC-ING).", "Facultades:")
add_bullet(" Permite agregar programas académicos vinculándolos a una facultad padre, definiendo el código de carrera (ej. PROG-SIS).", "Programas:")

add_heading_2("4.4 Gestión del Catálogo Curricular de Materias")
add_p("Desde la sección Gestión de Materias (/admin/materias):")
add_bullet(" Seleccione el programa académico y el semestre lectivo (1 al 10) para consultar las asignaturas.", "Filtros:")
add_bullet(" Presione '+ Nueva Materia' e indique nombre, código, créditos (1 a 6) y semestre de ubicación curricular.", "Crear Materia:")

add_heading_1("5. Guía del Rol: Docente Tutor")

add_heading_2("5.1 Portal del Docente y Navegación")
add_p("El docente tutor dispone de un entorno optimizado para gestionar sus horarios de atención pedagógica y solicitudes de alumnos.")

add_heading_2("5.2 Creación y Programación de Sesiones de Tutoría")
add_p("Para ofertar un nuevo espacio de asesoría académica:")
add_bullet(" Ingrese a Mis Tutorías (/tutor/mis-tutorias).", "Paso 1:")
add_bullet(" Presione el botón '+ Programar Tutoría'.", "Paso 2:")
add_bullet(" Seleccione la asignatura del catálogo institucional que desea reforzar.", "Paso 3:")
add_bullet(" Defina la fecha, hora de inicio y hora estimada de finalización.", "Paso 4:")
add_bullet(" Seleccione la modalidad: Presencial (especificando aula o laboratorio) o Virtual (proporcionando enlace de Meet/Teams).", "Paso 5:")
add_bullet(" Indique el cupo máximo de estudiantes permitidos (ej. 5 o 10 cupos) y una breve descripción temaria.", "Paso 6:")
add_bullet(" Presione Guardar y Publicar. La tutoría quedará activa de inmediato con estado DISPONIBLE.", "Paso 7:")

add_heading_2("5.3 Gestión de Solicitudes y Control Automático de Aforo")
add_p("Desde la sección Solicitudes (/tutor/solicitudes), el docente visualiza los estudiantes postulados:")
add_bullet(" Presione el botón verde Aceptar. El sistema descontará un cupo de la tutoría automáticamente mediante una transacción atómica. Si se alcanza el límite máximo, la tutoría pasará automáticamente a estado OCUPADA.", "Aceptar Solicitud:")
add_bullet(" Presione el botón rojo Rechazar y proporcione una breve observación formativa para el estudiante.", "Rechazar Solicitud:")

add_heading_1("6. Guía del Rol: Estudiante")

add_heading_2("6.1 Búsqueda y Filtrado Reactivo de Tutorías Ofertadas")
add_bullet(" Ingrese al menú Buscar Tutorías (/estudiante/buscar).", "Paso 1:")
add_bullet(" Filtre por asignatura o modalidad según su preferencia horaria.", "Paso 2:")
add_bullet(" Revise los cupos disponibles indicados en la tarjeta de cada sesión.", "Paso 3:")

add_heading_2("6.2 Radicación de Solicitud de Cupo")
add_bullet(" Presione el botón 'Solicitar Cupo' en la sesión deseada.", "Paso 1:")
add_bullet(" Escriba brevemente las dudas o temáticas puntuales que desea tratar con el tutor.", "Paso 2:")
add_bullet(" Presione Confirmar Envío. El sistema emitirá una notificación visual flotante (Toast verde) confirmando la radicación.", "Paso 3:")

add_heading_2("6.3 Seguimiento en Tiempo Real en Mis Solicitudes")
add_p("En la pestaña Mis Solicitudes (/estudiante/mis-solicitudes), el estudiante puede consultar el estado de sus postulaciones:")
add_bullet(" La solicitud está a la espera de revisión por el docente. El alumno puede presionar Cancelar si ya no requiere el espacio.", "PENDIENTE (Amarillo):")
add_bullet(" El cupo fue confirmado. Queda disponible la información del aula o el enlace virtual para unirse a la sesión.", "ACEPTADA (Verde):")
add_bullet(" La postulación no pudo ser admitida, mostrando el motivo u observación del docente tutor.", "RECHAZADA (Rojo):")

add_heading_1("7. Preguntas Frecuentes (FAQ) y Solución de Incidencias")

tbl_faq_headers = ["Situación / Pregunta Frecuente", "Explicación Técnica", "Acción Recomendada para el Usuario"]
tbl_faq_rows = [
    ["Al presionar Iniciar Sesión la página tarda 25 segundos.", "El servidor en Render entra en reposo tras inactividad en la capa gratuita.", "Espere unos segundos a que la API despierte. Las siguientes consultas tardarán menos de 500 ms."],
    ["El botón de guardar permanece deshabilitado.", "El formulario reactivo detectó campos vacíos o con formato inválido.", "Revise los campos en color rojo y asegúrese de cumplir las validaciones (correo válido, cupo mayor a 0)."],
    ["¿Qué ocurre cuando una tutoría alcanza su cupo máximo?", "El backend detecta aforo lleno (cupos_ocupados >= cupo_maximo) y actualiza el estado a OCUPADA.", "El sistema deshabilita automáticamente el botón de solicitar para evitar sobreventa de cupos."],
    ["Aparece un mensaje de 'Sesión expirada'.", "Por política de seguridad el token JWT caduca automáticamente a las 24 horas.", "El sistema ejecuta un cierre de sesión limpio. Ingrese nuevamente sus credenciales en el login."],
    ["¿Cómo ingresar desde un teléfono celular?", "La aplicación está diseñada bajo el estándar responsive móvil-primero con Tailwind CSS.", "Abra el enlace en Chrome o Safari móvil; el menú se adaptará en formato táctil y hamburguesa."]
]
add_table_apa(tbl_faq_headers, tbl_faq_rows, 1, "Guía de resolución de incidencias comunes", col_widths=[2.0, 2.2, 2.3])

add_heading_1("8. Directorio de Cuentas Institucionales de Demostración")
add_p("Para verificar y evaluar los tres roles del sistema en el entorno de producción:")

tbl_cred_headers = ["Rol Institucional", "Nombre Completo", "Correo Electrónico (Login)", "Contraseña"]
tbl_cred_rows = [
    ["ADMINISTRADOR", "Administrador del Sistema", "admin@tutorias.com", "Admin123*"],
    ["DOCENTE TUTOR", "Prof. Wadid Rivas Payares", "wadid.docente@tutorias.com", "Docente123*"],
    ["ESTUDIANTE", "Ana Martínez (Ing. Sistemas)", "ana.estudiante@tutorias.com", "Estudiante123*"]
]
add_table_apa(tbl_cred_headers, tbl_cred_rows, 2, "Credenciales de prueba del SGTU", col_widths=[1.5, 1.8, 2.0, 1.2])

p_fin = doc.add_paragraph()
p_fin.paragraph_format.space_before = Pt(30)
p_fin.paragraph_format.space_after = Pt(12)
p_fin.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_fin = p_fin.add_run("— Fin del Manual de Usuario Oficial —\nSGTU | Electiva Profesional II | UNIAJS | Noviembre 2026")
r_fin.font.name = "Times New Roman"; r_fin.font.size = Pt(10); r_fin.italic = True
r_fin.font.color.rgb = RGBColor(100, 116, 139)

doc.save(DOCX_PATH)
print(f"Manual Word saved at: {DOCX_PATH}")
