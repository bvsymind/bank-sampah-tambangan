import { useState, useEffect, useRef } from "react";
import { Search, QrCode, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { nasabahService, type Nasabah, formatRupiah } from "@/services/firebase";
import { QRScannerModal } from "./QRScannerModal";
import { useToast } from "@/hooks/use-toast";

interface CustomerInputProps {
  onCustomerSelect: (customer: Nasabah | null) => void;
  selectedCustomer: Nasabah | null;
}

export function CustomerInput({ onCustomerSelect, selectedCustomer }: CustomerInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Nasabah[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }
    
    if (selectedCustomer && searchQuery === selectedCustomer.nama) {
        return;
    }


    const handler = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await nasabahService.searchNasabah(searchQuery);
        setSearchResults(results);
        setIsDropdownOpen(true);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal melakukan pencarian nasabah.",
        });
      } finally {
        setIsSearching(false);
      }
    }, 300); // Tunda pencarian selama 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, selectedCustomer, toast]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query) {
      onCustomerSelect(null);
    }
  };

  const handleSelectCustomer = (customer: Nasabah) => {
    onCustomerSelect(customer);
    setSearchQuery(customer.nama);
    setIsDropdownOpen(false);
    setSearchResults([]);
  };
  
  const handleQRScan = async (scannedId: string) => {
    setIsSearching(true);
    try {
      const customer = await nasabahService.getByIdNasabah(scannedId.trim());
      if (customer) {
        handleSelectCustomer(customer);
      } else {
        toast({ variant: "destructive", title: "Error", description: "Nasabah dari QR Code tidak ditemukan." });
        onCustomerSelect(null);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Gagal mencari nasabah" });
      onCustomerSelect(null);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!selectedCustomer) {
      setSearchQuery("");
    }
  }, [selectedCustomer]);


  return (
    <Card className="p-4 mb-6 bg-gradient-card border-0 shadow-card" ref={containerRef}>
      <h3 className="font-semibold text-foreground mb-3">Cari Nasabah</h3>
      
      <div className="space-y-3">
        <div className="flex gap-2 relative">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ketik ID atau Nama Nasabah..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => searchQuery.length > 1 && setIsDropdownOpen(true)}
              className="bg-input border-border pl-9"
            />
            {isSearching && <Loader2 className="animate-spin h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />}
            
            {isDropdownOpen && (searchQuery.length > 1) && (
              <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg z-10 shadow-lg max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map(customer => (
                      <li
                        key={customer.id}
                        onClick={() => handleSelectCustomer(customer)}
                        className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                      >
                        <p className="font-medium text-foreground">{customer.nama}</p>
                        <p className="text-sm text-muted-foreground">ID: {customer.id_nasabah}</p>
                      </li>
                    ))}
                  </ul>
                ) : !isSearching && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Nasabah tidak ditemukan.
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground flex-shrink-0"
            onClick={() => setShowQRScanner(true)}
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>

        {selectedCustomer && (
          <div className="flex items-start gap-3 p-3 rounded-lg border bg-success/10 border-success text-success-foreground">
            <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-success">{selectedCustomer.nama}</p>
              <p className="text-sm text-success/80">
                ID: {selectedCustomer.id_nasabah} • Saldo: {formatRupiah(selectedCustomer.saldo)}
              </p>
            </div>
          </div>
        )}
      </div>

      <QRScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />
    </Card>
  );
}

