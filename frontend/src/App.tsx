import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import RegisterPage from "./pages/RegisterPage";
import UsersPage from "./pages/dashboard/UsersPage";
import LoginPage from "./pages/dashboard/login"; 
import { AddRecipeForm } from "./components/ui/addRecipeForm";
import RecipeDetailPage from "./pages/RecipeDetailPage"; 

// Komponen sederhana untuk memproteksi Route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Publik: Bisa diakses siapa saja */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Redirect dari root ke dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />

        {/* Route Terproteksi: Harus Login dulu */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UsersPage />} />
          
          {/* Tambahkan Route untuk Tambah Resep di dalam Dashboard */}
          <Route path="add-recipe" element={
            <div className="p-6 bg-gray-50 min-h-screen">
              <AddRecipeForm />
            </div>
          } />
        </Route>

        {/* 404 Not Found - Opsional */}
        <Route path="*" element={<div className="flex items-center justify-center h-screen font-bold">Halaman Tidak Ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
}