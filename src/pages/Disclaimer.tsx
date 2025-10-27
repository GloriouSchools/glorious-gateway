import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary-hover mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none space-y-6 text-muted-foreground">
            <p>
              The information contained in this School Management System is for general information purposes only. The information is provided by Glorious Schools and while we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
            </p>

            <h2 className="text-xl font-semibold text-foreground">Academic Information</h2>
            <p>
              Any academic information, including grades, attendance records, and assessment results displayed in this system, is subject to verification and may be updated or corrected as necessary. Students and parents should confirm critical academic information with the school administration.
            </p>

            <h2 className="text-xl font-semibold text-foreground">External Links</h2>
            <p>
              Through this system, you may be able to link to other websites which are not under the control of Glorious Schools. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
            </p>

            <h2 className="text-xl font-semibold text-foreground">System Availability</h2>
            <p>
              Every effort is made to keep the School Management System up and running smoothly. However, Glorious Schools takes no responsibility for, and will not be liable for, the system being temporarily unavailable due to technical issues beyond our control.
            </p>

            <h2 className="text-xl font-semibold text-foreground">Data Accuracy</h2>
            <p>
              While we strive to ensure that all data displayed in the system is accurate and current, users should be aware that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Information may be subject to change without notice</li>
              <li>Technical errors may occasionally occur</li>
              <li>Data synchronization delays may affect real-time accuracy</li>
              <li>Official records maintained by the school administration supersede any information displayed in this system</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground">Professional Advice</h2>
            <p>
              The content in this system is not intended to be a substitute for professional educational advice, diagnosis, or treatment. Always seek the advice of qualified education professionals with any questions you may have regarding academic planning or student development.
            </p>

            <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
            <p>
              In no event will Glorious Schools be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this system.
            </p>

            <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
            <p>
              If you have any questions about this disclaimer, please contact the school administration at:<br /><br />
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