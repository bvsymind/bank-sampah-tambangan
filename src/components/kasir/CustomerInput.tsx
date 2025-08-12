// import { useState } from "react";
// import { Search, QrCode, CheckCircle, XCircle } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { nasabahService, type Nasabah, formatRupiah } from "@/services/firebase";
// import { cn } from "@/lib/utils";
// import { QRScannerModal } from "./QRScannerModal";
// import { useToast } from "@/hooks/use-toast";

// interface CustomerInputProps {
//   onCustomerSelect: (customer: Nasabah | null) => void;
//   selectedCustomer: Nasabah | null;
// }

// export function CustomerInput({ onCustomerSelect, selectedCustomer }: CustomerInputProps) {
//   const [customerId, setCustomerId] = useState("");
//   const [isChecking, setIsChecking] = useState(false);
//   const [showQRScanner, setShowQRScanner] = useState(false);
//   const { toast } = useToast();

//   const handleQRScan = async (scannedId: string) => {
//     setCustomerId(scannedId);
//     // Auto check customer after QR scan
//     setTimeout(async () => {
//       try {
//         const customer = await nasabahService.getByIdNasabah(scannedId.trim());
//         onCustomerSelect(customer);
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: "Gagal mencari nasabah"
//         });
//       }
//     }, 100);
//   };

//   const handleCheckCustomer = async () => {
//     if (!customerId.trim()) return;
    
//     setIsChecking(true);
    
//     try {
//       const customer = await nasabahService.getByIdNasabah(customerId.trim());
//       onCustomerSelect(customer);
      
//       if (!customer) {
//         toast({
//           variant: "destructive",
//           title: "Nasabah Tidak Ditemukan",
//           description: "ID Nasabah tidak terdaftar dalam sistem"
//         });
//       }
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Gagal mencari nasabah. Periksa koneksi internet."
//       });
//       onCustomerSelect(null);
//     } finally {
//       setIsChecking(false);
//     }
//   };

//   const handleInputChange = (value: string) => {
//     setCustomerId(value);
//     // Reset customer when input changes
//     if (selectedCustomer) {
//       onCustomerSelect(null);
//     }
//   };

//   return (
//     <Card className="p-4 mb-6 bg-gradient-card border-0 shadow-card">
//       <h3 className="font-semibold text-foreground mb-3">
//         Data Nasabah
//       </h3>
      
//       <div className="space-y-3">
//         <div className="flex gap-2">
//           <div className="flex-1">
//             <Input
//               placeholder="Masukkan ID Nasabah"
//               value={customerId}
//               onChange={(e) => handleInputChange(e.target.value)}
//               className="bg-input border-border"
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter') {
//                   handleCheckCustomer();
//                 }
//               }}
//             />
//           </div>
//           <Button
//             variant="outline"
//             size="icon"
//             className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
//             onClick={() => setShowQRScanner(true)}
//           >
//             <QrCode className="h-4 w-4" />
//           </Button>
//           <Button
//             onClick={handleCheckCustomer}
//             disabled={!customerId.trim() || isChecking}
//             className="bg-primary hover:bg-primary-glow"
//           >
//             {isChecking ? (
//               <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
//             ) : (
//               <Search className="h-4 w-4 mr-2" />
//             )}
//             Cek
//           </Button>
//         </div>

//         {/* Customer Status */}
//         {customerId && !isChecking && (
//           <div className={cn(
//             "flex items-center gap-2 p-3 rounded-lg border",
//             selectedCustomer 
//               ? "bg-success/10 border-success text-success-foreground" 
//               : "bg-destructive/10 border-destructive text-destructive-foreground"
//           )}>
//             {selectedCustomer ? (
//               <>
//                 <CheckCircle className="h-5 w-5 text-success" />
//                 <div>
//                   <p className="font-medium text-success">
//                     {selectedCustomer.nama}
//                   </p>
//                   <p className="text-sm text-success/80">
//                     ID: {selectedCustomer.id_nasabah} • Saldo: {formatRupiah(selectedCustomer.saldo)}
//                   </p>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <XCircle className="h-5 w-5 text-destructive" />
//                 <p className="font-medium text-destructive">
//                   ID Nasabah tidak ditemukan
//                 </p>
//               </>
//             )}
//           </div>
//         )}
//       </div>

