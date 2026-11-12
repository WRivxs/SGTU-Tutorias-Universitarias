# Documento de Integración Frontend Angular — Entrega 4
## Sistema de Gestión de Tutorías Universitarias (SGTU)

**Curso:** Electiva Profesional II  
**Programa:** Ingeniería de Sistemas  
**Institución:** Corporación Universitaria Antonio José de Sucre (UNIAJS)  
**Profesor:** Jaider de la Rosa Bertel  
**Semana del Cronograma:** Semana 10  
**Fecha:** Noviembre 2026  
**Repositorio Oficial (Monorepo):** [https://github.com/WRivxs/SGTU-Tutorias-Universitarias](https://github.com/WRivxs/SGTU-Tutorias-Universitarias)  
**Carpeta del Frontend:** [https://github.com/WRivxs/SGTU-Tutorias-Universitarias/tree/main/frontend](https://github.com/WRivxs/SGTU-Tutorias-Universitarias/tree/main/frontend)  
**Aplicación Web Desplegada en Vivo (Vercel + HTTPS):** [https://sgtu-tutorias-universitarias.vercel.app](https://sgtu-tutorias-universitarias.vercel.app)  
**Backend en Producción (Cloud Render):** [https://sgtu-tutorias-universitarias.onrender.com](https://sgtu-tutorias-universitarias.onrender.com)

**Integrantes del Equipo de Desarrollo:**

| Nombre | Rol en el Proyecto |
|---|---|
| **Wadid Rivas Payares** | Encargado de Arquitectura e Integración Backend-Frontend |
| **Eduardo Julio Bettin Avilez** | Líder Técnico de Frontend y Experiencia de Usuario (UI/UX) |
| **Azael Espitia Toribio** | Encargado de Persistencia y Pruebas de Integración (AWS RDS) |
| **Jhon Jader Bertel Ortega** | Encargado de Calidad (QA), Validación y Documentación |

---

## 1. Introducción y Alcance de la Entrega 4

La **Entrega 4** consolida la materialización de la interfaz de usuario del **Sistema de Gestión de Tutorías Universitarias (SGTU)** mediante una Single Page Application (SPA) desarrollada con **Angular 21** y **Tailwind CSS**. La plataforma se encuentra **100% integrada con el backend real** alojado en Render y la base de datos relacional MySQL en AWS RDS, prescindiendo totalmente de datos simulados (*mocks* o JSONs locales).

### Stack Tecnológico del Frontend

| Tecnología | Versión | Rol en el Proyecto |
|---|---|---|
| Angular | 21 | Framework SPA principal con Standalone Components |
| TypeScript | 5.x | Tipado estático estricto en toda la capa de servicios y modelos |
| Tailwind CSS | 3.x | Sistema de utilidades para diseño responsivo y personalización visual |
| RxJS | 7.x | Gestión de flujos de datos asíncronos con Observables |
| Angular Router | 21 | Enrutamiento con guards, carga perezosa y redirecciones dinámicas |
| HttpClient | Angular 21 | Consumo tipado de endpoints REST del backend Spring Boot |
| ReactiveFormsModule | Angular 21 | Formularios reactivos con validación sincrónica y en tiempo real |

### Objetivos Clave Cumplidos

1. **Arquitectura Modular y Carga Perezosa (Lazy Loading):** Organización por dominios de negocio (`core`, `shared`, `modules`), implementando componentes autónomos (*Standalone Components*) y enrutamiento dinámico que reduce drásticamente el peso del paquete inicial.
2. **Consumo Exhaustivo de Servicios REST:** Implementación de servicios Angular tipados con `HttpClient` y `RxJS` para consumir los 9 controladores del backend real en Render.
3. **Formularios Reactivos con Validación en Tiempo Real:** Empleo de `ReactiveFormsModule` con validación sincrónica para el control estricto de entradas en todos los formularios de creación y edición.
4. **Seguridad y Control de Acceso en el Cliente:** Pipeline de seguridad conformado por interceptores HTTP (`JwtInterceptor`, `ErrorInterceptor`) y guardianes de ruta (`AuthGuard`, `RoleGuard`) que previenen accesos no autorizados a nivel de vista.
5. **Retroalimentación Visual Superior:** Sistema propio de notificaciones flotantes (*Toasts*) y cuadros de diálogo de confirmación (*Modales*) que reemplazan por completo las alertas nativas bloqueantes del navegador.
6. **Diseño Responsivo:** Interfaz adaptable a pantallas móviles, tablets y laptops mediante clases utilitarias de Tailwind CSS y gestión dinámica del layout (sidebar colapsable, navegación inferior en móvil).

---

## 2. Arquitectura Modular del Proyecto Angular

El frontend se diseñó bajo una estructura limpia, escalable y mantenible, organizada en tres capas principales:

```text
frontend/src/
├── app/
│   ├── core/                                # 🛡️ Núcleo y Servicios Singulares (Singletons)
│   │   ├── guards/
│   │   │   ├── auth.guard.ts                # Verifica sesión activa y vigencia de token JWT
│   │   │   └── role.guard.ts                # Restringe navegación por rol (ADMIN / DOCENTE / ESTUDIANTE)
│   │   ├── interceptors/
│   │   │   ├── jwt.interceptor.ts           # Inyecta automáticamente el token Bearer JWT en cada petición
│   │   │   └── error.interceptor.ts         # Captura respuestas 401/403 y ejecuta cierre de sesión seguro
│   │   └── services/
│   │       ├── auth.service.ts              # Gestión de login, logout y persistencia en localStorage
│   │       ├── layout.service.ts            # Estado reactivo del menú lateral (sidebar móvil/escritorio)
│   │       ├── toast.service.ts             # Sistema global de notificaciones toast flotantes
│   │       └── dialog.service.ts            # Sistema global de diálogos modales de confirmación
│   │
│   ├── shared/                              # 🧩 Elementos Visuales y Modelos Compartidos
│   │   ├── components/
│   │   │   ├── layout/                      # Estructura base de navegación
│   │   │   │   ├── navbar/                  # Barra superior con nombre de usuario y período académico
│   │   │   │   ├── sidebar/                 # Menú lateral para Administrador
│   │   │   │   ├── sidebar-tutor/           # Menú lateral para Docente Tutor
│   │   │   │   └── sidebar-estudiante/      # Menú lateral para Estudiante
│   │   │   └── ui/
│   │   │       ├── toast-container/         # Contenedor visual de alertas emergentes (auto-cierre 4s)
│   │   │       └── confirm-dialog/          # Modal de confirmación para borrados y acciones críticas
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
│   ├── modules/                             # 📦 Módulos Funcionales (Carga Perezosa — Lazy Loading)
│   │   ├── auth/                            # Portal público de autenticación
│   │   │   └── pages/login/                 # Vista de Login con validación reactiva
│   │   ├── admin/                           # Vistas exclusivas de ADMINISTRADOR
│   │   │   └── pages/
│   │   │       ├── dashboard/               # Métricas globales de uso y actividad
│   │   │       ├── gestion-usuarios/        # CRUD completo de usuarios del sistema
│   │   │       ├── gestion-facultades/      # CRUD de facultades y programas académicos
│   │   │       ├── gestion-materias/        # Catálogo curricular de materias por semestre
│   │   │       └── calendario-tutorias/     # Visor general de tutorías programadas
│   │   ├── tutor/                           # Vistas exclusivas de DOCENTE TUTOR
│   │   │   └── pages/
│   │   │       ├── mis-tutorias/            # Programación de asesorías y control de cupos
│   │   │       ├── solicitudes/             # Aprobación y rechazo de solicitudes de estudiantes
│   │   │       └── perfil/                  # Perfil docente, especialidad y asignaturas vinculadas
│   │   └── estudiante/                      # Vistas exclusivas de ESTUDIANTE
│   │       └── pages/
│   │           ├── buscar-tutorias/         # Catálogo de búsqueda y filtros reactivos por materia
│   │           ├── mis-solicitudes/         # Seguimiento de solicitudes radicadas (PENDIENTE/ACEPTADA/RECHAZADA)
│   │           └── perfil/                  # Información académica y semestre matriculado
│   │
│   ├── app.routes.ts                        # Enrutador principal con guardianes y carga perezosa
│   └── app.ts                               # Componente raíz con <router-outlet /> y servicios globales
│
├── environments/                            # 🌍 Variables de Entorno por Perfil de Compilación
│   ├── environment.ts                       # Desarrollo local: apiUrl = 'http://localhost:8080/api'
│   └── environment.prod.ts                  # Producción: apiUrl = 'https://sgtu-tutorias-universitarias.onrender.com/api'
│
└── public/                                  # 📱 Recursos Estáticos y PWA
    ├── manifest.webmanifest                 # Manifiesto de la aplicación web progresiva
    └── icons/                               # Iconos adaptativos (192×192, 512×512, iOS touch)
```

---

## 3. Componentes Principales y Matriz de Vistas CRUD

La aplicación proporciona interfaces completas para la gestión de todo el ciclo del acompañamiento académico:

| Módulo | Vista / Componente | Operaciones Implementadas | Roles Permitidos |
|---|---|---|:---:|
| **Autenticación** | `pages/login` | Login con credenciales validadas mediante formulario reactivo. | Público |
| **Administración** | `gestion-usuarios` | **Listar** todos los usuarios, **Crear** con rol asignado, **Editar** datos de contacto, **Suspender/Activar** estado y **Eliminar** con confirmación. | `ADMINISTRADOR` |
| **Administración** | `gestion-facultades` | **Listar** facultades, **Crear** facultad, **Crear** programas vinculados a facultad y **Modificar** información. | `ADMINISTRADOR` |
| **Administración** | `gestion-materias` | **Listar** materias con filtros por programa y semestre, **Crear** asignaturas con créditos y **Editar** catálogo. | `ADMINISTRADOR` |
| **Docente** | `mis-tutorias` | **Listar** asesorías propias, **Crear** nueva sesión (fecha, hora, modalidad, cupo máximo) y **Cancelar** tutoría. | `DOCENTE` |
| **Docente** | `solicitudes` | **Listar** solicitudes recibidas, **Aceptar** (con descuento automático de cupos) y **Rechazar** con retroalimentación al alumno. | `DOCENTE` |
| **Estudiante** | `buscar-tutorias` | **Filtrar y explorar** catálogo de tutorías disponibles y **Solicitar cupo** con validación de disponibilidad. | `ESTUDIANTE` |
| **Estudiante** | `mis-solicitudes` | **Listar** estado de postulaciones y **Cancelar** solicitud radicada. | `ESTUDIANTE` |

---

## 4. Capa de Servicios Angular con `HttpClient`

Todos los servicios residen en la capa de servicios inyectables (`@Injectable({ providedIn: 'root' })`) y hacen uso de `HttpClient` con tipado estricto mediante observables de RxJS. El atributo `apiUrl` toma automáticamente el valor definido en `environment.prod.ts` cuando la aplicación se compila para producción.

### 4.1 Servicios Implementados

| Servicio | Endpoints Consumidos | Descripción |
|---|---|---|
| `AuthService` | `POST /api/auth/login` | Autenticación, decodificación del JWT y persistencia del token en `localStorage` |
| `UsuarioService` | `GET/POST/PUT/DELETE /api/usuarios` | CRUD completo de usuarios del sistema |
| `FacultadService` | `GET/POST/PUT /api/facultades` | Gestión del catálogo de facultades |
| `ProgramaService` | `GET/POST /api/programas` | Gestión de programas académicos por facultad |
| `MateriaService` | `GET/POST/PUT /api/materias` | Catálogo curricular con filtros por programa y semestre |
| `DocenteService` | `GET/PUT /api/docentes` | Perfiles de docentes tutores y asignaturas vinculadas |
| `EstudianteService` | `GET/PUT /api/estudiantes` | Perfiles de estudiantes y semestre matriculado |
| `TutoriaService` | `GET/POST/PATCH /api/tutorias` | Programación, listado y cambio de estado de asesorías |
| `SolicitudService` | `GET/POST/PATCH/DELETE /api/solicitudes` | Gestión del ciclo de vida de solicitudes de inscripción |

### 4.2 Ejemplo de Implementación — `TutoriaService`

```typescript
// src/app/core/services/tutoria.service.ts
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

### 4.3 Ejemplo de Implementación — `AuthService`

```typescript
// src/app/core/services/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('rol', response.rol);
        localStorage.setItem('usuario', JSON.stringify(response));
      })
    );
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
```

---

## 5. Formularios Reactivos con Validación (`ReactiveFormsModule`)

Para evitar errores en tiempo de ejecución y proteger la integridad de los datos, todos los formularios utilizan el patrón `FormBuilder` con validaciones sincrónicas:

**Comportamiento general de los formularios:**
- **Control de errores visual:** Los campos inválidos resaltan con bordes rojos y despliegan mensajes explicativos solo cuando el usuario ha interactuado con ellos (`touched`).
- **Protección del envío:** Los botones de guardado permanecen deshabilitados mientras el formulario no cumpla el 100% de los criterios de validación.
- **Consistencia:** Todos los modelos de formulario (`DTO`) están sincronizados con las entidades JPA del backend.

### 5.1 Formulario de Login

```typescript
// src/app/modules/auth/pages/login/login.component.ts
this.loginForm = this.fb.group({
  email:    ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]]
});
```

### 5.2 Formulario de Creación de Materias

```typescript
// src/app/modules/admin/pages/gestion-materias/gestion-materias.component.ts
this.formMateria = this.fb.group({
  nombre:     ['', [Validators.required, Validators.minLength(3)]],
  codigo:     ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-[0-9]{3}$/)]],
  programaId: [null, [Validators.required]],
  semestre:   [1,    [Validators.required, Validators.min(1), Validators.max(12)]],
  creditos:   [3,    [Validators.required, Validators.min(1), Validators.max(6)]],
  descripcion: ['']
});
```

### 5.3 Formulario de Programación de Tutorías (Docente)

```typescript
// src/app/modules/tutor/pages/mis-tutorias/mis-tutorias.component.ts
this.formTutoria = this.fb.group({
  materiaId:   [null,         [Validators.required]],
  fecha:       ['',          [Validators.required]],
  horaInicio:  ['',          [Validators.required]],
  horaFin:     ['',          [Validators.required]],
  modalidad:   ['PRESENCIAL', [Validators.required]],
  enlace:      [''],
  cupoMaximo:  [10,          [Validators.required, Validators.min(1), Validators.max(50)]],
  descripcion: ['']
});
```

---

## 6. Enrutamiento con Angular Router

El enrutamiento implementa carga perezosa (*lazy loading*) por módulo de rol, reduciendo el tiempo de carga inicial. Cada ruta protegida requiere pasar exitosamente por `AuthGuard` y `RoleGuard` antes de renderizar el componente.

### 6.1 Tabla de Rutas Configuradas

| Ruta | Componente Destino | Guards Aplicados | Rol Requerido |
|---|---|---|---|
| `/login` | `LoginComponent` | — | Público |
| `/admin/dashboard` | `DashboardComponent` | `AuthGuard`, `RoleGuard` | `ADMINISTRADOR` |
| `/admin/usuarios` | `GestionUsuariosComponent` | `AuthGuard`, `RoleGuard` | `ADMINISTRADOR` |
| `/admin/facultades` | `GestionFacultadesComponent` | `AuthGuard`, `RoleGuard` | `ADMINISTRADOR` |
| `/admin/materias` | `GestionMateriasComponent` | `AuthGuard`, `RoleGuard` | `ADMINISTRADOR` |
| `/tutor/mis-tutorias` | `MisTutoriasComponent` | `AuthGuard`, `RoleGuard` | `DOCENTE` |
| `/tutor/solicitudes` | `SolicitudesComponent` | `AuthGuard`, `RoleGuard` | `DOCENTE` |
| `/estudiante/buscar` | `BuscarTutoriasComponent` | `AuthGuard`, `RoleGuard` | `ESTUDIANTE` |
| `/estudiante/mis-solicitudes` | `MisSolicitudesComponent` | `AuthGuard`, `RoleGuard` | `ESTUDIANTE` |

### 6.2 Fragmento de Configuración del Enrutador Principal

```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./modules/auth/pages/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: 'tutor',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['DOCENTE'] },
    loadChildren: () => import('./modules/tutor/tutor.routes').then(m => m.tutorRoutes)
  },
  {
    path: 'estudiante',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ESTUDIANTE'] },
    loadChildren: () => import('./modules/estudiante/estudiante.routes').then(m => m.estudianteRoutes)
  },
  { path: '**', redirectTo: '/login' }
];
```

---

## 7. Autenticación desde el Frontend (Login + Consumo del Endpoint de Seguridad)

El módulo de autenticación implementa el flujo completo de login mediante el endpoint seguro del backend:

1. El usuario ingresa credenciales en el `LoginComponent` a través del formulario reactivo.
2. El `AuthService` realiza `POST /api/auth/login` al backend en Render con el cuerpo `{ email, password }`.
3. El backend valida las credenciales contra la base de datos MySQL en AWS RDS, genera y firma el JWT con el algoritmo `HS256`.
4. La respuesta incluye el token JWT, el nombre del usuario y su rol institucional (`ADMINISTRADOR`, `DOCENTE` o `ESTUDIANTE`).
5. El `AuthService` persiste el token en `localStorage` y el `Angular Router` redirige automáticamente al panel correspondiente según el rol.

```typescript
// Flujo de login en el componente
onSubmit(): void {
  if (this.loginForm.invalid) return;
  this.isLoading = true;
  this.authService.login(this.loginForm.value).subscribe({
    next: (response) => {
      const rol = response.rol;
      const ruta = rol === 'ADMINISTRADOR' ? '/admin/dashboard'
                 : rol === 'DOCENTE'       ? '/tutor/mis-tutorias'
                 : '/estudiante/buscar';
      this.router.navigate([ruta]);
    },
    error: (err) => {
      this.isLoading = false;
      this.toastService.error('Credenciales inválidas. Verifique su email y contraseña.');
    }
  });
}
```

---

## 8. Guards de Ruta por Rol de Usuario

El sistema implementa dos guardianes independientes que forman una cadena de verificación antes de cualquier acceso a rutas protegidas:

### 8.1 `AuthGuard` — Verificación de Sesión Activa

```typescript
// src/app/core/guards/auth.guard.ts
export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
```

### 8.2 `RoleGuard` — Verificación de Rol Autorizado

```typescript
// src/app/core/guards/role.guard.ts
export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const rolesRequeridos: string[] = route.data['roles'] ?? [];
  const rolUsuario = authService.getRol();
  if (rolesRequeridos.includes(rolUsuario ?? '')) {
    return true;
  }
  // Redirige al panel propio del usuario si intenta acceder a ruta de otro rol
  const ruta = rolUsuario === 'ADMINISTRADOR' ? '/admin/dashboard'
             : rolUsuario === 'DOCENTE'       ? '/tutor/mis-tutorias'
             : '/estudiante/buscar';
  router.navigate([ruta]);
  return false;
};
```

---

## 9. Interceptor HTTP para Adjuntar Token JWT

El `JwtInterceptor` actúa como middleware de cada petición HTTP saliente, inyectando automáticamente la cabecera `Authorization: Bearer <token>` sin necesidad de hacerlo manualmente en cada servicio:

```typescript
// src/app/core/interceptors/jwt.interceptor.ts
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  return next(req);
};
```

El `ErrorInterceptor` complementa este pipeline capturando respuestas `401 Unauthorized` y `403 Forbidden` del servidor, ejecutando un cierre de sesión limpio y redirigiendo al login de forma automática:

```typescript
// src/app/core/interceptors/error.interceptor.ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
```

**Diagrama del pipeline completo de seguridad:**

```mermaid
flowchart TD
    A["👤 Usuario navega a una ruta protegida"] --> B{"🛡️ AuthGuard:<br/>¿Existe token JWT en localStorage?"}
    B -->|No| C["🚫 Redirigir a /login"]
    B -->|Sí| D{"👥 RoleGuard:<br/>¿El rol coincide con el requerido?"}
    D -->|No coincide| E["⛔ Redirigir al panel<br/>correspondiente al rol del usuario"]
    D -->|Autorizado| F["✅ Carga del Componente Standalone"]

    F --> G["🌐 Petición HTTP saliente a la API"]
    G --> H["🧩 JwtInterceptor:<br/>Inyecta 'Authorization: Bearer token'"]
    H --> I["☁️ Backend Spring Boot en Render"]

    I -->|HTTP 401 / 403| J["⚠️ ErrorInterceptor:<br/>Limpia credenciales y redirige a login"]
    I -->|HTTP 200 OK| K["📦 Datos entregados al componente"]
