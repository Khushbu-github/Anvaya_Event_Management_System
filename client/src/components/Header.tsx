import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAuthenticated, removeToken } from '../lib/auth';
import AnvayaLogo from '@/components/assets/Anvaya.png';
import DSCLogo from '@/components/assets/image.png';
import Fb from '@/components/assets/fb.png';
import Insta from '@/components/assets/insta.png';
import LinkedIn from '@/components/assets/linkedin.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('jwt_token');
      const userStr = localStorage.getItem('user_info');

      if (token && userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch {
          setUser(null);
          // Optionally clear invalid user_info if found
          localStorage.removeItem('user_info');
        }
      } else {
        setUser(null);
      }
    };

    // Initial check
    checkAuth();

    // Listen for changes in localStorage (e.g., login/logout)
    window.addEventListener('storage', checkAuth);

    // Cleanup listener
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []); // Empty dependency array

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <img src={DSCLogo} alt="DSCE Logo" className="w-12 h-12 rounded-full shadow-sm" />
          <p className="text-gray-800 text-base font-medium leading-snug">
            Dayananda Sagar College <br /> of Engineering
          </p>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Social Icons and Anvaya Logo - always visible */}
          <div className="text-right">
            <p className="text-gray-800 text-base font-medium leading-snug">
              Department of Artificial Intelligence <br /> and Machine Learning
            </p>
            <div className="flex justify-end space-x-2 mt-2">
              <a href="https://www.instagram.com/aimldeptdsce" target="_blank" rel="noopener noreferrer">
                <img src={Insta} alt="Instagram" className="w-5 h-5 hover:scale-110 transition" />
              </a>
              <a href="https://www.linkedin.com/company/aimldeptdsce" target="_blank" rel="noopener noreferrer">
                <img src={LinkedIn} alt="LinkedIn" className="w-5 h-5 hover:scale-110 transition" />
              </a>
            </div>
          </div>
          <img src={AnvayaLogo} alt="Anvaya Logo" className="w-12 h-12 rounded-full shadow-sm" />

          {/* User Display (Login moved to GridNavigation) */}
          {/* The user state is still managed here if needed for other purposes, but not rendered as Login link */}
        </div>
      </div>
    </header>
  );
};

export default Header;