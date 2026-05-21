import fs from 'fs';
import path from 'path';
import { compressImage } from '../../shared/utils/compressImage.js';
import Meal from '../meals/Meal.model.js';
import Order from '../orders/Order.model.js';
import validateObjectId from '../../shared/utils/validateObjectId.js';
import {
  success,
  created,
  badRequest,
  serverError,
  notFound,
} from '../../shared/utils/response.js';
import { CATEGORIES } from '../../../frontend/src/shared/const/index.js';

export async function getAdminMeals(req, res) {
  try {
    const meals = await Meal.find().sort({ name: 1 }).lean();
    return success(res, meals);
  } catch (err) {
    console.error('getAdminMeals error:', err);
    return serverError(res, err);
  }
}

export async function createMeal(req, res) {
  try {
    const { name, price, description, category } = req.body;

    if (!name || !price || !category) {
      return badRequest(res, 'Wymagane pola: nazwa, cena i kategoria.');
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) {
      return badRequest(res, 'Cena musi być liczbą.');
    }

    if (!CATEGORIES.includes(category)) {
      return badRequest(res, 'Nieprawidłowa kategoria.');
    }

    const meal = await Meal.create({
      name,
      price: numPrice,
      description: description || '',
      image: null,
      category,
    });

    return created(res, meal, 'Danie utworzone.');
  } catch (err) {
    console.error('createMeal error:', err);
    return serverError(res, err);
  }
}

export async function updateMeal(req, res) {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return badRequest(res, 'Nieprawidłowe ID.');
    }

    const { name, price, description, category } = req.body;

    if (!name || !price || !category) {
      return badRequest(res, 'Wymagane pola: nazwa, cena i kategoria.');
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) {
      return badRequest(res, 'Cena musi być liczbą.');
    }

    if (!CATEGORIES.includes(category)) {
      return badRequest(res, 'Nieprawidłowa kategoria.');
    }

    const updated = await Meal.findByIdAndUpdate(
      id,
      {
        name,
        price: numPrice,
        description: description || '',
        category,
        updatedAt: new Date(),
      },
      { new: true },
    ).lean();

    if (!updated) {
      return notFound(res, 'Nie znaleziono dania.');
    }

    return success(res, updated, 'Danie zaktualizowane.');
  } catch (err) {
    console.error('updateMeal error:', err);
    return serverError(res, err);
  }
}

export async function deleteMeal(req, res) {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return badRequest(res, 'Nieprawidłowe ID.');
    }

    const meal = await Meal.findById(id).lean();
    if (!meal) {
      return notFound(res, 'Nie znaleziono dania.');
    }

    if (meal.image) {
      const base = meal.image.replace(/-800\.webp$/, '');
      for (const tag of ['400', '600', '800']) {
        const imgPath = path.join('images', `${base}-${tag}.webp`);
        if (fs.existsSync(imgPath)) {
          try {
            fs.unlinkSync(imgPath);
          } catch (err) {
            console.error('unlink error:', err);
          }
        }
      }
    }

    await Meal.findByIdAndDelete(id);
    return success(res, null, 'Danie usunięte.');
  } catch (err) {
    console.error('deleteMeal error:', err);
    return serverError(res, err);
  }
}

export async function uploadMealImage(req, res) {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return badRequest(res, 'Nieprawidłowe ID.');
    }

    if (!req.file) {
      return badRequest(res, 'Zdjęcie jest wymagane.');
    }

    const meal = await Meal.findById(id);
    if (!meal) return notFound(res, 'Nie znaleziono dania.');

    const inputPath = path.join('images', req.file.filename);

    const baseName = path.basename(
      req.file.filename,
      path.extname(req.file.filename),
    );

    const newFiles = await compressImage(inputPath, baseName);

    if (meal.image) {
      const oldBase = meal.image.replace(/-800\.webp$/, '');
      for (const tag of ['400', '600', '800']) {
        const oldPath = path.join('images', `${oldBase}-${tag}.webp`);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.error('unlink error:', err);
          }
        }
      }
    }

    meal.image = newFiles.find((name) => name.endsWith('-800.webp'));
    await meal.save();

    return success(res, { image: meal.image }, 'Obraz został zaktualizowany.');
  } catch (err) {
    console.error('uploadMealImage error:', err);
    return serverError(res, err);
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate('userId', 'email name')
      .sort({ createdAt: -1 })
      .lean();

    return success(res, orders);
  } catch (err) {
    console.error('getAllOrders error:', err);
    return serverError(res, err);
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!validateObjectId(id)) {
      return badRequest(res, 'Nieprawidłowe ID zamówienia.');
    }

    const allowed = ['pending', 'completed', 'cancelled'];

    if (!allowed.includes(status)) {
      return badRequest(res, 'Nieprawidłowy status zamówienia.');
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true },
    ).lean();

    if (!updated) {
      return notFound(res, 'Nie znaleziono zamówienia.');
    }

    return success(res, updated, 'Status zamówienia zaktualizowany.');
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return serverError(res, err);
  }
}
