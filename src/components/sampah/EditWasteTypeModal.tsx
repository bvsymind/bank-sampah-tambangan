import { useState, useEffect } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { type JenisSampah } from "@/services/firebase";

export interface EditWasteTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedData: Partial<JenisSampah>) => Promise<void>;
  wasteType: JenisSampah | null;
}

export function EditWasteTypeModal({ 
  isOpen, 
  onClose, 
  onUpdate,
  wasteType 
}: EditWasteTypeModalProps) {
  const [formData, setFormData] = useState({ nama: "", harga_kg: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (wasteType) {
      setFormData({
        nama: wasteType.nama,
        harga_kg: wasteType.harga_kg.toString()
      });
    }
  }, [wasteType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteType) return;

    if (!formData.nama.trim() || !formData.harga_kg) {
      toast({ variant: "destructive", title: "Error", description: "Nama dan harga harus diisi" });
      return;
    }
    const hargaNum = parseFloat(formData.harga_kg);
    if (isNaN(hargaNum) || hargaNum <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Harga harus berupa angka positif" });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedData: Partial<JenisSampah> = {
        nama: formData.nama.trim(),
        harga_kg: hargaNum,
      };

      await onUpdate(updatedData);
      handleClose();

    } catch (error) {
      console.error("Error updating waste type:", error);
      toast({ variant: "destructive", title: "Error", description: "Gagal memperbarui data." });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md bg-card animate-slide-up max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Edit Jenis Sampah</h3>
            <Button type="button" variant="ghost" size="icon" onClick={handleClose} disabled={isSubmitting}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Jenis Sampah</label>
              <Input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                className="bg-input"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Harga per Kilogram (Rp)</label>
              <Input
                type="number"
                value={formData.harga_kg}
                onChange={(e) => setFormData(prev => ({ ...prev, harga_kg: e.target.value }))}
                className="bg-input"
                min="0"
                step="100"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Foto</label>
              <div 
                className="border-2 border-border rounded-lg p-6 text-center bg-muted/50 min-h-[150px] flex flex-col items-center justify-center"
              >
                {wasteType?.foto_url && !wasteType.foto_url.includes("placeholder") ? (
                    <img src={wasteType.foto_url} alt={wasteType.nama} className="h-32 w-32 object-cover rounded-md" />
                ) : (
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Foto tidak dapat diubah
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose} disabled={isSubmitting}>
                Batal
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary-glow" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}