```

---

## 10. Manejo de Errores y Retroalimentación Visual al Usuario

Para cumplir con las mejores prácticas de experiencia de usuario (UX), el sistema prohíbe el uso de alertas nativas del navegador, implementando un sistema desacoplado basado en servicios reactivos:

### 10.1 `ToastService` — Notificaciones Flotantes

Muestra notificaciones en la esquina superior derecha con autocierre temporizado (4 segundos). Cuatro tipos estilizados:

| Tipo | Color | Uso |
|---|---|---|
| **Éxito** | Verde | Confirmar acciones exitosas: *"Tutoría creada correctamente"* |
| **Error** | Rojo | Informar fallos: *"Error al guardar. Intente nuevamente."* |
| **Advertencia** | Amarillo | Alertas no críticas: *"El cupo de esta tutoría está por agotarse"* |
| **Información** | Azul | Mensajes informativos: *"Su solicitud está en revisión"* |

### 10.2 `DialogService` — Modales de Confirmación

Despliega una ventana modal con fondo traslúcido (*backdrop blur*) antes de ejecutar acciones irreversibles (cancelar tutorías, eliminar usuarios, cerrar sesión). Permite al usuario confirmar o declinar la operación con botones estilizados.

```typescript
// Ejemplo de uso del DialogService en un componente
eliminarUsuario(id: number): void {
  this.dialogService.confirm('¿Eliminar usuario?', 'Esta acción no se puede deshacer.').subscribe(confirmado => {
    if (confirmado) {
      this.usuarioService.eliminar(id).subscribe({
        next: () => this.toastService.success('Usuario eliminado correctamente.'),
        error: () => this.toastService.error('No se pudo eliminar el usuario.')
      });
    }
  });
}
```

---

## 11. Diseño Responsivo (Tailwind CSS)

El diseño responsivo se implementa mediante el sistema de breakpoints de Tailwind CSS (`sm:`, `md:`, `lg:`) y la API de contenedores (`@container`), garantizando una experiencia óptima en todos los dispositivos:

| Dispositivo | Comportamiento del Layout |
|---|---|
| **Móvil (< 768px)** | Sidebar colapsado en menú hamburguesa, navegación inferior fija, tarjetas en columna única |
| **Tablet (768px – 1024px)** | Sidebar en modo icono (mini-rail), contenido en 2 columnas |
| **Escritorio (> 1024px)** | Sidebar expandido con etiquetas de texto, contenido en 3 o más columnas según el módulo |

Principios aplicados:
- **Mobile-first:** Todas las clases base corresponden a pantallas pequeñas; los breakpoints amplían el diseño.
- **Sin CSS personalizado innecesario:** El 95% del estilo se gestiona con clases de utilidad de Tailwind.
- **Consistencia visual:** Paleta de colores corporativa definida en `tailwind.config.js` y reutilizada en todos los módulos.

---

## 12. Evidencia de Integración Real con el Backend (CERO MOCKS)

> **Esta sección es el eje central de la Entrega 4.** Toda la aplicación opera contra la base de datos real MySQL en AWS RDS a través del backend Spring Boot desplegado en Render. No existe ningún JSON local, archivo de datos estático ni servicio simulado (*mock*) en el código fuente del frontend.

### 12.1 Configuración de Entorno de Producción

El archivo `environment.prod.ts` define la URL base de la API real. Angular utiliza este archivo automáticamente cuando la aplicación se compila con `ng build --configuration production` (el comando que ejecuta Vercel en cada despliegue):

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://sgtu-tutorias-universitarias.onrender.com/api'
};
```

