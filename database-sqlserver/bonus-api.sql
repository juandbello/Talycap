USE EmpresaDB;
GO
SET NOCOUNT ON;

-- El script no modifica la configuración del servidor.
IF NOT EXISTS (
    SELECT 1 FROM sys.configurations
    WHERE name = 'Ole Automation Procedures' AND value_in_use = 1
)
    THROW 50001, 'Habilita Ole Automation Procedures en la instancia de pruebas; consulta el README.', 1;

DECLARE @Http INT = NULL;
DECLARE @Resultado INT;
DECLARE @Estado INT;
DECLARE @Json NVARCHAR(MAX);
DECLARE @Inicio INT = 0;
DECLARE @Filas INT;
DECLARE @Url VARCHAR(250);
DECLARE @Respuesta TABLE (Contenido NVARCHAR(MAX));

DROP TABLE IF EXISTS #UsuariosAPI;
CREATE TABLE #UsuariosAPI (
    id INT NOT NULL PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    username NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) NOT NULL
);

BEGIN TRY
    EXEC @Resultado = sys.sp_OACreate 'MSXML2.ServerXMLHTTP.6.0', @Http OUTPUT;
    IF @Resultado <> 0
        THROW 50002, 'No se pudo crear el cliente HTTP.', 1;

    EXEC @Resultado = sys.sp_OAMethod @Http, 'setTimeouts', NULL, 5000, 5000, 10000, 10000;
    IF @Resultado <> 0
        THROW 50003, 'No se pudieron configurar los tiempos de espera.', 1;

    -- Páginas pequeñas evitan la truncación de textos largos en la interfaz OLE.
    WHILE @Inicio < 1000
    BEGIN
        SET @Url = 'https://jsonplaceholder.typicode.com/users?_start='
            + CAST(@Inicio AS VARCHAR(10)) + '&_limit=1';
        EXEC @Resultado = sys.sp_OAMethod @Http, 'open', NULL, 'GET', @Url, false;
        IF @Resultado <> 0
            THROW 50004, 'No se pudo abrir la solicitud a la API.', 1;

        EXEC @Resultado = sys.sp_OAMethod @Http, 'send';
        IF @Resultado <> 0
            THROW 50005, 'No se pudo consultar la API. Revisa la conexión del servidor.', 1;

        SET @Estado = NULL;
        EXEC @Resultado = sys.sp_OAGetProperty @Http, 'status', @Estado OUTPUT;
        IF @Resultado <> 0 OR @Estado IS NULL OR @Estado <> 200
            THROW 50006, 'La API no devolvió HTTP 200.', 1;

        DELETE FROM @Respuesta;
        SET @Json = NULL;
        INSERT INTO @Respuesta (Contenido)
        EXEC @Resultado = sys.sp_OAGetProperty @Http, 'responseText';
        IF @Resultado <> 0
            THROW 50007, 'No se pudo leer la respuesta de la API.', 1;

        SELECT @Json = Contenido FROM @Respuesta;
        IF @Json IS NULL OR ISJSON(@Json) <> 1
            THROW 50008, 'La respuesta no contiene JSON válido o llegó truncada.', 1;

        INSERT INTO #UsuariosAPI (id, name, username, email)
        SELECT id, name, username, email
        FROM OPENJSON(@Json)
        WITH (
            id INT '$.id',
            name NVARCHAR(200) '$.name',
            username NVARCHAR(100) '$.username',
            email NVARCHAR(150) '$.email'
        );

        SET @Filas = @@ROWCOUNT;
        IF @Filas = 0 BREAK;
        SET @Inicio = @Inicio + @Filas;
    END;

    IF @Inicio >= 1000
        THROW 50009, 'Se alcanzó el límite de paginación; revisa la respuesta de la API.', 1;

    EXEC sys.sp_OADestroy @Http;
    SET @Http = NULL;

    SELECT id, name, username, email FROM #UsuariosAPI ORDER BY id;

    SELECT
        e.IdEmpleado,
        e.Nombre AS Empleado,
        u.id AS IdUsuarioAPI,
        u.name AS UsuarioAPI,
        e.Email AS CorreoEmpleado,
        u.email AS CorreoAPI,
        CASE
            WHEN e.IdEmpleado IS NOT NULL AND u.id IS NOT NULL THEN 'Coincide'
            WHEN e.IdEmpleado IS NOT NULL THEN 'Solo en Empleados'
            ELSE 'Solo en API'
        END AS Comparacion
    FROM dbo.Empleados e
    FULL OUTER JOIN #UsuariosAPI u
        ON LOWER(LTRIM(RTRIM(e.Email))) COLLATE DATABASE_DEFAULT =
           LOWER(LTRIM(RTRIM(u.email))) COLLATE DATABASE_DEFAULT
    ORDER BY Comparacion, e.IdEmpleado, u.id;
END TRY
BEGIN CATCH
    IF @Http IS NOT NULL EXEC sys.sp_OADestroy @Http;
    THROW;
END CATCH;
