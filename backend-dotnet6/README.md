# Clientes API (.NET 6)

Consulta de clientes por identificación. La solución contiene un único proyecto llamado `ClientesApi`, organizado en Controllers, Models, Repositories, Services y Data. Usa EF Core y Swagger.

## Requisitos

.NET SDK 6 y SQL Server (2019 según la prueba). Si usas un SDK posterior, también necesitas el runtime de ASP.NET Core 6. En este equipo está configurado SQL Server LocalDB 2025.

## Iniciar

La conexión de desarrollo está en `ClientesApi/appsettings.Development.json`: servidor `(localdb)\MSSQLLocalDB`, base `DBClientes` y autenticación de Windows. La base ya quedó creada en este equipo.

Desde esta carpeta ejecuta:

```powershell
dotnet restore ClientesApi.sln
dotnet build ClientesApi.sln --no-restore
dotnet run --project ClientesApi --launch-profile ClientesApi
```

Abre [Swagger](http://localhost:5121/swagger). En Visual Studio 2022 también puedes abrir `ClientesApi.sln`, seleccionar `ClientesApi` como proyecto de inicio y ejecutar con F5.

Para preparar la base en otro equipo, ejecuta `database.sql` desde SSMS en tu instancia. También puedes usar `sqlcmd -S "(localdb)\MSSQLLocalDB" -E -f 65001 -i database.sql`. El script se puede repetir sin duplicar los clientes de ejemplo.

Si usas SQL Server 2019 o SQL Express, cambia `ConnectionStrings:DBClientes` en `appsettings.Development.json`. Ejemplo de servidor dentro del JSON: `localhost\\SQLEXPRESS`.

## Probar

En Swagger abre `GET /api/clientes/{identificacion}`, pulsa **Try it out** y luego **Execute**. Los resultados esperados con los datos del script son:

- `1001001`: HTTP 200, Ana García.
- `1001002`: HTTP 200, Luis Martínez.
- `9999999`: HTTP 404, cliente no encontrado.

También puedes consultar [el cliente de ejemplo](http://localhost:5121/api/clientes/1001001). Para detener la API, usa `Ctrl+C`.

Una identificación de más de 30 caracteres devuelve HTTP 400. Se verificaron las respuestas 200, 404 y 400 con la base local.
