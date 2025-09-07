import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary-hover mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm">Effective Date: January 1, 2024</p>

            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Glorious Schools Management System ("the System"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the System.
            </p>

            <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
            <p>
              The Glorious Schools Management System provides online access to educational resources, academic records, communication tools, and administrative functions for students, parents, teachers, and staff of Glorious Schools.
            </p>

            <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
            <p>
              To access certain features of the System, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain and update your information to keep it current</li>
              <li>Keep your password confidential and secure</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">4. User Conduct</h2>
            <p>
              You agree not to use the System to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Upload or transmit viruses or malicious code</li>
              <li>Collect or harvest information about other users</li>
              <li>Interfere with the proper functioning of the System</li>
              <li>Attempt to gain unauthorized access to any portion of the System</li>
              <li>Engage in any form of harassment, bullying, or inappropriate behavior</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">5. Content Guidelines</h2>
            <p>
              Users may submit content through various features of the System. You retain ownership of your content but grant Glorious Schools a license to use, display, and distribute it within the educational context. You agree that your content will:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be appropriate for an educational environment</li>
              <li>Not contain offensive, inappropriate, or harmful material</li>
              <li>Not violate intellectual property rights</li>
              <li>Be factually accurate when presenting information</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">6. Privacy and Data Protection</h2>
            <p>
              Your use of the System is also governed by our Privacy Policy. We are committed to protecting your personal information and comply with applicable data protection laws. We collect and use data only for legitimate educational purposes.
            </p>

            <h2 className="text-xl font-semibold text-foreground">7. Academic Integrity</h2>
            <p>
              Users must maintain academic integrity when using the System. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Not engaging in plagiarism or cheating</li>
              <li>Properly citing sources and references</li>
              <li>Completing assignments and assessments honestly</li>
              <li>Not sharing login credentials or allowing others to submit work on your behalf</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">8. System Availability and Maintenance</h2>
            <p>
              While we strive to maintain continuous availability of the System, we do not guarantee uninterrupted access. The System may be temporarily unavailable due to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Scheduled maintenance and updates</li>
              <li>Technical issues or system failures</li>
              <li>Force majeure events</li>
              <li>Security concerns</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">9. Modifications to Service</h2>
            <p>
              Glorious Schools reserves the right to modify, suspend, or discontinue any aspect of the System at any time. We will provide reasonable notice of significant changes when possible.
            </p>

            <h2 className="text-xl font-semibold text-foreground">10. Termination</h2>
            <p>
              We may terminate or suspend your access to the System immediately, without prior notice, for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violation of these Terms of Service</li>
              <li>Breach of school policies</li>
              <li>Engaging in harmful or illegal activities</li>
              <li>At the request of law enforcement or government agencies</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">11. Disclaimer of Warranties</h2>
            <p>
              The System is provided "as is" and "as available" without warranties of any kind, either express or implied. Glorious Schools does not warrant that the System will be error-free, secure, or operate without interruption.
            </p>

            <h2 className="text-xl font-semibold text-foreground">12. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Glorious Schools shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the System.
            </p>

            <h2 className="text-xl font-semibold text-foreground">13. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Glorious Schools, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the System or violation of these Terms.
            </p>

            <h2 className="text-xl font-semibold text-foreground">14. Governing Law</h2>
            <p>
              These Terms of Service are governed by the laws of the jurisdiction in which Glorious Schools operates. Any disputes shall be resolved in the courts of that jurisdiction.
            </p>

            <h2 className="text-xl font-semibold text-foreground">15. Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. We will notify users of material changes through the System or via email. Your continued use of the System after such changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-xl font-semibold text-foreground">16. Contact Information</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at:<br /><br />
              Glorious Kindergarten & Primary School<br />
              Lugala, Masanafu, Bukuluugi<br />
              Kampala, Uganda<br />
              Email: gloriousschools14@gmail.com<br />
              Phone: +256 772 907 220<br />
              Phone: 020 090 0124
            </p>

            <p className="text-sm italic">
              By using the Glorious Schools Management System, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}