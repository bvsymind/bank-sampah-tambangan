import { useState, useEffect } from "react";
import { CreditCard, AlertCircle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { nasabahService, transaksiService, type Nasabah, formatRupiah } from "@/services/firebase";
import { useToast } from "@/hooks/use-toast";

const CustomerDisplay = ({ nasabah }: { nasabah: Nasabah | undefined }) => {
  if (!nasabah) {
    return <span className="text-muted-foreground">Cari dan pilih nasabah...</span>;
  }

  return (
    <div className="flex items-center justify-between w-full overflow-hidden">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{nasabah.nama}</p>
        <p className="text-xs text-muted-foreground truncate">ID: {nasabah.id_nasabah}</p>
      </div>
      <span className="text-sm font-semibold text-primary ml-4 flex-shrink-0">
        {formatRupiah(nasabah.saldo)}
      </span>
    </div>
  );
};

export function TarikPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [nasabahList, setNasabahList] = useState<Nasabah[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadNasabah();
  }, []);

  const loadNasabah = async () => {
    try {
      setLoading(true);
      const data = await nasabahService.getAll();
      setNasabahList(data.filter(n => n.saldo > 0));
    } catch (error) {
      console.error("Error loading nasabah:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data nasabah. Periksa koneksi internet."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadNasabah();
    const currentCustomerExists = nasabahList.some(n => n.id_nasabah === selectedCustomerId);
    if (selectedCustomerId && !currentCustomerExists) {
        setSelectedCustomerId("");
        setWithdrawAmount("");
    }
    toast({
      title: "Data Diperbarui",
      description: "Data nasabah berhasil diperbarui"
    });
  };

  const selectedCustomer = nasabahList.find(n => n.id_nasabah === selectedCustomerId);

  const handleWithdraw = async () => {
    if (!selectedCustomer) {
      toast({ variant: "destructive", title: "Error", description: "Silakan pilih nasabah terlebih dahulu" });
      return;
    }
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Jumlah penarikan harus berupa angka positif" });
      return;
    }
    if (amount > selectedCustomer.saldo) {
      toast({ variant: "destructive", title: "Error", description: "Jumlah penarikan melebihi saldo yang tersedia" });
      return;
    }

    setProcessing(true);
    try {
      await transaksiService.addTarik(
        selectedCustomer.id_nasabah,
        selectedCustomer.nama,
        amount
      );
      toast({
        title: "Penarikan Berhasil",
        description: `Penarikan ${formatRupiah(amount)} untuk ${selectedCustomer.nama} berhasil diproses`
      });
      setSelectedCustomerId("");
      setWithdrawAmount("");
      await loadNasabah();
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memproses penarikan. Silakan coba lagi."
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="py-6 space-y-6">
        <Card className="p-6 bg-gradient-card border-0 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Penarikan Saldo</h2>
                <p className="text-muted-foreground">Proses penarikan dana nasabah</p>
              </div>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={processing}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Pilih Nasabah</label>
              {nasabahList.length === 0 ? (
                <Card className="p-4 bg-muted/50 border-dashed">
                  <p className="text-center text-muted-foreground">Tidak ada nasabah dengan saldo yang bisa ditarik</p>
                </Card>
              ) : (
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId} disabled={processing}>
                  <SelectTrigger className="bg-input h-auto">
                    <CustomerDisplay nasabah={selectedCustomer} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover" position="popper">
                    {nasabahList.map(nasabah => (
                      <SelectItem key={nasabah.id_nasabah} value={nasabah.id_nasabah}>
                        <CustomerDisplay nasabah={nasabah} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedCustomer && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">Informasi Nasabah</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nama:</span>
                    <span className="font-medium text-right">{selectedCustomer.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID Nasabah:</span>
                    <span className="font-medium">{selectedCustomer.id_nasabah}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alamat:</span>
                    <span className="font-medium text-right max-w-[50%] truncate">{selectedCustomer.alamat}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Saldo Saat Ini:</span>
                    <span className="font-bold text-primary text-lg">{formatRupiah(selectedCustomer.saldo)}</span>
                  </div>
                </div>
              </Card>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Jumlah Penarikan (Rp)</label>
              <Input
                type="number"
                placeholder="0"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="bg-input text-lg"
                min="0"
                step="1000"
                disabled={!selectedCustomer || processing}
              />
              {selectedCustomer && withdrawAmount && (
                <div className="mt-2">
                  {parseFloat(withdrawAmount) > selectedCustomer.saldo ? (
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Jumlah melebihi saldo yang tersedia</span>
                    </div>
                  ) : parseFloat(withdrawAmount) > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Saldo setelah penarikan: {formatRupiah(selectedCustomer.saldo - parseFloat(withdrawAmount))}
                    </p>
                  ) : null}
                </div>
              )}
              {selectedCustomer && (
                <div className="mt-3 flex gap-2">
                  {[25000, 50000, 100000].map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setWithdrawAmount(amount.toString())}
                      disabled={amount > selectedCustomer.saldo || processing}
                      className="text-xs"
                    >
                      {formatRupiah(amount)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={handleWithdraw}
              disabled={
                !selectedCustomer || 
                !withdrawAmount || 
                parseFloat(withdrawAmount) <= 0 ||
                parseFloat(withdrawAmount) > (selectedCustomer?.saldo || 0) ||
                processing
              }
              className="w-full bg-gradient-primary hover:bg-primary-glow text-lg py-6"
            >
              {processing ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Memproses...
                </>
              ) : "Proses Penarikan"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

