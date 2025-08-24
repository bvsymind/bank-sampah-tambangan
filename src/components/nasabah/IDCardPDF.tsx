// src/components/nasabah/IDCardPDF.tsx

import { type Nasabah } from "@/services/firebase";

interface IDCardPDFProps {
  nasabah: Nasabah | null;
}

export function IDCardPDF({ nasabah }: IDCardPDFProps) {
  if (!nasabah) return null;

  const rw = nasabah.id_nasabah.substring(0, 2);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(nasabah.id_nasabah)}`;

  return (
    <div
      id="id-card-to-print"
      className="fixed -top-[9999px] -left-[9999px] font-sans"
      style={{ width: '1016px', height: '638px' }}
    >
      <div className="w-full h-full bg-gradient-to-r from-[#4CAD51] to-[#2195ED] text-white p-8 flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-wider">KARTU TANDA ANGGOTA</h1>
          <p className="text-3xl mt-2 opacity-90">Bank Sampah Sido Makmur</p>
        </div>

        <div className="flex-grow flex items-center gap-8">
          <div className="flex-shrink-0 bg-white p-3 rounded-2xl shadow-lg">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              style={{ width: '240px', height: '240px' }} 
              crossOrigin="anonymous"
            />
          </div>

          {/* PERBAIKAN: Layout diubah untuk menangani teks panjang */}
          <div className="flex flex-col justify-center text-3xl space-y-6 min-w-0 flex-grow">
            <div>
              <p className="opacity-80 text-2xl font-semibold">ID Nasabah</p>
              <p className="font-mono font-bold text-4xl tracking-widest">{nasabah.id_nasabah}</p>
            </div>
            <div className="min-w-0">
              <p className="opacity-80 text-2xl font-semibold">Nama Nasabah</p>
              {/* Menggunakan flex-wrap agar nama panjang turun ke baris baru */}
              <p className="font-bold text-4xl flex flex-wrap">{nasabah.nama}</p>
            </div>
            <div className="min-w-0">
              <p className="opacity-80 text-2xl font-semibold">Alamat</p>
              <p className="text-2xl flex flex-wrap">{nasabah.alamat}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
