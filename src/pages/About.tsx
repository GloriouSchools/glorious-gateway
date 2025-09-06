import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary-hover mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">About Glorious Schools</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              At Glorious Schools, we are committed to providing exceptional education that empowers students to reach their full potential. Our mission is to create a nurturing environment where academic excellence meets character development.
            </p>

            <h2 className="text-xl font-semibold mb-4">Our Vision</h2>
            <p className="text-muted-foreground mb-6">
              To be a leading educational institution that shapes future leaders, innovators, and responsible global citizens through comprehensive education and values-based learning.
            </p>

            <h2 className="text-xl font-semibold mb-4">Core Values</h2>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li><strong>Excellence:</strong> Striving for the highest standards in all academic and extracurricular activities</li>
              <li><strong>Integrity:</strong> Fostering honesty, transparency, and ethical behavior</li>
              <li><strong>Innovation:</strong> Embracing creativity and modern teaching methodologies</li>
              <li><strong>Diversity:</strong> Celebrating differences and promoting inclusivity</li>
              <li><strong>Community:</strong> Building strong relationships among students, teachers, and parents</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">Our History</h2>
            <p className="text-muted-foreground mb-6">
              Founded in 2010, Glorious Schools has grown from a small institution with 50 students to a thriving educational community serving over 1,000 students. Our journey has been marked by continuous improvement, academic achievements, and the success of our alumni who have gone on to make significant contributions in various fields.
            </p>

            <h2 className="text-xl font-semibold mb-4">Academic Programs</h2>
            <p className="text-muted-foreground mb-6">
              We offer comprehensive educational programs from primary through secondary levels, with specialized streams in Sciences, Arts, and Commerce. Our curriculum is designed to meet national standards while incorporating international best practices.
            </p>

            <h2 className="text-xl font-semibold mb-4">Facilities</h2>
            <p className="text-muted-foreground">
              Our campus features state-of-the-art facilities including modern classrooms, science laboratories, computer labs, a well-stocked library, sports facilities, and creative arts studios. We continuously invest in infrastructure to provide the best learning environment for our students.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}