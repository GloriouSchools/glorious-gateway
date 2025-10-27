import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Legal() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary-hover mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Legal Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-6 text-muted-foreground">
            <h2 className="text-xl font-semibold text-foreground">Copyright Notice</h2>
            <p>
              © 2024 Glorious Schools. All rights reserved. The content, design, and information presented on this School Management System are protected by copyright laws. No part of this system may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of Glorious Schools.
            </p>

            <h2 className="text-xl font-semibold text-foreground">Intellectual Property Rights</h2>
            <p>
              All intellectual property rights in and to the School Management System, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Software code and functionality</li>
              <li>Educational content and materials</li>
              <li>Logos, trademarks, and brand elements</li>
              <li>Design elements and user interface</li>
              <li>Documentation and support materials</li>
            </ul>
            <p>
              are owned by or licensed to Glorious Schools. Unauthorized use of any intellectual property may violate copyright, trademark, and other applicable laws.
            </p>

            <h2 className="text-xl font-semibold text-foreground">User Obligations</h2>
            <p>
              Users of this School Management System agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the system only for legitimate educational purposes</li>
              <li>Maintain the confidentiality of their login credentials</li>
              <li>Not attempt to gain unauthorized access to any part of the system</li>
              <li>Not use the system to transmit harmful or malicious content</li>
              <li>Comply with all applicable laws and school policies</li>
              <li>Report any security vulnerabilities or breaches immediately</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">Data Protection and Privacy</h2>
            <p>
              Glorious Schools is committed to protecting the privacy and personal data of all users. We comply with applicable data protection laws and regulations, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Collection of personal data only for legitimate educational purposes</li>
              <li>Implementation of appropriate security measures to protect data</li>
              <li>Limited access to personal data on a need-to-know basis</li>
              <li>Regular review and update of data protection practices</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">Educational Records</h2>
            <p>
              Student educational records are maintained in accordance with the Family Educational Rights and Privacy Act (FERPA) and other applicable regulations. Access to educational records is restricted to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The student (if 18 years or older)</li>
              <li>Parents or legal guardians of minor students</li>
              <li>School officials with legitimate educational interest</li>
              <li>Authorized representatives for audit or evaluation purposes</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">Acceptable Use Policy</h2>
            <p>
              The School Management System must be used in a manner consistent with the educational mission of Glorious Schools. Prohibited activities include but are not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Harassment, bullying, or discrimination</li>
              <li>Sharing false or misleading information</li>
              <li>Violating the privacy of other users</li>
              <li>Commercial activities unrelated to school functions</li>
              <li>Any illegal activities</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">Dispute Resolution</h2>
            <p>
              Any disputes arising from the use of this School Management System shall be resolved through the following process:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Initial consultation with school administration</li>
              <li>Formal written complaint to the Board of Directors</li>
              <li>Mediation through an agreed-upon third party</li>
              <li>Binding arbitration as a last resort</li>
            </ol>

            <h2 className="text-xl font-semibold text-foreground">Governing Law</h2>
            <p>
              These legal terms and your use of the School Management System are governed by the laws of the jurisdiction in which Glorious Schools operates, without regard to conflict of law principles.
            </p>

            <h2 className="text-xl font-semibold text-foreground">Amendments</h2>
            <p>
              Glorious Schools reserves the right to modify these legal terms at any time. Users will be notified of significant changes through the system or via email. Continued use of the system after such modifications constitutes acceptance of the updated terms.
            </p>

            <h2 className="text-xl font-semibold text-foreground">Contact Legal Department</h2>
            <p>
              For legal inquiries or concerns, please contact:<br /><br />
              Legal Department<br />
              Glorious Kindergarten & Primary School<br />
              Lugala, Masanafu, Bukuluugi<br />
              Kampala, Uganda<br />
              Email: gloriousschools14@gmail.com<br />
              Phone: +256 772 907 220<br />
              Phone: 020 090 0124
            </p>

            <p className="text-sm italic">
              Last updated: January 2024
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}