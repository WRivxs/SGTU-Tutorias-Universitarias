# Sistema de Gestión de Tutorías Universitarias (SGTU) - Frontend

Aplicación Single Page Application (SPA) desarrollada con **Angular 21**, **TypeScript** y **Tailwind CSS**, consumiendo la API REST desarrollada en Spring Boot para la gestión integral de tutorías universitarias.

---

## 🚀 Requisitos Previos

- **Node.js**: v20 o superior
- **npm**: v10 o superior
- **Backend Spring Boot**: En ejecución en `http://localhost:8080` con base de datos configurada.

---

## 🛠️ Instalación y Puesta en Marcha

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm start
   # o bien:
   npx ng serve
   ```
   La aplicación estará disponible en `http://localhost:4200/`.

3. **Compilación para producción / desarrollo:**
   ```bash
   npx ng build --configuration development
   # o para producción:
   npx ng build
   ```

---

## 🏛️ Arquitectura del Proyecto

```
frontend/src/app/
├── core/                         # Singleton services, interceptores y guards
│   ├── guards/                   # auth.guard.ts, role.guard.ts (RBAC)
│   ├── interceptors/             # auth.interceptor.ts (Inyección Bearer JWT)
│   └── services/                 # auth, tutoria, solicitud, tutor-perfil, usuario
├── shared/                       # Componentes, modelos e interfaces compartidos
│   ├── components/layout/        # navbar, sidebars (admin, tutor, estudiante)
│   └── models/                   # auth, usuario, materia, tutoria, solicitud
└── modules/                      # Módulos organizados por rol y funcionalidad
    ├── auth/                     # Login con formulario reactivo
    ├── admin/                    # Dashboard, Usuarios, Materias, Calendario
    ├── tutor/                    # Mis Tutorías, Agenda, Solicitudes, Perfil
    └── estudiante/               # Buscar Tutorías, Mis Solicitudes, Horario, Perfil
```

---

## 🔐 Matriz de Roles y Acceso (RBAC)

| Módulo | Ruta Base | Rol Autorizado | Funcionalidades Principales |
|---|---|---|---|
| **Público** | `/login` | Todos | Autenticación con JWT, feedback de errores y redirección por rol |
| **Administrador** | `/admin/*` | `ADMINISTRADOR` | Dashboard estadístico, CRUD de usuarios, CRUD de materias y calendario institucional |
| **Docente Tutor** | `/tutor/*` | `TUTOR` | Creación y edición de tutorías grupales, control de estados, revisión de solicitudes recibidas, agenda mensual y perfil docente |
| **Estudiante** | `/estudiante/*` | `ESTUDIANTE` | Exploración de catálogo con filtros, reserva de cupos con notas, historial de solicitudes, horario mensual sincronizado y perfil |

---

## 📡 Integración con Backend Real

- Todas las peticiones HTTP se dirigen al backend en `http://localhost:8080/api`.
- Se adjunta automáticamente el token JWT en cada solicitud mediante el `authInterceptor`.
- La seguridad en el cliente está sincronizada con las anotaciones `@PreAuthorize` de Spring Boot.
