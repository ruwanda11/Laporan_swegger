const express = require('express');
const router = express.Router();
const controller = require('../controllers/user_controller');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh-token', controller.refreshToken);

module.exports = router;