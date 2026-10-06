import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../utils/validation.js';

export async function getDashboardStats(req, res) {
  try {
    const db = await getDb();

    const userCountResult = await db.get('SELECT COUNT(*) as count FROM users');
    const storeCountResult = await db.get('SELECT COUNT(*) as count FROM stores');
    const ratingCountResult = await db.get('SELECT COUNT(*) as count FROM ratings');

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: userCountResult?.count || 0,
        totalStores: storeCountResult?.count || 0,
        totalRatings: ratingCountResult?.count || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics.' });
  }
}

export async function getAllUsers(req, res) {
  try {
    const db = await getDb();
    const { searchName, searchEmail, searchAddress, role, sortBy = 'name', sortOrder = 'asc' } = req.query;

    let query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,
        u.created_at,
        s.id AS store_id,
        s.name AS store_name,
        ROUND(AVG(r.rating), 2) AS rating,
        COUNT(r.id) AS rating_count
      FROM users u
      LEFT JOIN stores s ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (searchName) {
      query += ` AND LOWER(u.name) LIKE ?`;
      params.push(`%${searchName.trim().toLowerCase()}%`);
    }

    if (searchEmail) {
      query += ` AND LOWER(u.email) LIKE ?`;
      params.push(`%${searchEmail.trim().toLowerCase()}%`);
    }

    if (searchAddress) {
      query += ` AND LOWER(u.address) LIKE ?`;
      params.push(`%${searchAddress.trim().toLowerCase()}%`);
    }

    if (role && ['ADMIN', 'USER', 'STORE_OWNER'].includes(role.toUpperCase())) {
      query += ` AND u.role = ?`;
      params.push(role.toUpperCase());
    }

    query += ` GROUP BY u.id`;

    const validSortColumns = {
      name: 'u.name',
      email: 'u.email',
      address: 'u.address',
      role: 'u.role',
      rating: 'rating',
      created_at: 'u.created_at',
    };

    const sortColumn = validSortColumns[sortBy.toLowerCase()] || 'u.name';
    const direction = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${sortColumn} ${direction}`;

    const users = await db.all(query, params);

    return res.status(200).json({
      success: true,
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        address: u.address,
        role: u.role,
        createdAt: u.created_at,
        rating: u.role === 'STORE_OWNER' ? (u.rating !== null ? Number(u.rating) : null) : null,
        ratingCount: u.role === 'STORE_OWNER' ? u.rating_count : 0,
        storeName: u.role === 'STORE_OWNER' ? u.store_name : null,
      })),
    });
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch users list.' });
  }
}

export async function addUser(req, res) {
  try {
    const { name, email, password, address, role } = req.body;

    const allowedRoles = ['ADMIN', 'USER', 'STORE_OWNER'];
    if (!role || !allowedRoles.includes(role.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Role must be one of: ADMIN, USER, or STORE_OWNER.',
      });
    }

    const nameVal = validateName(name);
    if (!nameVal.isValid) {
      return res.status(400).json({ success: false, message: nameVal.message });
    }

    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      return res.status(400).json({ success: false, message: emailVal.message });
    }

    const passVal = validatePassword(password);
    if (!passVal.isValid) {
      return res.status(400).json({ success: false, message: passVal.message });
    }

    const addrVal = validateAddress(address);
    if (!addrVal.isValid) {
      return res.status(400).json({ success: false, message: addrVal.message });
    }

    const db = await getDb();
    const existing = await db.get('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await db.run(
      `INSERT INTO users (id, name, email, password, address, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, name.trim(), email.trim().toLowerCase(), hashedPassword, address.trim(), role.toUpperCase()]
    );

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      user: {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        role: role.toUpperCase(),
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ success: false, message: 'Failed to create user.' });
  }
}

export async function getAllStores(req, res) {
  try {
    const db = await getDb();
    const { searchName, searchEmail, searchAddress, sortBy = 'name', sortOrder = 'asc' } = req.query;

    let query = `
      SELECT 
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        s.created_at,
        u.name AS owner_name,
        u.email AS owner_email,
        ROUND(AVG(r.rating), 2) AS rating,
        COUNT(r.id) AS rating_count
      FROM stores s
      LEFT JOIN users u ON u.id = s.owner_id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (searchName) {
      query += ` AND LOWER(s.name) LIKE ?`;
      params.push(`%${searchName.trim().toLowerCase()}%`);
    }

    if (searchEmail) {
      query += ` AND LOWER(s.email) LIKE ?`;
      params.push(`%${searchEmail.trim().toLowerCase()}%`);
    }

    if (searchAddress) {
      query += ` AND LOWER(s.address) LIKE ?`;
      params.push(`%${searchAddress.trim().toLowerCase()}%`);
    }

    query += ` GROUP BY s.id`;

    const validSortColumns = {
      name: 's.name',
      email: 's.email',
      address: 's.address',
      rating: 'rating',
      created_at: 's.created_at',
    };

    const sortColumn = validSortColumns[sortBy.toLowerCase()] || 's.name';
    const direction = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${sortColumn} ${direction}`;

    const stores = await db.all(query, params);

    return res.status(200).json({
      success: true,
      stores: stores.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        ownerId: s.owner_id,
        ownerName: s.owner_name,
        ownerEmail: s.owner_email,
        rating: s.rating !== null ? Number(s.rating) : null,
        ratingCount: s.rating_count,
        createdAt: s.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching stores for admin:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch stores list.' });
  }
}

export async function addStore(req, res) {
  try {
    const { name, email, address, ownerId } = req.body;

    const nameVal = validateName(name);
    if (!nameVal.isValid) {
      return res.status(400).json({ success: false, message: nameVal.message });
    }

    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      return res.status(400).json({ success: false, message: emailVal.message });
    }

    const addrVal = validateAddress(address);
    if (!addrVal.isValid) {
      return res.status(400).json({ success: false, message: addrVal.message });
    }

    const db = await getDb();

    const existingStore = await db.get('SELECT id FROM stores WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (existingStore) {
      return res.status(409).json({ success: false, message: 'A store with this email already exists.' });
    }

    if (ownerId) {
      const owner = await db.get("SELECT id, role FROM users WHERE id = ? AND role = 'STORE_OWNER'", [ownerId]);
      if (!owner) {
        return res.status(400).json({
          success: false,
          message: 'The specified owner ID is invalid or not registered as a Store Owner.',
        });
      }
    }

    const storeId = uuidv4();
    await db.run(
      `INSERT INTO stores (id, name, email, address, owner_id)
       VALUES (?, ?, ?, ?, ?)`,
      [storeId, name.trim(), email.trim().toLowerCase(), address.trim(), ownerId || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Store created successfully.',
      store: {
        id: storeId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        ownerId: ownerId || null,
      },
    });
  } catch (error) {
    console.error('Error creating store:', error);
    return res.status(500).json({ success: false, message: 'Failed to create store.' });
  }
}
