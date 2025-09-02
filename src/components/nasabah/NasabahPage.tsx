import { useState, useEffect, useRef } from "react";
import { Edit2, Trash2, UserPlus, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddNasabahModal } from "./AddNasabahModal";
import { EditNasabahModal } from "./EditNasabahModal";
import { nasabahService, type Nasabah, formatRupiah } from "@/services/firebase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function DraggableFloatingActionButton({ 
  onClick, 
  children 
}: { 
  onClick: () => void; 
  children: React.ReactNode; 
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragThreshold = 8;

  useEffect(() => {
    const initPosition = () => {
      const buttonSize = 56;
      const margin = 20;
      setPosition({
        x: window.innerWidth - buttonSize - margin,
        y: window.innerHeight - buttonSize - margin - 80
      });
      setIsInitialized(true);
    };
    initPosition();
    window.addEventListener('resize', initPosition);
    return () => window.removeEventListener('resize', initPosition);
  }, []);

  const snapToSide = (currentX: number, currentY: number) => {
    const buttonSize = 56;
    const margin = 20;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const bottomNavHeight = 80;
    const minY = margin;
    const maxY = screenHeight - buttonSize - margin - bottomNavHeight;
    const clampedY = Math.max(minY, Math.min(maxY, currentY));
    const centerX = screenWidth / 2;
    const snapToLeft = currentX < centerX;
    return {
      x: snapToLeft ? margin : screenWidth - buttonSize - margin,
      y: clampedY
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setInitialMousePos({ x: e.clientX, y: e.clientY });
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    const totalDistance = Math.sqrt(
      Math.pow(e.clientX - initialMousePos.x, 2) + 
      Math.pow(e.clientY - initialMousePos.y, 2)
    );
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    if (totalDistance < dragThreshold) {
      onClick();
    } else {
      const snappedPosition = snapToSide(position.x, position.y);
      setPosition(snappedPosition);
    }
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    setIsDragging(true);
    setInitialMousePos({ x: touch.clientX, y: touch.clientY });
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging) return;
    const touch = e.changedTouches[0];
    const totalDistance = Math.sqrt(
      Math.pow(touch.clientX - initialMousePos.x, 2) + 
      Math.pow(touch.clientY - initialMousePos.y, 2)
    );
    if (totalDistance < dragThreshold) {
      onClick();
    } else {
      const snappedPosition = snapToSide(position.x, position.y);
      setPosition(snappedPosition);
    }
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMoveGlobal = (e: MouseEvent) => handleMouseMove(e);
      const handleMouseUpGlobal = (e: MouseEvent) => handleMouseUp(e);
      const handleTouchMoveGlobal = (e: TouchEvent) => handleTouchMove(e);
      const handleTouchEndGlobal = (e: TouchEvent) => handleTouchEnd(e);

      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleMouseUpGlobal);
      document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
      document.addEventListener('touchend', handleTouchEndGlobal);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveGlobal);
        document.removeEventListener('mouseup', handleMouseUpGlobal);
        document.removeEventListener('touchmove', handleTouchMoveGlobal);
        document.removeEventListener('touchend', handleTouchEndGlobal);
        document.body.style.overflow = '';
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, dragStart, position, initialMousePos]);

  return (
    <button
      ref={buttonRef}
      className={cn( "fixed z-50 w-14 h-14 rounded-full", "bg-gradient-primary hover:bg-primary-glow shadow-floating", "text-white transition-all duration-200", "flex items-center justify-center", "touch-none select-none", isDragging ? "cursor-grabbing scale-110 shadow-2xl" : "cursor-grab hover:scale-105", !isInitialized && "opacity-0" )}
      style={{ left: `${position.x}px`, top: `${position.y}px`, transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      type="button"
      aria-label="Tambah Nasabah"
    >
      <span className={cn( "transition-transform duration-150", isDragging ? "scale-90" : "scale-100" )}>
        {children}
      </span>
    </button>
  );
}

export function NasabahPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNasabah, setEditingNasabah] = useState<Nasabah | null>(null);
  const [nasabahList, setNasabahList] = useState<Nasabah[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadNasabah();
  }, []);

  const loadNasabah = async () => {
    try {
      setLoading(true);
      const data = await nasabahService.getAll();
      setNasabahList(data);
    } catch (error) {
      console.error("Error loading nasabah:", error);
      toast({ variant: "destructive", title: "Error", description: "Gagal memuat data nasabah. Periksa koneksi internet." });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadNasabah();
      toast({ title: "Data Diperbarui", description: "Data nasabah berhasil diperbarui" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Gagal memperbarui data" });
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddNasabah = async (newNasabah: Omit<Nasabah, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await nasabahService.add(newNasabah);
      await loadNasabah();
      toast({ title: "Berhasil", description: "Nasabah baru berhasil ditambahkan" });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding nasabah:", error);
      toast({ variant: "destructive", title: "Error", description: "Gagal menambahkan nasabah. Silakan coba lagi." });
    }
  };

  const handleEdit = (nasabahToEdit: Nasabah) => {
    setEditingNasabah(nasabahToEdit);
    setShowEditModal(true);
  };

  const handleUpdateNasabah = async (updatedData: Partial<Nasabah>) => {
    if (!editingNasabah?.id) return;
    try {
      await nasabahService.update(editingNasabah.id, updatedData);
      await loadNasabah();
      toast({ title: "Berhasil", description: "Data nasabah berhasil diperbarui." });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating nasabah:", error);
      toast({ variant: "destructive", title: "Error", description: "Gagal memperbarui data nasabah." });
    }
  };

  const handleDelete = async (nasabah: Nasabah) => {
    if (!nasabah.id || !nasabah.id_nasabah) return;
    
    try {
      await nasabahService.delete(nasabah.id, nasabah.id_nasabah);
      setNasabahList(prev => prev.filter(n => n.id !== nasabah.id));
      toast({
        title: "Berhasil Dihapus",
        description: `Nasabah "${nasabah.nama}" beserta seluruh riwayat transaksinya telah dihapus.`
      });
    } catch (error) {
      console.error("Error deleting nasabah and transactions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus nasabah dan transaksinya."
      });
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Data Nasabah ({nasabahList.length})</h2>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {nasabahList.length === 0 ? (
          <Card className="p-8 text-center">
            <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Belum ada nasabah yang terdaftar</p>
            <Button onClick={() => setShowAddModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Tambah Nasabah Pertama
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {nasabahList.map((nasabah) => (
              <Card key={nasabah.id} className="p-4 bg-gradient-card border-0 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                        <span>{nasabah.nama.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          <h3 className="font-semibold text-foreground break-words">{nasabah.nama}</h3>
                          <p className="text-sm text-muted-foreground">ID: {nasabah.id_nasabah}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground break-words">{nasabah.alamat}</p>
                          <div className="flex justify-between text-sm">
                            <span>Saldo:</span>
                            <span className="font-semibold text-primary">{formatRupiah(nasabah.saldo)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Bergabung:</span>
                            <span>{new Date(nasabah.created_at).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(nasabah)}
                      className="h-8 w-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini akan menghapus nasabah{" "}
                            <span className="font-semibold">{nasabah.nama}</span> beserta{" "}
                            <span className="font-bold text-destructive">SELURUH RIWAYAT TRANSAKSINYA</span> secara permanen. Tindakan ini tidak dapat diurungkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(nasabah)}>
                            Ya, Hapus Semua
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <DraggableFloatingActionButton onClick={() => setShowAddModal(true)}>
          <UserPlus className="h-6 w-6" />
        </DraggableFloatingActionButton>

        <AddNasabahModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddNasabah}
          existingIds={nasabahList.map(n => n.id_nasabah)}
        />
        
        <EditNasabahModal 
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateNasabah}
          nasabah={editingNasabah}
        />
      </div>
    </div>
  );
}