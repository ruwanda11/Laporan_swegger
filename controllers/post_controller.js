const Post = require('../models/post');
const response = require('../utils/response');
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res) => {
    const data = await Post.getAll();
    response.success(res, data.rows);
};

exports.getById = async (req, res) => {
    const data = await Post.getById(req.params.id);
    response.success(res, data.rows[0]);
};

exports.create = async (req, res) => {
    const { judul, isi } = req.body;
    const gambar = req.file ? req.file.filename : null;

    const data = await Post.create(judul, isi, gambar);
    response.success(res, data.rows[0], 'Post berhasil dibuat');
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { judul, isi } = req.body;
    const gambar = req.file ? req.file.filename : null;

    await Post.update(id, judul, isi, gambar,);
    response.success(res, null, 'Post berhasil diupdate');
};

exports.remove = async (req, res) => {
    const { id } = req.params;

    const post = await Post.getById(id);
    if (post.rows[0]?.gambar) {
        const filePath = path.join(__dirname, '../uploads', post.rows[0].gambar);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Post.remove(id);
    response.success(res, null, 'Post berhasil dihapus');
};