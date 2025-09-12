const { verifyToken, getBearerToken } = require('../utils/jwt');

exports.authRequired = async (req, _res, next) => {
  const cookieToken = req.cookies?.token;
  const headerToken = getBearerToken(req.headers.authorization || '');
  const token = cookieToken || headerToken;

  if (!token) {
    const err = new Error('No autorizado');
    err.status = 401;
    return next(err);
  }
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    const err = new Error('Token inválido o expirado');
    err.status = 401;
    next(err);
  }
};