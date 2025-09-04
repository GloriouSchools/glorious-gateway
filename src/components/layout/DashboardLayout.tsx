import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { UserRole } from "@/types/user";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

export function DashboardLayout({ children, userRole, userName, onLogout }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar userRole={userRole} userName={userName} onLogout={onLogout} />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center px-4">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xl font-semibold">Glorious Schools Management System</h1>
          </header>
          <main className="flex-1 p-6 bg-gradient-subtle">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}