import { useState } from "react";
import { LoginPage } from "./Login";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudentDashboard } from "@/components/dashboards/StudentDashboard";
import { TeacherDashboard } from "@/components/dashboards/TeacherDashboard";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { UserRole } from "@/types/user";
import { toast } from "sonner";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [userName, setUserName] = useState("");

  const handleLogin = (email: string, password: string, role: UserRole) => {
    // This is where you would normally validate credentials
    // For demo purposes, we'll accept any login
    setIsAuthenticated(true);
    setUserRole(role);
    
    // Extract name from email for demo
    const name = email.split('@')[0].replace(/[0-9]/g, '');
    setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    
    toast.success(`Welcome to Glorious Schools!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    toast.info("You have been logged out");
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    switch (userRole) {
      case "student":
        return <StudentDashboard />;
      case "teacher":
        return <TeacherDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <DashboardLayout userRole={userRole} userName={userName} onLogout={handleLogout}>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Index;
