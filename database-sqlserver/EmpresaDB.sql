/*==============================================================
    PRUEBA TÉCNICA SQL SERVER
    Base de datos: EmpresaDB
==============================================================*/

--==============================================================
-- 1. CREAR BASE DE DATOS
--==============================================================

IF DB_ID('EmpresaDB') IS NULL
    CREATE DATABASE EmpresaDB;
GO

USE EmpresaDB;
GO

--==============================================================
-- 2. CREACIÓN DE TABLAS
--==============================================================

CREATE TABLE Departamentos (
    IdDepartamento INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Empleados (
    IdEmpleado INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(80) NOT NULL,
    Apellido VARCHAR(80) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    FechaIngreso DATE NOT NULL,
    IdDepartamento INT NULL,
    CONSTRAINT FK_Empleados_Departamentos
        FOREIGN KEY (IdDepartamento)
        REFERENCES Departamentos(IdDepartamento)
);

CREATE TABLE Proyectos (
    IdProyecto INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Presupuesto DECIMAL(14,2) NOT NULL
        CHECK (Presupuesto >= 0),
    FechaInicio DATE NOT NULL
);

CREATE TABLE EmpleadoProyecto (
    IdEmpleado INT NOT NULL,
    IdProyecto INT NOT NULL,
    FechaAsignacion DATE NOT NULL
        DEFAULT CAST(GETDATE() AS DATE),

    CONSTRAINT PK_EmpleadoProyecto
        PRIMARY KEY (IdEmpleado, IdProyecto),

    CONSTRAINT FK_EP_Empleado
        FOREIGN KEY (IdEmpleado)
        REFERENCES Empleados(IdEmpleado),

    CONSTRAINT FK_EP_Proyecto
        FOREIGN KEY (IdProyecto)
        REFERENCES Proyectos(IdProyecto)
);
GO

--==============================================================
-- 3. INSERCIÓN DE DATOS
--==============================================================

INSERT INTO Departamentos (Nombre)
VALUES
('Tecnología'),
('Finanzas'),
('Operaciones'),
('Talento Humano'),
('Comercial'),
('Jurídica');

INSERT INTO Empleados
    (Nombre, Apellido, Email, FechaIngreso, IdDepartamento)
VALUES
('Ana','García','ana.garcia@empresa.com','2021-01-10',1),
('Luis','Martínez','luis.martinez@empresa.com','2020-03-18',1),
('Sofía','Rodríguez','sofia.rodriguez@empresa.com','2022-06-01',2),
('Carlos','López','carlos.lopez@empresa.com','2019-09-20',3),
('Elena','Torres','elena.torres@empresa.com','2023-02-15',5);

INSERT INTO Proyectos
    (Nombre, Presupuesto, FechaInicio)
VALUES
('Portal clientes',150000.00,'2024-01-01'),
('ERP financiero',280000.00,'2024-02-10'),
('Automatización logística',95000.00,'2024-03-01'),
('CRM comercial',110000.00,'2024-04-05'),
('Analítica de datos',175000.00,'2024-05-15');

INSERT INTO EmpleadoProyecto (IdEmpleado, IdProyecto)
VALUES
(1,1),
(1,2),
(1,5),
(2,1),
(2,3),
(3,2),
(3,5),
(4,3),
(5,4);
GO

--==============================================================
-- 4. CONSULTAS
--==============================================================

-- Consulta 1: Empleados con su departamento
SELECT
    e.IdEmpleado,
    e.Nombre,
    e.Apellido,
    d.Nombre AS Departamento
FROM Empleados e
LEFT JOIN Departamentos d
    ON e.IdDepartamento = d.IdDepartamento;

-- Consulta 2: Cantidad de empleados por proyecto
SELECT
    p.Nombre,
    p.Presupuesto,
    COUNT(ep.IdEmpleado) AS EmpleadosAsignados
FROM Proyectos p
LEFT JOIN EmpleadoProyecto ep
    ON p.IdProyecto = ep.IdProyecto
GROUP BY
    p.Nombre,
    p.Presupuesto;

-- Consulta 3: Top 3 empleados con más proyectos
SELECT TOP (3)
    e.IdEmpleado,
    e.Nombre,
    e.Apellido,
    COUNT(ep.IdProyecto) AS TotalProyectos
FROM Empleados e
INNER JOIN EmpleadoProyecto ep
    ON e.IdEmpleado = ep.IdEmpleado
GROUP BY
    e.IdEmpleado,
    e.Nombre,
    e.Apellido
ORDER BY
    TotalProyectos DESC,
    e.Apellido;

-- Consulta 4: Departamentos sin empleados
SELECT
    d.IdDepartamento,
    d.Nombre
FROM Departamentos d
LEFT JOIN Empleados e
    ON d.IdDepartamento = e.IdDepartamento
WHERE e.IdEmpleado IS NULL;

-- Consulta 5: Empleados con más de un proyecto
SELECT
    e.IdEmpleado,
    e.Nombre,
    e.Apellido,
    COUNT(ep.IdProyecto) AS TotalProyectos
FROM Empleados e
INNER JOIN EmpleadoProyecto ep
    ON e.IdEmpleado = ep.IdEmpleado
GROUP BY
    e.IdEmpleado,
    e.Nombre,
    e.Apellido
HAVING COUNT(ep.IdProyecto) > 1;
GO

--==============================================================
-- 5. PROCEDIMIENTO ALMACENADO
--==============================================================

CREATE OR ALTER PROCEDURE dbo.sp_buscar_empleado
    @Nombre VARCHAR(80)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        e.IdEmpleado,
        e.Nombre,
        e.Apellido,
        e.Email,
        e.FechaIngreso,
        d.Nombre AS Departamento
    FROM Empleados e
    LEFT JOIN Departamentos d
        ON e.IdDepartamento = d.IdDepartamento
    WHERE e.Nombre LIKE '%' + @Nombre + '%';
END;
GO

-- Ejemplo de ejecución
EXEC dbo.sp_buscar_empleado 'Ana';
GO

--==============================================================
-- 6. FUNCIÓN ESCALAR
--==============================================================

CREATE OR ALTER FUNCTION dbo.fn_total_proyectos
(
    @IdEmpleado INT
)
RETURNS INT
AS
BEGIN
    RETURN
    (
        SELECT COUNT(*)
        FROM EmpleadoProyecto
        WHERE IdEmpleado = @IdEmpleado
    );
END;
GO

-- Ejemplo de uso
SELECT
    IdEmpleado,
    Nombre,
    dbo.fn_total_proyectos(IdEmpleado) AS TotalProyectos
FROM Empleados;
GO

--==============================================================
-- 7. ÍNDICE
--==============================================================

CREATE NONCLUSTERED INDEX IX_Empleados_Apellido
ON Empleados (Apellido);
GO

--==============================================================
-- 8. BACKUP Y RESTORE (REFERENCIA)
--==============================================================

/*
-- Crear Backup
BACKUP DATABASE EmpresaDB
TO DISK = 'C:\Backups\EmpresaDB.bak'
WITH INIT, COMPRESSION;

-- Ver archivos del backup
RESTORE FILELISTONLY
FROM DISK = 'C:\Backups\EmpresaDB.bak';

-- Restaurar la base de datos
RESTORE DATABASE EmpresaDB
FROM DISK = 'C:\Backups\EmpresaDB.bak'
WITH REPLACE,
MOVE 'EmpresaDB' TO 'C:\SQLData\EmpresaDB.mdf',
MOVE 'EmpresaDB_log' TO 'C:\SQLData\EmpresaDB_log.ldf';

-- Validar integridad
DBCC CHECKDB ('EmpresaDB');
*/

--==============================================================
-- 9. BONUS - IMPORTAR DATOS DESDE API
--==============================================================

/*
CREATE TABLE #UsuariosAPI
(
    id INT,
    name VARCHAR(200),
    username VARCHAR(100),
    email VARCHAR(150)
);

-- Cargar previamente el JSON mediante SSIS o PowerShell

SELECT
    e.Email AS CorreoEmpleado,
    u.email AS CorreoAPI
FROM Empleados e
FULL JOIN #UsuariosAPI u
    ON LOWER(e.Email) = LOWER(u.email);
*/

--========================= FIN ================================