import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { type JenisSampah, formatRupiah } from "@/services/firebase";

interface WeightInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  wasteType: JenisSampah | null;
  onAdd: (weight: number, subtotal: number) => void;
}

export function WeightInputModal({ isOpen, onClose, wasteType, onAdd }: WeightInputModalProps) {
  const [weight, setWeight] = useState("");
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (wasteType && weight) {
      const weightNum = parseFloat(weight);
      if (!isNaN(weightNum)) {
        setSubtotal(weightNum * wasteType.harga_kg);
      } else {
        setSubtotal(0);
      }
    } else {
      setSubtotal(0);
    }
  }, [weight, wasteType]);

  const handleAdd = () => {
    const weightNum = parseFloat(weight);
    if (weightNum > 0 && wasteType) {
      onAdd(weightNum, subtotal);
      setWeight("");
      setSubtotal(0);
      onClose();
    }
  };

  const handleClose = () => {
    setWeight("");
    setSubtotal(0);
    onClose();
  };

  if (!isOpen || !wasteType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md bg-card animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Input Berat Sampah
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">
                {wasteType.nama}
              </h4>
              <p className="text-sm text-muted-foreground">
                {formatRupiah(wasteType.harga_kg)} per kilogram
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Berat (kg)
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-lg text-center"
                autoFocus
              />
            </div>

            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Subtotal
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatRupiah(subtotal)}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Batal
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary-glow"
                onClick={handleAdd}
                disabled={!weight || parseFloat(weight) <= 0}
              >
                Tambah
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}