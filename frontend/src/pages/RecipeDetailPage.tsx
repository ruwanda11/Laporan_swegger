import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios"; // Pastikan path ini benar (../lib/axios)
import { Utensils, ArrowLeft, Loader2, Clock, User } from "lucide-react";

export default function RecipeDetailPage() {
  const { id } = useParams();

  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const res = await api.get(`/posts/${id}`);
      return res.data.data; // Mengambil data dari objek 'data' backend kamu
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-orange-500">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-medium">Menyiapkan bahan-bahan...</p>
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="text-center p-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Resep Hilang dari Dapur!</h2>
        <p className="text-gray-500 mb-6">Mungkin resep ini sudah dihapus atau ada kesalahan koneksi.</p>
        <Link to="/dashboard" className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Tombol Kembali */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-orange-100/50 overflow-hidden border border-orange-50">
          
          {/* Bagian Gambar Utama */}
          <div className="relative h-[400px] w-full bg-orange-100 flex items-center justify-center">
            {recipe.gambar ? (
              <img 
                src={`http://localhost:3000/post/${recipe.gambar}`} 
                alt={recipe.judul}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop"; }}
              />
            ) : (
              <div className="flex flex-col items-center text-orange-300">
                <Utensils className="w-24 h-24 mb-2" />
                <p>Belum ada foto masakan</p>
              </div>
            )}
            
            {/* Badge Kategori */}
            <div className="absolute bottom-6 left-6">
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {recipe.category?.nama || "Kuliner"}
              </span>
            </div>
          </div>

          {/* Konten Detail */}
          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              {recipe.judul}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mb-10 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="p-2 bg-gray-100 rounded-full"><User className="w-4 h-4" /></div>
                <span className="font-medium text-sm">Oleh: {recipe.user?.username || "Koki Rahasia"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="p-2 bg-gray-100 rounded-full"><Clock className="w-4 h-4" /></div>
                <span className="font-medium text-sm">Baru saja dibagikan</span>
              </div>
            </div>

            <div className="prose prose-orange max-w-none">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ChefHat className="text-orange-500" /> Cara Memasak
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {recipe.isi}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { ChefHat } from "lucide-react"; // Tambahkan ini di deretan import lucide