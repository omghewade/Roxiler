import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import { config } from '../config.js';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../utils/validation.js';

export async function signup(req, res) {
  try {
    const { name, email, password, address } = req.body;

    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      return res.status(400).json({ success: false, message: nameValidation.message });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ success: false, message: emailValidation.message });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ success: false, message: passwordValidation.message });
    }

    const addressValidation = validateAddress(address);
    if (!addressValidation.isValid) {
      return res.status(400).json({ success: false, message: addressValidation.message });
    }

    const db = await getDb();

    const existingUser = await db.get('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await db.run(
      `INSERT INTO users (id, name, email, password, address, role)
       VALUES (?, ?, ?, ?, ?, 'USER')`,
      [userId, name.trim(), email.trim().toLowerCase(), hashedPassword, address.trim()]
    );

    const token = jwt.sign({ userId, role: 'USER' }, config.jwtSecret, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        role: 'USER',
      },
    });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });

    let store = null;
    if (user.role === 'STORE_OWNER') {
      store = await db.get('SELECT id, name, email, address FROM stores WHERE owner_id = ?', [user.id]);
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        store: store || null,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const db = await getDb();
    let store = null;
    if (req.user.role === 'STORE_OWNER') {
      store = await db.get('SELECT id, name, email, address FROM stores WHERE owner_id = ?', [req.user.id]);
    }

    return res.status(200).json({
      success: true,
      user: {
        ...req.user,
        store: store || null,
      },
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current password and new password are required.' });
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ success: false, message: passwordValidation.message });
    }

    const db = await getDb();
    const user = await db.get('SELECT password FROM users WHERE id = ?', [req.user.id]);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from current password.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.run('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
      hashedPassword,
      req.user.id,
    ]);

    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
}
