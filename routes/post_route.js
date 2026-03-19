const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/post_controller');
const { verifyToken } = require('../middlewares/auth'); // Pastikan ada auth
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
console.log("DEBUG controller:", postController.getComments); // Ganti sesuai nama fungsi di baris 24

router.get('/:id/comments', postController.getComments);
router.post('/:id/comments', upload.single('image'), postController.postComment);
router.get('/:id/comments', (req, res, next) => {
    console.log("Request masuk ke rute comments untuk ID:", req.params.id);
    next();
}, postController.getComments);

router.get('/:id/ratings', postController.getRatings);
module.exports = router;