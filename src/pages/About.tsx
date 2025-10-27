import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";
import { subDays, format } from "date-fns";

export default function About() {
  const lastUpdated = format(subDays(new Date(), 7), "MMMM d, yyyy");
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      <div className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <Link to="/login" className="inline-flex items-center text-primary hover:text-primary-hover mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">About Glorious Kindergarten & Primary School</CardTitle>
            <p className="text-sm text-muted-foreground pt-2">
              Last updated: {lastUpdated}
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg mb-6">
              Welcome to Glorious Kindergarten & Primary School, located in Lugala, Masanafu, Bukuluugi, Kampala, Uganda. 
              Our school motto "We Will Always Shine" reflects our unwavering commitment to nurturing bright, confident, and capable 
              young minds who will excel in all aspects of life through innovative education and comprehensive support systems.
            </p>

            <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
            <p className="mb-6">
              To provide comprehensive, technology-enhanced quality education from kindergarten through primary levels, empowering our 
              students with strong academic foundations, digital literacy, and moral values. We believe in creating an inclusive, 
              technologically advanced learning environment where every child can discover their potential, develop critical thinking 
              skills, and shine brightly in their future endeavors. Through our integrated School Management System, we ensure seamless 
              communication, transparent academic tracking, and personalized learning experiences for every student.
            </p>

            <h2 className="text-xl font-semibold text-foreground">Our Vision</h2>
            <p className="mb-6">
              To be the beacon of educational excellence and technological innovation in Uganda, producing well-rounded, digitally 
              literate individuals who will always shine in their academic pursuits, professional careers, and personal lives. We 
              envision our students as future leaders equipped with 21st-century skills who will make positive contributions to society 
              through knowledge, innovation, and ethical leadership.
            </p>

            <h2 className="text-xl font-semibold text-foreground">Core Values</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Excellence:</strong> Maintaining the highest standards in academics, technology integration, and extracurricular activities</li>
              <li><strong>Integrity:</strong> Upholding ethical behavior, transparency, and honesty in all aspects of school life</li>
              <li><strong>Innovation:</strong> Embracing cutting-edge educational technology and continuous improvement in teaching methodologies</li>
              <li><strong>Inclusivity:</strong> Respecting diversity, individual differences, and providing equal opportunities for all students</li>
              <li><strong>Collaboration:</strong> Building strong partnerships between school, parents, teachers, and the wider community</li>
              <li><strong>Growth:</strong> Creating a nurturing environment that encourages personal, academic, and social development</li>
              <li><strong>Digital Citizenship:</strong> Promoting responsible and ethical use of technology and digital resources</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">Our Comprehensive School Management System</h2>
            <p className="mb-4">
              Glorious Schools operates a state-of-the-art, cloud-based School Management System that revolutionizes education delivery 
              and administration. Our platform integrates all aspects of school life into a seamless digital experience:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Academic Management:</strong> Real-time tracking of assignments, grades, timetables, and class schedules accessible to students, parents, and teachers</li>
              <li><strong>Attendance System:</strong> Comprehensive daily attendance tracking with analytics, reports, and automated notifications to parents</li>
              <li><strong>E-Learning Platform:</strong> Access to over 100 educational videos, tutorials, and digital learning resources</li>
              <li><strong>Digital Library:</strong> Online catalog of 500+ books and educational materials available for browsing and reservation</li>
              <li><strong>Communication Hub:</strong> Secure messaging system enabling seamless communication between students, teachers, parents, and administration</li>
              <li><strong>Electoral System:</strong> Democratic student leadership elections with transparent voting and real-time results</li>
              <li><strong>Analytics & Reporting:</strong> Comprehensive performance analytics, attendance reports, and progress tracking for informed decision-making</li>
              <li><strong>Event Management:</strong> Calendar integration for school events, activities, parent-teacher meetings, and important dates</li>
              <li><strong>Gallery & Media:</strong> Digital gallery showcasing school achievements, events, and memorable moments</li>
              <li><strong>Finance Management:</strong> Transparent fee payment tracking and financial reporting for parents</li>
              <li><strong>Educational Games:</strong> Interactive learning games including typing tutorials and subject-specific challenges</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">Why Choose Glorious Kindergarten & Primary School?</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Technology-Enhanced Learning:</strong> Every student benefits from our advanced digital learning platform and modern educational tools</li>
              <li><strong>Experienced Faculty:</strong> Our highly qualified and dedicated teaching staff are trained in both traditional and digital pedagogy</li>
              <li><strong>Safe & Secure Environment:</strong> 24/7 security, CCTV monitoring, and comprehensive safety protocols ensure student wellbeing</li>
              <li><strong>Comprehensive Curriculum:</strong> Following Uganda's national education standards with enhanced digital literacy and STEM programs</li>
              <li><strong>Holistic Development:</strong> Balanced focus on academic excellence, moral education, extracurricular activities, and leadership development</li>
              <li><strong>Transparent Communication:</strong> Real-time updates to parents through our digital platform, ensuring complete visibility of student progress</li>
              <li><strong>Individual Attention:</strong> Personalized learning approaches with detailed progress tracking for each student</li>
              <li><strong>Modern Facilities:</strong> Well-equipped classrooms, computer labs, library, and recreational facilities</li>
              <li><strong>Affordable Excellence:</strong> Quality education at competitive fees with flexible payment options</li>
              <li><strong>Parent Engagement:</strong> Regular parent-teacher conferences, digital progress reports, and active parent involvement in school activities</li>
              <li><strong>Student Leadership:</strong> Democratic electoral system promoting student voice, leadership skills, and civic responsibility</li>
              <li><strong>Entertainment & Recreation:</strong> Balanced curriculum including educational entertainment, games, and recreational activities</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">Academic Programs & Services</h2>
            <p className="mb-4">Our comprehensive educational offerings include:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Kindergarten Program:</strong> Early childhood education with focus on foundational skills and social development</li>
              <li><strong>Primary Education (P1-P7):</strong> Complete primary curriculum aligned with Uganda National Curriculum Development Center standards</li>
              <li><strong>Digital Literacy:</strong> Computer studies and internet safety from early grades</li>
              <li><strong>STEM Education:</strong> Science, Technology, Engineering, and Mathematics with hands-on projects</li>
              <li><strong>Language Arts:</strong> English language development with emphasis on reading, writing, and communication</li>
              <li><strong>Creative Arts:</strong> Music, art, drama, and cultural activities</li>
              <li><strong>Physical Education:</strong> Sports, games, and health education programs</li>
              <li><strong>Life Skills:</strong> Character education, environmental awareness, and personal development</li>
              <li><strong>Academic Support:</strong> Remedial classes and advanced learning opportunities based on individual needs</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">Student Support Services</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Academic Counseling:</strong> Guidance for academic planning and career development</li>
              <li><strong>Help & Support System:</strong> 24/7 assistance through our digital platform for technical and academic queries</li>
              <li><strong>Hall of Fame:</strong> Recognition program celebrating top-performing students and their achievements</li>
              <li><strong>Progress Monitoring:</strong> Continuous assessment and detailed progress reports accessible through parent portals</li>
              <li><strong>Duty Rota System:</strong> Transparent teacher duty schedules ensuring consistent student supervision</li>
              <li><strong>Medical Support:</strong> First aid facilities and health monitoring</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">Our Commitment to Excellence</h2>
            <p className="mb-6">
              At Glorious Schools, we continuously invest in educational innovation, teacher professional development, and 
              infrastructure improvement. Our commitment extends beyond academic achievement to include character formation, 
              digital citizenship, environmental consciousness, and community engagement. We believe that every child has 
              unique talents and potential, and our role is to provide the nurturing environment, resources, and guidance 
              necessary for each student to discover and develop their gifts.
            </p>

            <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
            <div className="mb-6">
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
      <Footer />
    </div>
  );
}
