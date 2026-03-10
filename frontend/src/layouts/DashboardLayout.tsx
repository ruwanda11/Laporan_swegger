import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* 1. SIDEBAR CONTAINER 
        Kita memberikan lebar tetap (w-64) di sini agar Sidebar 
        memiliki ruang meskipun nanti isinya bersifat 'fixed'.
      */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* 2. CONTENT AREA 
        Menggunakan flex-1 agar mengambil sisa ruang layar.
      */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Tetap di Atas */}
        <header className="h-16 border-b flex items-center px-8 bg-white sticky top-0 z-40">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Dashboard Resep 
          </h2>
        </header>

        {/* Area Main: Tempat Outlet (DashboardHome, Daftar User, dll) merender isinya.
           Scroll akan terjadi di sini.
        */}
        <main className="flex-1 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}