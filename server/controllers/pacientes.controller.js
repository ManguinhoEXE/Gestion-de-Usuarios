const pool = require("../db");

const nullIfEmpty = (v) =>
  v === undefined || v === null || String(v).trim() === "" ? null : v;

exports.createPaciente = async (req, res) => {
  const {
    numero_documento,
    tipo_documento,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    fecha_nacimiento,
    email,
    telefono,
    direccion,
  } = req.body || {};

  const required = {
    numero_documento,
    tipo_documento,
    primer_nombre,
    primer_apellido,
    fecha_nacimiento,
    email,
    telefono,
    direccion,
  };
  for (const [k, v] of Object.entries(required)) {
    if (v === undefined || v === null || String(v).trim() === "") {
      const err = new Error(`Falta el campo obligatorio: ${k}`);
      err.status = 400;
      throw err;
    }
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO pacientes
       (numero_documento, tipo_documento, primer_nombre, segundo_nombre,
        primer_apellido, segundo_apellido, fecha_nacimiento, email, telefono, direccion)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        numero_documento.trim(),
        tipo_documento,
        primer_nombre.trim(),
        nullIfEmpty(segundo_nombre),
        primer_apellido.trim(),
        nullIfEmpty(segundo_apellido),
        fecha_nacimiento,
        email.trim(),
        telefono.trim(),
        direccion.trim(),
      ]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === "23505") {
      const err = new Error("Documento o email ya registrados");
      err.status = 409;
      throw err;
    }
    if (e.code === "23514") {
      const err = new Error("Datos inválidos: violación de restricciones");
      err.status = 400;
      throw err;
    }
    if (e.code === "23502") {
      const err = new Error("Datos inválidos: campos obligatorios faltantes");
      err.status = 400;
      throw err;
    }
    throw e;
  }
};

exports.listPacientes = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const size = Math.min(Math.max(parseInt(req.query.size, 10) || 10, 1), 100);
  const offset = (page - 1) * size;

  const { rows: countRows } = await pool.query(
    "SELECT COUNT(*)::int AS total FROM pacientes"
  );
  const total = countRows[0].total;
  const total_pages = Math.max(Math.ceil(total / size), 1);

  const { rows: data } = await pool.query(
    `SELECT *
     FROM pacientes
     ORDER BY fecha_registro DESC
     LIMIT $1 OFFSET $2`,
    [size, offset]
  );

  res.json({ page, size, total, total_pages, data });
};

exports.getPaciente = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error("ID inválido");
    err.status = 400;
    throw err;
  }

  const { rows } = await pool.query("SELECT * FROM pacientes WHERE id = $1", [
    id,
  ]);
  if (rows.length === 0) {
    const err = new Error("Paciente no encontrado");
    err.status = 404;
    throw err;
  }

  res.json(rows[0]);
};

exports.updatePaciente = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error("ID inválido");
    err.status = 400;
    throw err;
  }

  const allowedFields = [
    "numero_documento",
    "tipo_documento",
    "primer_nombre",
    "segundo_nombre",
    "primer_apellido",
    "segundo_apellido",
    "fecha_nacimiento",
    "email",
    "telefono",
    "direccion",
  ];

  const updates = [];
  const params = [];
  let idx = 1;

  const cleaner = (key, val) => {
    if (["segundo_nombre", "segundo_apellido"].includes(key)) {
      return nullIfEmpty(val);
    }
    if (
      [
        "primer_nombre",
        "primer_apellido",
        "numero_documento",
        "email",
        "telefono",
        "direccion",
      ].includes(key)
    ) {
      return typeof val === "string" ? val.trim() : val;
    }
    return val;
  };

  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      const value = cleaner(key, req.body[key]);
      updates.push(`${key} = $${idx++}`);
      params.push(value);
    }
  }

  if (updates.length === 0) {
    const err = new Error("Nada que actualizar");
    err.status = 400;
    throw err;
  }

  params.push(id);

  try {
    const { rows } = await pool.query(
      `UPDATE pacientes
       SET ${updates.join(", ")}
       WHERE id = $${idx}
       RETURNING *`,
      params
    );

    if (rows.length === 0) {
      const err = new Error("Paciente no encontrado");
      err.status = 404;
      throw err;
    }

    res.json(rows[0]);
  } catch (e) {
    if (e.code === "23505") {
      const err = new Error("Documento o email ya registrados");
      err.status = 409;
      throw err;
    }
    if (e.code === "23514") {
      const err = new Error("Datos inválidos: violación de restricciones");
      err.status = 400;
      throw err;
    }
    if (e.code === "23502") {
      const err = new Error("Datos inválidos: campos obligatorios faltantes");
      err.status = 400;
      throw err;
    }
    throw e;
  }
};

exports.deletePaciente = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error("ID inválido");
    err.status = 400;
    throw err;
  }

  const { rowCount } = await pool.query("DELETE FROM pacientes WHERE id = $1", [
    id,
  ]);
  if (rowCount === 0) {
    const err = new Error("Paciente no encontrado");
    err.status = 404;
    throw err;
  }

  res.status(204).send();
};
