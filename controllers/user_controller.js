const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const response = require('../utils/response');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hash = await argon2.hash(password);
        await User.createUser(email, hash);
        response.success(res, null, "User berhasil dibuat");
    } catch (err) {
        response.error(res, "Email sudah terdaftar");
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
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: user.rows[0].id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    await User.saveRefreshToken(refreshToken, user.rows[0].id);

    response.success(res, { accessToken, refreshToken }, "Login berhasil");
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