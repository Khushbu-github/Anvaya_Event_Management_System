import React from 'react';
import { Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-purple-800 text-white pt-8 pb-4 relative">
      {/* Decorative top wave shape */}
      <div className="absolute top-0 left-0 right-0 h-6 overflow-hidden">
        <svg className="absolute bottom-0 fill-purple-800" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Top Section with Social Icons */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-6">
            <a href="https://www.linkedin.com/company/aimldeptdsce" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-purple-200 hover:text-white transition-all duration-300">
              <Linkedin size={22} />
            </a>
            <a href="https://www.instagram.com/aimldeptdsce" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-purple-200 hover:text-white transition-all duration-300">
              <Instagram size={22} />
            </a>
            <a href="https://www.youtube.com/@aimldeptdsce" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-purple-200 hover:text-white transition-all duration-300">
              <Youtube size={22} />
            </a>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-b border-purple-300 opacity-20 mb-6"></div>
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Links */}
          <div className="bg-purple-900 bg-opacity-30 rounded p-4 shadow">
            <h3 className="text-lg font-bold mb-3 text-white pb-1 border-b border-purple-300 inline-block">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
              <Link to="/" className="text-sm text-purple-100 hover:text-white transition-colors duration-300 flex items-center">
                <span className="w-1 h-1 bg-purple-300 rounded-full mr-1"></span>
                Home
              </Link>
              <Link to="/about" className="text-sm text-purple-100 hover:text-white transition-colors duration-300 flex items-center">
                <span className="w-1 h-1 bg-purple-300 rounded-full mr-1"></span>
                About Us
              </Link>
              <Link to="/research" className="text-sm text-purple-100 hover:text-white transition-colors duration-300 flex items-center">
                <span className="w-1 h-1 bg-purple-300 rounded-full mr-1"></span>
                Research
              </Link>
            </div>
          </div>
          
          {/* Contact Us */}
          <div className="bg-purple-900 bg-opacity-30 rounded p-4 shadow">
            <h3 className="text-lg font-bold mb-3 text-white pb-1 border-b border-purple-300 inline-block">
              Contact Us
            </h3>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2 group">
                <Mail size={16} className="text-purple-300 group-hover:text-white" />
                <a href="mailto:contact@anvaya-department.edu" className="text-sm text-purple-100 group-hover:text-white transition-colors duration-300">
                  contact@anvaya-department.edu
                </a>
              </div>
              <div className="flex items-center space-x-2 group">
                <Phone size={16} className="text-purple-300 group-hover:text-white" />
                <a href="tel:+919876543210" className="text-sm text-purple-100 group-hover:text-white transition-colors duration-300">
                  +91 98765 43210
                </a>
              </div>
              <div className="mt-2 bg-purple-950 bg-opacity-50 p-2 rounded text-xs">
                <p className="font-semibold text-purple-200 mb-1">Office Hours</p>
                <p className="text-purple-100">Mon-Fri: 9:00 AM - 5:00 PM</p>
                <p className="text-purple-100">Sat: 9:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>
          
          {/* Address */}
          <div className="bg-purple-900 bg-opacity-30 rounded p-4 shadow">
            <h3 className="text-lg font-bold mb-3 text-white pb-1 border-b border-purple-300 inline-block">
              Location
            </h3>
            <div className="flex items-start space-x-2 mt-2 group">
              <MapPin size={16} className="text-purple-300 mt-1 flex-shrink-0 group-hover:text-white" />
              <div>
                <address className="text-sm text-purple-100 not-italic group-hover:text-white transition-colors duration-300">
                  Department of Artificial Intelligence and Machine Learning,<br />
                  Kumarswamy Layout,<br />
                  Bengaluru, Karnataka - 560078
                </address>
                <a href="https://g.co/kgs/8iMfdtw" target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center bg-white text-purple-800 hover:bg-purple-50 px-2 py-1 rounded-full text-xs font-medium mt-2 shadow transform hover:scale-105 transition-all duration-300">
                  <MapPin size={12} className="mr-1" />
                  View on Map
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-6 pt-3 border-t border-purple-300 opacity-20 flex flex-col md:flex-row justify-between items-center text-purple-200 text-xs">
          <div className="mb-2 md:mb-0">
            © {new Date().getFullYear()} Anvaya. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link to="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors duration-300">Terms of Use</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors duration-300">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;