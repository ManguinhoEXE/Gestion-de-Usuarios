const pool = require('../db');
const { hashPassword, verifyPassword } = require('../utils/password');
const { signAuthToken, verifyToken, getBearerToken } = require('../utils/jwt');

const isProd = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,              
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
  maxAge: 1000 * 60 * 60 * 8,
};

exports.register = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    const err = new Error('email y password son requeridos');
    err.status = 400;
    throw err;
  }

  const exists = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
  if (exists.rowCount > 0) {
    const err = new Error('Email ya está registrado');
    err.status = 409;
    throw err;
  }

  const hashed = await hashPassword(password);
  const { rows } = await pool.query(
    `INSERT INTO usuarios (email, password)
     VALUES ($1, $2)
     RETURNING id, email, fecha_creacion`,
    [email, hashed]
  );

  const user = rows[0];
  const token = signAuthToken({ id: user.id, email: user.email });

  res.cookie('token', token, COOKIE_OPTIONS);
  res.status(201).json({ user }); 
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    const err = new Error('email y password son requeridos');
    err.status = 400;
    throw err;
  }

  const { rows } = await pool.query(
    'SELECT id, email, password FROM usuarios WHERE email = $1',
    [email]
  );
  if (rows.length === 0) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
    throw err;
  }

  const user = rows[0];
  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
    throw err;
  }

  const token = signAuthToken({ id: user.id, email: user.email });

  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ user: { id: user.id, email: user.email } });
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

exports.logout = async (req, res) => {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: undefined });
  res.status(204).send();
};