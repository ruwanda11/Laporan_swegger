import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusSquare, LogOut, UtensilsCrossed } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  // 1. Ambil data user dari localStorage untuk cek role secara real-time
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  
  // Pastikan di database role ditulis 'admin' (huruf kecil semua)
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirmLogout) {
      // Hapus semua data sesi agar login berikutnya bersih
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 p-3 rounded-xl transition-all ${
      isActive 
        ? "bg-orange-500 text-white shadow-md shadow-orange-200" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-orange-500 p-2 rounded-lg">
          <UtensilsCrossed className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">ResepKita</h1>
      </div>

      <nav className="space-y-2 flex-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
          Menu Utama
        </p>
        
        <NavLink to="/dashboard" end className={linkStyle}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        {/* 2. Logika Role-Based Access Control (RBAC) */}
        {/* Tombol ini HANYA muncul jika di localStorage user.role === 'admin' */}
        {isAdmin && (
          <NavLink to="/dashboard/add-recipe" className={linkStyle}>
            <PlusSquare className="w-5 h-5" />
            <span className="font-medium">Tambah Resep</span>
          </NavLink>
        )}
      </nav>

      <div className="pt-6 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}