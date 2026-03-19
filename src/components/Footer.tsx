import { Sun, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-solar-secondary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Sun className="w-8 h-8 text-solar-primary" />
              <span className="text-xl font-bold tracking-tight">SolarConnect <span className="text-solar-primary">Nigeria</span></span>
            </Link>
            <p className="text-blue-100/70 text-sm leading-relaxed">
              Connecting Nigerians with verified solar installers for a cleaner, more reliable energy future.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-solar-primary transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-solar-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-solar-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm text-blue-100/70">
              <li><Link to="/" className="hover:text-solar-primary">Home</Link></li>
              <li><Link to="/quote" className="hover:text-solar-primary">Get Free Quote</Link></li>
              <li><Link to="/contact" className="hover:text-solar-primary">Contact Us</Link></li>
              <li><Link to="/admin" className="hover:text-solar-primary">Admin Login</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Our Focus</h4>
            <ul className="space-y-3 text-sm text-blue-100/70">
              <li>Residential Solar</li>
              <li>Commercial Solar</li>
              <li>Off-grid Systems</li>
              <li>Hybrid Solutions</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-solar-primary" />
                <span>davidaiki17@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-solar-primary" />
                <span>0708 527 6095</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-solar-primary" />
                <span>Kaduna, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm text-blue-100/50">
          <p>&copy; {new Date().getFullYear()} SolarConnect Nigeria. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
