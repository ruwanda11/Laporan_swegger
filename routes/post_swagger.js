module.exports = {
    paths: {
        '/posts': {
            get: {
                tags: ['Posts'],
                summary: 'Ambil semua post',
                security: [],
                responses: { 200: { description: 'Berhasil' } }
            },
            post: {
                tags: ['Posts'],
                summary: 'Tambah post',
                requestBody: {
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    judul: { type: 'string' },
                                    isi: { type: 'string' },
                                    gambar: { type: 'string', format: 'binary' }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Post dibuat' } }
            }
        },

        '/posts/{id}': {
            put: {
                tags: ['Posts'],
                summary: 'Update post',
                parameters: [{ name: 'id', in: 'path', required: true }],
                responses: { 200: { description: 'Post diupdate' } }
            },
            delete: {
                tags: ['Posts'],
                summary: 'Hapus post',
                parameters: [{ name: 'id', in: 'path', required: true }],
                responses: { 200: { description: 'Post dihapus' } }
            }
        }
    }
};