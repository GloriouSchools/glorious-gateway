import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { UserRole } from "@/types/user";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";
import { UserAvatarDropdown } from "@/components/ui/user-avatar-dropdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: UserRole;
  userName: string;
  photoUrl?: string | null;
  onLogout: () => void;
}

export function DashboardLayout({ children, userRole, userName, photoUrl, onLogout }: DashboardLayoutProps) {
  const navigate = useNavigate();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fade-in">
        <AppSidebar userRole={userRole} userName={userName} photoUrl={photoUrl} onLogout={onLogout} />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center justify-between px-4 animate-slide-in-right">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-xl font-semibold">Glorious Schools Management System</h1>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <UserAvatarDropdown 
                userName={userName} 
                photoUrl={photoUrl} 
                onLogout={onLogout} 
              />
            </div>
          </header>
          <main className="flex-1 p-6 bg-gradient-subtle animate-zoom-in">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}