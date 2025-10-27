import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary-hover mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm">Last Updated: January 1, 2024</p>

            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
            <p>
              Glorious Schools ("we," "our," or "us") is committed to protecting the privacy of our students, parents, teachers, and staff. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our School Management System.
            </p>

            <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth, address</li>
              <li><strong>Academic Information:</strong> Student ID, grades, attendance records, class schedules, assignments</li>
              <li><strong>Account Information:</strong> Username, password, security questions</li>
              <li><strong>Communication Data:</strong> Messages, feedback, and correspondence through the system</li>
              <li><strong>Usage Information:</strong> Login times, pages visited, features used</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <p>
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain educational services</li>
              <li>Manage student records and academic progress</li>
              <li>Facilitate communication between students, parents, and teachers</li>
              <li>Process and track assignments and assessments</li>
              <li>Generate reports and analytics for educational improvement</li>
              <li>Ensure system security and prevent unauthorized access</li>
              <li>Comply with legal obligations and educational regulations</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">4. Information Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or rent your personal information. We may share information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>With Consent:</strong> When you give us explicit permission to share</li>
              <li><strong>Educational Partners:</strong> With authorized educational service providers who assist in delivering our services</li>
              <li><strong>Legal Requirements:</strong> When required by law or to respond to legal processes</li>
              <li><strong>Safety:</strong> To protect the rights, property, or safety of our school community</li>
              <li><strong>Authorized School Personnel:</strong> With teachers and staff who have legitimate educational interests</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection practices</li>
              <li>Regular backups and disaster recovery procedures</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">6. Rights of Parents and Students</h2>
            <p>
              Under FERPA and applicable laws, parents and eligible students have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access educational records</li>
              <li>Request corrections to inaccurate information</li>
              <li>Control disclosure of personally identifiable information</li>
              <li>File complaints regarding privacy violations</li>
              <li>Opt-out of certain data uses (where applicable)</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">7. Children's Privacy</h2>
            <p>
              We are committed to protecting the privacy of children under 13. We do not knowingly collect personal information from children under 13 without parental consent. Parents have the right to review, delete, and control the use of their child's information.
            </p>

            <h2 className="text-xl font-semibold text-foreground">8. Data Retention</h2>
            <p>
              We retain personal information for as long as necessary to fulfill educational purposes and comply with legal obligations. Academic records are maintained according to state and federal requirements. When information is no longer needed, it is securely destroyed.
            </p>

            <h2 className="text-xl font-semibold text-foreground">9. Cookies and Tracking Technologies</h2>
            <p>
              Our System uses cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintain user sessions and preferences</li>
              <li>Improve system performance and user experience</li>
              <li>Analyze usage patterns for system improvement</li>
              <li>Ensure security and detect unusual activity</li>
            </ul>
            <p>
              You can manage cookie preferences through your browser settings, though some features may not function properly without cookies.
            </p>

            <h2 className="text-xl font-semibold text-foreground">10. Third-Party Services</h2>
            <p>
              We may use third-party services for specific educational functions. These services are carefully selected and required to maintain appropriate privacy standards. We do not control the privacy practices of third-party websites linked from our System.
            </p>

            <h2 className="text-xl font-semibold text-foreground">11. International Data Transfers</h2>
            <p>
              If we transfer data internationally, we ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable laws.
            </p>

            <h2 className="text-xl font-semibold text-foreground">12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of material changes through the System or by email. The "Last Updated" date at the top indicates when the policy was last revised.
            </p>

            <h2 className="text-xl font-semibold text-foreground">13. Contact Information</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <p>
              Data Protection Officer<br />
              Glorious Kindergarten & Primary School<br />
              Lugala, Masanafu, Bukuluugi<br />
              Kampala, Uganda<br />
              Email: gloriousschools14@gmail.com<br />
              Phone: +256 772 907 220<br />
              Phone: 020 090 0124
            </p>

            <h2 className="text-xl font-semibold text-foreground">14. Complaints</h2>
            <p>
              If you believe we have not addressed your concerns adequately, you have the right to file a complaint with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The school's Board of Directors</li>
              <li>Your local education authority</li>
              <li>The relevant data protection authority</li>
            </ul>

            <p className="text-sm italic">
              By using the Glorious Schools Management System, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}