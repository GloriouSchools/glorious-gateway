import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Lock, Mail, Shield, AlertTriangle, Eye, EyeOff, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { evaluatePasswordStrength } from "@/utils/passwordStrength";

interface SecureAccountFormProps {
  userType: 'student' | 'teacher' | 'admin';
  userId?: string;
  userName?: string;
  currentEmail?: string;
  onSuccess?: () => void;
}

export function SecureAccountForm({ userType, userId, userName, currentEmail, onSuccess }: SecureAccountFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [personalEmail, setPersonalEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  
  const passwordStrength = evaluatePasswordStrength(password);
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleEmailChange = (email: string) => {
    setPersonalEmail(email);
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else if (email && email.endsWith('@glorious.com')) {
      setEmailError("Please use a personal email address, not a school email");
    } else {
      setEmailError("");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personalEmail || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (emailError) {
      toast.error("Please fix the email error");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (passwordStrength.score < 3) {
      toast.error("Please choose a stronger password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For students, update their record with personal email and password
      if (userType === 'student' && userId) {
        // Update student record with personal email and password
        const { data, error } = await supabase
          .rpc('update_student_password', {
            p_student_id: userId,
            p_personal_email: personalEmail,
            p_password_hash: password // In production, this should be properly hashed
          });
        
        if (error) throw error;
        
        // Sign up with Supabase Auth for email verification
        const { error: signUpError } = await supabase.auth.signUp({
          email: personalEmail,
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: userName,
              role: 'student',
              student_id: userId,
              is_secured: true
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        toast.success("Security settings updated! Please check your email to verify your personal email address.");
        
        if (onSuccess) {
          onSuccess();
        }
      } else if (userType === 'admin') {
        // For admin, sign up with the personal email
        const { error: signUpError } = await supabase.auth.signUp({
          email: personalEmail,
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: 'System Administrator',
              role: 'admin',
              is_secured: true
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        toast.success("Security settings updated! Please check your email to verify your personal email address.");
        
        if (onSuccess) {
          onSuccess();
        }
      }
      // Similar logic can be added for teachers
      
    } catch (error: any) {
      toast.error(error.message || "Failed to secure account");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Secure Your Account</CardTitle>
        </div>
        <CardDescription>
          Add a personal email and create a strong password to protect your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">Account at Risk</p>
                <p className="text-xs text-muted-foreground">
                  Your account is currently using default credentials. Secure it now to prevent unauthorized access.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Current School Email</Label>
            <Input 
              value={currentEmail || ''} 
              disabled 
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="personal-email">Personal Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="personal-email"
                type="email"
                placeholder="your.email@example.com"
                value={personalEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                disabled={isLoading}
                className="pl-10"
                required
              />
            </div>
            {emailError && (
              <p className="text-xs text-destructive">{emailError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              You'll be able to login with both your school and personal email
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {password && (
              <div className="space-y-2">
                <Progress value={passwordStrength.percentage} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium ${
                    passwordStrength.color === "bg-destructive" ? "text-destructive" : 
                    passwordStrength.color === "bg-orange-500" ? "text-orange-500" : 
                    "text-green-600"
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Use at least 8 characters with uppercase, lowercase, numbers, and special characters
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Securing account...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Secure My Account
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}