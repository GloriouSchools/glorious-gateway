import { LoginForm } from "@/components/auth/LoginForm";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";

const schoolLogo = "https://raw.githubusercontent.com/Fresh-Teacher/glorious-gateway-65056-78561-35497/main/src/assets/school-logo.png";

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col animate-page-in">
      <div 
        className="flex-1 flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: `url('/lovable-uploads/14faa411-7825-49ec-985a-1fc83c26171e.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="relative z-10 w-full max-w-md animate-zoom-in">
          <LoginForm schoolLogo={schoolLogo} />
        </div>
      </div>
      <Footer />
      <CookieConsent />
    </div>
  );
}