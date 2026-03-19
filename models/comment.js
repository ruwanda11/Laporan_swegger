const db = require('../config/db');

const Comment = {
    create: async (post_id, user_id, komentar, rating) => {
        const result = await db.query(
            `INSERT INTO comments (post_id, user_id, komentar, rating)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [post_id, user_id, komentar, rating]
        );
        return result.rows[0];
    }
};

module.exports = Comment;