**Verificación:** Ningún componente, servicio ni archivo del frontend contiene URLs hardcodeadas a `localhost` o datos JSON definidos dentro del código. La única fuente de datos es el endpoint de producción en Render.

### 12.2 Endpoints Reales Consumidos en Producción

A continuación se documentan las peticiones HTTP reales que el frontend realiza al backend en Render, todas verificables desde la pestaña *Network* del inspector de elementos del navegador:

| # | Método | Endpoint Completo | Cabeceras Enviadas | Respuesta Esperada |
|---|---|---|---|---|
| 1 | `POST` | `https://sgtu-tutorias-universitarias.onrender.com/api/auth/login` | `Content-Type: application/json` | `200 OK` + JWT firmado con HS256 |
| 2 | `GET` | `https://sgtu-tutorias-universitarias.onrender.com/api/usuarios` | `Authorization: Bearer <token>` | `200 OK` + lista de usuarios |
| 3 | `GET` | `https://sgtu-tutorias-universitarias.onrender.com/api/facultades` | `Authorization: Bearer <token>` | `200 OK` + lista de facultades |
| 4 | `GET` | `https://sgtu-tutorias-universitarias.onrender.com/api/programas` | `Authorization: Bearer <token>` | `200 OK` + lista de programas |
| 5 | `GET` | `https://sgtu-tutorias-universitarias.onrender.com/api/materias?programaId=1` | `Authorization: Bearer <token>` | `200 OK` + materias de Ing. Sistemas |
| 6 | `GET` | `https://sgtu-tutorias-universitarias.onrender.com/api/tutorias?estado=DISPONIBLE` | `Authorization: Bearer <token>` | `200 OK` + catálogo de tutorías activas |
| 7 | `POST` | `https://sgtu-tutorias-universitarias.onrender.com/api/solicitudes` | `Authorization: Bearer <token>` | `201 Created` + solicitud registrada en BD |
| 8 | `GET` | `https://sgtu-tutorias-universitarias.onrender.com/api/solicitudes/estudiante/{id}` | `Authorization: Bearer <token>` | `200 OK` + solicitudes del estudiante |
| 9 | `PATCH` | `https://sgtu-tutorias-universitarias.onrender.com/api/solicitudes/{id}/estado` | `Authorization: Bearer <token>` | `200 OK` + solicitud actualizada en BD |

