import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { KasirPage } from "@/components/kasir/KasirPage";
import { RiwayatPage } from "@/components/riwayat/RiwayatPage";
import { NasabahPage } from "@/components/nasabah/NasabahPage";
import { SampahPage } from "@/components/sampah/SampahPage";
import { TarikPage } from "@/components/tarik/TarikPage";

const pageComponents = {
  kasir: KasirPage,
  riwayat: RiwayatPage,
  nasabah: NasabahPage,
  sampah: SampahPage,
  tarik: TarikPage,
};

const pageTitles = {
  kasir: "Kasir",
  riwayat: "Riwayat Transaksi",
  nasabah: "Manajemen Nasabah",
  sampah: "Manajemen Sampah",
  tarik: "Penarikan Saldo",
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<keyof typeof pageComponents>('kasir');
  
  const PageComponent = pageComponents[activeTab];
  const pageTitle = pageTitles[activeTab];

  return (
    <div className="min-h-screen bg-background">
      <Header title={pageTitle} />
      
      <main className="flex-1">
        <PageComponent />
      </main>
      
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab as keyof typeof pageComponents)} 
      />
    </div>
  );
};

export default Index;
