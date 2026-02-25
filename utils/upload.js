const sharp = require('sharp');
const { minioClient, bucketName } = require('../config/minio');

exports.uploadImage = async (file) => {

    const fileName = Date.now() + '-' + file.originalname;

    // Resize gambar
    const buffer = await sharp(file.buffer)
        .resize(500)
        .jpeg({ quality: 80 })
        .toBuffer();

    // Upload ke MinIO
    await minioClient.putObject(
        bucketName,
        fileName,
        buffer
    );

    return fileName;

};