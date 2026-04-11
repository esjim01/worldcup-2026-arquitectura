user Nexus
pass Nexus06

CREATE DATABASE NexusWorldCup26
GO

-- RF-03: Gestión de Roles
CREATE TABLE [NexusWorldCup26].[dbo].[TABLA_ROLES](
	ID INT IDENTITY(1,1)  PRIMARY KEY,
	NOMBRE_ROL NVARCHAR(50) NOT NULL UNIQUE,
	DESCRIPCION NVARCHAR(100),
    FECHA_CREACION DATETIME DEFAULT GETDATE(),
    -- Definimos la columna y luego la restricción de valores
    ESTADO NVARCHAR(3) NOT NULL 
        CONSTRAINT CK_ROLES_ESTADO CHECK (ESTADO IN ('ACT', 'INA')) 
        CONSTRAINT DF_ROLES_ESTADO DEFAULT 'ACT',
    USUARIO_CREACION NVARCHAR(15) NOT NULL;
);

INSERT INTO TABLA_ROLES(NOMBRE_ROL) VALUES ('usuario'),('admin');

-- RF-01 y RF-02: Registro e Inicio de Sesión
CREATE TABLE [NexusWorldCup26].[dbo].[TABLA_USUARIOS](
	ID INT IDENTITY(1,1)  PRIMARY KEY,
	NOMBRE NVARCHAR(100) NOT NULL,
	EMIAL NVARCHAR(150) NOT NULL UNIQUE,
	PASSWORD_HASH NVARCHAR(200) NOT NULL,
	ROL INT NOT NULL DEFAULT 1,
	FECHA_CREACION DATETIME DEFAULT GETDATE(),

	CONSTRAINT FK_USUARIO_ROLES
	FOREIGN KEY (ROL) REFERENCES TABLA_ROLES(ID)

	);
	
	-- RF-04: Registro de Equipos
CREATE TABLE TBL_EQUIPOS (
    EquipoID INT PRIMARY KEY IDENTITY(1,1),
    NombreEquipo VARCHAR(100) NOT NULL,
    EscudoURL VARCHAR(255),
    Grupo CHAR(1), -- Ejemplo: 'A', 'B' para RF-07
	Estado NVARCHAR(3) NOT NULL 
        CHECK (ESTADO IN ('ACT', 'INA')) 
        DEFAULT 'ACT'
);

-- RF-05 y RF-06: Registro de Partidos y Resultados
CREATE TABLE TBL_PARTIDOS (
    PartidoID INT PRIMARY KEY IDENTITY(1,1),
    EquipoLocalID INT FOREIGN KEY REFERENCES TBL_EQUIPOS(EquipoID),
    EquipoVisitanteID INT FOREIGN KEY REFERENCES TBL_EQUIPOS(EquipoID),
    FechaPartido DATETIME NOT NULL,
    Estadio VARCHAR(100),
    Fase VARCHAR(50), -- 'Grupos', 'Cuartos', 'Final'
    GolesLocal INT DEFAULT NULL,
    GolesVisitante INT DEFAULT NULL,
    Estado_Juego VARCHAR(20) DEFAULT 'PROGRAMADO' -- 'PROGRAMADO', 'FINALIZADO'
);





RF-07: Cálculo de Tabla de Posiciones
Para no saturar el servidor calculando todo en tiempo real en cada consulta, lo ideal es usar una Vista (View) que procese los resultados de la tabla Partidos

USE [NexusWorldCup26]
GO

CREATE VIEW VW_POSICIONES AS
SELECT 
    E.EquipoID,
    E.NombreEquipo,
    E.Grupo,
    COUNT(*) AS PJ,
    SUM(Ganado) AS PG,
    SUM(Empatado) AS PE,
    SUM(Perdido) AS PP,
    SUM(GF) AS GF,
    SUM(GC) AS GC,
    SUM(GF - GC) AS DG,
    SUM(Puntos) AS PTS
FROM (
    -- Casos como Local
    SELECT EquipoLocalID AS EquipoID, 
        CASE WHEN GolesLocal > GolesVisitante THEN 1 ELSE 0 END AS Ganado,
        CASE WHEN GolesLocal = GolesVisitante THEN 1 ELSE 0 END AS Empatado,
        CASE WHEN GolesLocal < GolesVisitante THEN 1 ELSE 0 END AS Perdido,
        GolesLocal AS GF, GolesVisitante AS GC,
        CASE WHEN GolesLocal > GolesVisitante THEN 3 WHEN GolesLocal = GolesVisitante THEN 1 ELSE 0 END AS Puntos
    FROM TBL_PARTIDOS WHERE Estado_Juego = 'FINALIZADO'
    UNION ALL
    -- Casos como Visitante
    SELECT EquipoVisitanteID AS EquipoID, 
        CASE WHEN GolesVisitante > GolesLocal THEN 1 ELSE 0 END AS Ganado,
        CASE WHEN GolesVisitante = GolesLocal THEN 1 ELSE 0 END AS Empatado,
        CASE WHEN GolesVisitante < GolesLocal THEN 1 ELSE 0 END AS Perdido,
        GolesVisitante AS GF, GolesLocal AS GC,
        CASE WHEN GolesVisitante > GolesLocal THEN 3 WHEN GolesVisitante = GolesLocal THEN 1 ELSE 0 END AS Puntos
    FROM TBL_PARTIDOS WHERE Estado_Juego = 'FINALIZADO'
) AS Resultados
JOIN TBL_EQUIPOS E ON Resultados.EquipoID = E.EquipoID
GROUP BY E.EquipoID, E.NombreEquipo, E.Grupo;
