const pool = require('../config/db');
const db = require('../config/db');
exports.getAll = ()=>{

return db.query(
`SELECT posts.*,
categories.nama as category
FROM posts
LEFT JOIN categories
ON posts.category_id = categories.id
ORDER BY posts.id ASC`
);

};

exports.getById = (id) => {
    return pool.query('SELECT * FROM posts WHERE id = $1', [id]);
};

exports.create = (judul,isi,gambar,file,category_id)=>{
    return db.query(
        `INSERT INTO posts
        (judul,isi,gambar,file,category_id)
        VALUES($1,$2,$3,$4,$5)`,
        [judul,isi,gambar,file,category_id]
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