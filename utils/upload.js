const sharp = require('sharp');
const { minioClient, bucketName } = require('../config/minio');

exports.uploadImage = async (file) => {

    const fileName = Date.now() + '-' + file.originalname;

    // Resize gambar
    const buffer = await sharp(file.buffer)
        .resize(500)
        .jpeg({ quality: 80 })
        .toBuffer();

        const metaData = {
        'Content-Type': 'image/jpeg',
    };
    // Upload ke MinIO
    await minioClient.putObject(
        bucketName,
        fileName,
        buffer,
        buffer.length, // Tambahkan ukuran buffer
        metaData
    );

    return fileName;

};