import jwt from 'jsonwebtoken';
import { unauthorized, forbidden } from '../utils/response.js';
import { ROLES } from '../../../frontend/src/shared/const/index.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return unauthorized(res, 'Brak tokenu.');

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return unauthorized(res, 'Token nieprawidłowy.');
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return unauthorized(res, 'Brak autoryzacji.');
  }

  if (req.user.role !== ROLES.ADMIN) {
    return forbidden(res, 'Brak uprawnień administratora.');
  }

  next();
}
