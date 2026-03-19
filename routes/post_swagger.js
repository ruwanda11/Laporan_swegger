module.exports = {
  paths: {
    // --- POSTS ---
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
        responses: { 200: { description: 'Berhasil mengambil data' } }
      },
      post: {
        tags: ['Posts'],
        summary: 'Tambah post',
        security: [{ bearerAuth: [] }],
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
        security: [{ bearerAuth: [] }],
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
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Post dihapus' } }
      }
    },
    // --- COMMENTS ---
    '/posts/{id}/comments': {
      get: {
        tags: ['Comments'],
        summary: 'Dapatkan daftar ulasan untuk resep tertentu',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Berhasil mengambil ulasan' } }
      },
      post: {
        tags: ['Comments'],
        summary: 'Kirim ulasan dan rating untuk resep',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  komentar: { type: 'string' },
                  rating: { type: 'integer', minimum: 1, maximum: 5 }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Komentar berhasil dibuat' } }
      }
    },
    '/comments/{commentId}': {
      delete: {
        tags: ['Comments'],
        summary: 'Hapus ulasan/komentar tertentu',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'commentId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Komentar berhasil dihapus' } }
      }
    },
    // --- RATINGS ---
    '/posts/{id}/ratings': {
      get: {
        tags: ['Ratings'],
        summary: 'Dapatkan daftar rating untuk resep tertentu',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Berhasil mengambil rating' } }
      }
    },
    '/ratings/{ratingId}': {
      delete: {
        tags: ['Ratings'],
        summary: 'Hapus rating tertentu',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'ratingId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Rating berhasil dihapus' } }
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
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};