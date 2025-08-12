import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/services/firebase";

export interface TransactionItem {
  id: string;
  nama_sampah: string;
  berat_kg: number;
  harga_kg: number;
  subtotal: number;
}

interface TransactionSummaryProps {
  items: TransactionItem[];
  onRemoveItem: (itemId: string) => void;
  onSaveTransaction: () => void;
  disabled?: boolean;
  isSaving?: boolean;
}

export function TransactionSummary({ 
  items, 
  onRemoveItem, 
  onSaveTransaction,
  disabled,
  isSaving 
}: TransactionSummaryProps) {
  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.berat_kg, 0);

  return (
    <Card className="p-4 bg-gradient-card border-0 shadow-card">
      <h3 className="font-semibold text-foreground mb-3">
        Ringkasan Transaksi
      </h3>

      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Belum ada item yang ditambahkan</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-card rounded-lg border"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground truncate">
                    {item.nama_sampah}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {item.berat_kg}kg × {formatRupiah(item.harga_kg)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-primary text-sm">
                    {formatRupiah(item.subtotal)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item.id)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    disabled={isSaving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Berat:</span>
              <span className="font-medium">{totalWeight.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-foreground">
                Total Harga:
              </span>
              <span className="text-2xl font-bold text-primary">
                {formatRupiah(totalAmount)}
              </span>
            </div>
          </div>

          <Button
            onClick={onSaveTransaction}
            disabled={disabled || items.length === 0 || isSaving}
            className="w-full mt-4 bg-gradient-primary hover:bg-primary-glow text-lg py-6"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                Menyimpan...
              </>
            ) : (
              "Simpan Transaksi"
            )}
          </Button>
        </>
      )}
    </Card>
  );
}