// src/components/sampah/AddWasteTypeModal.tsx

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AddWasteTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (wasteType: any) => Promise<void>; // Disesuaikan agar bisa async
}

export function AddWasteTypeModal({ isOpen, onClose, onAdd }: AddWasteTypeModalProps) {
  const [formData, setFormData] = useState({
    nama: "",
    harga_kg: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.nama.trim() || !formData.harga_kg) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Nama dan harga harus diisi"
      });
      return;
    }

    const hargaNum = parseFloat(formData.harga_kg);
    if (isNaN(hargaNum) || hargaNum <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Harga harus berupa angka positif"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Foto URL di-hardcode ke placeholder, tidak ada upload
      const newWasteType = {
        nama: formData.nama.trim(),
        harga_kg: hargaNum,
        foto_url: "/placeholder-waste.jpg"
      };

      await onAdd(newWasteType);
      handleClose();
      
    } catch (error) {
      console.error("Error adding waste type:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan jenis sampah. Silakan coba lagi."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ nama: "", harga_kg: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md bg-card animate-slide-up max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Tambah Jenis Sampah
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Jenis Sampah</label>
              <Input
                type="text"
                placeholder="Contoh: Botol Plastik"
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                className="bg-input"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Harga per Kilogram (Rp)</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.harga_kg}
                onChange={(e) => setFormData(prev => ({ ...prev, harga_kg: e.target.value }))}
                className="bg-input"
                min="0"
                step="100"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Foto Sampah</label>
              {/* Area upload dinonaktifkan, tidak bisa diklik */}
              <div 
                className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/50 min-h-[150px] flex flex-col items-center justify-center opacity-50"
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Fitur upload foto dinonaktifkan
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose} disabled={isSubmitting}>
                Batal
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary-glow" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}