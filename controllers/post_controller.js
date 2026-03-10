const Post = require('../models/post');
const response = require('../utils/response');
const { uploadImage } = require('../utils/upload');
const { minioClient, bucketName } = require('../config/minio');

const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
const port = process.env.MINIO_PORT || '9000';
const bucket = process.env.MINIO_BUCKET || 'posts';
const MINIO_URL = `http://${endpoint}:${port}/${bucket}`;

// --- PERBAIKAN: Fungsi getAll menggunakan getAllPaginated dari model ---
// controllers/post_controller.js

exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const offset = (page - 1) * limit;
        const category = req.query.category || "";

        const result = await Post.getAllPaginated(limit, offset, category);
        
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