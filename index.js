require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const userRoutes = require('./routes/user_route');
const swaggerDocument = require('./utils/swagger');
const postRoutes = require('./routes/post_route');


const app = express();
const PORT = 3000;

app.use(express.json());

// Upload folder
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
  cb(null, 'public/images');
 },
 filename: function (req, file, cb) {
  cb(null, Date.now() + path.extname(file.originalname));
 }
});

const upload = multer({ storage: storage });

module.exports = upload;

app.use('/images', express.static('public/images'));

// Routes
app.use('/', userRoutes);
app.use('/', postRoutes);

// Swagger (kalau mau dipisah nanti bisa)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(` Server: http://localhost:${PORT}`);
    console.log(` Swagger: http://localhost:${PORT}/api-docs`);
});