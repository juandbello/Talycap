IF DB_ID('DBClientes') IS NULL
    CREATE DATABASE DBClientes;
GO
USE DBClientes;
GO

IF OBJECT_ID('dbo.Clientes', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Clientes (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Identificacion VARCHAR(30) NOT NULL UNIQUE,
        Nombres VARCHAR(100) NOT NULL,
        Apellidos VARCHAR(100) NOT NULL,
        Correo VARCHAR(150) NOT NULL,
        Telefono VARCHAR(30) NULL
    );
END;
GO

CREATE OR ALTER PROCEDURE dbo.sp_ObtenerCliente
    @Identificacion VARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Identificacion, Nombres, Apellidos, Correo, Telefono
    FROM dbo.Clientes
    WHERE Identificacion = @Identificacion;
END;
GO

INSERT INTO dbo.Clientes (Identificacion, Nombres, Apellidos, Correo, Telefono)
SELECT Identificacion, Nombres, Apellidos, Correo, Telefono
FROM (VALUES
    ('1001001', 'Ana', 'García', 'ana.garcia@example.com', '3005550101'),
    ('1001002', 'Luis', 'Martínez', 'luis.martinez@example.com', '3005550102')
) AS Datos(Identificacion, Nombres, Apellidos, Correo, Telefono)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.Clientes c WHERE c.Identificacion = Datos.Identificacion
);
