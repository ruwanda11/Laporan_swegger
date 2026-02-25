const db = require('../config/db');

const Post = {

    // Ambil semua post + category
    getAll: async () => {

        const result = await db.query(`
            SELECT posts.*,
            categories.nama as category
            FROM posts
            LEFT JOIN categories
            ON posts.category_id = categories.id
            ORDER BY posts.id ASC
        `);

        return result.rows;
    },

    // Ambil post by id
    getById: async (id) => {

        const result = await db.query(
            'SELECT * FROM posts WHERE id=$1',
            [id]
        );

        return result.rows[0];
    },

    // Tambah post + category + gambar
    create: async (judul, isi, gambar, category_id) => {

        const result = await db.query(
            `INSERT INTO posts
            (judul, isi, gambar, category_id)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [judul, isi, gambar, category_id]
        );

        return result.rows[0];
    },

    // Update post
    update: async (id, judul, isi, gambar, category_id) => {

        const result = await db.query(
            `UPDATE posts
            SET judul=$1,
                isi=$2,
                gambar=$3,
                category_id=$4
            WHERE id=$5
            RETURNING *`,
            [judul, isi, gambar, category_id, id]
        );

        return result.rows[0];
    },

    // Hapus post
    remove: async (id) => {

        await db.query(
            'DELETE FROM posts WHERE id=$1',
            [id]
        );

    }

};

module.exports = Post;