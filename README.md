# Tutorías Backend — Entrega 2

Backend del **Sistema de Gestión de Tutorías Universitarias**, desarrollado con Spring Boot 3 y Spring Data JPA, conectado a una base de datos MySQL desplegada en AWS RDS.

## Integrantes
- Wadid Rivas Payares
- Azael Espitia Toribio
- Jhon Jader Bertel Ortega
- Eduardo Julio Bettin Avilez

## Stack tecnológico
- Java 17
- Spring Boot 3.3.4 (Web, Data JPA, Validation)
- MySQL 8 (AWS RDS)
- Maven
- Lombok

## Estructura del proyecto
```
src/main/java/com/uas/tutorias
├── entity/          # Entidades JPA (Usuario, Materia, Tutor, Tutoria, Solicitud)
├── repository/       # Interfaces Spring Data JPA
├── controller/       # Controladores REST (CRUD)
├── exception/        # Manejo global de errores
└── TutoriasBackendApplication.java
```

## Configuración de la base de datos (AWS RDS)

La conexión se hace **100% mediante variables de entorno**, nunca hardcodeada en el repositorio. Antes de levantar la aplicación exporta:

```bash
export DB_HOST=tu-instancia.xxxxxxxxxx.us-east-1.rds.amazonaws.com
export DB_PORT=3306
export DB_NAME=tutorias_db
export DB_USERNAME=admin
export DB_PASSWORD=tu_password_segura
export SERVER_PORT=8080
```

Ver `src/main/resources/application-example.yml` como referencia.

## Cómo ejecutar el proyecto

1. Clona el repositorio y entra a la carpeta del proyecto.
2. Crea la base de datos y las tablas en tu instancia de AWS RDS ejecutando el script `sql/ddl_tutorias.sql` (entregado junto con este proyecto) desde MySQL Workbench, DBeaver o el cliente `mysql`.
3. Exporta las variables de entorno indicadas arriba.
4. Levanta la aplicación:
   ```bash
   mvn spring-boot:run
   ```
5. La API queda disponible en `http://localhost:8080`.

## Endpoints disponibles

| Recurso | Método | Endpoint | Descripción |
|---|---|---|---|
| Materias | GET | `/api/materias` | Listar todas las materias |
| Materias | GET | `/api/materias/{id}` | Obtener una materia |
| Materias | POST | `/api/materias` | Crear una materia |
| Materias | PUT | `/api/materias/{id}` | Actualizar una materia |
| Materias | DELETE | `/api/materias/{id}` | Eliminar una materia |
| Usuarios | GET/POST/PUT/DELETE | `/api/usuarios[/{id}]` | CRUD de usuarios |
| Tutores | GET/POST/PUT/DELETE | `/api/tutores[/{id}]` | CRUD de tutores |
| Tutorías | GET/POST/PUT/DELETE | `/api/tutorias[/{id}]` | CRUD de tutorías |
| Solicitudes | GET/POST/PUT/DELETE | `/api/solicitudes[/{id}]` | CRUD de solicitudes |

## Ejemplo de body — crear materia (POST /api/materias)
```json
{
  "nombre": "Bases de Datos",
  "descripcion": "Modelado y administración de bases de datos relacionales",
  "estado": true
}
```

## Ejemplo de body — crear usuario (POST /api/usuarios)
```json
{
  "nombre": "Eduardo",
  "apellido": "Bettin",
  "correo": "eduardo.bettin@example.com",
  "password": "claveSegura123",
  "rol": "ESTUDIANTE",
  "estado": true
}
```

## Pruebas con Postman
La colección `postman/Tutorias-API.postman_collection.json` incluye ejemplos de todos los endpoints CRUD. Impórtala en Postman, define la variable `base_url` (por defecto `http://localhost:8080`) y ejecuta las peticiones en orden para generar las capturas de evidencia.

## Próximos pasos (Entrega 3)
- Autenticación y autorización basada en roles (Spring Security + JWT).
- Integración con el frontend en Angular.
- Reglas de negocio adicionales (validación de disponibilidad, prevención de solicitudes duplicadas).
