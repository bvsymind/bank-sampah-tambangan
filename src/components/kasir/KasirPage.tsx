// import { useState } from "react";
// import { CustomerInput } from "./CustomerInput";
// import { WasteTypeGrid } from "./WasteTypeGrid";
// import { WeightInputModal } from "./WeightInputModal";
// import { TransactionSummary, type TransactionItem } from "./TransactionSummary";
// import { transaksiService, type Nasabah, type JenisSampah } from "@/services/firebase";
// import { useToast } from "@/hooks/use-toast";

// export function KasirPage() {
//   const [selectedCustomer, setSelectedCustomer] = useState<Nasabah | null>(null);
//   // State untuk ID nasabah dipindahkan ke sini (parent component)
//   const [customerId, setCustomerId] = useState("");
  
//   const [selectedWasteType, setSelectedWasteType] = useState<JenisSampah | null>(null);
//   const [showWeightModal, setShowWeightModal] = useState(false);
//   const [transactionItems, setTransactionItems] = useState<TransactionItem[]>([]);
//   const [isSaving, setIsSaving] = useState(false);
//   const { toast } = useToast();

//   const handleWasteTypeSelect = (wasteType: JenisSampah) => {
//     if (!selectedCustomer) {
//       toast({
//         variant: "destructive",
//         title: "Peringatan",
//         description: "Silakan pilih nasabah terlebih dahulu"
//       });
//       return;
//     }
    
//     setSelectedWasteType(wasteType);
//     setShowWeightModal(true);
//   };
  
//   const handleAddItem = (weight: number, subtotal: number) => {
//     if (!selectedWasteType) return;

//     // Gunakan tipe data dari TransactionSummary.tsx
//     const newItem: TransactionItem = {
//       // id sekarang dari Date.now, bukan dari firebase.ts
//       id: Date.now().toString(), 
//       nama_sampah: selectedWasteType.nama,
//       berat_kg: weight,
//       harga_kg: selectedWasteType.harga_kg,
//       subtotal: subtotal
//     };

//     setTransactionItems(prev => [...prev, newItem]);
    
//     toast({
//       title: "Item Ditambahkan",
//       description: `${selectedWasteType.nama} ${weight}kg berhasil ditambahkan`
//     });
//   };

//   const handleRemoveItem = (itemId: string) => {
//     setTransactionItems(prev => prev.filter(item => item.id !== itemId));
    
//     toast({
//       title: "Item Dihapus",
//       description: "Item berhasil dihapus dari transaksi"
//     });
//   };

//   const handleSaveTransaction = async () => {
//     if (!selectedCustomer || transactionItems.length === 0) return;

//     setIsSaving(true);
    
//     try {
//       const totalHarga = transactionItems.reduce((sum, item) => sum + item.subtotal, 0);
//       const totalBerat = transactionItems.reduce((sum, item) => sum + item.berat_kg, 0);

//       const transaksiData = {
//         id_nasabah: selectedCustomer.id_nasabah,
//         nama_nasabah: selectedCustomer.nama,
//         timestamp: new Date(),
//         tipe: 'setor' as const,
//         total_harga: totalHarga,
//         total_berat_kg: totalBerat,
//         items: transactionItems.map(item => ({
//           nama_sampah: item.nama_sampah,
//           berat_kg: item.berat_kg,
//           harga_kg: item.harga_kg,
//           subtotal: item.subtotal
//         }))
//       };

//       await transaksiService.addSetor(transaksiData);

//       toast({
//         title: "Transaksi Berhasil",
//         description: `Transaksi untuk ${selectedCustomer.nama} berhasil disimpan`
//       });

//       // --- RESET FORM SECARA KESELURUHAN ---
//       setSelectedCustomer(null);
//       setTransactionItems([]);
//       // Reset input field ID nasabah setelah transaksi berhasil
//       setCustomerId(""); 
      
//     } catch (error) {
//       console.error("Error saving transaction:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Gagal menyimpan transaksi. Silakan coba lagi."
//       });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 pb-20">
//       <div className="py-6 space-y-6">
//         <CustomerInput
//           // Kirim state dan setter-nya sebagai props
//           value={customerId}
//           onChange={setCustomerId}
//           onCustomerSelect={setSelectedCustomer}
//           selectedCustomer={selectedCustomer}
//         />

//         <WasteTypeGrid
//           onWasteTypeSelect={handleWasteTypeSelect}
//           disabled={!selectedCustomer}
//         />

