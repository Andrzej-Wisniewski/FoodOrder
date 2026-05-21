import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from './User.model.js';
import validateEmail from '../../shared/utils/validateEmail.js';

import {
  success,
  created,
  unauthorized,
  conflict,
  serverError,
  validationError,
} from '../../shared/utils/response.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET not set');
}

function generateToken(userId, role) {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: '1h',
  });
}

export async function getCurrentUser(req, res) {
  try {
    if (!req.user) {
      return unauthorized(res, 'Brak autoryzacji.');
    }

    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return unauthorized(res, 'Użytkownik nie istnieje.');
    }

    return success(res, {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    return serverError(res, err);
  }
}

export async function registerUser(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return validationError(res, { email: 'Email i hasło są wymagane.' });
    }

    if (!validateEmail(email)) {
      return validationError(res, { email: 'Niepoprawny adres email.' });
    }

    if (password.length < 6) {
      return validationError(res, {
        password: 'Hasło musi mieć co najmniej 6 znaków.',
      });
    }

    if (!name) {
      return validationError(res, { name: 'Nazwa użytkownika jest wymagana.' });
    }

    const exists = await User.findOne({ email }).lean();
    if (exists) {
      return conflict(res, 'Użytkownik z takim emailem już istnieje.');
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashed,
      name,
      role: 'user',
    });

    const token = generateToken(newUser._id, newUser.role);

    const userPayload = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    return created(res, { token, user: userPayload }, 'Utworzono użytkownika.');
  } catch (err) {
    console.error('registerUser fatal error:', err);
    return serverError(res, err);
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return validationError(res, { email: 'Email i hasło są wymagane.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return unauthorized(res, 'Nieprawidłowy email lub hasło');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return unauthorized(res, 'Nieprawidłowy email lub hasło.');
    }

    const token = generateToken(user._id, user.role);

    const userPayload = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return success(
      res,
      {
        token,
        user: userPayload,
      },
      'Zalogowano pomyślnie.',
    );
  } catch (err) {
    console.error('loginUser fatal error:', err);
    return serverError(res, err);
  }
}
