const pool = require('../config/db');

exports.getAll = () => {
    return pool.query('SELECT * FROM posts ORDER BY id DESC');
};

exports.getById = (id) => {
    return pool.query('SELECT * FROM posts WHERE id = $1', [id]);
};

exports.create = (judul, isi, gambar) => {
    return pool.query(
        'INSERT INTO posts (judul, isi, gambar) VALUES ($1, $2, $3) RETURNING *',
        [judul, isi, gambar]
    );
};

exports.update = (id, judul, isi, gambar) => {
    if (gambar) {
        return pool.query(
            'UPDATE posts SET judul=$1, isi=$2, gambar=$3 WHERE id=$4',
            [judul, isi, gambar, id]
        );
    }
    return pool.query(
        'UPDATE posts SET judul=$1, isi=$2 WHERE id=$3',
        [judul, isi, id]
    );
};

exports.remove = (id) => {
    return pool.query('DELETE FROM posts WHERE id=$1', [id]);
};