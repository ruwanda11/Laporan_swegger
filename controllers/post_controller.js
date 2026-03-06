const Post = require('../models/post');
const response = require('../utils/response');
const { uploadImage } = require('../utils/upload');
const { minioClient, bucketName } = require('../config/minio');

// Alamat dasar MinIO - Memastikan format URL benar tanpa double slash di akhir
const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
const port = process.env.MINIO_PORT || '9000';
const bucket = process.env.MINIO_BUCKET || 'posts';

// Gabungkan menjadi URL yang utuh
const MINIO_URL = `http://${endpoint}:${port}/${bucket}`;
exports.getAll = async (req, res) => {
    try {
        
        const data = await Post.getAll();
        const postsWithUrl = data.map(item => ({
            ...item,
            // Jika gambar ada, buatkan URL lengkap agar frontend tinggal pakai
            gambar: item.gambar ? `${MINIO_URL}/${item.gambar}` : null
        }));

        response.success(res, postsWithUrl);
    } catch (error) {
        console.error("❌ Error Get All Posts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await Post.getById(req.params.id);
        
        if (data) {
            // Transformasi gambar ke URL lengkap untuk data tunggal
            data.gambar = data.gambar ? `${MINIO_URL}/${data.gambar}` : null;
        }
        
        response.success(res, data);
    } catch (error) {
        console.error("❌ Error Get Post By ID:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.create = async (req, res) => {
     console.log("BODY:", req.body);   // ✅ BENAR
    console.log("FILE:", req.file);   // ✅ BENAR

    try {
        const { judul, isi, category_id } = req.body;
        let gambar = null;

        // 1️⃣ Validasi Field Wajib
        if (!judul || !isi || !category_id) {
            return res.status(400).json({
                status: "error",
                message: "Judul, isi, dan kategori wajib diisi"
            });
        }

        // 2️⃣ Validasi Gambar (Jika Upload Wajib)
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "Gambar tidak ditemukan. Pastikan file dikirim dengan field yang benar."
            });
        }

        // 3️⃣ Validasi Tipe File
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                status: "error",
                message: "Format gambar tidak didukung. Gunakan JPG, PNG, atau WEBP."
            });
        }

        // 4️⃣ Validasi Ukuran (contoh max 2MB)
        const maxSize = 2 * 1024 * 1024;
        if (req.file.size > maxSize) {
            return res.status(400).json({
                status: "error",
                message: "Ukuran gambar terlalu besar. Maksimal 2MB."
            });
        }

        // 5️⃣ Upload ke MinIO
        try {
            gambar = await uploadImage(req.file);
        } catch (uploadError) {
            console.error("❌ Error Upload ke MinIO:", uploadError);
            return res.status(500).json({
                status: "error",
                message: "Gagal mengupload gambar ke server"
            });
        }

        // 6️⃣ Simpan ke Database
        const newPost = await Post.create(
            judul,
            isi,
            gambar,
            parseInt(category_id)
        );

        return res.status(201).json({
            status: "success",
            message: "Resep berhasil dibuat",
            data: newPost
        });

    } catch (error) {
        console.error("❌ Error Create Post:", error);
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { judul, isi, category_id } = req.body;

        let gambar = null;
        const oldPost = await Post.getById(id);

        if (req.file) {
            // Jika ada file baru, upload dan gunakan nama file baru
            gambar = await uploadImage(req.file);
            
            // Opsional: Hapus gambar lama di MinIO jika diperlukan agar tidak penuh
            if (oldPost && oldPost.gambar) {
                minioClient.removeObject(bucketName, oldPost.gambar, (err) => {
                    if (err) console.error("Gagal hapus file lama di MinIO:", err);
                });
            }
        } else {
            // Jika tidak upload baru, tetap gunakan nama gambar lama (jangan diubah ke URL lengkap di DB)
            gambar = oldPost ? oldPost.gambar : null;
        }

        await Post.update(id, judul, isi, gambar, category_id);
        response.success(res, null, 'Post berhasil diupdate');
    } catch (error) {
        console.error("❌ Error Update Post:", error);
        res.status(500).json({ message: "Gagal update post" });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.getById(id);

        if (post && post.gambar) {
            // Hapus file fisik di MinIO berdasarkan nama file yang tersimpan di DB
            minioClient.removeObject(bucketName, post.gambar, (err) => {
                if (err) console.error("Gagal hapus file di MinIO:", err);
            });
        }

        await Post.remove(id);
        response.success(res, null, 'Post berhasil dihapus');
    } catch (error) {
        console.error("❌ Error Remove Post:", error);
        res.status(500).json({ message: "Gagal menghapus post" });
    }
};