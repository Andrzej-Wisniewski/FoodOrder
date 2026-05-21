import bcrypt from 'bcryptjs';
import User from './features/auth/User.model.js';

export async function createAdmin() {
  try {
    if (!process.env.ADMIN_SECRET) {
      console.warn('ADMIN_SECRET not set');
      return;
    }

    const email = 'admin@test.com';

    const exists = await User.findOne({ email });
    if (exists) {
      console.log('Default admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_SECRET, 10);

    await User.create({
      name: 'Admin',
      email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Default admin created');
  } catch (err) {
    console.error('createAdmin error:', err);
  }
}
