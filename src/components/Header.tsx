// src/components/Header.tsx
import { Recycle, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { adminData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    } else {
      console.error('Logout failed:', result.error);
    }
  };

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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-2"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {adminData?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}