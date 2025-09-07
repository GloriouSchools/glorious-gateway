import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { UserRole } from "@/types/user";
import { Footer } from "./Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "@/assets/default-avatar.png";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

export function DashboardLayout({ children, userRole, userName, onLogout }: DashboardLayoutProps) {
  const navigate = useNavigate();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fade-in">
        <AppSidebar userRole={userRole} userName={userName} onLogout={onLogout} />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center justify-between px-4 animate-slide-in-right">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-xl font-semibold">Glorious Schools Management System</h1>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src={defaultAvatar} />
                <AvatarFallback>
                  <img src={defaultAvatar} alt="User avatar" className="h-full w-full object-cover" />
                </AvatarFallback>
              </Avatar>
            </button>
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