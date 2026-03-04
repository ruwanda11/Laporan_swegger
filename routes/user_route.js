// routes/user_route.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/user_controller');

// rute ini akan menjadi: /api/register
router.post('/register', controller.register);

// rute ini akan menjadi: /api/login
router.post('/login', controller.login);

// rute ini akan menjadi: /api/refresh-token
router.post('/refresh-token', controller.refreshToken);

// rute ini akan menjadi: /api/users (Biasanya untuk admin)
router.get('/', controller.getAllUsers); 

// Pastikan ada rute /users di sini

module.exports = router;