### 12.3 Mecanismo de Inyección del Token JWT (Sin Intervención Manual)

El `JwtInterceptor` garantiza que **el 100% de las peticiones a rutas protegidas lleven la cabecera `Authorization`** sin requerir código adicional en cada servicio. Esto se verifica observando cualquier petición autenticada en la pestaña Network del navegador:

```
Request Headers (observadas en Browser DevTools > Network):
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
  Accept: application/json
```

### 12.4 Declaración de Ausencia de Datos Simulados

Se declara formalmente que el proyecto **no utiliza**:
- Archivos JSON estáticos con datos predefinidos
- Servicios con arrays hardcodeados de tipo `of([...])` como fuente de datos definitiva
- Interceptores que sustituyan respuestas reales por datos locales
- Librerías de mocking como `json-server`, `msw` o similares

Todos los datos mostrados en la interfaz provienen en tiempo real de la API REST del backend Spring Boot, el cual a su vez los obtiene de la instancia MySQL en **AWS RDS** (`parcial1electiva.cd40okomwyz0.us-east-2.rds.amazonaws.com`, base de datos `tutorias_db`).

[Pegar aquí captura de evidencia de integración: Browser DevTools > Network mostrando petición a sgtu-tutorias-universitarias.onrender.com con Status 200 y cabecera Authorization: Bearer]

