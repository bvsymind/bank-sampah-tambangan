import { Recycle, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-hero shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
              <Recycle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {title}
              </h1>
              <p className="text-white/80 text-sm">
                Bank Sampah Digital
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="ghost"
              className="text-white hover:bg-white/20 p-2"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              className="text-white hover:bg-white/20 p-2"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}