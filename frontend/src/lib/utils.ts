import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

// Fungsi bawaan kamu untuk Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fungsi BARU untuk format waktu relatif (1 jam yang lalu, dll)
export function formatRelatif(dateString: string) {
  if (!dateString) return "Baru saja";
  
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: id 
    });
  } catch (error) {
    return "Baru saja";
  }
}