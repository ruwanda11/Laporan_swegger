import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recipeSchema, type RecipeFormValues } from "../../lib/schema";
import api from "../../lib/axios"; 
import { Utensils, ChefHat, PlusCircle, Loader2, Image as ImageIcon } from "lucide-react";

export function AddRecipeForm() {
  const queryClient = useQueryClient();

  // 1. Ambil data kategori untuk Dropdown
  const { data: categories, isLoading: isLoadingCats } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // Pastikan endpoint ini sesuai dengan yang ada di backend
      const res = await api.get("/categories");
      // Mengambil array data (sesuaikan jika return backend-nya res.data.data)
      return res.data;
    },
  });

  // 2. Setup Mutation dengan FormData
  const mutation = useMutation({
    mutationFn: (data: RecipeFormValues & { image?: FileList }) => {
      const formData = new FormData();
      
      // Sinkronisasi field dengan Backend (judul, isi, category_id)
      formData.append("judul", data.title);   
      formData.append("isi", data.content);   
      
      // KONVERSI: Pastikan category_id dikirim sebagai string angka agar 
      // bisa diparsing backend menjadi Integer
      formData.append("category_id", String(data.categoryId)); 
      
      // Penanganan File Gambar
      if (data.image && data.image[0]) {
        formData.append("gambar", data.image[0]); 
      }

      return api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      alert("Resep berhasil dibagikan! 🍳");
      reset(); 
      // Refresh daftar resep agar kategori baru langsung muncul
      queryClient.invalidateQueries({ queryKey: ["recipes"] }); 
    },
    onError: (error: any) => {
      alert("Gagal: " + (error.response?.data?.message || "Terjadi kesalahan"));
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecipeFormValues & { image?: FileList }>({
    resolver: zodResolver(recipeSchema),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="max-w-md mx-auto space-y-5 p-8 bg-white rounded-[2.5rem] shadow-xl shadow-orange-100/50 border border-orange-50"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-orange-50 rounded-2xl">
          <ChefHat className="w-6 h-6 text-orange-600" />
        </div>
        <div>
           <h2 className="text-2xl font-black text-gray-800 tracking-tight">Bagikan Resep</h2>
           <p className="text-xs text-gray-400 font-medium italic">Biarkan dunia mencicipi karyamu</p>
        </div>
      </div>

      <hr className="border-orange-50/50" />

      {/* Nama Masakan */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
          <Utensils className="w-4 h-4 text-orange-500" /> Nama Masakan
        </label>
        <input
          {...register("title")}
          className={`w-full border-2 p-3.5 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all duration-300 ${
            errors.title ? "border-red-500" : "border-gray-50 bg-gray-50/50 focus:bg-white"
          }`}
          placeholder="Contoh: Soto Ayam Lamongan"
        />
        {errors.title && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.title.message}</p>}
      </div>

      {/* Input Gambar Custom Style */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
          <ImageIcon className="w-4 h-4 text-orange-500" /> Foto Masakan
        </label>
        <div className="relative group">
           <input
             type="file"
             accept="image/*"
             {...register("image")}
             className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-2xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-orange-600 file:text-white hover:file:bg-orange-700 transition-all cursor-pointer bg-orange-50/30 rounded-2xl p-2 border-2 border-dashed border-orange-100"
           />
        </div>
      </div>

      {/* Kategori */}
      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-gray-700 ml-1">Pilih Kategori</label>
        <select
          {...register("categoryId")}
          className={`w-full border-2 p-3.5 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none bg-gray-50/50 transition-all ${
            errors.categoryId ? "border-red-500" : "border-gray-50"
          }`}
        >
          <option value="">{isLoadingCats ? "Memuat..." : "Pilih Kategori"}</option>
          {categories?.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {/* Gunakan cat.nama atau cat.nama_kategori sesuai field DB kamu */}
              {cat.nama_kategori || cat.nama}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Cara Memasak */}
      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-gray-700 ml-1">Bahan & Langkah</label>
        <textarea
          {...register("content")}
          className={`w-full border-2 p-4 rounded-2xl h-32 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none resize-none transition-all ${
            errors.content ? "border-red-500" : "border-gray-50 bg-gray-50/50 focus:bg-white"
          }`}
          placeholder="Tulis rahasia masakanmu di sini..."
        />
        {errors.content && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.content.message}</p>}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-orange-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 shadow-xl shadow-orange-200"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Mengirim...
          </>
        ) : (
          <>
            <PlusCircle className="w-5 h-5" /> Terbitkan Resep
          </>
        )}
      </button>
    </form>
  );
}