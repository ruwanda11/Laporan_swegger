const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/post_controller');
const authenticateToken = require('../middlewares/auth');

const upload = multer({
    storage: multer.memoryStorage()
});

// PUBLIC
router.get('/posts', postController.getAll);
router.get('/posts/:id', postController.getById);

// PROTECTED
router.post('/posts', authenticateToken, upload.single('gambar'), postController.create);
router.put('/posts/:id', authenticateToken, upload.single('gambar'), postController.update);
router.delete('/posts/:id', authenticateToken, postController.remove);

module.exports = router;