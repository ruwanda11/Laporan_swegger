const db = require('../config/db');

exports.getAll = () => {
    return db.query("SELECT * FROM categories ORDER BY id ASC");
};

exports.getById = (id) => {
    return db.query("SELECT * FROM categories WHERE id=$1",[id]);
};

exports.create = (nama) => {
    return db.query(
        "INSERT INTO categories(nama) VALUES($1)",
        [nama]
    );
};

exports.update = (id,nama) => {
    return db.query(
        "UPDATE categories SET nama=$1 WHERE id=$2",
        [nama,id]
    );
};

exports.delete = (id) => {
    return db.query(
        "DELETE FROM categories WHERE id=$1",
        [id]
    );
};