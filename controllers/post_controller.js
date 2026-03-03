const Post = require('../models/post');
const response = require('../utils/response');
const { uploadImage } = require('../utils/upload');
const { minioClient, bucketName } = require('../config/minio');

// Alamat dasar MinIO - Memastikan format URL benar tanpa double slash di akhir
const MINIO_URL = `${process.env.MINIO_ENDPOINT || 'http://localhost:9000'}/${process.env.MINIO_BUCKET || 'posts'}`;

exports.getAll = async (req, res) => {
    try {
        const data = await Post.getAll();
        
        // Transformasi: Gabungkan alamat MinIO dengan nama file untuk setiap item
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
    try {
        const { judul, isi, category_id } = req.body;
        let gambar = null;

        // 1. Validasi Input
        if (!judul || !isi || !category_id) {
            return res.status(400).json({ status: 'error', message: 'Semua field harus diisi' });
        }

        // 2. Proses Upload Gambar ke MinIO
        if (req.file) {
            // uploadImage harus mengembalikan nama file yang disimpan di MinIO
            gambar = await uploadImage(req.file); 
        }

        // 3. Simpan ke Database
        await Post.create(judul, isi, gambar, parseInt(category_id), req.user.id);

        return res.status(201).json({
            status: 'success',
            message: 'Resep berhasil dibuat',
            data: { 
                judul, 
                gambar: gambar ? `${MINIO_URL}/${gambar}` : null 
            }
        });
    } catch (error) {
        console.error("❌ Error Create Post:", error);
        return res.status(500).json({
            status: 'error',
            message: 'Gagal membuat post',
            error: error.message 
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