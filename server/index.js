require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


const authRoutes = require('./routes/auth.routes');
const pacientesRoutes = require('./routes/pacientes.routes');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser()); 
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);

app.use((req, res, _next) => {
  res.status(404).json({ error: true, message: 'Ruta no encontrada' });
});

app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: true, message: 'JSON inválido' });
  }
  console.error(err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Server Error',
    details: err.details,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`API running on http://localhost:${PORT}`)
);