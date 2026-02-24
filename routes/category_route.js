const express = require('express');
const router = express.Router();

const category = require('../controllers/category_controller');

const { body } = require('express-validator');

router.get('/',category.getAll);

router.post('/',
[
body('nama').notEmpty().withMessage('Nama category wajib diisi')
],
category.create);

router.put('/:id',category.update);

router.delete('/:id',category.delete);

module.exports = router;