# MiniCoreBancario

Este es un proyecto de demostración de una API RESTful desarrollada con **ASP.NET Core (.NET 9)**, **C#** y **Entity Framework Core** utilizando **SQLite** como base de datos. 

Este proyecto fue desarrollado para demostrar conocimientos sólidos en el desarrollo del Core Bancario (Mantenimiento Core), diseño de APIs y gestión de bases de datos relacionales, herramientas fundamentales para el trabajo en el sector corporativo financiero.

## Tecnologías Utilizadas
- **.NET 9 (ASP.NET Core Web API)**
- **Entity Framework Core 9**
- **SQLite**
- **C#**
- **Swagger / OpenAPI** para documentación y pruebas de la API

## Estructura del Dominio
El proyecto maneja dos entidades clave para un Core Bancario:
1. **Cuenta**: Representa una cuenta bancaria con su saldo y titular.
2. **Transaccion**: Registra los movimientos (Depósitos y Retiros) asociados a una cuenta, validando saldos y reglas de negocio.

## Cómo ejecutar el proyecto localmente

1. Clona este repositorio o descarga los archivos.
2. Abre una terminal en la carpeta del proyecto.
3. Asegúrate de tener instalado el SDK de .NET 9.
4. Ejecuta las migraciones para crear la base de datos local:
   ```bash
   dotnet ef database update
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   dotnet run
   ```
6. Abre tu navegador y dirígete a `http://localhost:5000/swagger` (o el puerto que te asigne la consola al iniciar) para probar los Endpoints.

## Endpoints Disponibles

- `GET /api/cuentas` -> Obtener todas las cuentas.
- `POST /api/cuentas` -> Crear una nueva cuenta.
- `POST /api/cuentas/{id}/deposito` -> Realizar un depósito en una cuenta existente.
- `POST /api/cuentas/{id}/retiro` -> Realizar un retiro de una cuenta (valida saldo insuficiente).

## Propósito
Este proyecto refleja capacidad rápida de adaptación al ecosistema de Microsoft (.NET y C#), habiendo construido una arquitectura basada en inyección de dependencias, controladores y ORM muy alineada con las mejores prácticas de la industria.
