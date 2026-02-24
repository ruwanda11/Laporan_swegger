require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express(); 
const PORT = process.env.PORT || 3000;



// MIDDLEWARE

app.use(express.json());



// ROUTES

const userRoutes = require('./routes/user_route');
const postRoutes = require('./routes/post_route');
const categoryRoute = require('./routes/category_route');

app.use('/', userRoutes);
app.use('/', postRoutes);
app.use('/categories', categoryRoute);

// SWAGGER

const swaggerDocument = require('./utils/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// UPLOAD CONFIG


if (!fs.existsSync('public/images')) {
    fs.mkdirSync('public/images', { recursive: true });
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

app.use('/images', express.static('public/images'));

app.listen(PORT, () => {

 console.log("🚀 Server:", `http://localhost:${PORT}`);
 console.log("📘 Swagger:", `http://localhost:${PORT}/api-docs`);

});