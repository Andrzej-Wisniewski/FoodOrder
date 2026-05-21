import 'dotenv/config';
import app from './app.js';
import { connectDB } from './mongoose.js';
import { createAdmin } from './initAdmin.js';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    if (!process.env.ADMIN_SECRET) {
      throw new Error('ADMIN_SECRET not set');
    }

    await connectDB();
    await createAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server start error:', err);
  }
}

start();
