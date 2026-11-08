# Documento de Integración Frontend Angular — Entrega 4
## Sistema de Gestión de Tutorías Universitarias (SGTU)

**Curso:** Electiva Profesional II  
**Programa:** Ingeniería de Sistemas  
**Institución:** Corporación Universitaria Antonio José de Sucre (UNIAJS)  
**Semana del Cronograma:** Semana 10  
**Fecha:** Noviembre 2026  
**Repositorio Oficial (Monorepo):** [https://github.com/WRivxs/SGTU-Tutorias-Universitarias](https://github.com/WRivxs/SGTU-Tutorias-Universitarias)  
**Carpeta del Frontend:** [https://github.com/WRivxs/SGTU-Tutorias-Universitarias/tree/main/frontend](https://github.com/WRivxs/SGTU-Tutorias-Universitarias/tree/main/frontend)  
**Aplicación Web Desplegada en Vivo (Vercel con HTTPS):** [https://sgtu-tutorias-universitarias.vercel.app](https://sgtu-tutorias-universitarias.vercel.app)  
**Backend en Producción (Cloud Render):** [https://sgtu-tutorias-universitarias.onrender.com](https://sgtu-tutorias-universitarias.onrender.com)  

**Integrantes del Equipo de Desarrollo:**
* **Wadid Rivas Payares** — *Encargado de Arquitectura e Integración Backend-Frontend*
* **Eduardo Julio Bettin Avilez** — *Líder Técnico de Frontend y Experiencia de Usuario (UI/UX)*
* **Azael Espitia Toribio** — *Encargado de Persistencia y Pruebas de Integración (AWS RDS)*
* **Jhon Jader Bertel Ortega** — *Encargado de Calidad (QA), Validación y Documentación*

---

## 1. Introducción y Alcance de la Entrega 4

La **Entrega 4** consolida la materialización de la interfaz de usuario del **Sistema de Gestión de Tutorías Universitarias (SGTU)** mediante una Single Page Application (SPA) desarrollada con **Angular 21** y **Tailwind CSS**. La plataforma se encuentra **100% integrada con el backend real** alojado en Render y la base de datos relacional MySQL en AWS RDS, prescindiendo totalmente de datos simulados (*mocks* o JSONs locales).

### Objetivos Clave de la Entrega Cumplidos:
1. **Arquitectura Modular y Carga Perezosa (Lazy Loading):** Organización por dominios de negocio (`core`, `shared`, `modules`) implementando componentes autónomos (*Standalone Components*) y enrutamiento dinámico que reduce drásticamente el peso del paquete inicial transferido al navegador.
2. **Consumo Exhaustivo de Servicios REST:** Implementación de servicios Angular tipados basados en `HttpClient` y `RxJS` para consumir los 9 controladores del backend.
3. **Formularios Reactivos con Validación en Tiempo Real:** Empleo de `ReactiveFormsModule` con validación asíncrona y sincrónica para el control estricto de entradas en todos los formularios de creación y edición.
4. **Seguridad y Control de Acceso en el Cliente:** Pipeline de seguridad en el frontend conformado por interceptores HTTP para inyección automática de cabeceras `Authorization: Bearer <token>` y guardianes de ruta (`AuthGuard` y `RoleGuard`) que previenen accesos no autorizados a nivel de vista.
5. **Retroalimentación y Experiencia de Usuario Superior:** Sistema visual propio de notificaciones flotantes (*Toasts*) y cuadros de diálogo de confirmación (*Modales*) que reemplazan por completo las alertas nativas bloqueantes del navegador (`alert()` / `confirm()`).
6. **Diseño Responsivo Integral y Transformación a PWA:** Interfaz adaptable a pantallas móviles (smartphones con safe-area y altura dinámica `100dvh`), tablets y laptops, complementada con soporte de Service Worker y Web App Manifest para instalación nativa en dispositivos Android e iOS.

---

## 2. Arquitectura del Proyecto Angular

El frontend se diseñó bajo una estructura limpia, escalable y mantenible:

```text
frontend/src/
├── app/
│   ├── core/                                # 🛡️ Núcleo y Servicios Singulares (Singletons)
│   │   ├── guards/
│   │   │   ├── auth.guard.ts                # Verifica sesión activa y vigencia de token
│   │   │   └── role.guard.ts                # Restringe navegación por rol (ADMIN / DOCENTE / ESTUDIANTE)
│   │   ├── interceptors/
│   │   │   ├── jwt.interceptor.ts           # Inyecta automáticamente el token Bearer JWT
│   │   │   └── error.interceptor.ts         # Captura 401/403 y ejecuta cierre de sesión seguro
│   │   └── services/
│   │       ├── auth.service.ts              # Gestión de login, logout y persistencia en localStorage
│   │       ├── layout.service.ts            # Estado reactivo del menú lateral (sidebar móvil/escritorio)
│   │       ├── toast.service.ts             # Sistema global de notificaciones toast flotantes
│   │       ├── dialog.service.ts            # Sistema global de diálogos modales de confirmación
│   │       └── pwa.service.ts               # Control del ciclo de vida y banners de instalación PWA
│   │
│   ├── shared/                              # 🧩 Elementos Visuales y Modelos Compartidos
│   │   ├── components/
│   │   │   ├── layout/                      # Estructura base de navegación
│   │   │   │   ├── navbar/                  # Barra superior con perfil y período académico
│   │   │   │   ├── sidebar/                 # Menú lateral para Administrador
│   │   │   │   ├── sidebar-tutor/           # Menú lateral para Docente Tutor
│   │   │   │   └── sidebar-estudiante/      # Menú lateral para Estudiante
│   │   │   ├── ui/
│   │   │   │   ├── toast-container/         # Contenedor visual de alertas emergentes
│   │   │   │   └── confirm-dialog/          # Modal de confirmación para borrados y acciones críticas
│   │   │   └── pwa-install-prompt/          # Banner inteligente de instalación web y guía para iOS
│   │   └── models/                          # Interfaces TypeScript sincronizadas con las Entidades JPA
│   │       ├── auth.model.ts
│   │       ├── usuario.model.ts
│   │       ├── facultad.model.ts
│   │       ├── programa.model.ts
│   │       ├── materia.model.ts
│   │       ├── docente.model.ts
│   │       ├── estudiante.model.ts
│   │       ├── tutoria.model.ts
│   │       └── solicitud.model.ts
│   │
│   ├── modules/                             # 📦 Módulos Funcionales (Cargados perezosamente)
│   │   ├── auth/                            # Portal público de autenticación
│   │   │   └── pages/login/                 # Vista de Login con modo demostración de 1-clic
│   │   ├── admin/                           # Vistas exclusivas de ADMINISTRADOR
│   │   │   └── pages/
│   │   │       ├── dashboard/               # Métricas globales de uso y actividad
│   │   │       ├── gestion-usuarios/        # CRUD de usuarios y cambio de estados
│   │   │       ├── gestion-facultades/      # CRUD de facultades y programas académicos
│   │   │       ├── gestion-materias/        # Catálogo curricular de materias por semestre
│   │   │       └── calendario-tutorias/     # Visor general de tutorías programadas
│   │   ├── tutor/                           # Vistas exclusivas de DOCENTE TUTOR
│   │   │   └── pages/
│   │   │       ├── mis-tutorias/            # Programación de asesorías y control de cupos
│   │   │       ├── agenda/                  # Vista de calendario académico de sesiones
│   │   │       ├── solicitudes/             # Aprobación y rechazo de solicitudes de estudiantes
│   │   │       └── perfil/                  # Perfil docente, especialidad y asignaturas vinculadas
│   │   └── estudiante/                      # Vistas exclusivas de ESTUDIANTE
│   │       └── pages/
│   │           ├── buscar-tutorias/         # Catálogo de búsqueda y filtros reactivos por materia/semestre
│   │           ├── mis-solicitudes/         # Seguimiento en tiempo real de solicitudes radicadas
│   │           ├── horario/                 # Cronograma personal de asesorías confirmadas
│   │           └── perfil/                  # Información académica y semestre matriculado
│   │
│   ├── app.routes.ts                        # Enrutador principal con guardianes y carga perezosa
│   └── app.ts                               # Componente raíz con <router-outlet /> y servicios globales
│
├── environments/                            # 🌍 Variables de Entorno
│   ├── environment.ts                       # Desarrollo: apiUrl = 'http://localhost:8080/api'
│   └── environment.prod.ts                  # Producción: apiUrl = 'https://sgtu-tutorias-universitarias.onrender.com/api'
│
└── public/                                  # 📱 Recursos PWA y Públicos
    ├── manifest.webmanifest                 # Manifiesto de la aplicación web progresiva
    ├── sw.js                                # Service Worker con caché stale-while-revalidate
    ├── icons/                               # Iconos adaptativos (192x192, 512x512, maskable, iOS)
    └── qr/                                  # Códigos QR en alta definición para acceso inmediato
```

---

## 3. Matriz de Vistas Principales y Operaciones CRUD

La aplicación proporciona interfaces completas para la gestión de todo el ciclo de vida del acompañamiento académico:

| Módulo | Vista / Componente | Operaciones CRUD Implementadas | Roles Permitidos |
|---|---|:---:|:---:|
| **Autenticación** | `pages/login` | Login con credenciales, Auto-login por query params y selector rápido de estudiantes demo. | Público |
| **Administración** | `gestion-usuarios` | **Listar** todos los usuarios, **Crear** nuevos usuarios con rol, **Editar** datos de contacto, **Suspender/Activar** usuario (`PATCH estado`) y **Eliminar**. | `ADMINISTRADOR` |
| **Administración** | `gestion-facultades` | **Listar** facultades, **Crear** facultad, **Crear** programas vinculados a facultad y **Modificar** descripciones. | `ADMINISTRADOR` |
| **Administración** | `gestion-materias` | **Listar** materias con filtros por programa y semestre de malla, **Crear** asignaturas con créditos y **Editar** catálogo. | `ADMINISTRADOR` |
| **Docente** | `mis-tutorias` | **Listar** asesorías del tutor, **Crear** nueva sesión (fecha, hora, modalidad presencial/virtual, cupo máximo) y **Cancelar** tutoría. | `DOCENTE` |
| **Docente** | `solicitudes` | **Listar** solicitudes recibidas en tiempo real, **Aceptar** solicitud (con descuento automático de cupos) y **Rechazar** con mensaje al alumno. | `DOCENTE` |
| **Estudiante** | `buscar-tutorias` | **Filtrar y Explorar** catálogo de tutorías por materia, tutor o semestre, y **Solicitar Cupo** con validación de disponibilidad. | `ESTUDIANTE` |
| **Estudiante** | `mis-solicitudes` | **Listar** estado de postulaciones (`PENDIENTE`, `ACEPTADA`, `RECHAZADA`) y **Cancelar** solicitud radicada. | `ESTUDIANTE` |

---

## 4. Capa de Servicios Angular y Consumo con `HttpClient`

Todos los servicios residen en la capa de servicios inyectables (`@Injectable({ providedIn: 'root' })`) y hacen uso de `HttpClient` con tipado estricto mediante observables de RxJS:

```typescript
// Ejemplo de servicio representativo: TutoriaService
@Injectable({ providedIn: 'root' })
export class TutoriaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tutorias`;

  listarDisponibles(materiaId?: number, docenteId?: number): Observable<Tutoria[]> {
    let params = new HttpParams().set('estado', 'DISPONIBLE');
    if (materiaId) params = params.set('materiaId', materiaId.toString());
    if (docenteId) params = params.set('docenteId', docenteId.toString());
    return this.http.get<Tutoria[]>(this.apiUrl, { params });
  }

  crear(tutoria: CrearTutoriaDto): Observable<Tutoria> {
    return this.http.post<Tutoria>(this.apiUrl, tutoria);
  }

  cambiarEstado(id: number, estado: string): Observable<Tutoria> {
    return this.http.patch<Tutoria>(`${this.apiUrl}/${id}/estado`, null, {
      params: { estado }
    });
  }
}
```

---

## 5. Formularios Reactivos con Validación (`ReactiveFormsModule`)

Para evitar errores en tiempo de ejecución y proteger la integridad de los datos, todos los formularios utilizan el patrón `FormBuilder` con validaciones sincronizadas:

* **Control de Errores Visuales:** Los campos inválidos resaltan automáticamente con bordes rojos y despliegan mensajes explicativos en tiempo real solo cuando el usuario ha interactuado con ellos (`touched`).
* **Protección del Envío:** Los botones de guardado permanecen visualmente deshabilitados mientras el formulario no cumpla el 100% de los criterios de validación.

```typescript
// Formulario reactivo representativo de creación de asignaturas
this.formMateria = this.fb.group({
  nombre: ['', [Validators.required, Validators.minLength(3)]],
  codigo: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-[0-9]{3}$/)]],
  programaId: [null, [Validators.required]],
  semestre: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
  creditos: [3, [Validators.required, Validators.min(1), Validators.max(6)]],
  descripcion: ['']
});
```

---

## 6. Pipeline de Seguridad: Guards e Interceptores HTTP

```mermaid
flowchart TD
    A["👤 Usuario navega a una ruta (ej. /admin/usuarios)"] --> B{"🛡️ AuthGuard:<br/>¿Existe token JWT en localStorage?"}
    B -->|No| C["🚫 Redirigir a /login"]
    B -->|Sí| D{"👥 RoleGuard:<br/>¿El rol coincide con el requerido?"}
    D -->|No coincide| E["⛔ Redirigir a su panel correspondiente<br/>(Estudiante o Docente)"]
    D -->|Autorizado| F["✅ Carga del Componente Standalone"]

    F --> G["🌐 Petición HTTP saliente a la API"]
    G --> H["🧩 JwtInterceptor:<br/>Inyecta cabecera 'Authorization: Bearer &lt;token&gt;'"]
    H --> I["☁️ Backend Spring Boot en Render"]

    I -->|HTTP 401 / 403| J["⚠️ ErrorInterceptor:<br/>Limpia credenciales y redirige a login"]
    I -->|HTTP 200 OK| K["📦 Entrega de datos a la vista"]
