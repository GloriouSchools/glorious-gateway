import { useState } from "react";
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
  EyeOff,
  Info 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { setAdminToken } from "@/lib/adminAuth";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";

export function LoginForm() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  
  // Email validation state
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
      // Use the new flexible login function for all users
      const { data, error } = await supabase
        .rpc('verify_flexible_login', {
          input_email: signInData.email,
          input_password: signInData.password
        });
      
      if (error) {
        toast.error(error.message || "Failed to sign in");
        setIsLoading(false);
        return;
      }
      
      if (data && typeof data === 'object' && 'success' in data && data.success) {
        const sessionData = data as any;
        
        // Store session info based on role
        if (sessionData.role === 'admin') {
          setAdminToken(sessionData.token);
          localStorage.setItem('adminRole', sessionData.role);
          localStorage.setItem('adminName', sessionData.name);
          localStorage.setItem('adminIsSecured', sessionData.is_secured);
        } else if (sessionData.role === 'student') {
          localStorage.setItem('studentToken', sessionData.token);
          localStorage.setItem('studentRole', sessionData.role);
          localStorage.setItem('studentName', sessionData.name);
          localStorage.setItem('studentId', sessionData.student_id);
          localStorage.setItem('studentEmail', sessionData.email);
          localStorage.setItem('studentIsSecured', sessionData.is_secured);
        }
        // Similar logic can be added for teachers
        
        toast.success(`Welcome, ${sessionData.name}!`);
        
        // Force a page reload to trigger auth state update
        window.location.href = '/';
      } else {
        // If flexible login fails, try normal Supabase auth (for users who have secured their accounts)
        try {
          const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
            email: signInData.email,
            password: signInData.password,
          });

          if (signInError) {
            if (signInError.message?.includes('Invalid login credentials')) {
              toast.error("Invalid email or password. Please try again.");
            } else if (signInError.message?.includes('Email not confirmed')) {
              toast.error("Please check your email and verify your account before signing in.");
            } else {
              toast.error(signInError.message || "Failed to sign in");
            }
            setIsLoading(false);
            return;
          }

          // Check if email is verified
          if (authData.user && !authData.user.email_confirmed_at) {
            await supabase.auth.signOut();
            toast.error("Please check your email and verify your account before signing in.");
            setIsLoading(false);
            return;
          }

          toast.success("Welcome back!");
          window.location.href = '/';
        } catch (authError: any) {
          toast.error((data as any)?.message || "Invalid credentials");
        }
      }
    } catch (error: any) {
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
          
          <div className="p-3 bg-muted/50 border border-muted-foreground/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  <strong>Students:</strong> Use your school email (@glorious.com) and password "123"
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Admin:</strong> Use admin@glorious.com
                </p>
                <p className="text-xs text-muted-foreground">
                  After logging in, you can secure your account with a personal email.
                </p>
              </div>
            </div>
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