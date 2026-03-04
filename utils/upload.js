const sharp = require('sharp');
const {minioClient} = require('../config/minio'); // Sesuaikan path config MinIO kamu

exports.uploadImage = async (file) => {
    // 1. Validasi apakah file dan buffer ada
    if (!file || !file.buffer) {
        throw new Error("File buffer tidak ditemukan. Pastikan Multer menggunakan memoryStorage.");
    }

    try {
        const fileName = `${Date.now()}-${file.originalname}`;
        
        // 2. Proses gambar dengan Sharp (Contoh: resize agar ringan)
        const optimizedBuffer = await sharp(file.buffer)
            .resize(800) // Ukuran maksimal lebar 800px
            .toFormat('jpeg')
            .toBuffer();

        // 3. Upload buffer yang sudah dioptimasi ke MinIO
        await minioClient.putObject(
    process.env.MINIO_BUCKET || 'posts', // Gunakan env agar konsisten dengan controller
    fileName,
    optimizedBuffer,
    optimizedBuffer.length,
    { 'Content-Type': 'image/jpeg' }
);

        return fileName; // Kembalikan nama file agar bisa disimpan di Database
    } catch (error) {
        console.error("❌ Detail Error Sharp:", error);
        throw new Error("Gagal memproses gambar: " + error.message);
    }
};