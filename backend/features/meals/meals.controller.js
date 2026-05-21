import Meal from './Meal.model.js';
import { success, serverError } from '../../shared/utils/response.js';

export async function getMeals(req, res) {
  try {
    const meals = await Meal.find()
      .sort({ name: 1 })
      .lean()
      .collation({ locale: 'pl' });

    return success(res, meals);
  } catch (err) {
    console.error('getMeals error:', err);
    return serverError(res, err);
  }
}
