# SGIP - Prueba Tecnica: Sistema de Gestion de Inversiones y Prestamos

Frontend web para la gestion de prestamos y transacciones de una plataforma fintech. La aplicacion permite simular prestamos, registrar nuevas solicitudes, consultar detalle por prestamo, visualizar cronogramas de pago y crear transacciones asociadas a un prestamo.

## Links de despliegue

- Frontend URL: https://frontendfintech.vercel.app/
- Backend URL: https://backendfintech-production-14ea.up.railway.app/swagger/index.html

### Referencias locales

- Frontend local: `http://localhost:3000`
- Backend local: `https://localhost:7221/api`
- Swagger local: `https://localhost:7221/swagger`

## Tecnologias utilizadas

### Stack del proyecto

- Frontend: Next.js 16 con App Router, React 19 y TypeScript
- UI: Material UI 9 con Emotion
- Cliente HTTP: Axios
- Backend: ASP.NET Core Web API sobre .NET 10
- Persistencia: Entity Framework Core 9 con PostgreSQL y proveedor Npgsql
- Documentacion API: Swagger / Swashbuckle
- Testing backend: xUnit, Moq, FluentAssertions y EF Core InMemory
- Despliegue backend: Dockerfile + Railway

### Librerias principales

- `next`, `react`, `react-dom`
- `@mui/material`
- `@mui/icons-material`
- `@mui/material-nextjs`
- `@emotion/react`
- `@emotion/styled`
- `axios`
- `uuid`
- `Microsoft.EntityFrameworkCore.Design`
- `Npgsql.EntityFrameworkCore.PostgreSQL`
- `Swashbuckle.AspNetCore`
- `xunit`
- `Moq`
- `FluentAssertions`
- `Microsoft.EntityFrameworkCore.InMemory`

## Decisiones tecnicas importantes

- Se eligio Material UI porque acelera la construccion de interfaces ofrenciendo una buena experiencia al cliente.
- La simulacion del prestamo se calcula en frontend para ofrecer retroalimentacion inmediata antes de crear el prestamo(Se puede mejorar usando el api de simulacion pero implicaria hacer varias llamadas a la api por cada campo cambio dentro del formulario).
- El `idempotencyKey` se genera en frontend con `uuid` para soportar escenarios de reintento en la creacion de transacciones.
- Se uso solo hooks para el manejo de estados dentro del frontend debido a la limitante del tiempo en la entrega del proyecto.

## Instalacion local

### Prerrequisitos

- .NET SDK 8 o superior
- Node.js 18 o superior
- PostgreSQL 14 o superior

### Backend

Usa los siguientes pasos en el repositorio del backend:

```bash
cd FinTech.API
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend

En este repositorio:

```bash
cd frontend_fintech
npm install
npm run dev
```

La aplicacion quedara disponible en `http://localhost:3000`.

## Variables de entorno

### Backend (`.env` y `appsettings.json`)

El backend tiene la validacion para usara variables de railway y las variables de appsettings.json (DefaultConnection).

RUN_MIGRATIONS, es una variable que se usa para que railway haga la migraciones.

```env
DATABASE_URL=Host=localhost;Port=5432;Database=fintech;Username=postgres;Password=postgres
RUN_MIGRATIONS=true
```


### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=https://localhost:7221/api
```

Si no se define `NEXT_PUBLIC_API_URL`, el frontend usa `https://localhost:7221/api` por defecto.

## Testing

```bash
cd FinTech.Tests
dotnet test
```

## Arquitectura

### Estructura general

```text
src/
	app/          Paginas y rutas con App Router
	components/   Componentes reutilizables de UI
	lib/          Utilidades, tema y helpers de calculo/API
	services/     Capa de acceso a datos y mapeo de DTOs
	types/        Tipos y contratos TypeScript
```

### Arquitectura del backend

El backend sigue una arquitectura por capas orientada a API REST:

- Controllers: exponen endpoints HTTP y validan entrada basica.
- Services: concentran reglas de negocio (simulacion, aprobacion, rechazo y validaciones).
- Repositories: encapsulan acceso a datos con Entity Framework Core.
- Data: contiene el DbContext y configuracion de persistencia.
- DTOs: definen contratos de entrada/salida para no exponer entidades directamente.

Estructura principal del backend:

```text
FinTech.API/
	Controllers/   Endpoints REST (Loans, Transactions)
	Services/      Logica de negocio
	Repositories/  Acceso a datos por interfaces/implementaciones
	Data/          ApplicationDbContext
	DTOs/          Contratos HTTP
	Models/        Entidades de dominio
	Migrations/    Migraciones EF Core
	Program.cs     Composicion DI, CORS, Swagger, DbContext
```

Flujo de una solicitud:

```text
HTTP Request -> Controller -> Service -> Repository -> DbContext -> PostgreSQL
```

Notas de composicion:

- Inyeccion de dependencias en Program.cs para services y repositories.
- Configuracion de EF Core con Npgsql, retry on failure y query splitting.
- Soporte de DATABASE_URL y RUN_MIGRATIONS para despliegue en Railway.
- Swagger habilitado para documentacion y preba de endpoints.

### Patrones implementados

- Separacion por capas: `services` encapsula llamadas HTTP y mapeo de datos; `components` se enfoca en UI y estado local.
- DTO mapping: los servicios traducen respuestas numericas del backend a tipos de dominio del frontend.
- Arquitectura Controller-Service-Repository en backend: los controllers exponen endpoints HTTP, los services concentran la logica de negocio y los repositories encapsulan el acceso a datos con Entity Framework Core.
- Inyeccion de dependencias: interfaces como `ILoanService`, `ITransactionService` e `ILoanRepository` se registran en `Program.cs`, lo que desacopla implementaciones y facilita pruebas.
- DTOs de entrada y salida: el backend usa objetos dedicados para contratos HTTP (`CreateLoanDto`, `LoanDto`, `PaymentScheduleDto`, etc.), separando el modelo de persistencia del modelo expuesto por la API.
- Reglas de negocio centralizadas en servicios: validaciones como limite del 40% del ingreso mensual, maximo de prestamos activos y aprobacion automatica bajo ciertas condiciones viven en `LoanService`, no en los controllers.
- Persistencia abstraida con repositorios: consultas, includes y ordenamientos quedan concentrados en clases como `LoanRepository`, evitando mezclar acceso a datos con logica de negocio.


## Decisiones de diseno


### Por que se eligio Material UI

Porque permite construir rapido una interfaz de tipo dashboard, con componentes accesibles, sistema de tema, tablas, dialogs, cards y formularios consistentes sin tener que definir toda la base visual desde cero.

### Trade-offs realizados

- El caculo de los prestamos es del lado de frontend debido a la velocidad que este otorga y porque no son calculos grandes los que se hacen.

## Supuestos y limitaciones

## Funcionalidades no implementadas

- Aprobacion/rechazo de prestamos desde la interfaz

## Mejoras futuras

- Utilizar el endpoint de simulate en lugar de hacerlo todo desde frontend, es posible usar un timeout de espera por cada tecleado del usuario para que no se hagan constantes llamadas a api
- Agregar restricciones al momento de realizar el pago de un prestamo (el monto no puede ser menor a la cuota)
