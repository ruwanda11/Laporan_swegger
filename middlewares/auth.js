// middlewares/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Akses ditolak' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token tidak valid' });
        req.user = user; // Di sini user.role akan tersedia (admin atau user)
        next();
    });
};

// Middleware khusus untuk mengecek role admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Hanya Admin yang diizinkan!' });
    }
    next();
};

// middlewares/auth.js
exports.isAdmin = (req, res, next) => {
    // req.user berasal dari authenticateToken
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
        return res.status(403).json({ 
            status: 'error', 
            message: 'Akses ditolak: Hanya Admin yang bisa mengelola resep' 
        });
    }
};
module.exports = { authenticateToken, isAdmin };