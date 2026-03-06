import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // 1. Ambil data lama resep
  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const res = await api.get(`/posts/${id}`);
      return res.data.data;
    },
  });

  // 2. Set data ke state saat data berhasil dimuat
  useEffect(() => {
    if (recipe) {
      setJudul(recipe.judul);
      setIsi(recipe.isi);
      setCategoryId(recipe.category_id?.toString() || "");
      setPreview(recipe.gambar); // Tampilkan gambar lama sebagai preview
    }
  }, [recipe]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Preview gambar baru
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("isi", isi);
    formData.append("category_id", categoryId);
    if (image) formData.append("gambar", image);

    try {
      await api.put(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      alert("Resep berhasil diperbarui!");
      navigate("/dashboard");
    } catch (error) {
      alert("Gagal memperbarui resep.");
    }
  };

  if (isLoading) return <div className="p-10">Memuat data resep...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Kembali
      </button>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50">
        <h1 className="text-3xl font-black text-gray-800 mb-8 italic">Edit Resep ✨</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sisi Kiri: Upload & Preview */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 ml-2">Foto Masakan</label>
              <div className="relative h-64 bg-orange-50 rounded-[2rem] overflow-hidden border-4 border-dashed border-orange-100 flex items-center justify-center group">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-orange-200" />
                )}
                <input 
                  type="file" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept="image/*"
                />
                <div className="absolute bottom-4 bg-black/50 text-white px-4 py-2 rounded-xl text-xs backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                  Klik untuk ubah foto
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Input Data */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Nama Resep</label>
                <input 
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-medium"
                  placeholder="Contoh: Rendang Daging Sapi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Kategori</label>
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-medium"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="1">makanan</option>
                  <option value="2">Minuman</option>
                  <option value="3">Cemilan</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Langkah Memasak</label>
            <textarea 
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-medium h-40"
              placeholder="Tuliskan bumbu dan cara membuatnya..."
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Save className="w-6 h-6" /> Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}