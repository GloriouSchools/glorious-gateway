import { LoginForm } from "@/components/auth/LoginForm";
import { UserRole } from "@/types/user";

interface LoginPageProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <div className="absolute inset-0 bg-gradient-primary opacity-5" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Glorious Schools
          </h1>
          <p className="text-muted-foreground mt-2">Excellence in Education</p>
        </div>
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  );
}