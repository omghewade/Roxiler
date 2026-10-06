import { getDb } from '../db/database.js';

export async function getStoresForUser(req, res) {
  try {
    const db = await getDb();
    const userId = req.user ? req.user.id : null;
    const { searchName, searchAddress, sortBy = 'name', sortOrder = 'asc' } = req.query;

    let query = `
      SELECT 
        s.id,
        s.name,
        s.address,
        ROUND(AVG(r.rating), 2) AS overall_rating,
        COUNT(r.id) AS rating_count,
        ur.rating AS user_submitted_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
      WHERE 1=1
    `;
    const params = [userId];

    if (searchName) {
      query += ` AND LOWER(s.name) LIKE ?`;
      params.push(`%${searchName.trim().toLowerCase()}%`);
    }

    if (searchAddress) {
      query += ` AND LOWER(s.address) LIKE ?`;
      params.push(`%${searchAddress.trim().toLowerCase()}%`);
    }

    query += ` GROUP BY s.id`;

    const validSortColumns = {
      name: 's.name',
      address: 's.address',
      rating: 'overall_rating',
      overall_rating: 'overall_rating',
      user_rating: 'user_submitted_rating',
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
        address: s.address,
        overallRating: s.overall_rating !== null ? Number(s.overall_rating) : null,
        ratingCount: s.rating_count,
        userSubmittedRating: s.user_submitted_rating !== null ? Number(s.user_submitted_rating) : null,
      })),
    });
  } catch (error) {
    console.error('Error fetching stores for user:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve stores.' });
  }
}
