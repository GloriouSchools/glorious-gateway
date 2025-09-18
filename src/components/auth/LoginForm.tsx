import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Loader2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { useNavigate, useLocation } from "react-router-dom";

interface LoginFormProps {
  schoolLogo: string;
}

export function LoginForm({ schoolLogo }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  
  // Email validation states
  const [emailError, setEmailError] = useState("");
  
  // Remember me state
  const [rememberMe, setRememberMe] = useState(false);
  
  // Password recovery dialog state
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  // Clear form data when component mounts or on logout for security
  useEffect(() => {
    const clearFormData = () => {
      setSignInData({
        email: "",
        password: "",
      });
      setRecoveryEmail("");
      setEmailError("");
      setShowPassword(false);
      setRememberMe(false);
    };

    // Clear on mount
    clearFormData();

    // Listen for logout event
    const handleClearFormData = () => clearFormData();
    window.addEventListener('clearFormData', handleClearFormData);

    return () => {
      window.removeEventListener('clearFormData', handleClearFormData);
    };
  }, []);
  
  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Handle email changes with validation
  const handleEmailChange = (email: string) => {
    setSignInData({ ...signInData, email });
    if (email && !validateEmail(email)) {
      setEmailError("Please type a correct email address");
    } else {
      setEmailError("");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting login with email:', signInData.email);
      
      // First, try direct database authentication as fallback
      let userData = null;
      let userRole = null;
      
      // Try to find user in students table
      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('email', signInData.email)
        .maybeSingle();
      
      if (student) {
        const correctPassword = student.password_hash || student.default_password;
        if (correctPassword === signInData.password) {
          userData = student;
          userRole = 'student';
        }
      }
      
      // Try teachers table if no student found
      if (!userData) {
        const { data: teacher } = await supabase
          .from('teachers')
          .select('*')
          .eq('email', signInData.email)
          .maybeSingle();
        
        if (teacher && teacher.password_hash === signInData.password) {
          userData = teacher;
          userRole = 'teacher';
        }
      }
      
      // Try admins table if no teacher found
      if (!userData) {
        const { data: admin } = await supabase
          .from('admins')
          .select('*')
          .eq('email', signInData.email)
          .maybeSingle();
        
        if (admin && admin.password_hash === signInData.password) {
          userData = admin;
          userRole = 'admin';
        }
      }
      
      if (!userData) {
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }
      
      // Store session info based on role
      const name = userData.name;
      const isVerified = userData.is_verified || false;
      const personalEmail = userData.personal_email;
      const photoUrl = userData.photo_url;
      const email = userData.email;
      const userId = userData.id;
      
      if (userRole === 'admin') {
        localStorage.setItem('adminToken', 'admin-token-' + userId);
        localStorage.setItem('adminRole', 'admin');
        localStorage.setItem('adminName', name);
        localStorage.setItem('adminVerified', String(isVerified));
        localStorage.setItem('adminId', userId);
        localStorage.setItem('adminEmail', email);
        if (personalEmail) {
          localStorage.setItem('adminPersonalEmail', personalEmail);
        }
      } else if (userRole === 'teacher') {
        localStorage.setItem('teacherToken', 'teacher-token-' + userId);
        localStorage.setItem('teacherRole', 'teacher');
        localStorage.setItem('teacherName', name);
        localStorage.setItem('teacherId', userId);
        localStorage.setItem('teacherEmail', email);
        localStorage.setItem('teacherVerified', String(isVerified));
        if (personalEmail) {
          localStorage.setItem('teacherPersonalEmail', personalEmail);
        }
      } else if (userRole === 'student') {
        localStorage.setItem('studentToken', 'student-token-' + userId);
        localStorage.setItem('studentRole', 'student');
        localStorage.setItem('studentName', name);
        localStorage.setItem('studentId', userId);
        localStorage.setItem('studentEmail', email);
        localStorage.setItem('studentVerified', String(isVerified));
        if (personalEmail) {
          localStorage.setItem('studentPersonalEmail', personalEmail);
        }
        if (photoUrl) {
          localStorage.setItem('studentPhotoUrl', photoUrl);
        }
      }
      
      toast.success(`Welcome, ${name}!`);
      
      // Check for redirect path - only use it if user was actively trying to access a page
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      localStorage.removeItem('redirectAfterLogin'); // Clean up immediately
      
      // Only redirect to specific page if there's a valid redirect path that's not the login page
      // Otherwise, always go to dashboard (home page)
      const targetPath = (redirectPath && redirectPath !== '/login' && redirectPath !== '/') 
        ? redirectPath 
        : '/';
      
      // Force a page reload to ensure auth state is properly initialized
      window.location.href = targetPath;
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordRecovery = async () => {
    if (!recoveryEmail) {
      toast.error("Please enter your email address");
      return;
    }
    
    if (!validateEmail(recoveryEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsRecovering(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
        redirectTo: `${window.location.origin}/`,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password recovery email sent! Please check your inbox.");
        setShowPasswordRecovery(false);
        setRecoveryEmail("");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send recovery email");
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <div className="mb-4 flex justify-center">
          <img 
            src={schoolLogo} 
            alt="Glorious Kindergarten & Primary School" 
            className="h-24 w-24 object-contain"
          />
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Glorious Schools Portal
        </CardTitle>
        <CardDescription className="text-center">
          Sign in with your school credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="signin-email"
                type="email"
                placeholder="Enter your email"
                value={signInData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                disabled={isLoading}
                className="pl-10"
                required
              />
            </div>
            {emailError && (
              <p className="text-xs text-destructive">{emailError}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signin-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
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
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember-me" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label 
              htmlFor="remember-me" 
              className="text-sm font-normal cursor-pointer"
            >
              Remember Me
            </Label>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          
          <div className="flex items-center justify-center">
            <Dialog open={showPasswordRecovery} onOpenChange={setShowPasswordRecovery}>
              <DialogTrigger asChild>
                <Button variant="link" className="px-0 font-normal text-sm">
                  Forgot Password?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                    Enter your email address and we'll send you a link to reset your password.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="recovery-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        disabled={isRecovering}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handlePasswordRecovery} 
                    className="w-full"
                    disabled={isRecovering}
                  >
                    {isRecovering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Recovery Email"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}