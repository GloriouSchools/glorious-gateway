import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, userRole, isLoading } = useAuth();
  const location = useLocation();

  // Handle email confirmation redirect
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');
    
    if (type === 'email' && accessToken) {
      // Store the intended destination
      localStorage.setItem('redirectAfterLogin', location.pathname);
      // Clear the hash and redirect to login
      window.location.href = '/login';
    }
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !userRole) {
    // Store the current path for redirect after login
    localStorage.setItem('redirectAfterLogin', location.pathname + location.search);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}