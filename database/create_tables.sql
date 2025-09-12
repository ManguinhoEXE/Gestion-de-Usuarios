-- Tabla de pacientes
CREATE TABLE pacientes (
  id SERIAL PRIMARY KEY,
  numero_documento VARCHAR(20) NOT NULL UNIQUE,
  tipo_documento VARCHAR(5) NOT NULL CHECK (tipo_documento IN ('CC', 'TI', 'CE', 'PA')),
  primer_nombre VARCHAR(50) NOT NULL,
  segundo_nombre VARCHAR(50),
  primer_apellido VARCHAR(50) NOT NULL,
  segundo_apellido VARCHAR(50),
  fecha_nacimiento DATE NOT NULL CHECK (fecha_nacimiento <= CURRENT_DATE),
  email VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(20) NOT NULL CHECK (telefono ~ '^[0-9]+$'),
  direccion VARCHAR(150) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios para login
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);