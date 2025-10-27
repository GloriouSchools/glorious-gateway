import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";

export default function Cookies() {
  return (
    <div className="min-h-screen flex flex-col animate-page-in">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/login" className="text-primary hover:underline mb-4 inline-block">
          ← Back to Login
        </Link>
        
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>
          
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. What are cookies?</h2>
            <p className="text-muted-foreground mb-4">
              Cookies are small text files that uniquely identify your browser or device. The cookie file is stored on your browser. 
              When you return to that website (or visit websites that use the same cookies) these websites recognize the cookies and your browsing device.
            </p>
            <p className="text-muted-foreground mb-4">
              Cookies do many different jobs, like letting you navigate between pages efficiently, remembering your preferences, 
              and generally improving your experience. Cookies can tell us, for example, whether you have visited our Services before.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Are there different types of cookies?</h2>
            <p className="text-muted-foreground mb-4">
              There are different types of cookies, including first party cookies (which are served directly by us to your computer or device) 
              and third party cookies (which are served by a third party on our behalf). Third party cookies enable third party features or 
              functionality to be provided on or through the website (e.g. advertising, interactive content and analytics). The parties that 
              set these third party cookies can recognise your computer both when it visits the website in question and also when it visits 
              certain other websites.
            </p>
            <p className="text-muted-foreground mb-4">
              Cookies can remain on your device for different periods of time. Some cookies are session cookies, meaning that they exist only 
              while your browser is open and are deleted automatically once you close your browser. Other cookies are permanent cookies, meaning 
              that they survive after your browser is closed. They can be used to recognise your computer when you open your browser and browse 
              the Internet again.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. What are cookies used for?</h2>
            <p className="text-muted-foreground mb-4">
              Cookies are used for different purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-3 ml-4">
              <li>
                <strong>Essential cookies</strong> are needed to provide you with the Services and to use some of its features, 
                such as access to secure areas. Without these cookies, we would not be able to provide you with the websites and 
                services that you have asked for.
              </li>
              <li>
                <strong>Functionality cookies</strong> record information about choices you have made and allow us to provide relevant 
                content and tailor our Services for you. For example, we use cookies to tailor content and information that we may send 
                or display to you and otherwise personalize your experience while interacting with our Services and to otherwise improve 
                the functionality of the Services.
              </li>
              <li>
                <strong>Performance cookies</strong> help us to measure traffic and usage data and to analyze how our Services are used 
                in order to provide you with a better user experience and maintain, operate and improve our Services. These cookies may 
                be set by us or third-party providers whose services we have added to our websites and apps.
              </li>
              <li>
                <strong>Targeting cookies</strong> help us show you ads that are useful to you on our websites or on third-party websites, 
                and measure the effectiveness of the relevant ad campaigns.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. How can you control cookies?</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your 
              preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies 
              you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
            </p>
            <p className="text-muted-foreground mb-4">
              If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our 
              website may be restricted.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about our use of cookies, please contact us at:<br /><br />
              Glorious Kindergarten & Primary School<br />
              Lugala, Masanafu, Bukuluugi<br />
              Kampala, Uganda<br />
              Email: gloriousschools14@gmail.com<br />
              Phone: +256 772 907 220<br />
              Phone: 020 090 0124
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}