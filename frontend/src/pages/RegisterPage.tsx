import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { UtensilsCrossed, User, Mail, Lock, Loader2 } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Menambahkan formState untuk menampilkan pesan error validasi di bawah input
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Role tetap dipaksa 'user' agar pendaftar baru tidak menjadi admin
      await api.post("/register", { ...data, role: "user" });
      alert("Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.");
      navigate("/login");
    } catch (error: any) {
      const message = error.response?.data?.message || "Terjadi kesalahan saat mendaftar";
      alert("Gagal daftar: " + message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4"
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')` 
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-10 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-orange-500 rounded-2xl text-white mb-4 shadow-lg shadow-orange-200">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Daftar Akun Baru</h1>
            <p className="text-gray-500 mt-2 font-medium">Mulailah berbagi resep lezatmu</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
            {/* Input Username - Menambahkan autoComplete="new-password" adalah trik agar browser tidak mengisi otomatis */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 ml-1">
                <User className="w-4 h-4 text-orange-500" /> Username
              </label>
              <input
                {...register("username", { required: "Username wajib diisi" })}
                type="text"
                autoComplete="new-password" 
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
                placeholder="Pilih nama koki unik"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username.message as string}</p>}
            </div>

            {/* Input Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 ml-1">
                <Mail className="w-4 h-4 text-orange-500" /> Email
              </label>
              <input
                {...register("email", { 
                  required: "Email wajib diisi",
                  pattern: { value: /^\S+@\S+$/i, message: "Format email salah" }
                })}
                type="email"
                autoComplete="new-password"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
                placeholder="koki@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message as string}</p>}
            </div>

            {/* Input Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 ml-1">
                <Lock className="w-4 h-4 text-orange-500" /> Password
              </label>
              <input
                {...register("password", { 
                  required: "Password wajib diisi",
                  minLength: { value: 6, message: "Minimal 6 karakter" }
                })}
                type="password"
                autoComplete="new-password"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
                placeholder="Buat sandi rahasia"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message as string}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                </>
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 font-medium">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-orange-600 font-bold hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}