import { stripe } from './stripe.js';
import Order from '../orders/Order.model.js';
import validateObjectId from '../../shared/utils/validateObjectId.js';
import {
  success,
  badRequest,
  serverError,
  forbidden,
  notFound,
  serviceUnavailable,
} from '../../shared/utils/response.js';

export async function createCheckoutSession(req, res) {
  if (!stripe) {
    return serviceUnavailable(res, new Error('Płatności niedostępne.'));
  }

  try {
    const { orderId } = req.params;

    if (!validateObjectId(orderId)) {
      return badRequest(res, 'Nieprawidłowy identyfikator zamówienia.');
    }

    const order = await Order.findById(orderId);

    if (!order) return notFound(res, 'Nie znaleziono zamówienia.');

    if (order.userId.toString() !== req.user.id) {
      return forbidden(res, 'Brak dostępu do zamówienia.');
    }

    if (order.paymentStatus === 'paid') {
      return badRequest(res, 'Zamówienie jest już opłacone.');
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],

      line_items: order.items.map((item) => ({
        price_data: {
          currency: 'pln',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),

      metadata: {
        orderId: order._id.toString(),
      },

      success_url: `${process.env.FRONTEND_URL}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/?payment=cancel&session_id={CHECKOUT_SESSION_ID}`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    return success(res, {
      checkoutUrl: session.url,
    });
  } catch (err) {
    console.error('createCheckoutSession error:', err);
    return serverError(res, err);
  }
}
