# Documento de Arquitectura de Seguridad — Entrega 3
## Sistema de Gestión de Tutorías Universitarias (SGTU)

**Semana:** 8  
**Fecha:** Octubre 2026  
**Integrantes:**
- Wadid Rivas Payares (Encargado Backend)
- Azael Espitia Toribio (Encargado Base de Datos / AWS RDS)
- Eduardo Julio Bettin Avilez (Líder Técnico / Frontend)
- Jhon Jader Bertel Ortega (Encargado QA / Documentación)

---

## 1. Introducción y Enfoque de Seguridad

El Sistema de Gestión de Tutorías Universitarias (SGTU) implementa un modelo de seguridad robusto, sin estado (**Stateless**) y basado en estándares de la industria para APIs RESTful.

La solución integra:
- **Spring Security 6.3.x:** Control de filtros HTTP, cadena de seguridad y autorización declarativa con `@EnableMethodSecurity(prePostEnabled = true)`.
- **JSON Web Tokens (JJWT 0.12.6):** Autenticación mediante tokens firmados criptográficamente bajo el estándar RFC 7519.
- **BCrypt Password Hashing:** Cifrado unidireccional de contraseñas con factor de coste 10 (`$2a$10$...`), protegiendo las credenciales contra ataques de fuerza bruta y diccionarios.

---

## 2. Modelo Institucional Estricto y Control de Acceso por Roles (RBAC)

De acuerdo con las reglas de negocio de una institución universitaria:
1. **Sin auto-registro público:** No existe creación libre de cuentas anónimas. El único endpoint público del módulo de autenticación es `POST /api/auth/login`.
2. **Creación exclusiva por Administrador:** La creación de cualquier usuario (Estudiantes, Tutores u otros Administradores) está centralizada en `POST /api/usuarios`, restringida a usuarios con rol `ADMINISTRADOR`.
3. **Roles implementados:**
   - `ADMINISTRADOR`: Acceso total al sistema, gestión de usuarios, materias, auditoría y parámetros globales.
   - `TUTOR`: Programación y gestión de sesiones de tutoría, consulta de materias y aceptación/rechazo de solicitudes de estudiantes.
   - `ESTUDIANTE`: Consulta de materias, visualización de tutorías disponibles, creación y seguimiento de sus propias solicitudes.

### Matriz de Permisos RBAC

| Endpoint | Método | Roles Permitidos | Propósito |
|---|---|---|---|
| `/api/auth/login` | POST | Público (Todos) | Iniciar sesión y emitir JWT |
| `/api/usuarios/**` | GET, POST, PUT, DELETE, PATCH | `ADMINISTRADOR` | Gestión completa de usuarios |
| `/api/usuarios/{id}` | GET | `ADMINISTRADOR`, `TUTOR`, `ESTUDIANTE` | Consulta de perfil |
| `/api/materias` | POST, PUT, DELETE | `ADMINISTRADOR` | Mantenimiento del catálogo |
| `/api/materias/**` | GET | `ADMINISTRADOR`, `TUTOR`, `ESTUDIANTE` | Consulta de materias activas |
| `/api/tutores` | POST, DELETE | `ADMINISTRADOR` | Alta y baja de perfil tutor |
| `/api/tutores/{id}` | PUT | `ADMINISTRADOR`, `TUTOR` | Edición de disponibilidad |
| `/api/tutores/**` | GET | `ADMINISTRADOR`, `TUTOR`, `ESTUDIANTE` | Consulta de tutores |
| `/api/tutorias` | POST, PUT, PATCH, DELETE | `ADMINISTRADOR`, `TUTOR` | Programar y gestionar tutorías |
| `/api/tutorias/**` | GET | `ADMINISTRADOR`, `TUTOR`, `ESTUDIANTE` | Consulta de tutorías disponibles |
| `/api/solicitudes` | POST | `ESTUDIANTE` | Solicitar una tutoría disponible |
| `/api/solicitudes/{id}/responder`| PATCH | `ADMINISTRADOR`, `TUTOR` | Aceptar o rechazar solicitud |
| `/api/solicitudes/**` | GET, DELETE | `ADMINISTRADOR`, `TUTOR`, `ESTUDIANTE` | Consulta y cancelación |
| `/swagger-ui/**`, `/v3/api-docs/**` | GET | Público | Documentación interactiva OpenAPI |

---

