const Post = require('../models/post');
const response = require('../utils/response');
const { uploadImage } = require('../utils/upload');
const { minioClient, bucketName } = require('../config/minio'); // Pastikan path ke minio.js benar

// Alamat dasar MinIO
const MINIO_URL = `${process.env.MINIO_ENDPOINT || 'http://localhost:9000'}/${process.env.MINIO_BUCKET || 'posts'}`;

exports.getAll = async (req, res) => {
    try {
        const data = await Post.getAll();
        
        // Transformasi: Gabungkan alamat MinIO dengan nama file
        const postsWithUrl = data.map(item => ({
            ...item,
            gambar: item.gambar ? `${MINIO_URL}/${item.gambar}` : null
        }));

        response.success(res, postsWithUrl);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await Post.getById(req.params.id);
        
        if (data) {
            data.gambar = data.gambar ? `${MINIO_URL}/${data.gambar}` : null;
        }
        
        response.success(res, data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.create = async (req, res) => {
    try {
        const { judul, isi, category_id } = req.body;
        let gambar = null;

        if (req.file) {
            gambar = await uploadImage(req.file);
        }

        // PERBAIKAN: Sesuaikan dengan parameter di model post.js (4 parameter)
        await Post.create(judul, isi, gambar, category_id);

        res.json({ message: "Post berhasil dibuat" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Gagal membuat post" });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { judul, isi, category_id } = req.body;

        let gambar = null;
        if (req.file) {
            gambar = await uploadImage(req.file);
        } else {
            // Ambil nama gambar lama jika tidak upload gambar baru
            const oldPost = await Post.getById(id);
            gambar = oldPost ? oldPost.gambar : null;
        }

        await Post.update(id, judul, isi, gambar, category_id);
        response.success(res, null, 'Post berhasil diupdate');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Gagal update post" });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.getById(id);

        if (post && post.gambar) {
            // Hapus file fisik di MinIO
            minioClient.removeObject(bucketName, post.gambar, (err) => {
                if (err) console.log("Gagal hapus file di MinIO:", err);
            });
        }

        await Post.remove(id);
        response.success(res, null, 'Post berhasil dihapus');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Gagal menghapus post" });
    }
};