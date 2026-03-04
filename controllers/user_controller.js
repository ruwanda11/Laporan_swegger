const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const response = require('../utils/response');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// controllers/auth_controller.js

exports.register = async (req, res) => {
    try {
        // 1. Ambil data dari body (abaikan jika user mengirim 'role')
        const { username, email, password } = req.body;

        // 2. Validasi sederhana
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        // 3. SIMPAN KE DATABASE
        // Masukkan string 'user' secara manual sebagai parameter terakhir.
        // Ini memastikan siapapun yang daftar lewat halaman "Daftar Akun Baru", 
        // role-nya akan terkunci sebagai 'user'.
        const newUser = await User.create(
            username, 
            email, 
            password, 
            'user' // <--- DI SINI KUNCINYA
        );

        res.status(201).json({
            status: 'success',
            message: 'Pendaftaran berhasil sebagai User',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (user.rows.length === 0)
        return response.error(res, "User tidak ditemukan", 404);

    const valid = await argon2.verify(user.rows[0].password, password);
    if (!valid)
        return response.error(res, "Password salah", 401);

    const accessToken = jwt.sign(
        { id: user.rows[0].id },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
        { id: user.rows[0].id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    await User.saveRefreshToken(refreshToken, user.rows[0].id);

    response.success(res, { 
    accessToken, 
    refreshToken,
    user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role // BARIS INI WAJIB ADA AGAR TOMBOL MUNCUL
    }
}, "Login berhasil");
};

exports.refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token)
        return response.error(res, "Token diperlukan", 401);

    const user = await User.findByRefreshToken(token);
    if (user.rows.length === 0)
        return response.error(res, "Token tidak valid", 403);

    jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err)
            return response.error(res, "Token expired", 403);

        const accessToken = jwt.sign(
            { id: decoded.id },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        response.success(res, { accessToken }, "Token diperbarui");
    });
};
// Tambahkan ini di paling bawah file user_controller.js
exports.getAllUsers = async (req, res) => {
    try {
        // Asumsi model User punya fungsi getAllUsers
        const users = await User.getAllUsers(); 
        
        // Menggunakan format response.success yang ada di file kamu
        response.success(res, users.rows, "Data user berhasil diambil");
    } catch (err) {
        console.error("Error Detail:", err);
        response.error(res, "Gagal mengambil data user dari database");
    }
};