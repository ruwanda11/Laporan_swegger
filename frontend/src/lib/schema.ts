import { z } from "zod";

// Pastikan bagian ini ADA dan di-EXPORT
export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Schema resep yang lama tetap di sini
export const recipeSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  content: z.string().min(20, "Deskripsi resep minimal 20 karakter"),
  categoryId: z.string().min(1, "Pilih salah satu kategori"),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;