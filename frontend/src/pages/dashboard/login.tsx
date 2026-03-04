import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { loginSchema, type LoginFormValues } from "../../lib/schema";
import { Mail, Lock, Loader2, UtensilsCrossed } from "lucide-react"; 
import { Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await api.post("/login", data); 
      return res.data;
    },
    onSuccess: (data) => {
      // 1. Ambil token (cek berbagai kemungkinan struktur data dari backend)
      const token = data?.data?.token || data?.token || data?.data?.accessToken || data?.accessToken;
      
      // 2. Ambil data user (Kunci utama agar tombol "Tambah Resep" muncul)
      const user = data?.data?.user || data?.user || data?.data;
      console.log("Respon API:", data);

      if (token) {
        localStorage.setItem("token", token);
        
        // 3. Simpan data user ke localStorage agar Sidebar bisa membaca role: 'admin'
        if (user && typeof user === 'object' && 'role' in user) {
      localStorage.setItem("user", JSON.stringify(user));
      console.log("User tersimpan:", user);
      navigate("/dashboard");
    } else {
      // Jika token ada tapi data user tidak lengkap
      console.error("Data user tidak valid atau tidak memiliki role:", user);
      alert("Login berhasil, tapi data profil (role) tidak ditemukan. Pastikan backend mengirimkan data user lengkap.");
    }
  } else {
    alert("Token tidak ditemukan. Silakan cek respon API di Network Tab.");
  }
},
  });

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
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-orange-500 rounded-2xl text-white mb-4 shadow-lg shadow-orange-200">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Masuk ke ResepKita</h1>
            <p className="text-gray-500 mt-2 font-medium">Bagikan resep lezatmu dengan dunia</p>
          </div>

          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 ml-1">
                <Mail className="w-4 h-4 text-orange-500" /> Email
              </label>
              <input
                {...register("email")}
                type="email"
                className={`w-full px-5 py-4 rounded-2xl bg-gray-50 border outline-none transition-all font-medium ${
                  errors.email ? "border-red-500 ring-2 ring-red-100" : "border-gray-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                }`}
                placeholder="nama@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-2 ml-1 font-bold">{errors.email.message}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 ml-1">
                <Lock className="w-4 h-4 text-orange-500" /> Password
              </label>
              <input
                {...register("password")}
                type="password"
                className={`w-full px-5 py-4 rounded-2xl bg-gray-50 border outline-none transition-all font-medium ${
                  errors.password ? "border-red-500 ring-2 ring-red-100" : "border-gray-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                }`}
                placeholder="••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-2 ml-1 font-bold">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 font-medium">
            Belum punya akun?{" "}
            <Link 
              to="/register" 
              className="text-orange-600 font-bold cursor-pointer hover:underline"
            >
              Daftar di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}