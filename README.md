# Sistema de Gestión de Tutorías Universitarias (SGTU) 🎓

[![Java](https://img.shields.io/badge/Java-17-orange.svg?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.x-brightgreen.svg?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-21.2-red.svg?logo=angular&logoColor=white)](https://angular.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![AWS RDS](https://img.shields.io/badge/AWS-RDS_MySQL_8-232F3E.svg?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/rds/)
[![JWT](https://img.shields.io/badge/Security-JWT_Stateless-black.svg?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

Plataforma web integral orientada a optimizar y automatizar los procesos de asesoría académica universitaria. El sistema centraliza la oferta de tutorías grupales, el agendamiento interactivo en tiempo real y el seguimiento académico bajo un esquema de control de acceso basado en roles (**RBAC**).

---

## 🏛️ Arquitectura Global del Sistema

El proyecto está diseñado bajo una arquitectura desacoplada estructurada en un monorepo:

```text
       ┌────────────────────────────────────────────────────────┐
       │                   CLIENTE WEB (SPA)                    │
       │          Angular 21 + Tailwind CSS + Signals           │
       └───────────────────────────┬────────────────────────────┘
                                   │ HTTP / JSON
                                   │ Bearer JWT Token
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │                  BACKEND (API RESTful)                 │
       │       Spring Boot 3 + Spring Security 6 + JJWT         │
       │       (Controller -> Service -> Repository)            │
       └───────────────────────────┬────────────────────────────┘
                                   │ JDBC / JPA (Hibernate)
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │                 BASE DE DATOS CLOUD                    │
       │              AWS RDS (MySQL 8 Relacional)              │
       └────────────────────────────────────────────────────────┘
```

---

## 👥 Integrantes del Equipo

| Nombre | Rol Principal |
|---|---|
| **Wadid Rivas Payares** | Encargado Backend & Arquitectura |
| **Azael Espitia Toribio** | Encargado Base de Datos & Infraestructura Cloud (AWS) |
| **Eduardo Julio Bettin Avilez** | Líder Técnico & Frontend |
| **Jhon Jader Bertel Ortega** | Encargado QA & Documentación |

---

## 🔐 Matriz de Roles y Funcionalidades (RBAC)

El sistema opera bajo tres perfiles con vistas, permisos e interfaces personalizadas:

* **🛠️ Administrador:**
  * Dashboard con métricas globales del sistema.
  * Gestión centralizada de usuarios (crear, editar, desactivar estudiantes/tutores/admins).
  * Catálogo de materias universitarias (activación y registro).
  * Supervisión del calendario institucional general.

* **👨‍🏫 Docente Tutor:**
  * Creación y programación de tutorías académicas grupales.
  * Control del ciclo de vida de la tutoría (`DISPONIBLE`, `OCUPADA`, `FINALIZADA`, `CANCELADA`).
  * Conteo de estudiantes inscritos en tiempo real y visualización de lista de asistentes por sesión.
  * Bandeja de solicitudes de cupos con opción de Aceptar o Rechazar individualmente.
  * Agenda interactiva mensual con panel detallado de sesiones por fecha.
  * Perfil docente (especialidad académica y disponibilidad).

* **🎓 Estudiante:**
  * Exploración de catálogo con búsqueda en vivo, filtros por materia y modalidad (Presencial / Virtual).
  * Solicitud de cupo en tutorías con notas o comentarios para el docente.
  * Historial de solicitudes enviadas y cancelación de solicitudes en estado `PENDIENTE`.
  * Horario académico sincronizado (calendario mensual con tutorías confirmadas).
  * Gestión de perfil personal y cambio seguro de contraseña.

---

## 📁 Estructura del Monorepo

```text
SGTU-Tutorias-Universitarias/
├── backend/                  # API REST en Spring Boot 3 (Java 17, JPA, MySQL RDS)
│   ├── src/                  # Capas: Controller, Service, Repository, Entity, Config, DTO
│   ├── sql/                  # Scripts DDL y datos de inicialización
│   ├── postman/              # Colección de pruebas de integración y seguridad
│   ├── arrancar.ps1          # Script de arranque rápido con variables de entorno para desarrollo
│   ├── pom.xml               # Dependencias Maven (Spring Data JPA, Security, JJWT, OpenAPI)
│   └── README.md             # Documentación técnica exhaustiva del Backend
├── frontend/                 # Single Page Application (SPA) en Angular 21
│   ├── src/app/
│   │   ├── core/             # Servicios Singleton, Interceptores JWT y Route Guards
│   │   ├── shared/           # Modelos TypeScript, Layouts (Sidebars por rol, Navbar)
│   │   └── modules/          # Submódulos independientes: auth, admin, tutor, estudiante
│   ├── package.json          # Dependencias y scripts de Angular / Tailwind
│   └── README.md             # Guía de instalación, arquitectura y despliegue del Frontend
├── docs/                     # Entregables y documentación formal académica
│   ├── Entrega1-Requerimientos-Arquitectura.pdf
│   ├── Entrega 2_DER_y_Diccionario_de_Datos.pdf
│   ├── Entrega2_Documento.md
│   ├── Entrega3_Arquitectura_Seguridad.md
│   ├── Entrega3_Reporte_Pruebas.md
│   └── Plan_Entrega4_Frontend.md
└── README.md                 # Este documento (visión general del proyecto)
```

---

## 🚀 Guía de Puesta en Marcha Local

### 1. Clonar el Repositorio
```bash
git clone https://github.com/WRivxs/SGTU-Tutorias-Universitarias.git
cd SGTU-Tutorias-Universitarias
```

### 2. Prerrequisitos
* **Java 17 o superior** (OpenJDK / Eclipse Adoptium)
* **Maven** (3.8+)
* **Node.js** (v20 o superior) y **npm** (v10 o superior)
* Conexión a Internet para la persistencia en AWS RDS.

---

### 3. Ejecutar el Backend (Spring Boot)

1. Abre una terminal en la carpeta `backend/`:
   ```bash
   cd backend
   ```

2. **En Windows (PowerShell):**
   Ejecuta el script automatizado que inyecta las variables de entorno de AWS RDS y arranca el servicio:
   ```powershell
   .\arrancar.ps1
   ```

3. **En Linux / macOS (Bash):**
   ```bash
   export DB_HOST="parcial1electiva.cd40okomwyz0.us-east-2.rds.amazonaws.com"
   export DB_PORT="3306"
   export DB_NAME="tutorias_db"
   export DB_USERNAME="ingeniero"
   export DB_PASSWORD="tu_password_aqui"
   export SERVER_PORT="8080"

   mvn spring-boot:run
   ```

* **API Base:** `http://localhost:8080/api`
* **Swagger OpenAPI 3 (Documentación interactiva):** `http://localhost:8080/swagger-ui.html`

---

### 4. Ejecutar el Frontend (Angular)

1. Abre una nueva terminal en la carpeta `frontend/`:
   ```bash
   cd frontend
   ```

2. Instala las dependencias de Node:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm start
   # o bien: npx ng serve
   ```

* **Aplicación Web:** `http://localhost:4200/`
* Redirección inicial automática hacia la pantalla de autenticación (`/login`).
