CREATE DATABASE DBClientes;
GO
USE DBClientes;
GO
CREATE TABLE dbo.Clientes (Id INT IDENTITY(1,1) PRIMARY KEY, Identificacion VARCHAR(30) NOT NULL UNIQUE, Nombres VARCHAR(100) NOT NULL, Apellidos VARCHAR(100) NOT NULL, Correo VARCHAR(150) NOT NULL, Telefono VARCHAR(30) NULL);
GO
CREATE OR ALTER PROCEDURE dbo.sp_ObtenerCliente @Identificacion VARCHAR(30) AS BEGIN SET NOCOUNT ON; SELECT Identificacion, Nombres, Apellidos, Correo, Telefono FROM dbo.Clientes WHERE Identificacion = @Identificacion; END;
GO
INSERT INTO dbo.Clientes (Identificacion, Nombres, Apellidos, Correo, Telefono) VALUES ('1001001','Ana','García','ana.garcia@example.com','3005550101'),('1001002','Luis','Martínez','luis.martinez@example.com','3005550102');