//         <TransactionSummary
//           items={transactionItems}
//           onRemoveItem={handleRemoveItem}
//           onSaveTransaction={handleSaveTransaction}
//           disabled={!selectedCustomer || isSaving}
//           isSaving={isSaving}
//         />

//         <WeightInputModal
//           isOpen={showWeightModal}
//           onClose={() => setShowWeightModal(false)}
//           wasteType={selectedWasteType}
//           onAdd={handleAddItem}
//         />
//       </div>
//     </div>
//   );
// }

// src/components/kasir/KasirPage.tsx

import { useState } from "react";
import { CustomerInput } from "./CustomerInput";
import { WasteTypeGrid } from "./WasteTypeGrid";
import { WeightInputModal } from "./WeightInputModal";
import { TransactionSummary, type TransactionItem } from "./TransactionSummary";
// Impor 'auth' untuk mendapatkan info user yang sedang login
import { transaksiService, type Nasabah, type JenisSampah, auth } from "@/services/firebase"; 
import { useToast } from "@/hooks/use-toast";

export function KasirPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Nasabah | null>(null);
  const [customerId, setCustomerId] = useState("");
  const [selectedWasteType, setSelectedWasteType] = useState<JenisSampah | null>(null);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [transactionItems, setTransactionItems] = useState<TransactionItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleWasteTypeSelect = (wasteType: JenisSampah) => {
    if (!selectedCustomer) {
      toast({
        variant: "destructive",
        title: "Peringatan",
        description: "Silakan pilih nasabah terlebih dahulu"
      });
      return;
    }
    setSelectedWasteType(wasteType);
    setShowWeightModal(true);
  };
  
  const handleAddItem = (weight: number, subtotal: number) => {
    if (!selectedWasteType) return;
    const newItem: TransactionItem = {
      id: Date.now().toString(), 
      nama_sampah: selectedWasteType.nama,
      berat_kg: weight,
      harga_kg: selectedWasteType.harga_kg,
      subtotal: subtotal
    };
    setTransactionItems(prev => [...prev, newItem]);
    toast({
      title: "Item Ditambahkan",
      description: `${selectedWasteType.nama} ${weight}kg berhasil ditambahkan`
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setTransactionItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Dihapus",
      description: "Item berhasil dihapus dari transaksi"
    });
  };

  const handleSaveTransaction = async () => {
    if (!selectedCustomer || transactionItems.length === 0) return;

    setIsSaving(true);
    
    try {
      const totalHarga = transactionItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totalBerat = transactionItems.reduce((sum, item) => sum + item.berat_kg, 0);

      const transaksiData = {
        id_nasabah: selectedCustomer.id_nasabah,
        nama_nasabah: selectedCustomer.nama,
        timestamp: new Date(),
        tipe: 'setor' as const,
        total_harga: totalHarga,
        total_berat_kg: totalBerat,
        items: transactionItems.map(item => ({
          nama_sampah: item.nama_sampah,
          berat_kg: item.berat_kg,
          harga_kg: item.harga_kg,
          subtotal: item.subtotal
        }))
      };

      // Dapatkan user yang sedang login
      const currentUser = auth.currentUser;
      
      // Kirim data transaksi DAN email admin yang memproses
      await transaksiService.addSetor(
        transaksiData, 
        currentUser?.email || 'System' // Gunakan email user, atau 'System' jika tidak ada
      );

      toast({
        title: "Transaksi Berhasil",
        description: `Transaksi untuk ${selectedCustomer.nama} berhasil disimpan`
      });

      setSelectedCustomer(null);
      setTransactionItems([]);
      setCustomerId(""); 
      
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menyimpan transaksi. Silakan coba lagi."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="py-6 space-y-6">
        <CustomerInput
          value={customerId}
          onChange={setCustomerId}
          onCustomerSelect={setSelectedCustomer}
          selectedCustomer={selectedCustomer}
        />

        <WasteTypeGrid
          onWasteTypeSelect={handleWasteTypeSelect}
          disabled={!selectedCustomer}
        />

        <TransactionSummary
          items={transactionItems}
          onRemoveItem={handleRemoveItem}
          onSaveTransaction={handleSaveTransaction}
          disabled={!selectedCustomer || isSaving}
          isSaving={isSaving}
        />

        <WeightInputModal
          isOpen={showWeightModal}
          onClose={() => setShowWeightModal(false)}
          wasteType={selectedWasteType}
          onAdd={handleAddItem}
        />
      </div>
    </div>
  );
}