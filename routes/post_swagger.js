module.exports = {
    paths: {
        '/posts': {
            get: {
                tags: ['Posts'],
                summary: 'Ambil semua post dengan paginasi dan filter',
                security: [],
                parameters: [
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 }, description: 'Nomor halaman' },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 9 }, description: 'Jumlah data per halaman' },
                    { in: 'query', name: 'category', schema: { type: 'string' }, description: 'Filter berdasarkan nama kategori' }
                ],
                responses: {
                    200: {
                        description: 'Berhasil mengambil data',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
                                        meta: {
                                            type: 'object',
                                            properties: {
                                                totalItems: { type: 'integer' },
                                                currentPage: { type: 'integer' },
                                                limit: { type: 'integer' },
                                                totalPages: { type: 'integer' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
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
                                    gambar: { type: 'string', format: 'binary' },
                                    category_id: { type: 'integer', example: 1 }
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
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    judul: { type: 'string' },
                                    isi: { type: 'string' },
                                    gambar: { type: 'string', format: 'binary' },
                                    category_id: { type: 'integer' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Post diupdate' } }
            },
            delete: {
                tags: ['Posts'],
                summary: 'Hapus post',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'Post dihapus' } }
            }
        }
    },
    components: {
        schemas: {
            Post: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    judul: { type: 'string' },
                    isi: { type: 'string' },
                    gambar: { type: 'string' },
                    category: { type: 'string' },
                    category_id: { type: 'integer' }
                }
            }
        }
    }
};