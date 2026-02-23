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
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

app.use('/uploads', express.static('uploads'));

// Routes
app.use('/', userRoutes);
app.use('/', postRoutes);

// Swagger (kalau mau dipisah nanti bisa)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📘 Swagger: http://localhost:${PORT}/api-docs`);
});