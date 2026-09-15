# EmpresaDB - SQL Server

Script con empleados, departamentos y proyectos. Incluye datos de ejemplo, cinco consultas, un procedimiento, una función y un índice. Esta base es independiente de `DBClientes`, que usa la API .NET.

## Ejecutar

Necesitas SQL Server 2019 y SQL Server Management Studio (SSMS).

1. Conéctate a tu instancia de SQL Server con un usuario que pueda crear bases de datos.
2. Abre `EmpresaDB.sql` y ejecútalo con F5. El script crea y selecciona `EmpresaDB`.
3. Revisa las pestañas de resultados y mensajes.

Ejecuta el script completo solo la primera vez: las tablas, los datos y el índice no están preparados para crearse de nuevo. Después puedes seleccionar y ejecutar únicamente las consultas.

## Probar

Abre una nueva consulta y ejecuta:

```sql
USE EmpresaDB;
GO
SELECT 'Departamentos' AS Tabla, COUNT(*) AS Registros FROM dbo.Departamentos
UNION ALL SELECT 'Empleados', COUNT(*) FROM dbo.Empleados
UNION ALL SELECT 'Proyectos', COUNT(*) FROM dbo.Proyectos
UNION ALL SELECT 'EmpleadoProyecto', COUNT(*) FROM dbo.EmpleadoProyecto;

EXEC dbo.sp_buscar_empleado @Nombre = 'Ana';
SELECT dbo.fn_total_proyectos(1) AS ProyectosDeAna;
```

Con los datos iniciales deben salir 6 departamentos, 5 empleados, 5 proyectos y 9 asignaciones. El procedimiento devuelve a Ana García y la función devuelve `3`. La consulta de departamentos sin empleados debe mostrar Talento Humano y Jurídica.

## Backup y restore

Crearía un backup completo con `BACKUP DATABASE` en una carpeta accesible por el servicio de SQL Server.
Revisaría el archivo con `RESTORE VERIFYONLY` y sus rutas con `RESTORE FILELISTONLY`.
Restauraría una copia con `RESTORE DATABASE ... WITH MOVE` y validaría la base con `DBCC CHECKDB`.

## Bonus de API

En una instancia de pruebas de SQL Server en Windows, un administrador debe habilitar OLE Automation:

```sql
EXEC sys.sp_configure 'show advanced options', 1;
RECONFIGURE;
EXEC sys.sp_configure 'Ole Automation Procedures', 1;
RECONFIGURE;
```

Después abre `bonus-api.sql` en SSMS y ejecútalo. Descarga los usuarios de JSONPlaceholder en `#UsuariosAPI` y compara sus correos con los empleados. Con los datos iniciales devuelve 10 usuarios externos y ninguna coincidencia. La tabla temporal dura mientras mantengas abierta esa conexión.

El bonus no cambia la configuración del servidor; al terminar, devuelve las opciones anteriores a sus valores originales si las habilitaste solo para esta prueba. Se verificó en LocalDB 2025; la entrega usa instrucciones compatibles con SQL Server 2019.
