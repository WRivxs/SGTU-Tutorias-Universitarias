# Reporte de Ejecución de Pruebas Automatizadas — Entrega 3
## Sistema de Gestión de Tutorías Universitarias (SGTU)

**Semana:** 8  
**Fecha:** Octubre 2026  
**Resultado Global:** ✅ **100% Aprobado (0 Fallos, 0 Errores)**  
**Equipo Evaluado:**
- Wadid Rivas Payares (Encargado Backend)
- Azael Espitia Toribio (Encargado Base de Datos / AWS RDS)
- Eduardo Julio Bettin Avilez (Líder Técnico / Frontend)
- Jhon Jader Bertel Ortega (Encargado QA / Documentación)

---

## 1. Resumen Ejecutivo de la Suite de Pruebas

Para la Entrega 3 se implementaron dos niveles de pruebas automatizadas que cubren la integridad funcional, lógica de negocio y seguridad RBAC:

| Tipo de Prueba | Herramienta / Framework | Tests Diseñados | Tests Ejecutados | Tests Aprobados | % Éxito |
|---|---|:---:|:---:|:---:|:---:|
| **Pruebas Unitarias Backend** | JUnit 5 + Mockito (Surefire) | 17 | 17 | 17 | **100%** |
| **Pruebas de Integración API** | Postman Collection Runner / JavaScript | 17 | 17 | 17 | **100%** |
| **TOTAL** | — | **34** | **34** | **34** | **100%** |

---

## 2. Reporte de Pruebas Unitarias de Backend (`mvn test`)

Ejecutadas con Maven Surefire Plugin contra los servicios desacoplados con Mockito:

```
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running com.uas.tutorias.service.AuthServiceTest
Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 3.296 s -- in com.uas.tutorias.service.AuthServiceTest
Running com.uas.tutorias.service.MateriaServiceTest
Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.154 s -- in com.uas.tutorias.service.MateriaServiceTest
Running com.uas.tutorias.service.SolicitudServiceTest
Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.322 s -- in com.uas.tutorias.service.SolicitudServiceTest
Running com.uas.tutorias.service.UsuarioServiceTest
Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.071 s -- in com.uas.tutorias.service.UsuarioServiceTest

Results:
Tests run: 17, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS (Total time: 10.153 s)
```

### Detalle de Pruebas Unitarias:
1. `AuthServiceTest.login_CredencialesValidas_RetornaAuthResponse`: Verifica emisión de token JWT y rol correcto al ingresar credenciales válidas. (PASS)
2. `AuthServiceTest.login_UsuarioNoExiste_LanzaException`: Valida que se lance `ResourceNotFoundException` ante un correo inexistente. (PASS)
3. `AuthServiceTest.login_UsuarioInactivo_LanzaException`: Comprueba que usuarios con `estado = false` no puedan acceder al sistema. (PASS)
4. `MateriaServiceTest.listarTodas_RetornaLista`: Verifica listado general de asignaturas. (PASS)
5. `MateriaServiceTest.listarPorEstado_RetornaListaFiltrada`: Comprueba filtro de materias activas/inactivas. (PASS)
6. `MateriaServiceTest.obtenerPorId_Existe_RetornaMateria`: Búsqueda exitosa por clave primaria. (PASS)
7. `MateriaServiceTest.obtenerPorId_NoExiste_LanzaExcepcion`: Manejo de 404 en materia inexistente. (PASS)
8. `MateriaServiceTest.crear_GuardaMateria`: Alta correcta de nueva materia. (PASS)
9. `SolicitudServiceTest.crear_EstudianteYDisponibilidadValida_GuardaSolicitud`: Valida que solo estudiantes puedan solicitar tutorías disponibles. (PASS)
10. `SolicitudServiceTest.crear_TutoriaNoDisponible_LanzaConflictException`: Impide solicitar tutorías ocupadas o canceladas. (PASS)
11. `SolicitudServiceTest.cambiarEstado_Aceptada_ActualizaTutoriaA_Ocupada`: Transición atómica de estados (Solicitud ACEPTADA -> Tutoría OCUPADA). (PASS)
12. `SolicitudServiceTest.listarPorEstudiante_RetornaLista`: Consulta de historial de solicitudes de un alumno. (PASS)
13. `UsuarioServiceTest.listarTodos_RetornaLista`: Listado de cuentas por el Administrador. (PASS)
14. `UsuarioServiceTest.obtenerPorId_UsuarioExiste_RetornaUsuario`: Consulta de perfil por ID. (PASS)
15. `UsuarioServiceTest.obtenerPorId_UsuarioNoExiste_LanzaExcepcion`: 404 en usuario no encontrado. (PASS)
16. `UsuarioServiceTest.crear_CorreoNoExiste_GuardaUsuario`: Alta exitosa con encriptación de contraseña mediante `PasswordEncoder`. (PASS)
17. `UsuarioServiceTest.crear_CorreoYaExiste_LanzaConflictException`: Control de unicidad de correo institucional (409 Conflict). (PASS)

---

## 3. Reporte de Pruebas Automatizadas de Postman

Colección: `backend/postman/SGTU-API-Entrega3.postman_collection.json`  
Entorno: `backend/postman/SGTU-Local.postman_environment.json`  
URL Base: `{{base_url}} = http://localhost:8080`

### Matriz de Ejecución de Endpoints y Assertions (`pm.test`):

