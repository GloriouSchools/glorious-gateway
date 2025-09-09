import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  GraduationCap,
  TrendingUp,
  MessageSquare,
  ClipboardList,
  Award,
  DollarSign,
  Library,
  UserCheck,
  BarChart3
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultAvatar from "@/assets/default-avatar.png";
import { UserRole } from "@/types/user";

interface AppSidebarProps {
  userRole: UserRole;
  userName: string;
  photoUrl?: string | null;
  onLogout: () => void;
}

export function AppSidebar({ userRole, userName, photoUrl, onLogout }: AppSidebarProps) {
  const getMenuItems = () => {
    const commonItems = [
      { title: "Dashboard", icon: Home, url: `/${userRole}` },
    ];

    switch (userRole) {
      case "student":
        return [
          { title: "Dashboard", icon: Home, url: "/" },
          { title: "My Courses", icon: BookOpen, url: "/courses" },
          { title: "Assignments", icon: ClipboardList, url: "/assignments" },
          { title: "Grades", icon: Award, url: "/grades" },
          { title: "Schedule", icon: Calendar, url: "/schedule" },
          { title: "Library", icon: Library, url: "/library" },
          { title: "Messages", icon: MessageSquare, url: "/messages" },
          { title: "Fees", icon: DollarSign, url: "/fees" },
        ];
      case "teacher":
        return [
          { title: "Dashboard", icon: Home, url: "/" },
          { title: "My Classes", icon: GraduationCap, url: "/classes" },
          { title: "Students", icon: Users, url: "/students" },
          { title: "Assignments", icon: ClipboardList, url: "/assignments" },
          { title: "Grades", icon: TrendingUp, url: "/grades" },
          { title: "Schedule", icon: Calendar, url: "/schedule" },
          { title: "Attendance", icon: UserCheck, url: "/attendance" },
          { title: "Messages", icon: MessageSquare, url: "/messages" },
          { title: "Reports", icon: FileText, url: "/reports" },
        ];
      case "admin":
        return [
          { title: "Dashboard", icon: Home, url: "/" },
          { title: "Students", icon: GraduationCap, url: "/students" },
          { title: "Teachers", icon: Users, url: "/teachers" },
          { title: "Courses", icon: BookOpen, url: "/courses" },
          { title: "Analytics", icon: BarChart3, url: "/analytics" },
          { title: "Finance", icon: DollarSign, url: "/finance" },
          { title: "Reports", icon: FileText, url: "/reports" },
          { title: "Settings", icon: Settings, url: "/settings" },
        ];
      default:
        return [{ title: "Dashboard", icon: Home, url: "/" }];
    }
  };

  const menuItems = getMenuItems();
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={photoUrl || defaultAvatar} />
              <AvatarFallback>
                <img src={defaultAvatar} alt="User avatar" className="h-full w-full object-cover" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenuButton onClick={onLogout} className="w-full">
          <LogOut className="h-4 w-4 mr-3" />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}