import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function About() {
  const { userName, photoUrl, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <DashboardLayout 
      userRole={userRole} 
      userName={userName || ''} 
      photoUrl={photoUrl} 
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">About Glorious Kindergarten & Primary School</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Welcome to Glorious Kindergarten & Primary School, located in Lugala, Masanafu, Bukuluugi, Kampala, Uganda. 
              Our school motto "We Will Always Shine" reflects our commitment to nurturing bright, confident, and capable 
              young minds who will excel in all aspects of life.
            </p>

            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              To provide comprehensive, quality education from kindergarten through primary levels, empowering our 
              students with strong academic foundations and moral values. We believe in creating an inclusive 
              learning environment where every child can discover their potential and shine brightly in their future endeavors.
            </p>

            <h2 className="text-xl font-semibold mb-4">Our Vision</h2>
            <p className="text-muted-foreground mb-6">
              To be the beacon of educational excellence in Uganda, producing well-rounded individuals who will 
              always shine in their academic pursuits, professional careers, and personal lives. We envision our 
              students as future leaders who will make positive contributions to society.
            </p>

            <h2 className="text-xl font-semibold mb-4">Core Values</h2>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li>Excellence in academics and extracurricular activities</li>
              <li>Integrity and ethical behavior in all aspects</li>
              <li>Respect for diversity and individual differences</li>
              <li>Innovation and continuous improvement in teaching methods</li>
              <li>Strong partnership between school, parents, and community</li>
              <li>Nurturing environment that encourages growth and development</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">Why Choose Glorious Kindergarten & Primary School?</h2>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li>Experienced and dedicated teaching staff</li>
              <li>Safe and nurturing learning environment</li>
              <li>Comprehensive curriculum following Uganda's education standards</li>
              <li>Strong emphasis on both academic and moral development</li>
              <li>Affordable quality education</li>
              <li>Regular parent-teacher communication</li>
              <li>Extracurricular activities for holistic development</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="text-muted-foreground mb-6">
              <p className="mb-2">
                <strong>Location:</strong> Lugala, Masanafu, Bukuluugi, Kampala, Uganda
              </p>
              <p className="mb-2">
                <strong>Phone:</strong> +256 772 907 220 / 020 090 0124
              </p>
              <p className="mb-2">
                <strong>Email:</strong> gloriousschools14@gmail.com
              </p>
              <p className="mb-4">
                <strong>Operating Hours:</strong><br />
                Monday - Friday: 08:00 AM - 04:00 PM<br />
                Saturday - Sunday: 08:00 AM - 12:00 PM
              </p>
            </div>

            <p className="text-center text-lg font-medium italic text-primary">
              "We Will Always Shine" - Our commitment to your child's bright future.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}