```

---

## 7. Sistema de Retroalimentación al Usuario (Feedback Visual)

Para cumplir con las mejores prácticas de experiencia de usuario (UX), el sistema prohíbe el uso de alertas nativas del navegador (`alert()` / `confirm()`), implementando un sistema desacoplado basado en Signals y Servicios reactivos:

1. **`ToastService`:**
   * Muestra notificaciones flotantes en la esquina superior derecha con autocierre temporizado (4 segundos).
   * Cuatro tipos estilizados: **Éxito (verde)**, **Error (rojo)**, **Advertencia (amarillo)** e **Información (azul)**.
   * Utilizado para confirmar acciones como *"Tutoría solicitada exitosamente"*, *"Usuario actualizado"* o informar errores del servidor.
2. **`DialogService`:**
   * Despliega una ventana modal con fondo traslúcido (*backdrop blur*) antes de ejecutar acciones irreversibles (como cancelar tutorías, eliminar usuarios o cerrar sesión).
   * Permite al usuario confirmar o declinar la operación con botones estilizados.

---

## 8. Evidencia de Integración Real con el Backend (CERO MOCKS)

Toda la aplicación opera contra la base de datos real en AWS RDS a través del backend en Render. A continuación se documentan las evidencias técnicas verificables por el evaluador docente:

### 8.1 Tráfico HTTP en Tiempo Real (Network Tab):
* **Login de Usuario:**
  * Petición: `POST https://sgtu-tutorias-universitarias.onrender.com/api/auth/login`
  * Código de Respuesta: `200 OK`
  * Carga Útil Recibida: Token JWT con firma criptográfica y rol correspondiente.
