import { stripe } from './stripe.js';
import Order from '../orders/Order.model.js';

export async function handleStripeWebhook(req, res) {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).send('Internal error');
  }
}

async function handleCheckoutCompleted(session) {
  const result = await Order.findOneAndUpdate(
    { stripeSessionId: session.id, paymentStatus: 'unpaid' },
    {
      $set: {
        paymentStatus: 'paid',
        stripePaymentIntentId: session.payment_intent,
      },
    },
  );

  if (!result) {
    console.warn(`Order not found or already paid for session ${session.id}`);
  }
}

async function handleCheckoutExpired(session) {
  const result = await Order.findOneAndUpdate(
    { stripeSessionId: session.id, paymentStatus: 'unpaid' },
    {
      $set: {
        paymentStatus: 'expired',
        status: 'cancelled',
      },
    },
  );

  if (!result) {
    console.warn(`Order not found for expired session ${session.id}`);
  }
}

async function handleChargeRefunded(charge) {
  const result = await Order.findOneAndUpdate(
    {
      stripePaymentIntentId: charge.payment_intent,
      paymentStatus: 'paid',
    },
    { $set: { paymentStatus: 'refunded' } },
  );

  if (!result) {
    console.warn(
      `Order not found for refunded charge ${charge.payment_intent}`,
    );
  }
}

async function handlePaymentFailed(paymentIntent) {
  console.warn(
    `Payment failed for intent ${paymentIntent.id}: ${paymentIntent.last_payment_error?.message}`,
  );
}
