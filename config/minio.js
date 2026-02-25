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
minioClient.bucketExists(bucketName, function(err, exists) {

    if (err) return console.log(err);

    if (!exists) {

        minioClient.makeBucket(bucketName, 'us-east-1', function(err) {

            if (err) return console.log(err);

            console.log("Bucket berhasil dibuat");

        });

    }

});

module.exports = {
    minioClient,
    bucketName
};