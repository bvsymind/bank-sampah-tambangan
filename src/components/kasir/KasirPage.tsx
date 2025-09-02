import { useState } from "react";
import { CustomerInput } from "./CustomerInput";
import { WasteTypeGrid } from "./WasteTypeGrid";
import { WeightInputModal } from "./WeightInputModal";
import { TransactionSummary, type TransactionItem } from "./TransactionSummary";
import { transaksiService, type Nasabah, type JenisSampah, auth } from "@/services/firebase"; 
import { useToast } from "@/hooks/use-toast";

export function KasirPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Nasabah | null>(null);
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
    const existingItem = transactionItems.find(item => item.id === selectedWasteType.id);

    if (existingItem) {
      setTransactionItems(
        transactionItems.map(item =>
          item.id === selectedWasteType.id
            ? {
                ...item,
                berat_kg: item.berat_kg + weight,
                subtotal: item.subtotal + subtotal,
              }
            : item
        )
      );
      toast({
        title: "Item Diperbarui",
        description: `${selectedWasteType.nama} ditambahkan ${weight}kg. Total sekarang: ${existingItem.berat_kg + weight}kg`
      });
    } else {
      const newItem: TransactionItem = {
        id: selectedWasteType.id, 
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
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setTransactionItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Dihapus",
      description: "Item berhasil dihapus dari transaksi"
    });
  };

  const handleCustomerChange = (customer: Nasabah | null) => {
    setTransactionItems([]);
    setSelectedCustomer(customer);
  }

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
      const currentUser = auth.currentUser;
      await transaksiService.addSetor(
        transaksiData, 
        currentUser?.email || 'System'
      );

      toast({
        title: "Transaksi Berhasil",
        description: `Transaksi untuk ${selectedCustomer.nama} berhasil disimpan`
      });

      // Reset state setelah transaksi berhasil
      setSelectedCustomer(null);
      setTransactionItems([]);
      
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
          onCustomerSelect={handleCustomerChange}
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

