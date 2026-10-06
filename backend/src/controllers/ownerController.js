import { getDb } from '../db/database.js';

export async function getOwnerDashboard(req, res) {
  try {
    const ownerId = req.user.id;
    const db = await getDb();
    const { sortBy = 'rating', sortOrder = 'desc', searchName, searchEmail } = req.query;

    const store = await db.get('SELECT id, name, email, address FROM stores WHERE owner_id = ?', [ownerId]);

    if (!store) {
      return res.status(200).json({
        success: true,
        store: null,
        averageRating: null,
        totalRatings: 0,
        raters: [],
        message: 'No store currently assigned to your account. Please contact an administrator.',
      });
    }

    const stats = await db.get(
      'SELECT ROUND(AVG(rating), 2) AS avg_rating, COUNT(id) AS total_count FROM ratings WHERE store_id = ?',
      [store.id]
    );

    let query = `
      SELECT 
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.address AS user_address,
        r.rating,
        r.created_at,
        r.updated_at
      FROM ratings r
      JOIN users u ON u.id = r.user_id
      WHERE r.store_id = ?
    `;
    const params = [store.id];

    if (searchName) {
      query += ` AND LOWER(u.name) LIKE ?`;
      params.push(`%${searchName.trim().toLowerCase()}%`);
    }

    if (searchEmail) {
      query += ` AND LOWER(u.email) LIKE ?`;
      params.push(`%${searchEmail.trim().toLowerCase()}%`);
    }

    const validSortColumns = {
      name: 'u.name',
      user_name: 'u.name',
      email: 'u.email',
      user_email: 'u.email',
      address: 'u.address',
      user_address: 'u.address',
      rating: 'r.rating',
      date: 'r.updated_at',
      created_at: 'r.created_at',
    };

    const sortColumn = validSortColumns[sortBy.toLowerCase()] || 'r.updated_at';
    const direction = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortColumn} ${direction}`;

    const raters = await db.all(query, params);

    return res.status(200).json({
      success: true,
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      averageRating: stats.avg_rating !== null ? Number(stats.avg_rating) : null,
      totalRatings: stats.total_count,
      raters: raters.map((r) => ({
        userId: r.user_id,
        name: r.user_name,
        email: r.user_email,
        address: r.user_address,
        rating: r.rating,
        date: r.updated_at || r.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching store owner dashboard data:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve owner dashboard data.' });
  }
}