* **Consulta de Materias y Tutorías:**
  * Petición: `GET https://sgtu-tutorias-universitarias.onrender.com/api/materias?programaId=1`
  * Cabecera Enviada: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...`
  * Código de Respuesta: `200 OK` (Registros reales de Cálculo, POO, Bases de Datos).
* **Persistencia Atómica de Solicitudes:**
  * Petición: `POST https://sgtu-tutorias-universitarias.onrender.com/api/solicitudes`
  * Código de Respuesta: `201 Created`
  * El nuevo registro se refleja instantáneamente en el panel del docente tutor sin recargar la página.

---

## 9. Guion Detallado para el Video Demostrativo (3 a 5 Minutos)

El video de sustentación de la Entrega 4 sigue una estructura concisa y profesional diseñada para obtener la máxima calificación:

* **Minuto 0:00 – 0:40 | Presentación y Arquitectura Cloud:**
  * Mostrar el frontend abierto en Vercel con candado HTTPS: `https://sgtu-tutorias-universitarias.vercel.app`.
  * Explicar brevemente que el proyecto está desarrollado en Angular 21, con arquitectura por capas, Tailwind CSS y conectado al backend Spring Boot en Render.
* **Minuto 0:40 – 1:50 | Flujo del Estudiante (Búsqueda y Solicitud):**
  * Iniciar sesión como estudiante (Ana Martínez) con el botón de 1-clic.
  * Entrar al catálogo de tutorías, aplicar filtros de materias y seleccionar una sesión disponible.
  * Hacer clic en *"Solicitar Tutoría"* $\rightarrow$ Señalar la aparición del Toast de confirmación.
  * Ir a la pestaña *"Mis Solicitudes"* para evidenciar que el registro quedó en estado `PENDIENTE`.
