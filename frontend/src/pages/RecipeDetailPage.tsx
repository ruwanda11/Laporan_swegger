import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Tambahkan useQueryClient
import api from "../lib/axios"; 
import { Utensils, ArrowLeft, Loader2, Clock, User, ChefHat, Star,Image as ImageIcon } from "lucide-react";
import { formatRelatif } from "@/lib/utils";
import { useState, useRef } from "react"; 

export default function RecipeDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient(); // Tambahkan ini untuk refresh data
  const [komentar, setKomentar] = useState("");
  const [rating, setRating] = useState(5);
  const [file, setFile] = useState<File | null>(null); // State untuk file gambar
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref untuk reset input file

  // 1. Query untuk Data Resep
  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const res = await api.get(`/posts/${id}`);
      return res.data.data; 
    },
  });

  // 2. Query TAMBAHAN untuk Data Komentar
  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const res = await api.get(`/posts/${id}/comments`); // Mengambil dari endpoint baru
      return res.data.data; 
    },
  });

  const submitKomentar = async () => {
    if (!komentar.trim()) return alert("Tulis komentar terlebih dahulu!");
    try {
      // Menggunakan FormData agar bisa kirim file
      const formData = new FormData();
      formData.append("komentar", komentar);
      formData.append("rating", rating.toString());
      if (file) formData.append("image", file);
      await api.post(`/posts/${id}/comments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
       // Sesuaikan endpoint
      alert("Terima kasih atas ulasanmu!");
      setKomentar(""); 
      setRating(5);
      refetchComments(); 
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
      // Refresh daftar komentar saja
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      refetchComments(); 
    } catch (error) {
      console.error("Error submit ulasan:", error);
      alert("Gagal mengirim ulasan. Pastikan Anda sudah login.");
    }
  };
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
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-orange-100/50 overflow-hidden border border-orange-50">
          
          <div className="relative h-[400px] w-full bg-orange-100 flex items-center justify-center">
            {recipe.gambar ? (
              <img 
                src={recipe.gambar} 
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
            
            <div className="absolute bottom-6 left-6">
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {recipe.category?.nama || "Kuliner"}
              </span>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              {recipe.judul}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mb-10 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="p-2 bg-gray-100 rounded-full"><User className="w-4 h-4" /></div>
                <span className="font-medium text-sm">Oleh: {recipe.user?.username || "Rahasia"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="p-2 bg-gray-100 rounded-full"><Clock className="w-4 h-4" /></div>
                <span>{formatRelatif(recipe.created_at)}</span>
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

            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Beri Rating & Komentar</h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)} 
                    className={`text-2xl transition-transform active:scale-125 ${rating >= star ? "text-orange-500" : "text-gray-300"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 min-h-[120px] transition-all"
                placeholder="Bagaimana menurutmu tentang resep ini? Berikan ulasan jujurmu..."
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
              />
              <div className="mt-3">
  <label className="flex items-center gap-2 cursor-pointer w-fit group">
    <div className="p-2 bg-orange-50 text-orange-500 rounded-lg group-hover:bg-orange-100 transition-colors">
      <ImageIcon className="w-5 h-5" />
    </div>
    <span className="text-sm font-medium text-gray-500 group-hover:text-orange-600 transition-colors">
      {file ? file.name : "Tambah foto masakan (Opsional)"}
    </span>
    <input 
      type="file" 
      ref={fileInputRef} 
      className="hidden" 
      accept="image/*" 
      onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
    />
  </label>
</div>
{/* ---------------------------------- */}

{/* Tombol Kirim yang sudah ada */}
<div className="mt-4">  </div>
              <button 
                onClick={submitKomentar}
                className="mt-4 bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 hover:shadow-lg transition-all active:scale-95"
              >
                Kirim Ulasan
              </button>
            </div>

          {/* Judul Bagian Ulasan */}
<div className="mt-12">
  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
    <Star className="text-orange-500 fill-orange-500" /> Ulasan Masuk
  </h3>

  {/* Daftar Kartu Ulasan */}
  <div className="space-y-4">
    {Array.isArray(comments) && comments.length > 0 ? (
      comments.map((c: any) => (
        <div key={c.id} className="bg-gray-50 p-6 rounded-[1.5rem] border border-gray-100 transition-hover hover:shadow-md">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-bold text-gray-900">{c.username || "Anonim"}</p>
              <div className="flex text-orange-400 text-sm">
                {/* Menangani rating jika nilainya 0 atau null agar tidak error */}
                {"★".repeat(c.rating || 0)}{"☆".repeat(5 - (c.rating || 0))}
              </div>
            </div>
            
            <span className="text-xs text-gray-400">
              {c.created_at ? formatRelatif(c.created_at) : "Baru saja"}
            </span>
          </div>
          <p className="text-gray-600 italic">"{c.komentar}"</p>
          {/* --- TAMBAHKAN KODE INI DI SINI --- */}
        {c.image_url && (
          <div className="mt-3">
            <img 
              src={`http://localhost:3000/${c.image_url}`} 
              alt="Foto masakan pengguna" 
              className="w-full max-w-[200px] h-32 object-cover rounded-xl border border-gray-100 shadow-sm"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
        )}
        </div>
      ))
    ) : (
      <div className="text-center py-10 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
        <p className="text-gray-400 font-medium italic">Belum ada ulasan. Jadi yang pertama mencoba!</p>
      </div>
    )}
  </div>
</div>
</div>
        </div>
      </div>
    </div>
  );
}