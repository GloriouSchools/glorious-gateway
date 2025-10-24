import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserRole } from "@/types/user";
import { toast } from "sonner";
import { getAdminToken, clearAdminSession } from "@/lib/adminAuth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  userName: string;
  userId: string | null;
  photoUrl: string | null;
  isLoading: boolean;
  isVerified: boolean;
  personalEmail: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [personalEmail, setPersonalEmail] = useState<string | null>(null);

  useEffect(() => {
    // SECURITY: Function to check and load auth state from localStorage
    const checkAuthState = () => {
      // Check for admin token first
      const adminToken = localStorage.getItem('adminToken');
      const adminRole = localStorage.getItem('adminRole');
      const adminName = localStorage.getItem('adminName');
      const adminId = localStorage.getItem('adminId');
      const adminEmail = localStorage.getItem('adminEmail');
      
      if (adminToken && adminRole === 'admin') {
        // Set admin state from localStorage
        setUserRole('admin');
        setUserName(adminName || 'System Administrator');
        setUser({ id: adminId || 'admin-hardcoded', email: adminEmail || 'admin@glorious.com' } as any);
        const verified = localStorage.getItem('adminVerified');
        setIsVerified(verified === 'true');
        const storedPersonalEmail = localStorage.getItem('adminPersonalEmail');
        setPersonalEmail(storedPersonalEmail || null);
        setIsLoading(false);
        return true;
      }
      
      // Check for teacher token
      const teacherToken = localStorage.getItem('teacherToken');
      const teacherRole = localStorage.getItem('teacherRole');
      const teacherName = localStorage.getItem('teacherName');
      const teacherId = localStorage.getItem('teacherId');
      const teacherEmail = localStorage.getItem('teacherEmail');
      
      if (teacherToken && teacherRole === 'teacher') {
        // Set teacher state from localStorage
        setUserRole('teacher');
        setUserName(teacherName || 'Teacher');
        setUser({ id: teacherId || 'teacher-hardcoded', email: teacherEmail || '' } as any);
        const verified = localStorage.getItem('teacherVerified');
        setIsVerified(verified === 'true');
        const storedPersonalEmail = localStorage.getItem('teacherPersonalEmail');
        setPersonalEmail(storedPersonalEmail || null);
        setIsLoading(false);
        return true;
      }
      
      // Check for student token
      const studentToken = localStorage.getItem('studentToken');
      const studentRole = localStorage.getItem('studentRole');
      const studentName = localStorage.getItem('studentName');
      const studentId = localStorage.getItem('studentId');
      const studentEmail = localStorage.getItem('studentEmail');
      
      if (studentToken && studentRole === 'student') {
        // Set student state from localStorage
        setUserRole('student');
        setUserName(studentName || 'Student');
        setUser({ id: studentId || 'student-hardcoded', email: studentEmail || '' } as any);
        const verified = localStorage.getItem('studentVerified');
        setIsVerified(verified === 'true');
        const storedPersonalEmail = localStorage.getItem('studentPersonalEmail');
        setPersonalEmail(storedPersonalEmail || null);
        const storedPhotoUrl = localStorage.getItem('studentPhotoUrl');
        setPhotoUrl(storedPhotoUrl || null);
        setIsLoading(false);
        return true;
      }
      
      return false;
    };
    
    // Check auth state on mount
    const hasCustomAuth = checkAuthState();
    
    // SECURITY: Listen for storage changes (handles cross-tab and new logins)
    const handleStorageChange = (e: StorageEvent) => {
      // If any auth-related key changed, re-check auth state
      if (e.key?.includes('Token') || e.key?.includes('Role') || e.key === null) {
        checkAuthState();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up auth state listener FIRST for normal users
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only update if we don't have custom auth (admin/teacher/student tokens)
        if (!localStorage.getItem('adminToken') && 
            !localStorage.getItem('teacherToken') && 
            !localStorage.getItem('studentToken')) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Fetch user profile and role when authenticated
          if (session?.user) {
            setTimeout(() => {
              fetchUserProfile(session.user.id);
            }, 0);
          } else {
            setUserRole(null);
            setUserName("");
          }
        }
      }
    );

    // THEN check for existing Supabase session only if no custom auth
    if (!hasCustomAuth) {
      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            fetchUserProfile(session.user.id);
          }
        })
        .catch((error) => {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // For students, fetch from students table
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('name, photo_url')
        .eq('id', userId)
        .single();

      if (!studentError && student) {
        setUserName(student.name || "");
        setUserRole('student');
        setPhotoUrl(student.photo_url || null);
        return;
      }

      // For teachers, fetch from teachers table
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .select('name, photo_url, personal_email, is_verified')
        .eq('id', userId)
        .single();

      if (!teacherError && teacher) {
        setUserName(teacher.name || "");
        setUserRole('teacher');
        setPhotoUrl(teacher.photo_url || null);
        setPersonalEmail(teacher.personal_email || null);
        setIsVerified(teacher.is_verified || false);
        return;
      }

      // For admins, fetch from admins table
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('name, personal_email, is_verified')
        .eq('id', userId)
        .single();

      if (!adminError && admin) {
        setUserName(admin.name || "");
        setUserRole('admin');
        setPersonalEmail(admin.personal_email || null);
        setIsVerified(admin.is_verified || false);
        return;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) throw error;
  };

  const signOut = async () => {
    // CRITICAL SECURITY FIX: Clear ALL localStorage first to prevent any session leakage
    const keysToPreserve = ['cookieConsent']; // Preserve non-auth data
    const preservedData: Record<string, string> = {};
    
    keysToPreserve.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) preservedData[key] = value;
    });
    
    // Clear everything
    localStorage.clear();
    
    // Restore preserved data
    Object.entries(preservedData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    
    // Only sign out from Supabase if there's a real session
    if (session) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    
    // Reset all state immediately
    setUser(null);
    setSession(null);
    setUserRole(null);
    setUserName("");
    setPhotoUrl(null);
    setIsVerified(false);
    setPersonalEmail(null);
    
    // Clear any remaining form data in memory for security
    const event = new CustomEvent('clearFormData');
    window.dispatchEvent(event);
    
    // Use client-side navigation to prevent page reload and double navigation
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userRole,
      userName,
      userId: user?.id || null,
      photoUrl,
      isLoading,
      isVerified,
      personalEmail,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}