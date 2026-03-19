const db = require('../config/db'); 
const Post = require('../models/post');
const Comment = require('../models/comment');
const response = require('../utils/response');
const { uploadImage } = require('../utils/upload');
const { minioClient, bucketName } = require('../config/minio');


const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
const port = process.env.MINIO_PORT || '9000';
const bucket = process.env.MINIO_BUCKET || 'posts';
const MINIO_URL = `http://${endpoint}:${port}/${bucket}`;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// --- PERBAIKAN: Fungsi getAll menggunakan getAllPaginated dari model ---
// controllers/post_controller.js

exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const offset = (page - 1) * limit;
        const category = req.query.category || "";
        const search = req.query.search || "";
        console.log("Parameter dari frontend:", { page, limit, category, search });


        const result = await Post.getAllPaginated(limit, offset, category, search);
        
        // --- PERBAIKAN URL GAMBAR ---
        // Sesuaikan 'uploads' dengan folder yang Anda daftarkan di app.use(express.static(...))
        const postsWithUrl = result.data.map(item => ({
            ...item,
            // Jika sebelumnya gambar muncul, pastikan path ini sama dengan kode lama Anda
                gambar: item.gambar ? `${MINIO_URL}/${item.gambar}` : null
        }));

        res.status(200).json({
            status: "success",
            data: {
                data: postsWithUrl,
                meta: result.meta 
            }
        });
    } catch (error) {
        console.error("❌ Error Get All Posts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};// --- FUNGSI LAIN TETAP SAMA ---

exports.getById = async (req, res) => {
    try {
        const data = await Post.getById(req.params.id);
        if (data) {
            data.gambar = data.gambar ? `${MINIO_URL}/${data.gambar}` : null;
        }
        response.success(res, data);
    } catch (error) {
        console.error("❌ Error Get Post By ID:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.create = async (req, res) => {
    try {
        const { judul, isi, category_id } = req.body;
        if (!judul || !isi || !category_id || !req.file) {
            return res.status(400).json({ status: "error", message: "Data tidak lengkap" });
        }
        
        const gambar = await uploadImage(req.file);
        const newPost = await Post.create(judul, isi, gambar, parseInt(category_id));
        
        return res.status(201).json({ status: "success", message: "Resep berhasil dibuat", data: newPost });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { judul, isi, category_id } = req.body;
        const oldPost = await Post.getById(id);

        let gambar = oldPost ? oldPost.gambar : null;
        if (req.file) {
            gambar = await uploadImage(req.file);
            if (oldPost && oldPost.gambar) {
                minioClient.removeObject(bucketName, oldPost.gambar, (err) => {
                    if (err) console.error("Gagal hapus file lama:", err);
                });
            }
        }

        await Post.update(id, judul, isi, gambar, category_id);
        response.success(res, null, 'Post berhasil diupdate');
    } catch (error) {
        res.status(500).json({ message: "Gagal update post" });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.getById(id);
        if (post && post.gambar) {
            minioClient.removeObject(bucketName, post.gambar, (err) => {
                if (err) console.error("Gagal hapus file di MinIO:", err);
            });
        }
        await Post.remove(id);
        response.success(res, null, 'Post berhasil dihapus');
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus post" });
    }
};
// controllers/post_controller.js
exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;
        // Pastikan ID adalah angka
        const postId = parseInt(id); 

        if (isNaN(postId)) {
            return res.status(400).json({ message: "ID tidak valid" });
        }

        const query = `
            SELECT c.*, u.email as user_email 
            FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.post_id = $1 
            ORDER BY c.created_at DESC`;
            
        const result = await db.query(query, [postId]);
        
        res.status(200).json({ status: "success", data: result.rows });
    } catch (error) {
        console.error("❌ FINAL DEBUG ERROR:", error);
        res.status(500).json({ message: "Gagal mengambil ulasan", detail: error.message });
    }
};
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params; // ID dari URL /posts/:id/comments
    const { komentar, rating } = req.body;
    
    // Pastikan req.user ada (dari middleware auth)
    if (!req.user) {
        return res.status(401).json({ status: "error", message: "User tidak terautentikasi" });
    }
    const userId = req.user.id; 

    // Debug log untuk melihat apa yang dikirim
    console.log("Data diterima:", { id, userId, komentar, rating });

    const newComment = await Comment.create(id, userId, komentar, rating);

    res.status(201).json({ status: "success", message: "Berhasil", data: newComment });
  } catch (error) {
    // Ini akan menampilkan error asli dari database (misal: "violates foreign key constraint")
    console.error("DEBUG ERROR DETAIL:", error.message);
    res.status(500).json({ 
        status: "error", 
        message: "Gagal menyimpan komentar", 
        detail: error.message 
    });
  }
};

exports.postComment = [
    upload.single('image'), // Middleware untuk handle satu file bernama 'image'
    async (req, res) => {
        try {
            const { id } = req.params;
            const { komentar, rating } = req.body;
            const user_id = req.user.id; // Asumsi dari middleware auth
            const image_url = req.file ? req.file.path : null;

            const query = `
                INSERT INTO comments (post_id, user_id, komentar, rating, image_url)
                VALUES ($1, $2, $3, $4, $5) RETURNING *`;
                
            const result = await db.query(query, [id, user_id, komentar, rating, image_url]);
            res.status(201).json({ status: "success", data: result.rows[0] });
        } catch (error) {
            res.status(500).json({ message: "Gagal menyimpan komentar", detail: error.message });
        }
    }
];

// Tambahkan ini di controllers/post_controller.js
exports.getRatings = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT AVG(rating) as average_rating, COUNT(*) as total_ratings 
            FROM comments 
            WHERE post_id = $1`;
            
        const result = await db.query(query, [id]);
        
        res.status(200).json({ 
            status: "success", 
            data: result.rows[0] 
        });
    } catch (error) {
        console.error("DEBUG DATABASE ERROR:", error);
        res.status(500).json({ message: "Gagal mengambil rating", detail: error.message });
    }
};