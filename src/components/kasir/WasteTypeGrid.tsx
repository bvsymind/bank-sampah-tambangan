import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { jenisSampahService, type JenisSampah, formatRupiah } from "@/services/firebase";
import { useToast } from "@/hooks/use-toast";

interface WasteTypeGridProps {
  onWasteTypeSelect: (wasteType: JenisSampah) => void;
  disabled?: boolean;
}

export function WasteTypeGrid({ onWasteTypeSelect, disabled }: WasteTypeGridProps) {
  const [wasteTypes, setWasteTypes] = useState<JenisSampah[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadWasteTypes();
  }, []);

  const loadWasteTypes = async () => {
    try {
      setLoading(true);
      const data = await jenisSampahService.getAll();
      setWasteTypes(data);
    } catch (error) {
      console.error("Error loading waste types:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat jenis sampah. Periksa koneksi internet."
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-6">
        <h3 className="font-semibold text-foreground mb-3">
          Pilih Jenis Sampah
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-3 animate-pulse">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-muted rounded-lg"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-foreground mb-3">
        Pilih Jenis Sampah
      </h3>
      
      {wasteTypes.length === 0 ? (
        <Card className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Belum ada jenis sampah yang tersedia</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {wasteTypes.map((wasteType) => (
            <Card
              key={wasteType.id}
              className={`
                p-3 cursor-pointer transition-all duration-200
                hover:shadow-card hover:scale-105
                border border-border
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}
              `}
              onClick={() => !disabled && onWasteTypeSelect(wasteType)}
            >
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  {wasteType.foto_url && wasteType.foto_url !== "/placeholder-waste.jpg" ? (
                    <img 
                      src={wasteType.foto_url} 
                      alt={wasteType.nama}
                      className="w-8 h-8 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <Package className={`h-6 w-6 text-white ${wasteType.foto_url && wasteType.foto_url !== "/placeholder-waste.jpg" ? 'hidden' : ''}`} />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-foreground line-clamp-2">
                    {wasteType.nama}
                  </h4>
                  <p className="text-xs text-primary font-semibold">
                    {formatRupiah(wasteType.harga_kg)}/kg
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
};