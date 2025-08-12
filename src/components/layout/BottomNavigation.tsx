import { Home, History, Users, Package, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'kasir', icon: Home, label: 'Kasir' },
  { id: 'riwayat', icon: History, label: 'Riwayat' },
  { id: 'nasabah', icon: Users, label: 'Nasabah' },
  { id: 'sampah', icon: Package, label: 'Sampah' },
  { id: 'tarik', icon: CreditCard, label: 'Tarik' },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center",
                "min-w-0 flex-1 py-2 px-1",
                "transition-colors duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 mb-1",
                  isActive && "text-primary"
                )} 
              />
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}