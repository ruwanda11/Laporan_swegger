require('dotenv').config();

const express = require('express');
const cors = require('cors'); // <--- 1. Tambahkan ini
const swaggerUi = require('swagger-ui-express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express(); 
const PORT = process.env.PORT || 3000;



// MIDDLEWARE
app.use(cors()); // <--- 2. Tambahkan ini di atas routes
app.use(express.json());



// ROUTES

const userRoutes = require('./routes/user_route');
const postRoutes = require('./routes/post_route');
const categoryRoute = require('./routes/category_route');

// Ubah bagian ini di index.js backend
app.use('/api', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoute);
// SWAGGER

const swaggerDocument = require('./utils/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// UPLOAD CONFIG

app.use('/upload', express.static(path.join(__dirname,'uploads')));

app.listen(PORT, () => {

 console.log("🚀 Server:", `http://localhost:${PORT}`);
 console.log("📘 Swagger:", `http://localhost:${PORT}/api-docs`);

});