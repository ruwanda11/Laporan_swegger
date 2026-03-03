import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/users.service";

// 1. Definisikan Interface sesuai data dari backend kamu
interface User {
  id: number;
  name: string;
  email: string;
  // tambahkan field lain jika ada di backend (misal: role)
}

export default function UsersPage() {
  // 2. Gunakan useQuery dengan generic type <User[]>
  const { data, isLoading, isError, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
    retry: 1, // Mencoba ulang 1 kali jika gagal
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="animate-pulse text-gray-500">Loading data users...</p>
      </div>
    );
  }

  // 3. Jika Error, tampilkan pesan yang lebih spesifik
  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded">
        <p className="font-bold">Gagal mengambil data:</p>
        <p className="text-sm">{(error as any)?.response?.data?.message || (error as Error).message}</p>
        <p className="text-xs mt-2 italic text-red-400">Pastikan backend sudah jalan dan CORS sudah diaktifkan.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          + Add User
        </button>
      </div>

      <div className="grid gap-4">
        {data && data.length > 0 ? (
          data.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-lg">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-sm border px-3 py-1 rounded">Edit</button>
                <button className="text-sm border border-red-200 text-red-500 px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-10">Tidak ada data user tersedia.</p>
        )}
      </div>
    </div>
  );
}