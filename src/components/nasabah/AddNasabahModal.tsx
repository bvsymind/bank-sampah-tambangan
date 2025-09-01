import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddNasabahModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (nasabah: any) => Promise<void>;
  existingIds: string[];
}

export function AddNasabahModal({ isOpen, onClose, onAdd, existingIds }: AddNasabahModalProps) {
  const [formData, setFormData] = useState({
    nama: "",
    alamat: ""
  });
  const [selectedRW, setSelectedRW] = useState("");
  const [selectedRT, setSelectedRT] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRW || !selectedRT || !formData.nama.trim() || !formData.alamat.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Semua field harus diisi"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const idPrefix = selectedRW + selectedRT;
      const countExisting = existingIds.filter(id => id.startsWith(idPrefix)).length;
      const newSequence = (countExisting + 1).toString().padStart(3, '0');
      const newIdNasabah = idPrefix + newSequence;

      const newNasabah = {
        id_nasabah: newIdNasabah,
        nama: formData.nama.trim(),
        alamat: formData.alamat.trim(),
        saldo: 0,
        created_at: new Date()
      };

      await onAdd(newNasabah);
      handleClose();

    } catch (error) {
        console.error("Error saat menambah nasabah:", error);
        toast({
            variant: "destructive",
            title: "Gagal Menyimpan",
            description: "Terjadi kesalahan saat membuat ID nasabah."
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ nama: "", alamat: "" });
    setSelectedRW("");
    setSelectedRT("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md bg-card animate-slide-up">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Tambah Nasabah Baru</h3>
            <Button type="button" variant="ghost" size="icon" onClick={handleClose} disabled={isSubmitting}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">RW</label>
                <Select value={selectedRW} onValueChange={setSelectedRW} disabled={isSubmitting}>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Pilih RW" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="01">RW 01</SelectItem>
                    <SelectItem value="02">RW 02</SelectItem>
                    <SelectItem value="03">RW 03</SelectItem>
                    <SelectItem value="04">RW 04</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">RT</label>
                <Select value={selectedRT} onValueChange={setSelectedRT} disabled={isSubmitting}>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Pilih RT" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="01">RT 01</SelectItem>
                    <SelectItem value="02">RT 02</SelectItem>
                    <SelectItem value="03">RT 03</SelectItem>
                    <SelectItem value="04">RT 04</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
              <Input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                className="bg-input"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Alamat</label>
              <Textarea
                placeholder="Masukkan alamat lengkap"
                value={formData.alamat}
                onChange={(e) => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
                className="bg-input min-h-20"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose} disabled={isSubmitting}>
                Batal
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary-glow" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}