---

## 13. Repositorio GitHub y Control de Versiones

El proyecto completo se encuentra versionado en el repositorio oficial del equipo, con historial de commits distribuido entre los cuatro integrantes:

- **Repositorio GitHub (Monorepo):** [https://github.com/WRivxs/SGTU-Tutorias-Universitarias](https://github.com/WRivxs/SGTU-Tutorias-Universitarias)
- **Carpeta raíz del frontend:** `/frontend/`
- **Carpeta de documentación técnica:** `/docs/`
- **Backend Spring Boot:** `/backend/`

---

## 14. Resumen de Entregables y Accesos Rápidos para el Evaluador

| Recurso | URL / Ubicación |
|---|---|
| **Frontend en producción (Vercel)** | [https://sgtu-tutorias-universitarias.vercel.app](https://sgtu-tutorias-universitarias.vercel.app) |
| **Backend + Swagger UI (Render)** | [https://sgtu-tutorias-universitarias.onrender.com/swagger-ui/index.html](https://sgtu-tutorias-universitarias.onrender.com/swagger-ui/index.html) |
| **Repositorio completo (GitHub)** | [https://github.com/WRivxs/SGTU-Tutorias-Universitarias](https://github.com/WRivxs/SGTU-Tutorias-Universitarias) |
| **Código fuente del frontend** | [/frontend/ en el repositorio](https://github.com/WRivxs/SGTU-Tutorias-Universitarias/tree/main/frontend) |
| **Código fuente del backend** | [/backend/ en el repositorio](https://github.com/WRivxs/SGTU-Tutorias-Universitarias/tree/main/backend) |

### Credenciales de Demostración

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@uniajs.edu.co` | `admin123` |
| Docente Tutor | `wadid.rivas@uniajs.edu.co` | `docente123` |
| Estudiante | `estudiante@uniajs.edu.co` | `estudiante123` |

---

*Documento elaborado por el equipo de desarrollo del SGTU — Electiva Profesional II, UNIAJS, Noviembre 2026.*
