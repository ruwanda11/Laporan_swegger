require('dotenv').config();

const express = require('express');
const cors = require('cors'); 
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express(); 
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(cors()); 
app.use(express.json());
// Menambahkan parser untuk form-data agar handling upload lebih lancar
app.use(express.urlencoded({ extended: true }));

// ROUTES
const userRoutes = require('./routes/user_route');
const postRoutes = require('./routes/post_route');
const categoryRoute = require('./routes/category_route');

app.use('/api', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoute);

// SWAGGER
const swaggerDocument = require('./utils/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// UPLOAD CONFIG (STATIC FOLDER)
// Melayani file dari folder 'uploads' agar bisa diakses via http://localhost:3000/upload/filename.jpg
app.use('/upload', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log("🚀 Server:", `http://localhost:${PORT}`);
    console.log("📘 Swagger:", `http://localhost:${PORT}/api-docs`);
    
    const uploadPath = path.resolve(__dirname, 'uploads');
    
    // Memastikan folder uploads tersedia saat server dijalankan
    if (!fs.existsSync(uploadPath)) {
        console.log("⚠️ PERINGATAN: Folder 'uploads' tidak ditemukan. Membuat folder baru...");
        fs.mkdirSync(uploadPath);
    } else {
        console.log("✅ Folder 'uploads' terdeteksi di:", uploadPath);
    }
});