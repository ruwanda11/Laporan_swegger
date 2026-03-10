const db = require('../config/db');

const Post = {
    // --- UPDATE: Fungsi ini diperbaiki total agar pagination muncul ---
    getAllPaginated: async (limit, offset, category) => {
        let baseQuery = `
            SELECT posts.*, categories.nama as category
            FROM posts
            LEFT JOIN categories ON posts.category_id = categories.id
        `;
        let countQuery = `
            SELECT COUNT(*) as total 
            FROM posts 
            LEFT JOIN categories ON posts.category_id = categories.id
        `;
        
        const params = [];
        const countParams = [];
        
        // Logika filter kategori tetap dipertahankan
        if (category && category !== "" && category !== "Semua") {
            baseQuery += ` WHERE LOWER(categories.nama) = LOWER($1)`;
            countQuery += ` WHERE LOWER(categories.nama) = LOWER($1)`;
            params.push(category);
            countParams.push(category);
        }

        // --- UPDATE: Mendefinisikan limitNum agar tidak error 500 ---
        const limitNum = parseInt(limit, 10) || 9; 
        const offsetNum = parseInt(offset) || 0;
        
        // Menentukan index $ secara dinamis untuk query PostgreSQL
        const limitIndex = params.length + 1;
        const offsetIndex = params.length + 2;
        
        baseQuery += ` ORDER BY posts.id ASC LIMIT $${limitIndex} OFFSET $${offsetIndex}`;
        params.push(limitNum, offsetNum);

        // Eksekusi Query ke Database
        const result = await db.query(baseQuery, params);
        const countResult = await db.query(countQuery, countParams);
        
        // --- UPDATE: Perhitungan metadata agar totalPages TIDAK NULL ---
        const total = countResult.rows[0] && countResult.rows[0].total 
              ? parseInt(countResult.rows[0].total, 10) 
              : 0;
        // Jika total resep lebih dari 0, hitung halaman, minimal 1 halaman.
        const totalPages = total > 0 ? Math.ceil(total / limitNum) : 1;
        const currentPage = Math.floor(offsetNum / limitNum) + 1;
        console.log("Debug Pagination:", { total, limitNum, totalPages }); // Cek di terminal Anda
        return {
            data: result.rows,
            meta: {
                total: total,
                totalPages: totalPages, // Sekarang pasti berisi angka (contoh: 2), bukan null
                currentPage: currentPage,
                limit: limitNum
            }
        };
    },

    // Fungsi lama lainnya tidak diubah agar logika tetap benar
    getAll: async () => {
        const result = await db.query(`
            SELECT posts.*, categories.nama as category
            FROM posts
            LEFT JOIN categories ON posts.category_id = categories.id
            ORDER BY posts.id ASC
        `);
        return result.rows;
    },

    getById: async (id) => {
        const result = await db.query('SELECT * FROM posts WHERE id=$1', [id]);
        return result.rows[0];
    },

    create: async (judul, isi, gambar, category_id) => {
        const result = await db.query(
            `INSERT INTO posts (judul, isi, gambar, category_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [judul, isi, gambar, category_id]
        );
        return result.rows[0];
    },

    update: async (id, judul, isi, gambar, category_id) => {
        const result = await db.query(
            `UPDATE posts
            SET judul=$1, isi=$2, gambar=$3, category_id=$4
            WHERE id=$5
            RETURNING *`,
            [judul, isi, gambar, category_id, id]
        );
        return result.rows[0];
    },

    remove: async (id) => {
        await db.query('DELETE FROM posts WHERE id=$1', [id]);
    }
};

module.exports = Post;