import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, Phone, Calendar, MapPin, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function UserProfile() {
  const { userRole, userName, signOut, personalEmail, user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    personalEmail: personalEmail || "",
    phone: "",
    address: "",
    dateOfBirth: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleLogout = async () => {
    try {
      await signOut();
      toast.info("You have been logged out");
      navigate("/login");
    } catch (error: any) {
      toast.error("Failed to log out");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validate password change if attempted
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("New passwords do not match");
          setLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          toast.error("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
      }

      // Update personal email if changed
      if (formData.personalEmail && formData.personalEmail !== personalEmail) {
        const { error } = await supabase.rpc('verify_user_account', {
          p_user_type: userRole,
          p_user_id: user?.id,
          p_personal_email: formData.personalEmail
        });
        
        if (error) throw error;
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error: any) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole={userRole || "student"} userName={userName} onLogout={handleLogout}>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xl">
                    {userName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{userName}</CardTitle>
                  <CardDescription className="capitalize">{userRole} Profile</CardDescription>
                </div>
              </div>
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={loading}
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  "Edit Profile"
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Some information cannot be changed. Contact admin for assistance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Non-editable fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="inline mr-2 h-4 w-4" />
                  Full Name
                </Label>
                <Input id="name" value={userName} disabled />
              </div>
              
              {userRole === 'student' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Input id="class" value="Form 4" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stream">Stream</Label>
                    <Input id="stream" value="Science" disabled />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="schoolEmail">School Email</Label>
                <Input id="schoolEmail" value={user?.email || ""} disabled />
              </div>
            </div>

            <Separator />

            {/* Editable fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="personalEmail">
                  <Mail className="inline mr-2 h-4 w-4" />
                  Personal Email
                </Label>
                <Input
                  id="personalEmail"
                  type="email"
                  value={formData.personalEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, personalEmail: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter personal email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="inline mr-2 h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">
                  <Calendar className="inline mr-2 h-4 w-4" />
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="inline mr-2 h-4 w-4" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>
                <Lock className="inline mr-2 h-4 w-4" />
                Change Password
              </CardTitle>
              <CardDescription>
                Leave blank to keep your current password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isEditing && (
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}