import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call - in production, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Thank you for subscribing! You'll receive our newsletter at " + email);
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-gradient-dark border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {/* About Section */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-foreground">Glorious Schools</h3>
            <p className="text-sm text-muted-foreground">
              Empowering students with quality education and innovative learning experiences since 2010.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Legal
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-foreground">Contact Us</h3>
            <ul className="space-y-2 text-left">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Lugala, Masanafu, Bukuluugi<br />
                  Kampala, Uganda
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  +256 772 907 220<br />
                  020 090 0124
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Mon-Fri: 08:00 AM - 04:00 PM<br />
                  Sat-Sun: 08:00 AM - 12:00 PM
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">gloriousschools14@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-foreground">Stay Connected</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for updates and educational resources.
            </p>
            <form className="space-y-2" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              ©2025 Glorious Electoral Commission. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Created with{" "}
              <span className="inline-block animate-pulse-heart text-primary">❤️</span>{" "}
              by{" "}
              <a
                href="https://fresh-teacher.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-hover underline transition-colors"
              >
                Fresh Teacher
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}