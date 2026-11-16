# Manual de Usuario del Sistema de Gestión de Tutorías Universitarias (SGTU)
## Guía Oficial de Operación para Administradores, Docentes y Estudiantes

---

**Institución:** Corporación Universitaria Antonio José de Sucre (UNIAJS)  
**Facultad:** Ciencias e Ingenierías  
**Programa:** Ingeniería de Sistemas  
**Asignatura:** Electiva Profesional II (Semana 12 — Entrega Final)  
**Fecha:** Noviembre 2026  
**Versión del Sistema:** v1.0.0 (Producción Cloud)  

**Aplicación Web en Producción:** [https://sgtu-tutorias-universitarias.vercel.app](https://sgtu-tutorias-universitarias.vercel.app)  
**Backend API & Swagger:** [https://sgtu-tutorias-universitarias.onrender.com/swagger-ui/index.html](https://sgtu-tutorias-universitarias.onrender.com/swagger-ui/index.html)  
**Repositorio Oficial (Monorepo):** [https://github.com/WRivxs/SGTU-Tutorias-Universitarias](https://github.com/WRivxs/SGTU-Tutorias-Universitarias)  

**Equipo de Desarrollo:**
* **Wadid Rivas Payares**
* **Eduardo Julio Bettin Avilez**
* **Azael Espitia Toribio**
* **Jhon Jader Bertel Ortega**

---

## 1. Introducción y Propósito del Manual

El presente **Manual de Usuario** tiene como objetivo orientar a los distintos integrantes de la comunidad académica de UNIAJS en el uso correcto, seguro y eficiente del **Sistema de Gestión de Tutorías Universitarias (SGTU)**.

El sistema fue concebido para eliminar las barreras de comunicación informal, centralizando la oferta de asesorías académicas, permitiendo a los estudiantes solicitar acompañamiento en las materias de su plan de estudios, y otorgando a los docentes tutores y administradores herramientas ágiles para la gestión de cupos, horarios y trazabilidad pedagógica.

---

## 2. Requisitos de Acceso y Compatibilidad

### 2.1 Requisitos de Hardware y Software
* **Dispositivos soportados:** Computadores de escritorio, portátiles, tabletas y teléfonos inteligentes (Smartphones con pantallas a partir de 360px de ancho).
* **Navegadores recomendados:** Google Chrome (v100+), Microsoft Edge (v100+), Mozilla Firefox (v100+) o Safari (v15+).
* **Conexión a Internet:** Requiere conectividad activa para sincronizar datos en tiempo real con la nube (AWS RDS y Render).
* **Instalación:** Al tratarse de una Single Page Application (SPA) web, **no requiere descargas ni instalaciones locales**. Opcionalmente, puede instalarse como Aplicación Web Progresiva (PWA) agregando el acceso directo a la pantalla de inicio desde el navegador móvil.

### 2.2 Enlace de Acceso Oficial
Ingrese desde cualquier navegador a la dirección segura con cifrado SSL:
👉 **[https://sgtu-tutorias-universitarias.vercel.app](https://sgtu-tutorias-universitarias.vercel.app)**

---

## 3. Módulo de Autenticación y Control de Sesión

### 3.1 Inicio de Sesión (Login)
1. Ingrese a la plataforma. Será recibido por la pantalla de bienvenida y el formulario de autenticación institucional.
2. Digite su **Correo Electrónico Institucional** y su **Contraseña**.
3. El formulario cuenta con validación reactiva en tiempo real: si el correo carece de formato válido o la contraseña tiene menos de 6 caracteres, el botón de ingreso permanecerá deshabilitado o alertará visualmente en color rojo.
4. Presione el botón **Iniciar Sesión**.
5. Al verificar las credenciales, el sistema emitirá un token criptográfico seguro (JWT) y el enrutador lo redirigirá de forma automática a su panel de control correspondiente según su rol institucional.

> **Nota sobre el primer inicio (Cold Start):**  
> El backend se encuentra alojado en la nube gratuita de Render. Si el servidor no ha recibido visitas en los últimos 15 minutos, puede entrar en modo suspensión. En dicho caso, el primer inicio de sesión puede tardar entre 20 y 30 segundos mientras la API despierta. Las consultas posteriores responden de manera instantánea (< 500 ms).

### 3.2 Cierre de Sesión Seguro (Logout)
En cualquier momento, puede finalizar su sesión haciendo clic en el botón **Cerrar Sesión** ubicado en la esquina inferior del menú lateral o en la barra superior:
1. El sistema desplegará un cuadro de diálogo modal de confirmación (*DialogService*): *"¿Desea cerrar la sesión actual?"*.
2. Al confirmar, se eliminarán de forma inmediata los tokens de autenticación de la memoria local del navegador (`localStorage.clear()`).
3. El sistema lo redirigirá al portal de inicio de sesión (`/login`), impidiendo que terceros puedan acceder a su información pulsando el botón "Atrás" del navegador.

---

## 4. Guía del Rol: ADMINISTRADOR DEL SISTEMA

El rol de **Administrador** cuenta con privilegios globales para auditar usuarios, administrar la estructura curricular de la institución y supervisar la actividad de las tutorías.

### 4.1 Dashboard Administrativo
Al ingresar, el Administrador visualiza el panel de control con métricas en tiempo real conectadas directamente a la base de datos MySQL en AWS RDS:
* **Total de Usuarios:** Número de cuentas activas clasificadas en alumnos, tutores y administradores.
* **Materias Registradas:** Total de asignaturas catalogadas en la malla curricular.
* **Tutorías Creadas:** Sesiones académicas programadas activas.
* **Total de Solicitudes:** Solicitudes radicadas en la plataforma.
* **Accesos Rápidos:** Botones directos a *"Gestionar Usuarios"* y *"Catálogo de Materias"*.

### 4.2 Gestión de Usuarios
Desde el menú lateral, seleccione **Gestión de Usuarios** (`/admin/usuarios`):
1. **Listar Usuarios:** Visualice una tabla responsiva con todos los usuarios registrados, indicando nombre, apellido, correo, rol asignado, estado (Activo/Inactivo) y fecha de creación.
2. **Crear Nuevo Usuario:**
   * Haga clic en el botón superior **+ Nuevo Usuario**.
   * Diligencie el formulario modal: Nombres, Apellidos, Correo Institucional, Contraseña inicial y Rol (`ADMINISTRADOR`, `DOCENTE` o `ESTUDIANTE`).
   * Presione **Guardar Usuario**. El sistema aplicará cifrado BCrypt a la contraseña y mostrará un mensaje flotante (Toast verde) de confirmación.
3. **Suspender / Activar Usuario:**
   * En la columna de acciones, presione el interruptor de estado (`PATCH /api/usuarios/{id}/estado`).
   * Un usuario suspendido no podrá ingresar a la plataforma hasta que el administrador reactive su cuenta.
4. **Eliminar Usuario:**
   * Haga clic en el ícono de papelera. Se abrirá el modal de confirmación antes de efectuar el borrado definitivo.

### 4.3 Gestión de Facultades y Programas Académicos
Ubicado en el menú **Estructura Académica** (`/admin/facultades`):
* **Facultades:** Permite dar de alta unidades académicas institucionales (ej. *Facultad de Ciencias e Ingenierías*, código `FAC-ING`).
* **Programas:** Permite asociar carreras profesionales a una facultad específica (ej. *Ingeniería de Sistemas*, código `PROG-SIS`).

### 4.4 Gestión del Catálogo de Materias
Ubicado en **Gestión de Materias** (`/admin/materias`):
1. **Filtros Curriculares:** Filtre el listado de materias seleccionando el programa académico y el semestre lectivo (Semestres 1 a 10).
2. **Creación de Asignaturas:**
   * Presione **+ Nueva Materia**.
   * Ingrese el nombre de la asignatura (ej. *Cálculo Diferencial*), código mnemotécnico (ej. `MAT-101`), programa adscrito, semestre en la malla (1 a 12) y número de créditos académicos (1 a 6).
   * Al guardar, la materia estará inmediatamente disponible para que los docentes la seleccionen al crear tutorías.

---

## 5. Guía del Rol: DOCENTE TUTOR

El perfil de **Docente Tutor** está diseñado para organizar la agenda académica de acompañamiento, publicar sesiones con límites de aforo y gestionar las peticiones de los alumnos.

### 5.1 Menú del Docente
Al autenticarse como docente, el menú lateral se adapta mostrando:
* **Mis Tutorías:** Administración de sesiones ofertadas.
* **Solicitudes Recibidas:** Bandeja de peticiones radicadas por estudiantes.
* **Mi Perfil:** Reseña profesional, especialidad y asignaturas habilitadas.

### 5.2 Creación y Programación de una Tutoría
Para ofertar una nueva sesión de asesoría académica:
1. Ingrese a la sección **Mis Tutorías** (`/tutor/mis-tutorias`).
2. Haga clic en el botón **+ Programar Tutoría**.
3. Complete los campos requeridos en el formulario reactivo:
   * **Materia:** Seleccione del menú desplegable la asignatura sobre la cual impartirá la asesoría.
   * **Fecha y Horario:** Indique la fecha de la sesión, hora de inicio y hora estimada de finalización.
   * **Modalidad:** Seleccione **Presencial** (indicando aula física, ej. *Laboratorio de Sistemas 2*) o **Virtual** (proporcionando el enlace de Google Meet o Microsoft Teams).
   * **Cupo Máximo:** Defina el límite máximo de estudiantes admitidos (por defecto 5 o 10 cupos).
   * **Temática / Descripción:** Resuma los temas a repasar (ej. *Repaso para segundo parcial: Normalización 1FN a 3FN*).
4. Haga clic en **Guardar y Publicar**.
5. La sesión quedará visible inmediatamente en el catálogo general de los estudiantes con estado `DISPONIBLE` y contador de cupos en `0 / X`.

### 5.3 Gestión de Solicitudes de Estudiantes
Cuando un estudiante solicita un cupo, la petición se refleja en tiempo real en la vista **Solicitudes** (`/tutor/solicitudes`):
1. El docente visualiza el nombre del estudiante, materia, fecha solicitada y el mensaje o duda manifestada por el alumno.
2. **Aceptar Solicitud:**
   * Presione el botón verde **Aceptar**.
   * El sistema ejecutará una transacción atómica en el backend: el estado de la solicitud pasará a `ACEPTADA`, el contador de cupos de la tutoría se incrementará en 1 y, si se alcanza el cupo máximo, la tutoría pasará automáticamente a estado `OCUPADA` cerrando nuevas inscripciones.
3. **Rechazar Solicitud:**
   * Presione el botón rojo **Rechazar**.
   * Puede ingresar un mensaje explicativo (ej. *Cupo saturado para este horario, por favor inscribirse en la sesión del viernes*).
   * El cupo no se descuenta y el estudiante recibe la retroalimentación en su panel.

---

## 6. Guía del Rol: ESTUDIANTE

El perfil de **Estudiante** ofrece una experiencia intuitiva centrada en la búsqueda rápida de apoyo pedagógico y el seguimiento de sus solicitudes.

### 6.1 Búsqueda y Exploración de Tutorías
1. Desde el menú lateral, ingrese a **Buscar Tutorías** (`/estudiante/buscar`).
2. Utilice los filtros reactivos superiores:
   * **Por Materia:** Filtre asignaturas de su programa (ej. *Bases de Datos*, *Programación Orientada a Objetos*).
   * **Por Modalidad:** Filtre si prefiere sesiones virtuales o presenciales.
3. Cada tarjeta de tutoría muestra: nombre de la materia, nombre del docente tutor, fecha y hora, modalidad, aula/enlace y el indicador de cupos disponibles (ej. *3 cupos restantes*).

### 6.2 Radicar una Solicitud de Tutoría
1. En la tarjeta de la sesión de su interés, presione el botón **Solicitar Cupo**.
2. Se abrirá una ventana modal donde puede redactar una breve descripción de los temas o dudas puntuales que desea resolver con el docente.
3. Presione **Enviar Solicitud**.
4. Recibirá una notificación Toast verde: *"Solicitud radicada con éxito. En espera de confirmación del docente."*

### 6.3 Seguimiento en "Mis Solicitudes"
En la pestaña **Mis Solicitudes** (`/estudiante/mis-solicitudes`), el estudiante puede monitorear el estado de cada postulación:
* **PENDIENTE (Amarillo):** El docente aún no ha evaluado la postulación. El estudiante puede presionar el botón **Cancelar Solicitud** si ya no requiere el espacio.
* **ACEPTADA (Verde):** El docente aprobó la participación. Se confirma el cupo y queda visible el enlace virtual o aula asignada.
* **RECHAZADA (Rojo):** La solicitud no pudo ser admitida, mostrando la retroalimentación u observaciones dejadas por el docente.

---

## 7. Preguntas Frecuentes (FAQ) y Solución de Problemas

| Pregunta / Situación | Causa / Explicación | Solución Recomendada |
|---|---|---|
| **Al presionar login la página se queda cargando 25 segundos.** | El servidor backend en Render entra en reposo tras inactividad en la capa gratuita. | Espere unos segundos a que la API despierte. Una vez activa, el resto de operaciones toma menos de medio segundo. |
| **No puedo hacer clic en el botón de Guardar.** | El formulario reactivo detectó un campo requerido vacío o con formato inválido. | Revise los campos con borde rojo y complete la información requerida (ej. correo válido, semestre entre 1 y 12). |
| **¿Qué ocurre si una tutoría se llena?** | El sistema controla el aforo automáticamente en el backend (`cupos_ocupados >= cupo_maximo`). | La sesión cambia su estado a `OCUPADA` y el botón de solicitar cupo se deshabilita para evitar sobreventa. |
| **Aparece un mensaje 'Sesión caducada o no autorizada'.** | Por seguridad, el token JWT vence tras 24 horas continuas de uso. | El sistema cerrará la sesión de forma limpia. Ingrese nuevamente sus credenciales en el login. |
| **¿Cómo usar la plataforma desde el celular?** | La interfaz está construida con diseño responsivo móvil-primero (Tailwind CSS). | Abra el enlace en Chrome o Safari móvil. El menú lateral se transforma en menú hamburguesa y barra inferior táctil. |

---

## 8. Directorio de Cuentas de Demostración Oficiales

Para fines de evaluación académica, se han configurado tres cuentas oficiales activas en la base de datos de producción:

| Rol de Usuario | Nombre Completo | Correo Institucional | Contraseña |
|---|---|---|---|
| **ADMINISTRADOR** | Administrador del Sistema | `admin@tutorias.com` | `Admin123*` |
| **DOCENTE TUTOR** | Prof. Wadid Rivas Payares | `wadid.docente@tutorias.com` | `Docente123*` |
| **ESTUDIANTE** | Ana Martínez (Ing. Sistemas) | `ana.estudiante@tutorias.com` | `Estudiante123*` |

---

*Manual elaborado por el equipo de desarrollo del SGTU — Electiva Profesional II, UNIAJS, Noviembre 2026.*
