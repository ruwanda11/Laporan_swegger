const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/post_controller');

// Import middleware dengan destructuring { }
const { authenticateToken } = require('../middlewares/auth');

// Gunakan memoryStorage agar file tidak parkir di folder 'uploads' tapi langsung ke RAM
// Ini syarat wajib agar fungsi upload ke MinIO di controller tidak menerima 'null'
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- DAFTAR ROUTE ---

// Akses Publik
router.get('/', postController.getAll);
router.get('/:id', postController.getById);

// Akses Terproteksi (Butuh Login & Upload Gambar)
router.post('/', authenticateToken, upload.single('gambar'), postController.create);
router.put('/:id', authenticateToken, upload.single('gambar'), postController.update);
router.delete('/:id', authenticateToken, postController.remove);

module.exports = router;