# Micro Shop - NestJS & NATS

Este proyecto implementa una arquitectura de microservicios usando NestJS como framework principal y NATS como sistema de mensajería para la comunicación entre servicios. Incluye tres servicios principales: `users-service`, `products-service` y `api-gateway`, con bases de datos separadas para usuarios y productos usando PostgreSQL, y autenticación basada en JWT.

## Arquitectura

- **Users Service**: Gestiona el registro y autenticación de usuarios. Usa una base de datos PostgreSQL (`users_db`) con el esquema `users`.
- **Products Service**: Maneja la creación y consulta de productos. Usa una base de datos PostgreSQL (`products_db`) con el esquema `products`.
- **API Gateway**: Punto de entrada HTTP que expone endpoints RESTful y se comunica con los microservicios a través de NATS.
- **NATS**: Sistema de mensajería para la comunicación asíncrona entre servicios.
- **PostgreSQL**: Dos instancias separadas para almacenar datos de usuarios y productos.

## Requisitos Previos

- **Docker**: Necesario para ejecutar los contenedores de los servicios, bases de datos y NATS.
- **Node.js**: Versión `20.x` o superior (solo si deseas ejecutar los servicios localmente sin Docker).
- **npm**: Para instalar dependencias si trabajas fuera de Docker.

## Instalación y Ejecución

### Clonar el Repositorio:
```bash
git clone https://github.com/DeiviRep/micro-shop-nestjs-nats.git
cd micro-shop-nestjs-nats
```

### Construir y Ejecutar con Docker:
Asegúrate de tener Docker y Docker Compose instalados. Luego ejecuta:
```bash
docker-compose up --build
```
Esto construirá las imágenes de los servicios y levantará los contenedores para `nats`, `postgres-users`, `postgres-products`, `users-service`, `products-service` y `api-gateway`.

### Verificar que los Servicios Estén Corriendo:
Revisa los logs para confirmar que:
- Las bases de datos están listas: `database system is ready to accept connections`.
- Los microservicios están conectados a NATS: `Connecting to NATS at nats://nats:4222`.
- El API Gateway está activo: `API Gateway is running on port 3000`.

## Endpoints Disponibles
Todos los endpoints están expuestos a través del `api-gateway` en `http://localhost:3000`.

### Autenticación
#### Registrar un Usuario:
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "pass123", "role": "user"}'
```
**Respuesta exitosa:**
```json
{
  "finalizado": true,
  "mensaje": "¡Tarea completada con éxito!",
  "datos": {
    "access_token": "<JWT_TOKEN>"
  }
}
```

**Errores comunes:**
- Email inválido: `{ "statusCode": 400, "message": ["email must be an email"] }`
- Email duplicado: `{ "statusCode": 400, "message": "Ya existe un usuario registrado con el mismo correo electrónico." }`
- Rol inválido: `{ "statusCode": 400, "message": ["Role must be one of: admin, user"] }`

#### Iniciar Sesión:
```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "pass123"}'
```
**Respuesta exitosa:**
```json
{
  "finalizado": true,
  "mensaje": "¡Tarea completada con éxito!",
  "datos": {
    "access_token": "<JWT_TOKEN>"
  }
}
```

### Productos
#### Crear un Producto (Requiere rol `admin`):
```bash
curl -X POST http://localhost:3000/products \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{"name": "Laptop", "price": 999.99}'
```
**Respuesta exitosa:**
```json
{
  "finalizado": true,
  "mensaje": "Registro creado con éxito.",
  "datos": {
    "id": "<UUID>",
    "name": "Laptop",
    "price": 999.99,
    "userId": "<USER_ID>"
  }
}
```
**Error de permisos (rol `user`)**:
```json
{
  "message": "You do not have permission to access this resource",
  "error": "Forbidden",
  "statusCode": 403
}
```

#### Obtener Productos por `User ID`:
```bash
curl -X GET http://localhost:3000/products/<USER_ID> \
-H "Authorization: Bearer <JWT_TOKEN>"
```
**Respuesta exitosa:**
```json
{
  "finalizado": true,
  "mensaje": "Registros obtenidos con éxito.",
  "datos": [
    {
      "id": "<UUID>",
      "name": "Laptop",
      "price": 999.99,
      "userId": "<USER_ID>"
    }
  ]
}
```

Si no hay productos:
```json
{
  "finalizado": true,
  "mensaje": "Registros obtenidos con éxito.",
  "datos": []
}
```

## Notas sobre JWT
Los tokens JWT contienen el `id` del usuario y su `role` (ejemplo: `admin` o `user`).
Ejemplo decodificado:
```json
{
  "id": "546d077f-9ed5-491b-be4b-8ce40561b29b",
  "role": "admin",
  "iat": 1743599488,
  "exp": 1743603088
}
```
**Advertencia**: Los JWT son credenciales sensibles. No los compartas en entornos públicos sin cuidado.

## Estructura del Proyecto
```
micro-shop-nestjs-nats/
├── api-gateway/          # Servicio de entrada HTTP
├── products-service/     # Microservicio para productos
├── users-service/        # Microservicio para usuarios
├── init-products-db.sql  # Script SQL para inicializar el esquema products
├── init-users-db.sql     # Script SQL para inicializar el esquema users
├── docker-compose.yml    # Configuración de Docker para todos los servicios
└── README.md             # Este archivo
```

## Detener el Proyecto
Para detener los servicios y eliminar los contenedores:
```bash
docker-compose down -v

