# Tutorías Backend — Entrega 2

Backend del **Sistema de Gestión de Tutorías Universitarias (SGTU)**, desarrollado con Spring Boot 3 y Spring Data JPA, preparado para conectarse a una base de datos MySQL desplegada en AWS RDS y con soporte CORS para cliente web Angular.

## Integrantes
- Wadid Rivas Payares (Encargado Backend)
- Azael Espitia Toribio (Encargado BD / AWS)
- Eduardo Julio Bettin Avilez (Líder Técnico / Frontend)
- Jhon Jader Bertel Ortega (Encargado QA / Documentación)

## Stack tecnológico
- Java 17
- Spring Boot 3.3.13 (Web, Data JPA, Validation)
- MySQL 8 (AWS RDS)
- Maven
- Lombok
- JUnit 5 & Mockito

## Arquitectura del proyecto (4 capas)
El proyecto implementa estrictamente la arquitectura en capas definida en la Entrega 1 (RNF-06 y Sección 7.2):

```
tutorias-backend/
├── sql/
│   └── ddl_tutorias.sql                  # Script DDL documentado para MySQL en AWS RDS
├── postman/
│   └── Tutorias-API.postman_collection.json # Colección Postman v2.1 para pruebas CRUD
└── src/
    ├── main/
    │   ├── java/com/uas/tutorias/
    │   │   ├── config/                   # Configuración CORS (Angular localhost:4200)
    │   │   ├── controller/               # Controladores REST (inyección por constructor)
    │   │   ├── service/                  # Interfaces de lógica de negocio
    │   │   │   └── impl/                 # Implementaciones de servicios (@Transactional)
    │   │   ├── repository/               # Interfaces Spring Data JPA
    │   │   ├── entity/                   # Entidades JPA (@Entity)
    │   │   ├── exception/                # Manejo global de excepciones (@RestControllerAdvice)
    │   │   └── TutoriasBackendApplication.java
    │   └── resources/
    │       ├── application.yml           # Configuración con variables de entorno
    │       └── application-example.yml   # Plantilla de variables de entorno
    └── test/
        └── java/com/uas/tutorias/service/ # Pruebas unitarias de servicios con Mockito
```

## Configuración de la base de datos (AWS RDS)

La conexión se realiza **100% mediante variables de entorno**, sin credenciales hardcodeadas en el repositorio.

### En Windows (PowerShell):
```powershell
$env:DB_HOST="tu-instancia.xxxxxxxxxx.us-east-1.rds.amazonaws.com"
$env:DB_PORT="3306"
$env:DB_NAME="tutorias_db"
$env:DB_USERNAME="admin"
$env:DB_PASSWORD="tu_password_segura"
$env:SERVER_PORT="8080"
```

### En Linux / macOS / Bash:
```bash
export DB_HOST=tu-instancia.xxxxxxxxxx.us-east-1.rds.amazonaws.com
export DB_PORT=3306
export DB_NAME=tutorias_db
export DB_USERNAME=admin
export DB_PASSWORD=tu_password_segura
export SERVER_PORT=8080
```

Ver `src/main/resources/application-example.yml` como referencia.

## Cómo compilar y probar

### 1. Ejecutar pruebas unitarias (no requiere BD activa)
Las pruebas de la capa de servicio utilizan Mockito, por lo que pueden validarse inmediatamente:
```powershell
mvn test
```

### 2. Ejecutar la base de datos en AWS RDS
1. Crea la instancia MySQL en AWS RDS siguiendo la guía de despliegue.
2. Ejecuta el script `sql/ddl_tutorias.sql` usando tu cliente preferido (DBeaver, MySQL Workbench o consola `mysql`).

### 3. Levantar la aplicación
Configura las variables de entorno y corre:
```powershell
mvn spring-boot:run
```
La API quedará disponible en `http://localhost:8080`.

## Endpoints disponibles

