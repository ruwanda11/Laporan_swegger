// config/minio.js
const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT) || 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const bucketName = 'posts';

const publicPolicy = {
    Version: "2012-10-17",
    Statement: [
        {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetBucketLocation", "s3:ListBucket"],
            Resource: [`arn:aws:s3:::${bucketName}`]
        },
        {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucketName}/*`]
        }
    ]
};

// Cek dan Inisialisasi Bucket
minioClient.bucketExists(bucketName, function(err, exists) {
    if (err) return console.log("❌ MinIO Error:", err);

    if (!exists) {
        minioClient.makeBucket(bucketName, 'us-east-1', function(err) {
            if (err) return console.log(err);
            console.log("✅ Bucket posts berhasil dibuat");
            
            minioClient.setBucketPolicy(bucketName, JSON.stringify(publicPolicy), function(err) {
                if (err) return console.log(err);
                console.log("✅ Bucket policy set to Public");
            });
        });
    } else {
        minioClient.setBucketPolicy(bucketName, JSON.stringify(publicPolicy), function(err) {
            if (err) return console.log("Gagal update policy:", err);
            console.log("✅ Bucket sudah ada & Status akses diperbarui ke PUBLIC");
        });
    }
});

// EKSPOR OBJEK
module.exports = { minioClient, bucketName };