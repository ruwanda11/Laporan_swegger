import * as XLSX from 'xlsx';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { Pencil, Trash2, ExternalLink, FileDown } from "lucide-react";
import { Link } from "react-router-dom";

export default function ManagePosts() {
  const queryClient = useQueryClient();

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["manage-recipes"],
    queryFn: async () => {
      const res = await api.get("/posts", { params: { limit: 100 } });
      return res.data;
    },
  });

  const recipes = response?.data?.data || [];

  // --- FUNGSI EKSPOR ---
  const exportToExcel = () => {
    const data = recipes.map((r: any) => ({
      ID: r.id,
      Judul: r.judul,
      Kategori: r.category,
      Dibuat: r.created_at
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resep");
    XLSX.writeFile(workbook, "Data_Resep.xlsx");
  };

const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Data Resep", 14, 15);
    
   
        autoTable(doc, {
      // Pastikan urutan head sesuai dengan urutan di dalam map body
      head: [['ID', 'Judul', 'Kategori', 'Dibuat', 'Isi']], 
      body: recipes.map((r: any) => [
        r.id, 
        r.judul, 
        r.category, 
        r.created_at, 
        r.isi || "-" // Membatasi teks 'isi' agar tidak terlalu panjang di PDF
      ]),
      startY: 20,
    });
    doc.save("Data_Resep.pdf");
  };
  const handleDelete = async (id: number) => {
    if (window.confirm("Hapus resep ini secara permanen?")) {
      try {
        await api.delete(`/posts/${id}`);
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
        refetch();
        alert("Resep berhasil dihapus!");
      } catch (error) {
        alert("Gagal menghapus resep.");
      }
    }
  };

  if (isLoading) return <div className="p-10 text-center font-bold text-orange-500">Memuat data...</div>;

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter">Kelola Postingan</h1>
        
        {/* Tombol Ekspor */}
        <div className="flex gap-2">
          <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-all">
            <FileDown size={16} /> Excel
          </button>
          <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all">
            <FileDown size={16} /> PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Info Resep</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recipes.map((recipe: any) => (
              <tr key={recipe.id} className="hover:bg-orange-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={recipe.gambar} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                    <div>
                      <p className="font-bold text-gray-700 italic group-hover:text-orange-600 transition-colors">{recipe.judul}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Koki: {recipe.user?.username || 'Admin'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-white border border-gray-200 text-gray-400 rounded-lg text-[10px] font-black uppercase">
                    {recipe.category || "Umum"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <Link to={`/recipe/${recipe.id}`} className="p-2 text-gray-400 hover:text-orange-500 transition-all">
                      <ExternalLink size={18} />
                    </Link>
                    <Link to={`/edit-recipe/${recipe.id}`} className="p-2 text-blue-400 hover:bg-blue-50 rounded-xl transition-all">
                      <Pencil size={18} />
                    </Link>
                    <button onClick={() => handleDelete(recipe.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}