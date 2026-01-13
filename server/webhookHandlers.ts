import { getStripeSync } from './stripeClient';
import { storage } from './storage';

const EXPECTED_AMOUNT = 9900;
const EXPECTED_CURRENCY = 'eur';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    const event = await sync.processWebhook(payload, signature);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      if (session.payment_status !== 'paid') {
        console.log(`Ignoring unpaid session: ${session.id}, status: ${session.payment_status}`);
        return;
      }

      if (session.amount_total !== EXPECTED_AMOUNT) {
        console.warn(`Invalid amount for session ${session.id}: expected ${EXPECTED_AMOUNT}, got ${session.amount_total}`);
        return;
      }

      if (session.currency?.toLowerCase() !== EXPECTED_CURRENCY) {
        console.warn(`Invalid currency for session ${session.id}: expected ${EXPECTED_CURRENCY}, got ${session.currency}`);
        return;
      }

      const userId = session.metadata?.userId;
      if (!userId) {
        console.warn(`Missing userId in metadata for session ${session.id}`);
        return;
      }

      await storage.grantUserAccess(
        userId,
        session.customer as string,
        session.payment_intent as string
      );
      console.log(`Access granted for user ${userId} after validated payment of €${EXPECTED_AMOUNT / 100}`);
    }
  }
}
