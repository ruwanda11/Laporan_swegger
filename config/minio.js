const Minio = require('minio');

const minioClient = new Minio.Client({

    endPoint: 'localhost',
    port: 9000,
    useSSL: false,

    accessKey: 'minioadmin',
    secretKey: 'minioadmin'

});

const bucketName = 'posts';

// Cek bucket otomatis
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

// GANTI BAGIAN INI DI minio.js
minioClient.bucketExists(bucketName, function(err, exists) {
    if (err) return console.log(err);

    if (!exists) {
        // Jika bucket belum ada, buat baru lalu set jadi Public
        minioClient.makeBucket(bucketName, 'us-east-1', function(err) {
            if (err) return console.log(err);
            console.log("Bucket berhasil dibuat");
            
            minioClient.setBucketPolicy(bucketName, JSON.stringify(publicPolicy), function(err) {
                if (err) return console.log(err);
                console.log("✅ Bucket policy set to Public");
            });
        });
    } else {
        // PERBAIKAN: Jika bucket SUDAH ADA, tetap paksa set policy-nya ke Public
        minioClient.setBucketPolicy(bucketName, JSON.stringify(publicPolicy), function(err) {
            if (err) return console.log("Gagal update policy:", err);
            console.log("✅ Bucket sudah ada & Status akses diperbarui ke PUBLIC");
        });
    }
});

module.exports = { minioClient, bucketName };
