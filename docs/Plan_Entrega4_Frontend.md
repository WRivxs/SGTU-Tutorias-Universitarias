# Plan de Arquitectura y Ejecución - Frontend Angular (Entrega 4)
Sistema de Gestión de Tutorías Universitarias (SGTU)

Este documento contiene la planificación detallada de la arquitectura del frontend en Angular y el flujo de trabajo para integrarlo con el backend Spring Boot.

---

## 1. Arquitectura a Nivel de Archivo (Monorepo)

Se implementará el patrón LIFT y **Lazy Loading** (carga perezosa por módulos según el rol).

```text
frontend/
├── src/
│   ├── environments/
│   │   ├── environment.ts                # Dev: apiUrl = 'http://localhost:8080/api'
│   │   └── environment.prod.ts           # Prod: apiUrl = 'https://tudominio.com/api'
│   │
│   ├── app/
│   │   ├── core/                         # 🛡️ MOTOR Y SEGURIDAD (Solo se importa 1 vez)
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts         # Valida si el usuario inició sesión
│   │   │   │   └── role.guard.ts         # Valida si tiene el ROL correcto para la URL
│   │   │   ├── interceptors/
│   │   │   │   ├── jwt.interceptor.ts    # Inyecta "Bearer <token>" en cada petición HTTP
│   │   │   │   └── error.interceptor.ts  # Atrapa errores 401/403 para cerrar la sesión
│   │   │   └── services/
│   │   │       └── auth.service.ts       # Lógica de login(), logout(), y token en localStorage
│   │   │
│   │   ├── shared/                       # 🧩 COMPONENTES VISUALES COMPARTIDOS
│   │   │   ├── components/
│   │   │   │   ├── layout/               # La "cáscara" de la app
│   │   │   │   │   ├── sidebar/          
│   │   │   │   │   └── navbar/           
│   │   │   │   └── ui/
│   │   │   │       └── alert/            # Componente genérico para mensajes (Éxito/Error)
│   │   │   └── models/                   # Interfaces TypeScript (DTOs del backend)
│   │   │       ├── usuario.model.ts
│   │   │       ├── materia.model.ts
│   │   │       ├── tutoria.model.ts
│   │   │       └── solicitud.model.ts
│   │   │
│   │   ├── modules/                      # 📦 MÓDULOS DE FUNCIONALIDAD (Lazy Loaded)
│   │   │   │
│   │   │   ├── auth/                     # PÚBLICO
│   │   │   │   ├── auth-routing.module.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   └── pages/login/          
│   │   │   │
│   │   │   ├── admin/                    # SOLO ROL: ADMINISTRADOR
│   │   │   │   ├── admin-routing.module.ts
│   │   │   │   ├── admin.module.ts
│   │   │   │   ├── services/admin.service.ts 
│   │   │   │   └── pages/
│   │   │   │       ├── dashboard/        
│   │   │   │       ├── gestion-materias/ 
│   │   │   │       └── gestion-usuarios/ 
│   │   │   │
│   │   │   ├── tutor/                    # SOLO ROL: TUTOR
│   │   │   │   ├── tutor-routing.module.ts
│   │   │   │   ├── tutor.module.ts
│   │   │   │   ├── services/tutor.service.ts 
│   │   │   │   └── pages/
│   │   │   │       ├── mis-tutorias/     
│   │   │   │       └── solicitudes/      
│   │   │   │
│   │   │   └── estudiante/               # SOLO ROL: ESTUDIANTE
│   │   │       ├── estudiante-routing.module.ts
│   │   │       ├── estudiante.module.ts
│   │   │       ├── services/estudiante.service.ts
│   │   │       └── pages/
│   │   │           ├── buscar-tutorias/  
│   │   │           └── mis-solicitudes/  
│   │   │
│   │   ├── app-routing.module.ts         # Enrutador Raíz (Redirige a los módulos)
│   │   ├── app.module.ts                 # Main Module (importa HttpClientModule y SharedModule)
│   │   └── app.component.ts | .html      # Solo contiene <router-outlet>
│   │
│   ├── styles.css                        # Importaciones de Tailwind CSS
│   └── index.html
└── tailwind.config.js                    # Configuración UI
```

---

## 2. Plan de Ejecución (Fase por Fase)

### Fase 1: Infraestructura y Modelos (Angular Puro sin Diseño)
1. Iniciar el proyecto con `ng new frontend` y configurar Tailwind CSS.
2. Crear las carpetas base `core`, `shared` y `modules`.
3. Crear las interfaces TypeScript (`.model.ts`) para que coincidan exactamente con las respuestas JSON de Spring Boot.

### Fase 2: Conexión Segura y Lógica (Puente al Backend)
1. Configurar `environment.ts` con la URL de Spring Boot (`http://localhost:8080/api`).
2. Implementar `AuthService` para conectarse a `/api/auth/login` y manejar el localStorage.
3. Programar el `JwtInterceptor` para adjuntar el JWT en cada petición.
4. Programar los Guards (`AuthGuard`, `RoleGuard`) para proteger el enrutamiento.

### Fase 3: Diseño Visual con Inteligencia Artificial (Google Stitch)
*(Trabajo paralelo entre diseño IA y código TypeScript)*
1. **Prompt 1:** Pantalla de Login moderna y centrada.
2. **Prompt 2:** Layout Dashboard (Sidebar izquierdo dinámico, Navbar superior).
3. **Prompt 3:** Plantilla genérica para tablas CRUD (botones editar/eliminar).
4. **Prompt 4:** Modal genérico para crear/editar registros.

### Fase 4: Fusión e Integración Final
1. Copiar y pegar el código HTML+Tailwind devuelto por Stitch en los componentes de Angular de la Fase 1.
2. Reemplazar datos estáticos por variables usando `*ngFor` y `*ngIf`.
3. Enlazar los inputs HTML con `ReactiveFormsModule` (`FormGroup`, `FormControl`) para activar validaciones en tiempo real (replicando las restricciones del backend).
4. Pruebas end-to-end simulando el flujo de un Admin, un Tutor y un Estudiante.
