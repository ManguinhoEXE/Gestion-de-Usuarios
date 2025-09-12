require('dotenv').config();
const jwt = require('jsonwebtoken');

const {
  JWT_SECRET,
  JWT_EXPIRES_IN = '8h',
  JWT_ISSUER,
  JWT_AUDIENCE,
} = process.env;

if (!JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en variables de entorno');
}

const signOptions = {};
if (JWT_EXPIRES_IN) signOptions.expiresIn = JWT_EXPIRES_IN;
if (JWT_ISSUER) signOptions.issuer = JWT_ISSUER;
if (JWT_AUDIENCE) signOptions.audience = JWT_AUDIENCE;

exports.signAuthToken = ({ id, email }) =>
  jwt.sign({ id, email }, JWT_SECRET, signOptions);

exports.verifyToken = (token) =>
  jwt.verify(token, JWT_SECRET, {
    issuer: JWT_ISSUER || undefined,
    audience: JWT_AUDIENCE || undefined,
  });

exports.getBearerToken = (authorizationHeader = '') => {
  const [type, token] = authorizationHeader.split(' ');
  return type === 'Bearer' && token ? token : null;
};