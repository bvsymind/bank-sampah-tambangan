import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, User, Copyright } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function InfoPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>

        <Card className="p-6 bg-gradient-card border-0 shadow-card">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Tentang Aplikasi Bank Sampah
          </h2>
          <p className="text-muted-foreground">
            Aplikasi ini merupakan sistem manajemen digital untuk Bank Sampah Sido Makmur. Dibuat untuk mempermudah proses pencatatan transaksi, pengelolaan data nasabah, dan pemantauan jenis sampah, sehingga operasional bank sampah menjadi lebih efisien, transparan, dan modern.
          </p>
        </Card>

        <Card className="p-6 bg-gradient-card border-0 shadow-card">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Dikembangkan Oleh
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">KKN-T IDBU Tim 85</p>
                <p className="text-sm text-muted-foreground">Universitas Diponegoro 2025</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Brian Fari Firmansyah</p>
                <p className="text-sm text-muted-foreground">Teknik Elektro</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center text-muted-foreground text-sm flex items-center justify-center gap-2 pt-4">
          <Copyright className="h-4 w-4" />
          <span>2025 - Bank Sampah Sido Makmur</span>
        </div>
      </div>
    </div>
  );
}
