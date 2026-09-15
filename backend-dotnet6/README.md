# Clientes API (.NET 6)

Ejecute `database.sql` en SQL Server 2019 y ajuste `ConnectionStrings:DBClientes`. La solución separa API, Services, Repositories y DTOs. El repositorio usa EF Core 6 y ejecuta `dbo.sp_ObtenerCliente`.

Ejecute `dotnet run --project ClientesApi.Api` y abra `/swagger`.
