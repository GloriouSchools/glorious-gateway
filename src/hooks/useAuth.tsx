import { useState, useEffect, createContext, useContext } from "react";
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
  isLoading: boolean;
  isVerified: boolean;
  personalEmail: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [personalEmail, setPersonalEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check for admin token first
    const adminToken = getAdminToken();
    const storedRole = localStorage.getItem('adminRole');
    const storedName = localStorage.getItem('adminName');
    
    if (adminToken && storedRole === 'admin') {
      // Set admin state from token (no real user object for hardcoded admin)
      setUserRole('admin');
      setUserName(storedName || 'System Administrator');
      setUser({ id: 'admin-hardcoded', email: 'admin@glorious.com' } as any);
      const verified = localStorage.getItem('adminVerified');
      setIsVerified(verified === 'true');
      const storedPersonalEmail = localStorage.getItem('adminPersonalEmail');
      setPersonalEmail(storedPersonalEmail || null);
      // Delay setting loading to false to ensure state is propagated
      setTimeout(() => setIsLoading(false), 0);
      return;
    }
    
    // Check for student token
    const studentToken = localStorage.getItem('studentToken');
    const studentRole = localStorage.getItem('studentRole');
    const studentName = localStorage.getItem('studentName');
    const studentId = localStorage.getItem('studentId');
    const studentEmail = localStorage.getItem('studentEmail');
    
    if (studentToken && studentRole === 'student') {
      // Set student state from token
      setUserRole('student');
      setUserName(studentName || 'Student');
      setUser({ id: studentId || 'student-hardcoded', email: studentEmail || '' } as any);
      const verified = localStorage.getItem('studentVerified');
      setIsVerified(verified === 'true');
      const storedPersonalEmail = localStorage.getItem('studentPersonalEmail');
      setPersonalEmail(storedPersonalEmail || null);
      setIsLoading(false);
      return;
    }
    
    // Set up auth state listener FIRST for normal users
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setUserName(profile?.full_name || "");

      // Fetch role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError && roleError.code !== 'PGRST116') throw roleError;
      setUserRole(roleData?.role as UserRole || 'student');
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
    // Clear admin session if present
    clearAdminSession();
    localStorage.removeItem('adminVerified');
    localStorage.removeItem('adminPersonalEmail');
    
    // Clear student session if present
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentRole');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentEmail');
    localStorage.removeItem('studentVerified');
    localStorage.removeItem('studentPersonalEmail');
    
    // Only sign out from Supabase if there's a real session
    if (session) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    
    setUser(null);
    setSession(null);
    setUserRole(null);
    setUserName("");
    setIsVerified(false);
    setPersonalEmail(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userRole,
      userName,
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