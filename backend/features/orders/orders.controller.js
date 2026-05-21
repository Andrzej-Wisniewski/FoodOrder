import Order from './Order.model.js';
import Meal from '../meals/Meal.model.js';
import {
  success,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError,
} from '../../shared/utils/response.js';
import validateObjectId from '../../shared/utils/validateObjectId.js';

const REQUIRED_CUSTOMER_FIELDS = [
  'name',
  'email',
  'street',
  'postalCode',
  'city',
];

function validateCustomer(customer) {
  if (!customer || typeof customer !== 'object') {
    return 'Brak danych dostawy.';
  }

  for (const field of REQUIRED_CUSTOMER_FIELDS) {
    if (!customer[field] || !customer[field].trim()) {
      return `Brak pola: ${field}.`;
    }
  }

  return null;
}

export async function createOrder(req, res) {
  try {
    if (!req.user) {
      return unauthorized(res, 'Musisz być zalogowany, aby złożyć zamówienie.');
    }

    const { items, customer } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return badRequest(res, 'Brak pozycji zamówienia.');
    }

    const customerError = validateCustomer(customer);
    if (customerError) {
      return badRequest(res, customerError);
    }

    for (const item of items) {
      if (!validateObjectId(item.mealId)) {
        return badRequest(res, 'Nieprawidłowe ID dania.');
      }
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return badRequest(
          res,
          'Ilość musi być liczbą całkowitą większą od zera.',
        );
      }
    }

    const mealIds = items.map((i) => i.mealId);
    const meals = await Meal.find({ _id: { $in: mealIds } }).lean();

    const mealsMap = new Map(meals.map((m) => [m._id.toString(), m]));

    const missing = mealIds.filter((id) => !mealsMap.has(id));
    if (missing.length > 0) {
      return badRequest(res, 'Nie znaleziono niektórych pozycji menu.');
    }

    let totalPrice = 0;
    const orderItems = items.map((i) => {
      const meal = mealsMap.get(i.mealId);
      const price = Number(meal.price);
      const quantity = Number(i.quantity);
      totalPrice += price * quantity;

      return {
        mealId: meal._id,
        name: meal.name,
        quantity,
        price,
      };
    });

    const newOrder = await Order.create({
      userId: req.user.id,
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        street: customer.street.trim(),
        postalCode: customer.postalCode.trim(),
        city: customer.city.trim(),
      },
      items: orderItems,
      totalPrice,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    return created(res, newOrder.toObject(), 'Zamówienie utworzone.');
  } catch (err) {
    console.error('createOrder error:', err);
    return serverError(res, err);
  }
}

export async function getUserOrders(req, res) {
  try {
    if (!req.user) {
      return unauthorized(res, 'Brak autoryzacji.');
    }

    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return success(res, orders);
  } catch (err) {
    console.error('getUserOrders error:', err);
    return serverError(res, err);
  }
}

export async function cancelOrder(req, res) {
  try {
    if (!req.user) {
      return unauthorized(res, 'Brak autoryzacji.');
    }

    const { id } = req.params;

    if (!validateObjectId(id)) {
      return badRequest(res, 'Nieprawidłowe ID zamówienia.');
    }

    const order = await Order.findById(id);

    if (!order) {
      return notFound(res, 'Zamówienie nie istnieje.');
    }

    if (order.userId.toString() !== req.user.id) {
      return forbidden(res, 'Brak dostępu do zamówienia.');
    }

    if (order.status !== 'pending') {
      return badRequest(
        res,
        'Możesz anulować tylko zamówienia w trakcie realizacji.',
      );
    }

    if (order.paymentStatus !== 'unpaid') {
      return badRequest(res, 'Nie można anulować opłaconego zamówienia.');
    }

    order.status = 'cancelled';
    await order.save();

    return success(res, order.toObject());
  } catch (err) {
    console.error('cancelOrder error:', err);
    return serverError(res, err);
  }
}