## 3. Arquitectura y Componentes de Seguridad

El flujo de procesamiento de cada petición sigue la siguiente arquitectura de componentes:

```
[ Petición HTTP ] 
       │
       ▼
[ CorsFilter ] ────────────────── Valida orígenes cruzados (Angular localhost:4200)
       │
       ▼
[ JwtAuthenticationFilter ] ───── Extrae header "Authorization: Bearer <token>"
       │                          Valida firma, expiración y claims con JwtTokenProvider
       │                          Si es válido, monta UserDetails en SecurityContextHolder
       │
       ▼
[ SecurityFilterChain ] ───────── Aplica reglas de URL y delega a @PreAuthorize en controladores
       │
   ┌───┴────────────────────────┐
   │                            │
   ▼                            ▼
[ 200/201 OK ]           [ Errores de Seguridad ]
Respuesta del Controller        ├── 401 Unauthorized -> JwtAuthEntryPoint (JSON)
                                └── 403 Forbidden    -> CustomAccessDeniedHandler (JSON)
```

### Descripción de Componentes:
1. **`SecurityConfig`:** Configuración central de Spring Security. Deshabilita CSRF (innecesario en APIs stateless), activa política de sesiones `SessionCreationPolicy.STATELESS`, inyecta el `CorsConfigurationSource` y define el bean `PasswordEncoder` (`BCryptPasswordEncoder`).
2. **`JwtTokenProvider`:** Clase encargada de firmar tokens con algoritmo HMAC-SHA256 (`HS256`), extraer el correo (`subject`), el rol (`ROLE_...`), el ID de usuario y validar que el token no haya sido manipulado ni haya expirado.
3. **`JwtAuthenticationFilter`:** Filtro de tipo `OncePerRequestFilter` que intercepta cada llamada, valida el token y propaga la identidad autenticada al hilo de ejecución (`SecurityContextHolder`).
4. **`UserDetailsServiceImpl`:** Implementa la interfaz estándar de Spring Security para cargar los datos del usuario desde `UsuarioRepository` y mapear sus roles como `GrantedAuthority`.
5. **`JwtAuthEntryPoint` & `CustomAccessDeniedHandler`:** Garantizan que las fallas de autenticación (401) y autorización (403) respondan siempre con un cuerpo JSON uniforme y no con páginas de error HTML.

---

## 4. Ciclo de Vida del Token JWT

- **Header:** Algoritmo `HS256` y tipo `JWT`.
- **Payload:**
  - `sub`: Correo electrónico del usuario (identificador principal).
  - `userId`: Identificador único numérico en base de datos.
  - `role`: Rol institucional (`ROLE_ADMINISTRADOR`, `ROLE_TUTOR`, `ROLE_ESTUDIANTE`).
  - `nombre`: Nombre completo del usuario para visualización en cliente.
  - `iat`: Timestamp de emisión.
  - `exp`: Timestamp de expiración (24 horas por defecto, configurable mediante `jwt.expiration`).
- **Signature:** Firma simétrica generada a partir de `jwt.secret` (almacenado como variable de entorno).

---

## 5. Respuestas de Error Estandarizadas

Cualquier excepción de seguridad genera un JSON con la siguiente estructura:

### Error 401 Unauthorized (Sin token o credenciales incorrectas):
```json
{
  "timestamp": "2026-10-03T17:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Acceso no autorizado: credenciales inválidas o token no proporcionado / expirado",
  "path": "/api/usuarios"
}
```

### Error 403 Forbidden (Rol no autorizado):
```json
{
  "timestamp": "2026-10-03T17:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Acceso denegado: no cuenta con los permisos o rol requeridos para esta acción",
  "path": "/api/materias"
}
```

---

## 6. Verificación y Pruebas

La arquitectura ha sido validada mediante dos vías:
1. **Pruebas Unitarias de Backend (`mvn test`):** 17 tests unitarios pasando exitosamente con Mockito y JUnit 5, cubriendo servicios y validación de tokens.
2. **Colección Automatizada de Postman:** 17 pruebas automatizadas (`pm.test`) que evalúan login de cada rol, persistencia de variables en entorno, creación de registros y comprobación de respuestas 401, 403, 404 y 400.
3. **Documentación Swagger / OpenAPI 3:** Accesible en `/swagger-ui/index.html` con botón "Authorize" para pruebas interactivas en vivo.