* **Minuto 1:50 – 3:00 | Flujo del Docente (Aprobación y Agenda):**
  * Cerrar sesión y autenticarse como el docente tutor (Prof. Wadid Rivas).
  * Ingresar a *"Solicitudes Recibidas"*; mostrar que la solicitud radicada por Ana aparece en pantalla en tiempo real.
  * Presionar *"Aceptar Solicitud"* $\rightarrow$ Mostrar cómo se actualiza el estado a `ACEPTADA` y se descuenta el cupo disponible.
* **Minuto 3:00 – 4:00 | Demostración de Integración Real (F12 Network Tab):**
  * Abrir la consola de desarrollador del navegador (`F12` $\rightarrow$ pestaña *Red / Network*).
  * Realizar cualquier consulta o recarga y mostrar que las peticiones se realizan hacia `https://sgtu-tutorias-universitarias.onrender.com`.
  * Mostrar los encabezados de respuesta `200 OK` y el header `Authorization: Bearer <JWT>`.
  * Enfatizar: *"Con esto demostramos que no existen datos simulados o mocks; el frontend consume al 100% el backend y la base de datos MySQL en AWS RDS"*.

---

## 10. Enlaces y Recursos de Entrega Oficial

* **Repositorio en GitHub (Código Fuente Completo):**  
  [https://github.com/WRivxs/SGTU-Tutorias-Universitarias](https://github.com/WRivxs/SGTU-Tutorias-Universitarias)
* **Frontend Desplegado (Producción Vercel):**  
  [https://sgtu-tutorias-universitarias.vercel.app](https://sgtu-tutorias-universitarias.vercel.app)
* **Backend y Swagger UI (Producción Render):**  
  [https://sgtu-tutorias-universitarias.onrender.com/swagger-ui/index.html](https://sgtu-tutorias-universitarias.onrender.com/swagger-ui/index.html)
