import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios"; 
import { Utensils, User, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Recipe {
  id: number;
  judul: string;
  isi: string;
  gambar?: string;
  nama: string;
  category: string;
  user?: {
    username: string;
  }
  
}

interface RecipeListProps {
  category: string;
  role?: string;
}

export default function RecipeList({ category, role }: RecipeListProps) {
  const { data: recipes, isLoading, isError } = useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: async () => {
      const res = await api.get("/posts");
      return res.data.data; 
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 bg-gray-100 rounded-[2.5rem] animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-12 bg-red-50 rounded-[2.5rem] border border-red-100">
        <p className="text-red-600 font-bold">Gagal memuat resep lezat. Coba refresh halaman.</p>
      </div>
    );
  }

const filteredRecipes = recipes?.filter((recipe) => {
  if (category === "Semua") return true;
  
  // Ambil nama kategori dari objek recipe yang dikirim backend
  // Pastikan backend Anda sudah melakukan JOIN antara tabel post dan categories
  const recipeCategoryName = recipe.category || "";
  
  return recipeCategoryName?.toLowerCase() === category.toLowerCase();
});
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredRecipes && filteredRecipes.length > 0 ? (
        filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="relative group">
            <Link 
              to={`/recipe/${recipe.id}`} 
              className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-orange-200/30 transition-all duration-500 block h-full border border-gray-50"
            >
              {/* Image Container */}
              <div className="h-52 bg-orange-50 rounded-[2rem] relative overflow-hidden flex items-center justify-center mb-5">
                {recipe.gambar ? (
                  <img 
                    src={recipe.gambar} 
                    alt={recipe.judul}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Gambar+Rusak";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Utensils className="w-12 h-12 text-orange-200" />
                    <span className="text-[10px] text-orange-300 font-black uppercase tracking-widest">No Image</span>
                  </div>
                )}
                
                {/* Badge Kategori - Glassmorphism */}
                <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase text-orange-600 shadow-sm border border-white/50">
                  {recipe.nama || "Umum"}
                </div>
              </div>
              
              {/* Content */}
              <div className="px-2 pb-2">
                <h3 className="font-black text-gray-800 text-xl mb-2 group-hover:text-orange-500 transition-colors line-clamp-1 italic">
                  {recipe.judul}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-5 leading-relaxed font-medium">
                  {recipe.isi}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-orange-500" />
                    </div>
                    <span className="text-xs text-gray-500 font-bold">{recipe.user?.username || "Koki Rahasia"}</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Admin Actions */}
            {role === "admin" && (
              <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <button className="p-3 bg-white/90 backdrop-blur text-blue-600 rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95">
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="p-3 bg-white/90 backdrop-blur text-red-600 rounded-2xl shadow-xl hover:bg-red-600 hover:text-white transition-all active:scale-95">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-24 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
          <Utensils className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-bold text-lg">Belum ada resep di kategori <span className="text-orange-400">{category}</span>.</p>
        </div>
      )}
    </div>
  );
}