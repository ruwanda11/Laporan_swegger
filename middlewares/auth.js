const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Akses ditolak, token tidak ditemukan'
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 'error',
                message: 'Token tidak valid atau sudah kadaluarsa'
            });
        }

        // data user dari token
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;