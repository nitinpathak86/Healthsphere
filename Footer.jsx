import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-card border-t border-slate-100 dark:border-dark-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Activity className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="font-bold text-2xl text-slate-900 dark:text-white">Health<span className="text-secondary">Sphere</span></span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
              Simplifying healthcare access with modern technology, expert doctors, and seamless appointment booking.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-primary-500 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-primary-500 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-primary-500 transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">Home</Link></li>
              <li><Link to="/doctors" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">Find a Doctor</Link></li>
              <li><Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">Login / Register</Link></li>
              <li><Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Specialties</h3>
            <ul className="space-y-3">
              <li><Link to="/doctors?spec=Cardiology" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">Cardiology</Link></li>
              <li><Link to="/doctors?spec=Neurology" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">Neurology</Link></li>
              <li><Link to="/doctors?spec=Orthopedics" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">Orthopedics</Link></li>
              <li><Link to="/doctors?spec=Pediatrics" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">Pediatrics</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400 font-medium">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span>123 Health Avenue, Medical District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium">
                <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium">
                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                <span>support@healthsphere.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-dark-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} HealthSphere. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
