import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserRole } from "@/types/user";
import { Loader2, GraduationCap, BookOpen, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { setAdminToken } from "@/lib/adminAuth";
import { evaluatePasswordStrength } from "@/utils/passwordStrength";
import { Progress } from "@/components/ui/progress";

interface Class {
  id: string;
  name: string;
}

interface Stream {
  id: string;
  name: string;
  class_id: string;
}

interface Student {
  id: string;
  name: string;
  class_id: string;
  stream_id: string;
  photo_url?: string;
}

interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  photo_url?: string;
}

export function LoginForm() {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  
  // Cascading dropdown states
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedTeacherClasses, setSelectedTeacherClasses] = useState<string[]>([]);
  
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  
  const [signUpData, setSignUpData] = useState({
    personalEmail: "",
    password: "",
    confirmPassword: "",
  });
  
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Enter password",
    color: "border-muted",
    percentage: 0,
  });

  // Fetch classes on mount
  useEffect(() => {
    fetchClasses();
    if (selectedRole === "teacher") {
      fetchTeachers();
    }
  }, [selectedRole]);
  
  // Fetch streams when class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchStreams(selectedClass);
      setSelectedStream("");
      setSelectedStudent("");
    }
  }, [selectedClass]);
  
  // Fetch students when stream is selected
  useEffect(() => {
    if (selectedStream) {
      fetchStudents(selectedStream);
      setSelectedStudent("");
    }
  }, [selectedStream]);
  
  // Update password strength
  useEffect(() => {
    const strength = evaluatePasswordStrength(signUpData.password);
    setPasswordStrength(strength);
  }, [signUpData.password]);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setClasses(data);
    }
  };

  const fetchStreams = async (classId: string) => {
    const { data, error } = await supabase
      .from('streams')
      .select('*')
      .eq('class_id', classId)
      .order('name');
    
    if (!error && data) {
      setStreams(data);
    }
  };

  const fetchStudents = async (streamId: string) => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('stream_id', streamId)
      .order('name');
    
    if (!error && data) {
      setStudents(data);
    }
  };

  const fetchTeachers = async () => {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setTeachers(data);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    // Check if this is the hardcoded admin account
    if (signInData.email === 'admin@glorious.com' && signInData.password === 'Glorious@15') {
      // Verify admin credentials using the database function
      const { data, error } = await supabase
        .rpc('verify_admin_login', {
          input_email: signInData.email,
          input_password: signInData.password
        });
      
      if (data && typeof data === 'object' && 'success' in data && data.success) {
        // Store admin token and session info
        setAdminToken((data as any).token);
        localStorage.setItem('adminRole', (data as any).role);
        localStorage.setItem('adminName', (data as any).name);
        
        setIsLoading(false);
        toast.success("Welcome back, Administrator!");
        
        // Force a page reload to trigger auth state update
        window.location.href = '/';
        return;
      }
    }
    
    // Normal user login flow
    try {
      // Try to sign in
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      if (signInError) {
        if (signInError.message?.includes('Invalid login credentials')) {
          // Check if user exists by trying to get their profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', signInData.email)
            .maybeSingle();
          
          if (!profileData) {
            toast.error("User does not exist. Please sign up first.");
          } else {
            toast.error("Invalid password. Please try again.");
          }
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
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate based on role
    if (selectedRole === "student") {
      if (!selectedStudent || !signUpData.personalEmail || !signUpData.password) {
        toast.error("Please complete all fields");
        return;
      }
    } else if (selectedRole === "teacher") {
      if (!selectedTeacher || selectedTeacherClasses.length === 0 || !signUpData.personalEmail || !signUpData.password) {
        toast.error("Please complete all fields and select at least one class");
        return;
      }
    }
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("Please choose a stronger password");
      return;
    }
    
    setIsLoading(true);
    try {
      // Get the name based on role
      let userName = "";
      if (selectedRole === "student") {
        const student = students.find(s => s.id === selectedStudent);
        userName = student?.name || "";
      } else if (selectedRole === "teacher") {
        const teacher = teachers.find(t => t.id === selectedTeacher);
        userName = teacher?.name || "";
      }
      
      // Try to sign up
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.personalEmail,
        password: signUpData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: userName,
            role: selectedRole,
          },
        },
      });

      if (error) {
        if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
          toast.error("User already exists. Please sign in to access your school portal.");
        } else {
          toast.error(error.message || "Failed to create account");
        }
        setIsLoading(false);
        return;
      }

      // Check if the user already existed (identities will be empty for existing users)
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.error("User already exists. Please sign in to access your school portal.");
        setIsLoading(false);
        return;
      }

      toast.success("Account created! Please check your email for verification.");
      setActiveTab("signin");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const roleIcons = {
    student: <GraduationCap className="h-5 w-5" />,
    teacher: <BookOpen className="h-5 w-5" />,
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
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  disabled={isLoading}
                  required
                />
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
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label>Select Role</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["student", "teacher"] as UserRole[]).map((role) => (
                    <Button
                      key={role}
                      type="button"
                      variant={selectedRole === role ? "default" : "outline"}
                      className="capitalize"
                      onClick={() => {
                        setSelectedRole(role);
                        setSelectedClass("");
                        setSelectedStream("");
                        setSelectedStudent("");
                        setSelectedTeacher("");
                        setSelectedTeacherClasses([]);
                      }}
                    >
                      {roleIcons[role]}
                      <span className="ml-1">{role}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {selectedRole === "student" && (
                <>
                  <div className="space-y-2">
                    <Label>Select Class</Label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedClass && (
                    <div className="space-y-2">
                      <Label>Select Stream</Label>
                      <Select value={selectedStream} onValueChange={setSelectedStream}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your stream" />
                        </SelectTrigger>
                        <SelectContent>
                          {streams.map((stream) => (
                            <SelectItem key={stream.id} value={stream.id}>
                              {stream.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {selectedStream && (
                    <div className="space-y-2">
                      <Label>Select Your Name</Label>
                      <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Find your name" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}
              
              {selectedRole === "teacher" && (
                <>
                  <div className="space-y-2">
                    <Label>Select Your Name</Label>
                    <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                      <SelectTrigger>
                        <SelectValue placeholder="Find your name" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedTeacher && (
                    <div className="space-y-2">
                      <Label>Select Classes You Teach</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {classes.map((cls) => (
                          <Button
                            key={cls.id}
                            type="button"
                            variant={selectedTeacherClasses.includes(cls.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setSelectedTeacherClasses(prev =>
                                prev.includes(cls.id)
                                  ? prev.filter(id => id !== cls.id)
                                  : [...prev, cls.id]
                              );
                            }}
                          >
                            {cls.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {((selectedRole === "student" && selectedStudent) || (selectedRole === "teacher" && selectedTeacher)) && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Personal Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signUpData.personalEmail}
                      onChange={(e) => setSignUpData({ ...signUpData, personalEmail: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be used for account verification
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                    {signUpData.password && (
                      <div className="space-y-2">
                        <Progress value={passwordStrength.percentage} className="h-2" />
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-medium ${passwordStrength.color === "bg-destructive" ? "text-destructive" : passwordStrength.color === "bg-orange-500" ? "text-orange-500" : "text-green-600"}`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                      <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        A strong password should contain a mixture of uppercase and lowercase letters, numbers, and at least one special character
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Re-enter your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || (selectedRole === "student" ? !selectedStudent : !selectedTeacher)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                You'll receive a verification email after signup
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}