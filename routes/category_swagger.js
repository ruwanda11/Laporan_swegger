module.exports = {
 paths: {

  "/categories": {
   get: {
    summary: "Ambil semua category",
    tags: ["Categories"],
    security: [{ bearerAuth: [] }],
    responses: {
     200: {
      description: "List category berhasil"
     }
    }
   },

   post: {
    summary: "Tambah category",
    tags: ["Categories"],
    security: [{ bearerAuth: [] }],
    requestBody: {
     required: true,
     content: {
      "application/json": {
       schema: {
        type: "object",
        properties: {
         nama: {
          type: "string",
          example: "Teknologi"
         }
        }
       }
      }
     }
    },
    responses: {
     200: {
      description: "Category berhasil ditambahkan"
     }
    }
   }
  },

  "/categories/{id}": {

   put: {
    summary: "Update category",
    tags: ["Categories"],
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      nam: "id",
      in: "path",
      required: true,
      schema: {
       type: "integer"
      }
     }
    ],
    requestBody: {
     required: true,
     content: {
      "application/json": {
       schema: {
        type: "object",
        properties: {
         name: {
          type: "string",
          example: "Olahraga"
         }
        }
       }
      }
     }
    },
    responses: {
     200: {
      description: "Category berhasil diupdate"
     }
    }
   },

   delete: {
    summary: "Hapus category",
    tags: ["Categories"],
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: {
       type: "integer"
      }
     }
    ],
    responses: {
     200: {
      description: "Category berhasil dihapus"
     }
    }
   }

  }

 }
};