| Recurso | Método | Endpoint | Descripción |
|---|---|---|---|
| **Materias** | GET | `/api/materias` | Listar todas las materias (filtro opcional `?estado=true`) |
| **Materias** | GET | `/api/materias/{id}` | Obtener materia por ID |
| **Materias** | POST | `/api/materias` | Crear una nueva materia |
| **Materias** | PUT | `/api/materias/{id}` | Actualizar materia existente |
| **Materias** | DELETE | `/api/materias/{id}` | Eliminar materia |
| **Usuarios** | GET | `/api/usuarios` | Listar todos los usuarios |
| **Usuarios** | GET | `/api/usuarios/{id}` | Obtener usuario por ID |
| **Usuarios** | POST | `/api/usuarios` | Crear usuario (valida correo único) |
| **Usuarios** | PUT | `/api/usuarios/{id}` | Actualizar usuario |
| **Usuarios** | PATCH | `/api/usuarios/{id}/estado` | Activar o desactivar usuario (`?activo=true/false`) |
| **Usuarios** | DELETE | `/api/usuarios/{id}` | Eliminar usuario |
| **Tutores** | GET | `/api/tutores` | Listar todos los tutores |
| **Tutores** | GET | `/api/tutores/{id}` | Obtener tutor por ID |
| **Tutores** | GET | `/api/tutores/usuario/{usuarioId}` | Obtener tutor por ID de usuario |
| **Tutores** | POST | `/api/tutores` | Crear tutor (valida rol TUTOR y perfil único) |
| **Tutores** | PUT | `/api/tutores/{id}` | Actualizar información del tutor |
| **Tutores** | DELETE | `/api/tutores/{id}` | Eliminar tutor |
| **Tutorías** | GET | `/api/tutorias` | Listar tutorías (filtros `?estado=...&materiaId=...`) |
| **Tutorías** | GET | `/api/tutorias/{id}` | Obtener tutoría por ID |
| **Tutorías** | POST | `/api/tutorias` | Programar tutoría (valida tutor y materia activa) |
| **Tutorías** | PUT | `/api/tutorias/{id}` | Actualizar datos de tutoría |
| **Tutorías** | PATCH | `/api/tutorias/{id}/estado` | Cambiar estado (`DISPONIBLE`, `OCUPADA`, `CANCELADA`) |
| **Tutorías** | DELETE | `/api/tutorias/{id}` | Eliminar tutoría |
| **Solicitudes** | GET | `/api/solicitudes` | Listar solicitudes (filtro `?estudianteId=...`) |
| **Solicitudes** | GET | `/api/solicitudes/{id}` | Obtener solicitud por ID |
| **Solicitudes** | POST | `/api/solicitudes` | Solicitar tutoría (valida estudiante y disponibilidad) |
| **Solicitudes** | PUT | `/api/solicitudes/{id}` | Actualizar comentario o datos |
| **Solicitudes** | PATCH | `/api/solicitudes/{id}/responder` | Aceptar/Rechazar solicitud (actualiza estado de tutoría) |
| **Solicitudes** | DELETE | `/api/solicitudes/{id}` | Eliminar solicitud |

## Pruebas con Postman
Importa la colección `postman/Tutorias-API.postman_collection.json` en Postman. La colección contiene carpetas organizadas para las 5 entidades con ejemplos de peticiones y variable `{{base_url}}` (`http://localhost:8080`).

### Guía rápida de pruebas

| Entidad | Operación | Endpoint | Ejemplo de cuerpo |
|---|---|---|---|
| Materias | POST | `/api/materias` | `{ "nombre": "Matemáticas", "estado": true }` |
| Usuarios | POST | `/api/usuarios` | `{ "nombre": "Juan Pérez", "correo": "juan@example.com", "rol": "ESTUDIANTE", "estado": true }` |
| Tutorías | POST | `/api/tutorias` | `{ "materiaId": 1, "tutorId": 2, "fecha": "2024-10-01T10:00:00", "estado": "DISPONIBLE" }` |
| Solicitudes | POST | `/api/solicitudes` | `{ "estudianteId": 3, "tutoriaId": 5, "comentario": "Necesito ayuda" }` |

Ejecuta la petición **GET** en `/api/tutorias` para listar las tutorías creadas y verifica que las respuestas tengan código `200`.

## Script de ejecución local (run‑local)

Se incluye el script `run-local.ps1` (ignorado por `.gitignore`) que simplifica la puesta en marcha del backend contra la instancia RDS.

```powershell
# Ejecutar desde la raíz del proyecto
.\run-local.ps1
```

El script configura las variables de entorno necesarias y lanza `mvn spring-boot:run`.  
> **Nota:** el script no se versiona para evitar exponer credenciales; cada desarrollador debe crear su propia copia con los valores de RDS.

## Checklist de despliegue en AWS RDS

1. **Crear la instancia MySQL** en AWS RDS (versión 8.x, tipo db.t3.micro, VPC y SG que permitan acceso desde tu IP).
2. **Ejecutar el script DDL** `sql/ddl_tutorias.sql` contra la base de datos recién creada (con tu cliente favorito).
3. **Configurar variables de entorno** con los valores de tu instancia (ver sección “Configuración de la base de datos”).
4. **Iniciar la API** usando `run-local.ps1` o `mvn spring-boot:run`.
5. **Verificar** que la aplicación responde en `http://localhost:8080/swagger-ui.html` o con Postman.
6. **Push** de la rama `main` al repositorio remoto (`git push origin main`).

## Solución de problemas comunes

- **Error 1045 (Access denied)** – Verifica `DB_USERNAME` y `DB_PASSWORD`.
- **Timeout al conectar con RDS** – Asegúrate que el SG permite tráfico inbound en el puerto 3306 desde tu IP.
- **Port 8080 en uso** – Cambia `SERVER_PORT` en la variable de entorno o en `application.yml`.
