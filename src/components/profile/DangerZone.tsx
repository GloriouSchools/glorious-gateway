import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { checkPasswordStrength } from "@/utils/passwordStrength";
import { supabase } from "@/integrations/supabase/client";

interface DangerZoneProps {
  personalEmail: string | null;
  userId: string | undefined;
  userRole: string | null;
}

export function DangerZone({ personalEmail, userId, userRole }: DangerZoneProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    personalEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [emailError, setEmailError] = useState("");

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [] as string[],
    level: 'weak' as 'weak' | 'medium' | 'strong',
    color: 'hsl(var(--destructive))'
  });

  const handlePasswordChange = (value: string) => {
    setFormData(prev => ({ ...prev, newPassword: value }));
    if (value) {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({
        score: 0,
        feedback: [],
        level: 'weak',
        color: 'hsl(var(--destructive))'
      });
    }
  };

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, personalEmail: value }));
    
    if (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  };

  const handleVerifyEmail = async () => {
    if (!formData.personalEmail) {
      toast.error("Please enter an email address");
      return;
    }

    if (emailError) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // Send verification email using Supabase auth
      const { error } = await supabase.auth.updateUser({
        email: formData.personalEmail
      });
      
      if (error) {
        console.error('Email verification error:', error);
        toast.error("Failed to send verification email: " + error.message);
        return;
      }
      
      // Update database record with new email
      if (userRole === 'student') {
        const { error } = await supabase
          .from('students')
          .update({ personal_email: formData.personalEmail })
          .eq('id', userId);
        
        if (error) throw error;
      } else if (userRole === 'teacher') {
        const { error } = await supabase
          .from('teachers')
          .update({ personal_email: formData.personalEmail })
          .eq('id', userId);
        
        if (error) throw error;
      } else if (userRole === 'admin') {
        const { error } = await supabase
          .from('admins')
          .update({ personal_email: formData.personalEmail })
          .eq('id', userId);
        
        if (error) throw error;
      }
      
      toast.success("Verification email sent! Please check your email to confirm the change.");
      setFormData(prev => ({ ...prev, personalEmail: "" }));
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast.error("Failed to update email: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!formData.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    if (passwordStrength.score < 3) {
      toast.error("Please create a stronger password");
      return;
    }

    setIsLoading(true);
    try {
      // Update auth password
      const { error: authError } = await supabase.auth.updateUser({
        password: formData.newPassword
      });
      
      if (authError) {
        console.error('Password update error:', authError);
        toast.error("Failed to update password: " + authError.message);
        return;
      }
      
      // Update database record
      if (userRole === 'student') {
        const { error } = await supabase
          .from('students')
          .update({ password_hash: formData.newPassword })
          .eq('id', userId);
        
        if (error) throw error;
      } else if (userRole === 'teacher') {
        const { error } = await supabase
          .from('teachers')
          .update({ password_hash: formData.newPassword })
          .eq('id', userId);
        
        if (error) throw error;
      } else if (userRole === 'admin') {
        const { error } = await supabase
          .from('admins')
          .update({ password_hash: formData.newPassword })
          .eq('id', userId);
        
        if (error) throw error;
      }
      
      toast.success("Password updated successfully!");
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      setPasswordStrength({
        score: 0,
        feedback: [],
        level: 'weak',
        color: 'hsl(var(--destructive))'
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error("Failed to update password: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = () => {
    switch (passwordStrength.level) {
      case 'weak':
        return 'bg-destructive';
      case 'medium':
        return 'bg-warning';
      case 'strong':
        return 'bg-success';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          DANGER ZONE
        </CardTitle>
        <CardDescription>
          Critical security settings. Changes here affect your account security.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Email Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Personal Email Address
          </h3>
          <div className="space-y-2">
            <Label htmlFor="personalEmail">
              Email for Account Recovery
            </Label>
            <Input
              id="personalEmail"
              type="email"
              value={formData.personalEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Enter your personal email"
              className="font-mono"
            />
            {emailError && (
              <p className="text-xs text-destructive mt-1">{emailError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              A verification link will be sent to this email address
            </p>
          </div>
        </div>

        <Separator />

        {/* Password Change Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Change Password
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Enter new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(passwordStrength.score / 4) * 100} 
                    className={`h-2 flex-1 ${getProgressColor()}`}
                  />
                  <span className="text-xs font-semibold capitalize" style={{ color: passwordStrength.color }}>
                    {passwordStrength.level}
                  </span>
                </div>
                <ul className="text-xs space-y-1">
                  {passwordStrength.feedback.map((tip, index) => (
                    <li key={index} className="text-muted-foreground">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>

          <div className="bg-muted p-3 rounded-md">
            <p className="text-xs font-semibold mb-2">Strong Password Requirements:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• At least 8 characters long</li>
              <li>• Include at least one uppercase letter (A-Z)</li>
              <li>• Include at least one number (0-9)</li>
              <li>• Include at least one special character (!@#$%^&*)</li>
            </ul>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-3">
          <Button 
            onClick={handleVerifyEmail}
            disabled={isLoading || !formData.personalEmail || !!emailError}
            variant="outline"
          >
            {isLoading ? "Sending..." : "Verify Email"}
          </Button>
          <Button 
            onClick={handleChangePassword}
            disabled={isLoading || !formData.newPassword || formData.newPassword !== formData.confirmPassword || passwordStrength.score < 3}
            variant="destructive"
          >
            {isLoading ? "Updating..." : "Change Password"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}