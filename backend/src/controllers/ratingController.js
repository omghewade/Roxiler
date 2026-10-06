import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import { validateRating } from '../utils/validation.js';

export async function submitOrUpdateRating(req, res) {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (!storeId) {
      return res.status(400).json({ success: false, message: 'Store ID is required.' });
    }

    const ratingVal = validateRating(rating);
    if (!ratingVal.isValid) {
      return res.status(400).json({ success: false, message: ratingVal.message });
    }

    const numRating = parseInt(rating, 10);
    const db = await getDb();

    const store = await db.get('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    const existingRating = await db.get(
      'SELECT id, rating FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    let ratingId;
    let isUpdate = false;

    if (existingRating) {
      ratingId = existingRating.id;
      isUpdate = true;
      await db.run(
        'UPDATE ratings SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [numRating, ratingId]
      );
    } else {
      ratingId = uuidv4();
      await db.run(
        'INSERT INTO ratings (id, user_id, store_id, rating) VALUES (?, ?, ?, ?)',
        [ratingId, userId, storeId, numRating]
      );
    }

    const storeStats = await db.get(
      'SELECT ROUND(AVG(rating), 2) AS overall_rating, COUNT(id) AS rating_count FROM ratings WHERE store_id = ?',
      [storeId]
    );

    return res.status(200).json({
      success: true,
      message: isUpdate ? 'Rating modified successfully.' : 'Rating submitted successfully.',
      rating: {
        id: ratingId,
        storeId,
        userId,
        rating: numRating,
        overallRating: storeStats.overall_rating !== null ? Number(storeStats.overall_rating) : null,
        ratingCount: storeStats.rating_count,
      },
    });
  } catch (error) {
    console.error('Error submitting or modifying rating:', error);
    return res.status(500).json({ success: false, message: 'Failed to record rating.' });
  }
}
