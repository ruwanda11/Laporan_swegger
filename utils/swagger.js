const userSwagger = require('../routes/user_swagger');
const postSwagger = require('../routes/post_swagger');
const categorySwagger = require('../routes/category_swagger');

module.exports = {
    openapi: '3.0.0',
    info: {
        title: 'API PKL',
        version: '1.0.0'
    },
    servers: [{ url: 'http://localhost:3000/api' }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        // --- SEKARANG SCHEMAS SEJAJAR DENGAN SECURITYSCHEMES ---
        schemas: {
            Post: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    judul: { type: 'string' },
                    isi: { type: 'string' },
                    gambar: { type: 'string' },
                    category: { type: 'string' }
                }
            },
            Category: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    nama: { type: 'string' }
                }
            }
        }
    },
    security: [{ bearerAuth: [] }],
    paths: {
        ...userSwagger.paths,
        ...postSwagger.paths,
        ...categorySwagger.paths 
    }
};