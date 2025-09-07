import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { PersonalInfo } from "@/components/profile/PersonalInfo";
import { DangerZone } from "@/components/profile/DangerZone";
import defaultAvatar from "@/assets/default-avatar.png";

export default function UserProfile() {
  const { userRole, userName, signOut, personalEmail, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.info("You have been logged out");
      navigate("/login");
    } catch (error: any) {
      toast.error("Failed to log out");
    }
  };

  return (
    <DashboardLayout userRole={userRole || "student"} userName={userName} onLogout={handleLogout}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={defaultAvatar} />
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {userName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{userName}</CardTitle>
                <CardDescription className="capitalize">{userRole} Account</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Personal Information - Read Only */}
        <PersonalInfo 
          userName={userName}
          userRole={userRole}
          userEmail={user?.email}
          personalEmail={personalEmail}
        />

        {/* Danger Zone - Editable Security Settings */}
        <DangerZone 
          personalEmail={personalEmail}
          userId={user?.id}
          userRole={userRole}
        />
      </div>
    </DashboardLayout>
  );
}