const db = require('../config/db');

const User = {
    // Fungsi untuk mengambil semua user
    getAllUsers: () => {
        return db.query('SELECT id, email, created_at FROM users');
    },

    // Fungsi cari berdasarkan email
    findByEmail: (email) => {
        return db.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );
    },

    // Fungsi membuat user baru
    createUser: (email, password) => {
        return db.query(
            "INSERT INTO users(email,password) VALUES($1,$2)",
            [email, password]
        );
    },

    // Fungsi simpan refresh token
    saveRefreshToken: (token, id) => {
        return db.query(
            "UPDATE users SET refresh_token=$1 WHERE id=$2",
            [token, id]
        );
    },

    // Fungsi cari berdasarkan refresh token
    findByRefreshToken: (token) => {
        return db.query(
            "SELECT * FROM users WHERE refresh_token=$1",
            [token]
        );
    }
};

module.exports = User; // Cukup satu ekspor di paling bawah