//       <QRScannerModal
//         isOpen={showQRScanner}
//         onClose={() => setShowQRScanner(false)}
//         onScan={handleQRScan}
//       />
//     </Card>
//   );
// }

// src/components/kasir/CustomerInput.tsx

import { useState, useEffect } from "react";
import { Search, QrCode, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { nasabahService, type Nasabah, formatRupiah } from "@/services/firebase";
import { cn } from "@/lib/utils";
import { QRScannerModal } from "./QRScannerModal";
import { useToast } from "@/hooks/use-toast";

interface CustomerInputProps {
  // Menerima value dan onChange dari parent
  value: string;
  onChange: (value: string) => void;
  onCustomerSelect: (customer: Nasabah | null) => void;
  selectedCustomer: Nasabah | null;
}

export function CustomerInput({ value: customerId, onChange, onCustomerSelect, selectedCustomer }: CustomerInputProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  // State baru untuk melacak apakah tombol "Cek" sudah diklik
  const [hasChecked, setHasChecked] = useState(false);
  const { toast } = useToast();

  // Reset status 'hasChecked' jika input dikosongkan secara manual
  useEffect(() => {
    if (!customerId) {
      setHasChecked(false);
    }
  }, [customerId]);

  const handleQRScan = async (scannedId: string) => {
    onChange(scannedId);
    // Auto check customer after QR scan
    setTimeout(async () => {
      try {
        setIsChecking(true);
        const customer = await nasabahService.getByIdNasabah(scannedId.trim());
        onCustomerSelect(customer);
        setHasChecked(true); // Tandai sudah dicek
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Gagal mencari nasabah" });
        onCustomerSelect(null);
      } finally {
        setIsChecking(false);
      }
    }, 100);
  };

  const handleCheckCustomer = async () => {
    if (!customerId.trim()) return;
    
    setIsChecking(true);
    
    try {
      const customer = await nasabahService.getByIdNasabah(customerId.trim());
      onCustomerSelect(customer);
      setHasChecked(true); // Tandai sudah dicek
      
      if (!customer) {
        toast({
          variant: "destructive",
          title: "Nasabah Tidak Ditemukan",
          description: "ID Nasabah tidak terdaftar dalam sistem"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mencari nasabah. Periksa koneksi internet."
      });
      onCustomerSelect(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue); // Kirim perubahan ke parent
    setHasChecked(false); // Reset status pengecekan setiap kali user mengetik
    if (selectedCustomer) {
      onCustomerSelect(null);
    }
  };

  return (
    <Card className="p-4 mb-6 bg-gradient-card border-0 shadow-card">
      <h3 className="font-semibold text-foreground mb-3">Data Nasabah</h3>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Masukkan ID Nasabah"
              value={customerId}
              onChange={(e) => handleInputChange(e.target.value)}
              className="bg-input border-border"
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCheckCustomer();
              }}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => setShowQRScanner(true)}
          >
            <QrCode className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleCheckCustomer}
            disabled={!customerId.trim() || isChecking}
            className="bg-primary hover:bg-primary-glow"
          >
            {isChecking ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <><Search className="h-4 w-4 mr-2" />Cek</>
            )}
          </Button>
        </div>

        {/* Customer Status: Hanya tampil jika sudah dicek */}
        {hasChecked && !isChecking && (
          <div className={cn(
            "flex items-center gap-2 p-3 rounded-lg border",
            selectedCustomer 
              ? "bg-success/10 border-success text-success-foreground" 
              : "bg-destructive/10 border-destructive text-destructive-foreground"
          )}>
            {selectedCustomer ? (
              <>
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium text-success">{selectedCustomer.nama}</p>
                  <p className="text-sm text-success/80">
                    ID: {selectedCustomer.id_nasabah} • Saldo: {formatRupiah(selectedCustomer.saldo)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-destructive" />
                <p className="font-medium text-destructive">ID Nasabah tidak ditemukan</p>
              </>
            )}
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