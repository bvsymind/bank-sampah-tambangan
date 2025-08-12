// Mock data untuk Bank Sampah Digital
import botolPlastik from '../images/botolPlastik.png';
import kardus from '../images/kardus.jpg';
import kertas from '../images/kertas.jpg';
import kaleng from '../images/kaleng.jpg';
import botolKaca from '../images/botolKaca.jpg';
import plastikKemasan from '../images/plastikKemasan.jpg';

export interface Nasabah {
  id_nasabah: string;
  nama: string;
  alamat: string;
  saldo: number;
  created_at: Date;
}

export interface JenisSampah {
  id: string;
  nama: string;
  harga_kg: number;
  foto_url: string;
  created_at: Date;
}

export interface TransactionItem {
  nama_sampah: string;
  berat_kg: number;
  harga_kg: number;
  subtotal: number;
}

export interface Transaksi {
  id: string;
  id_nasabah: string;
  nama_nasabah: string;
  timestamp: Date;
  tipe: 'setor' | 'tarik';
  total_harga: number;
  total_berat_kg: number;
  items: TransactionItem[];
}

// Mock Nasabah Data
export const mockNasabah: Nasabah[] = [
  {
    id_nasabah: "001",
    nama: "Budi Santoso",
    alamat: "Jl. Mawar No. 12, RT 02/RW 03",
    saldo: 150000,
    created_at: new Date('2024-01-15')
  },
  {
    id_nasabah: "002", 
    nama: "Siti Rahayu",
    alamat: "Jl. Melati No. 8, RT 01/RW 02",
    saldo: 225000,
    created_at: new Date('2024-01-20')
  },
  {
    id_nasabah: "003",
    nama: "Ahmad Wijaya",
    alamat: "Jl. Kenanga No. 15, RT 03/RW 01",
    saldo: 89000,
    created_at: new Date('2024-02-01')
  },
  {
    id_nasabah: "004",
    nama: "Dewi Lestari",
    alamat: "Jl. Cempaka No. 21, RT 01/RW 04",
    saldo: 310000,
    created_at: new Date('2024-02-10')
  }
];

// Mock Jenis Sampah Data
export const mockJenisSampah: JenisSampah[] = [
  {
    id: "1",
    nama: "Botol Plastik",
    harga_kg: 3000,
    foto_url: botolPlastik,
    created_at: new Date('2024-01-01')
  },
  {
    id: "2", 
    nama: "Kardus",
    harga_kg: 2000,
    foto_url: kardus,
    created_at: new Date('2024-01-01')
  },
  {
    id: "3",
    nama: "Kertas Putih",
    harga_kg: 1500,
    foto_url: kertas,
    created_at: new Date('2024-01-01')
  },
  {
    id: "4",
    nama: "Kaleng Aluminium",
    harga_kg: 7000,
    foto_url: kaleng,
    created_at: new Date('2024-01-01')
  },
  {
    id: "5",
    nama: "Kaca/Botol Kaca",
    harga_kg: 1000,
    foto_url: botolKaca,
    created_at: new Date('2024-01-01')
  },
  {
    id: "6",
    nama: "Plastik Kemasan",
    harga_kg: 2500,
    foto_url: plastikKemasan,
    created_at: new Date('2024-01-01')
  }
];

// Mock Transaksi Data
export const mockTransaksi: Transaksi[] = [
  {
    id: "tx001",
    id_nasabah: "001",
    nama_nasabah: "Budi Santoso",
    timestamp: new Date('2024-08-01T10:30:00'),
    tipe: 'setor',
    total_harga: 15000,
    total_berat_kg: 5.0,
    items: [
      {
        nama_sampah: "Botol Plastik",
        berat_kg: 2.0,
        harga_kg: 3000,
        subtotal: 6000
      },
      {
        nama_sampah: "Kardus",
        berat_kg: 3.0,
        harga_kg: 2000,
        subtotal: 6000
      },
      {
        nama_sampah: "Kertas Putih", 
        berat_kg: 2.0,
        harga_kg: 1500,
        subtotal: 3000
      }
    ]
  },
  {
    id: "tx002",
    id_nasabah: "002",
    nama_nasabah: "Siti Rahayu",
    timestamp: new Date('2024-08-02T14:15:00'),
    tipe: 'setor',
    total_harga: 21000,
    total_berat_kg: 3.0,
    items: [
      {
        nama_sampah: "Kaleng Aluminium",
        berat_kg: 3.0,
        harga_kg: 7000,
        subtotal: 21000
      }
    ]
  },
  {
    id: "tx003",
    id_nasabah: "001",
    nama_nasabah: "Budi Santoso",
    timestamp: new Date('2024-08-03T09:45:00'),
    tipe: 'tarik',
    total_harga: -50000,
    total_berat_kg: 0,
    items: []
  },
  {
    id: "tx004",
    id_nasabah: "003",
    nama_nasabah: "Ahmad Wijaya",
    timestamp: new Date('2024-08-03T16:20:00'),
    tipe: 'setor',
    total_harga: 12500,
    total_berat_kg: 5.0,
    items: [
      {
        nama_sampah: "Plastik Kemasan",
        berat_kg: 5.0,
        harga_kg: 2500,
        subtotal: 12500
      }
    ]
  }
];

// Helper functions
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatDateOnly = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short', 
    year: 'numeric'
  }).format(date);
};