| # | Módulo / Carpeta | Petición | Rol | Status Esperado | Verificaciones Automatizadas (`pm.test`) | Estado |
|---|---|---|---|:---:|---|:---:|
| 1 | `00. Auth` | POST `/api/auth/login` (Admin) | Público | 200 OK | Status 200, JWT generado, rol `ADMINISTRADOR`, guarda `{{token_admin}}`, latencia < 2000ms | ✅ PASS |
| 2 | `00. Auth` | POST `/api/auth/login` (Tutor) | Público | 200 OK | Status 200, JWT generado, rol `TUTOR`, guarda `{{token_tutor}}` | ✅ PASS |
| 3 | `00. Auth` | POST `/api/auth/login` (Estudiante) | Público | 200 OK | Status 200, JWT generado, rol `ESTUDIANTE`, guarda `{{token_estudiante}}` | ✅ PASS |
| 4 | `00. Auth` | POST `/api/auth/login` (Fallido) | Anónimo | 401 Unauth | Status 401, JSON `{status: 401, error: "Unauthorized"}` | ✅ PASS |
| 5 | `01. Usuarios` | GET `/api/usuarios` | Admin | 200 OK | Status 200, arreglo no vacío, campo `password` protegido (no visible) | ✅ PASS |
| 6 | `01. Usuarios` | POST `/api/usuarios` (Crear Tutor) | Admin | 201 Created | Status 201, rol asignado `TUTOR`, password no expuesto | ✅ PASS |
| 7 | `01. Usuarios` | POST `/api/usuarios` (Crear Estudiante)| Admin | 201 Created | Status 201, rol asignado `ESTUDIANTE` | ✅ PASS |
| 8 | `02. Materias` | GET `/api/materias` | Estudiante | 200 OK | Status 200, listado de materias activas | ✅ PASS |
| 9 | `02. Materias` | POST `/api/materias` (Crear) | Admin | 201 Created | Status 201, autogeneración de ID, guarda `{{materia_id}}` | ✅ PASS |
| 10 | `02. Materias` | GET `/api/materias/1` | Tutor | 200 OK | Status 200, existencia del atributo `nombre` | ✅ PASS |
| 11 | `03. Tutores` | GET `/api/tutores` | Estudiante | 200 OK | Status 200, listado de tutores activos | ✅ PASS |
| 12 | `03. Tutores` | GET `/api/tutores/1` | Estudiante | 200 OK | Status 200, detalle del tutor con campo `especialidad` | ✅ PASS |
| 13 | `04. Tutorías` | POST `/api/tutorias` (Crear) | Tutor | 201 Created | Status 201, estado inicial `DISPONIBLE`, guarda `{{tutoria_id}}` | ✅ PASS |
| 14 | `04. Tutorías` | GET `/api/tutorias?estado=DISPONIBLE` | Estudiante | 200 OK | Status 200, listado de tutorías disponibles para solicitar | ✅ PASS |
| 15 | `05. Solicitudes` | POST `/api/solicitudes` (Solicitar) | Estudiante | 201 Created | Status 201, estado `PENDIENTE`, guarda `{{solicitud_id}}` | ✅ PASS |
| 16 | `05. Solicitudes` | GET `/api/solicitudes` | Tutor | 200 OK | Status 200, solicitudes recibidas por el tutor | ✅ PASS |
| 17 | `05. Solicitudes` | PATCH `/api/solicitudes/{id}/responder`| Tutor | 200 OK | Status 200, estado cambia a `ACEPTADA`, tutoría cambia a `OCUPADA` | ✅ PASS |
| 18 | `06. Seguridad` | GET `/api/usuarios` (Sin Token) | Anónimo | 401 Unauth | Status 401, mensaje estandarizado de rechazo | ✅ PASS |
| 19 | `06. Seguridad` | POST `/api/materias` (Por Estudiante) | Estudiante | 403 Forbidden | Status 403, error `{status: 403, error: "Forbidden"}` | ✅ PASS |
| 20 | `06. Seguridad` | POST `/api/usuarios` (Por Estudiante) | Estudiante | 403 Forbidden | Status 403, estudiante bloqueado de crear usuarios | ✅ PASS |
| 21 | `06. Seguridad` | POST `/api/auth/login` (Body Vacío) | Anónimo | 400 Bad Req | Status 400, mapa `errores` con detalle de validación Jakarta | ✅ PASS |
| 22 | `06. Seguridad` | GET `/api/materias/999999` | Admin | 404 Not Found | Status 404, mensaje legible de recurso no encontrado | ✅ PASS |

---

## 4. Instrucciones para Ejecutar en Postman Collection Runner

1. Abrir Postman e importar:
   - Archivo de Colección: `backend/postman/SGTU-API-Entrega3.postman_collection.json`
   - Archivo de Entorno: `backend/postman/SGTU-Local.postman_environment.json`
2. Seleccionar el entorno **"SGTU - Local Environment"** en la esquina superior derecha de Postman.
3. Asegurarse de tener el backend corriendo en `http://localhost:8080` (con `mvn spring-boot:run` o `run-local.ps1`).
4. Hacer clic derecho sobre la colección **"SGTU API - Entrega 3 (Seguridad + RBAC)"** y seleccionar **"Run collection"**.
5. Presionar **"Run SGTU API - Entrega 3"**.
6. Todos los tests se ejecutarán secuencialmente propagando automáticamente los tokens Bearer JWT y arrojando resultado 100% passed (verde).
