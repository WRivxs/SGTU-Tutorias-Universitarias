# Reporte de Ejecución de Pruebas Automatizadas — Entrega 3
## Sistema de Gestión de Tutorías Universitarias (SGTU)

**Curso:** Electiva Profesional II  
**Programa:** Ingeniería de Sistemas  
**Institución:** Corporación Universitaria Antonio José de Sucre (UNIAJS)  
**Semana:** 8  
**Fecha:** Noviembre 2026  
**Resultado Global:** ✅ **100% Aprobado (0 Fallos, 0 Errores en Lógica y Seguridad)**  
**Repositorio Oficial:** [https://github.com/WRivxs/SGTU-Tutorias-Universitarias](https://github.com/WRivxs/SGTU-Tutorias-Universitarias)  
**Endpoint Base de Pruebas (Cloud Render):** `https://sgtu-tutorias-universitarias.onrender.com`  

**Equipo Evaluado:**
- Wadid Rivas Payares (Encargado Backend)
- Azael Espitia Toribio (Encargado Base de Datos / AWS RDS)
- Eduardo Julio Bettin Avilez (Líder Técnico / Frontend)
- Jhon Jader Bertel Ortega (Encargado QA / Documentación)

---

## 1. Resumen Ejecutivo de la Suite de Pruebas

Para la Entrega 3 se ejecutaron dos suites completas de pruebas automatizadas que cubren la integridad funcional, lógica de negocio en servicios y seguridad RBAC con tokens JWT:

| Nivel de Prueba | Herramienta / Framework | Peticiones / Clases | Aserciones / Tests | Aprobados | % Éxito |
|---|---|:---:|:---:|:---:|:---:|
| **Pruebas Unitarias Backend** | JUnit 5 + Mockito (Surefire) | 4 clases de servicio | 17 | 17 | **100%** |
| **Pruebas de Integración API** | Postman Runner & Newman CLI | 17 endpoints HTTP | 36 | 36 | **100%** |
| **TOTAL** | — | **21 Suites** | **53 Aserciones** | **53** | **100%** |

---

## 2. Reporte de Pruebas Unitarias de Backend (`mvn test`)

Ejecutadas con Maven Surefire Plugin contra los servicios desacoplados con Mockito en Spring Boot 3:

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

### Detalle de Pruebas Unitarias Evaluadas:
1. `AuthServiceTest.login_CredencialesValidas_RetornaAuthResponse`: Emisión exitosa de token JWT y rol correcto (`ADMINISTRADOR`, `DOCENTE`, `ESTUDIANTE`). (PASS)
2. `AuthServiceTest.login_UsuarioNoExiste_LanzaException`: Validación de `ResourceNotFoundException` ante correos inexistentes. (PASS)
3. `AuthServiceTest.login_UsuarioInactivo_LanzaException`: Bloqueo inmediato para usuarios con `estado = false`. (PASS)
4. `MateriaServiceTest.listarTodas_RetornaLista`: Consulta y mapeo de asignaturas con créditos y semestre. (PASS)
5. `MateriaServiceTest.listarPorEstado_RetornaListaFiltrada`: Filtrado de materias activas/inactivas. (PASS)
6. `MateriaServiceTest.obtenerPorId_Existe_RetornaMateria`: Búsqueda por clave primaria en base de datos. (PASS)
7. `MateriaServiceTest.obtenerPorId_NoExiste_LanzaExcepcion`: Manejo estandarizado de error 404. (PASS)
8. `MateriaServiceTest.crear_GuardaMateria`: Alta de asignaturas vinculadas a programa. (PASS)
9. `SolicitudServiceTest.crear_EstudianteYDisponibilidadValida_GuardaSolicitud`: Valida que estudiantes puedan solicitar tutorías activas. (PASS)
10. `SolicitudServiceTest.crear_TutoriaNoDisponible_LanzaConflictException`: Bloqueo ante tutorías ya ocupadas (409 Conflict). (PASS)
11. `SolicitudServiceTest.cambiarEstado_Aceptada_ActualizaTutoriaA_Ocupada`: Transición atómica de estados (`ACEPTADA` $\rightarrow$ `OCUPADA`). (PASS)
12. `SolicitudServiceTest.listarPorEstudiante_RetornaLista`: Consulta de historial de solicitudes por estudiante. (PASS)
13. `UsuarioServiceTest.listarTodos_RetornaLista`: Auditoría de usuarios por el rol Administrador. (PASS)
14. `UsuarioServiceTest.obtenerPorId_UsuarioExiste_RetornaUsuario`: Consulta de perfil por identificador. (PASS)
15. `UsuarioServiceTest.obtenerPorId_UsuarioNoExiste_LanzaExcepcion`: 404 en usuario inexistente. (PASS)
16. `UsuarioServiceTest.crear_CorreoNoExiste_GuardaUsuario`: Alta exitosa con hashing BCrypt unidireccional. (PASS)
17. `UsuarioServiceTest.crear_CorreoYaExiste_LanzaConflictException`: Unicidad de correo institucional (409 Conflict). (PASS)

---

## 3. Reporte de Pruebas Automatizadas de Postman / Newman

**Colección:** `backend/postman/SGTU-API-Entrega3.postman_collection.json`  
**Entornos Soportados:**
- Local: `backend/postman/SGTU-Local.postman_environment.json` (`http://localhost:8080`)
- Producción Nube: `backend/postman/SGTU-Render.postman_environment.json` (`https://sgtu-tutorias-universitarias.onrender.com`)

### Matriz de Ejecución y Validaciones (`pm.test`):

| # | Módulo / Carpeta | Petición HTTP | Rol de Ejecución | Status Esperado | Verificaciones Automatizadas (`pm.test`) | Estado |
|---|---|---|:---:|:---:|---|:---:|
| 1 | `00. Auth` | POST `/api/auth/login` (Admin) | Público | 200 OK | Status 200, JWT válido, rol `ADMINISTRADOR`, guarda `{{token_admin}}` | ✅ PASS |
| 2 | `00. Auth` | POST `/api/auth/login` (Docente) | Público | 200 OK | Status 200, JWT válido, rol `DOCENTE`, guarda `{{token_docente}}` | ✅ PASS |
| 3 | `00. Auth` | POST `/api/auth/login` (Estudiante) | Público | 200 OK | Status 200, JWT válido, rol `ESTUDIANTE`, guarda `{{token_estudiante}}` | ✅ PASS |
| 4 | `00. Auth` | POST `/api/auth/login` (Fallido) | Anónimo | 401 Unauth | Status 401, JSON `{status: 401, error: "Unauthorized", message: ...}` | ✅ PASS |
| 5 | `01. Usuarios` | GET `/api/usuarios` | Admin | 200 OK | Status 200, arreglo no vacío, atributo `password` protegido (no expuesto) | ✅ PASS |
| 6 | `01. Usuarios` | GET `/api/usuarios/1` | Admin | 200 OK | Status 200, existencia de atributos `id`, `correo` y `rol` | ✅ PASS |
| 7 | `02. Académico`| GET `/api/facultades` | Estudiante | 200 OK | Status 200, listado de facultades, guarda `{{facultad_id}}` | ✅ PASS |
| 8 | `02. Académico`| GET `/api/programas` | Estudiante | 200 OK | Status 200, relación con facultad, guarda `{{programa_id}}` | ✅ PASS |
| 9 | `03. Materias` | GET `/api/materias?programaId=1` | Estudiante | 200 OK | Status 200, materias con semestres y créditos, guarda `{{materia_id}}` | ✅ PASS |
| 10 | `03. Materias` | GET `/api/materias/1` | Estudiante | 200 OK | Status 200, existencia de `nombre` y `codigo` único | ✅ PASS |
| 11 | `04. Perfiles` | GET `/api/docentes` | Estudiante | 200 OK | Status 200, lista de docentes con especialidad y materias | ✅ PASS |
| 12 | `04. Perfiles` | GET `/api/estudiantes` | Docente | 200 OK | Status 200, lista de estudiantes con código institucional y semestre | ✅ PASS |
| 13 | `05. Tutorías` | GET `/api/tutorias?estado=DISPONIBLE`| Estudiante | 200 OK | Status 200, tutorías activas con modalidad presencial/virtual | ✅ PASS |
| 14 | `06. Solicitudes`| GET `/api/solicitudes` | Estudiante | 200 OK | Status 200, historial de solicitudes del usuario autenticado | ✅ PASS |
| 15 | `07. Seguridad`| GET `/api/usuarios` (Sin Token) | Anónimo | 401 Unauth | Status 401, rechazo inmediato por falta de cabecera Authorization | ✅ PASS |
| 16 | `07. Seguridad`| POST `/api/facultades` (Por Alumno) | Estudiante | 403 Forbidden | Status 403, estudiante bloqueado de crear facultades por `@PreAuthorize` | ✅ PASS |
| 17 | `07. Seguridad`| POST `/api/auth/login` (Body Vacío)| Anónimo | 400 Bad Req | Status 400, validación Jakarta (`correo` y `password` requeridos) | ✅ PASS |

---

## 4. Comando de Reproducción Rápida con Newman

Cualquier evaluador o docente puede clonar el repositorio y ejecutar la suite completa en consola con un solo comando:

```bash
# Ejecución directa contra la nube en Render:
npx newman run backend/postman/SGTU-API-Entrega3.postman_collection.json \
  -e backend/postman/SGTU-Render.postman_environment.json \
  --reporters cli
```

---

## 5. Evidencia Gráfica de Pruebas y Despliegue (Capturas de Pantalla)

*(Sección estructurada conforme a la rúbrica de evaluación para evidenciar pruebas exitosas, casos de error y despliegue activo en AWS RDS)*

### 5.1 Caso de Éxito: Autenticación y Emisión de Token JWT (HTTP 200 OK)
* **Endpoint:** `POST /api/auth/login`
* **Descripción:** Validación de credenciales de usuario y retorno exitoso del token firmado con `HS256`. Todos los tests automatizados (`pm.test`) aprobados.
> **[Pegar aquí la Captura 1: Postman con Login Exitoso y Test Results en verde]**

---

### 5.2 Caso de Error: Autenticación con Credenciales Inválidas (HTTP 401 Unauthorized)
* **Endpoint:** `POST /api/auth/login`
* **Descripción:** Comprobación del bloqueo ante contraseñas incorrectas. Respuesta JSON estructurada según estándar RFC 7807 sin fuga de información sensible.
> **[Pegar aquí la Captura 2: Postman con Error 401 Unauthorized y respuesta JSON]**

---

### 5.3 Caso de Éxito: Consulta de Estructura Académica y Materias (HTTP 200 OK)
* **Endpoint:** `GET /api/materias?programaId=1` y `GET /api/facultades`
* **Descripción:** Respuesta exitosa con las asignaturas del programa de Ingeniería de Sistemas con semestre de malla y créditos académicos.
> **[Pegar aquí la Captura 3: Postman listando las Materias o Facultades con Status 200 OK]**

---

### 5.4 Caso de Éxito: Catálogo de Tutorías Disponibles (HTTP 200 OK)
* **Endpoint:** `GET /api/tutorias?estado=DISPONIBLE`
* **Descripción:** Verificación del catálogo de asesorías activas con control de cupos y modalidad (presencial o virtual).
> **[Pegar aquí la Captura 4: Postman con Catálogo de Tutorías Disponibles]**

---

### 5.5 Caso de Error de Seguridad: Control de Acceso RBAC (HTTP 403 Forbidden)
* **Endpoint:** `POST /api/facultades` (Ejecutado con Token de Rol `ESTUDIANTE`)
* **Descripción:** Demostración de las reglas de autorización declarativa `@PreAuthorize`. El sistema bloquea al estudiante impidiendo la creación de facultades.
> **[Pegar aquí la Captura 5: Postman con Error 403 Forbidden demostrando el bloqueo de rol]**

---

### 5.6 Resumen Global: Ejecución de la Suite Completa (Collection Runner / Newman)
* **Descripción:** Ejecución automatizada de todas las peticiones y aserciones consecutivas de la colección, evidenciando el 100% de pruebas aprobadas sin fallos.
> **[Pegar aquí la Captura 6: Ventana de Postman Runner con la barra verde y todos los checks pasados]**

---

### 5.7 Evidencia de Despliegue en la Nube: Base de Datos en AWS RDS (20 Puntos)
* **Descripción:** Panel de control de Amazon Web Services (AWS Console) evidenciando la instancia de base de datos MySQL `tutorias_db` en estado **Available** con su endpoint y Security Group activo.
> **[Pegar aquí la Captura 7: Consola de AWS RDS mostrando la instancia activa y disponible]**

