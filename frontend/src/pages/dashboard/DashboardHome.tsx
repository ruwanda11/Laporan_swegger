import { useState } from "react";
import RecipeList from "../../components/RecipeList";

export default function DashboardHome() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Konsistensi penulisan kategori di sini harus sama persis dengan yang ada di database
const categories = [
  { name: "Semua", icon: "✨" }, // "Semua" hanyalah label UI, tidak masuk ke DB
  { name: "Makanan", icon: "🍳" }, // Harus "Makanan"
  { name: "Minuman", icon: "🥤" }, // Harus "Minuman"
  { name: "Cemilan", icon: "🍪" }  // Harus "Cemilan"
];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <header className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-orange-500 to-orange-600 p-8 md:p-12 text-white shadow-2xl shadow-orange-200">
        <div className="relative z-10">
          <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            Dashboard Resep
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 tracking-tighter">
            Halo, {user.username || "Koki"}! 👋
          </h1>
          <p className="text-orange-50 mt-2 text-lg font-medium max-w-md opacity-90">
            Temukan inspirasi rasa atau bagikan rahasia dapurmu hari ini.
          </p>
        </div>
        {/* Dekorasi Abstract */}
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[10%] w-48 h-48 bg-black/10 rounded-full blur-2xl" />
      </header>

      {/* Category Selection */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Kategori Menu</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((kat) => (
            <button
              key={kat.name}
              onClick={() => setSelectedCategory(kat.name)}
              className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] font-bold transition-all duration-300 whitespace-nowrap ${
                selectedCategory === kat.name
                  ? "bg-gray-900 text-white shadow-2xl shadow-gray-400 scale-105"
                  : "bg-white text-gray-500 hover:bg-orange-50 hover:text-orange-600 shadow-sm border border-gray-100"
              }`}
            >
              <span className="text-xl">{kat.icon}</span>
              {kat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-2 bg-orange-500 rounded-full" />
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Inspirasi Masakan</h2>
          <div className="flex-1 h-[1px] bg-gray-100" />
        </div>
        
        <RecipeList category={selectedCategory} role={user.role} />
      </main>
    </div>
  );
}