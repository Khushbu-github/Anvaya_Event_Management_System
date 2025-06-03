import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, GraduationCap, LayoutGrid, Users, Landmark, Wrench, Trophy, BookOpen, LogIn, User, UserCog, BarChart } from 'lucide-react';
import { isAuthenticated, removeToken } from '../lib/auth';

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  subItems?: { title: string; icon: React.ReactNode; path: string }[];
}

const GridNavigation = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
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
  
  useEffect(() => {
    if (!openMenu) return;
    function handleClickOutside(event: MouseEvent) {
      const ref = menuRefs.current[openMenu];
      if (ref && !ref.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);
  
  // Define navItems based on authentication status
  const navItems: NavItem[] = [
    {
      title: 'Home',
      icon: <LayoutGrid size={20} />,
      path: '/'
    },
    {
      title: 'Events',
      icon: <CalendarDays size={20} />,
      path: '#',
      subItems: [
        { title: 'Cultural', icon: <Landmark size={16} />, path: '/events/cultural' },
        { title: 'Sports', icon: <Trophy size={16} />, path: '/events/sports' },
        { title: 'Technical', icon: <Wrench size={16} />, path: '/events/technical' },
        { title: 'Workshops', icon: <BookOpen size={16} />, path: '/events/workshops' }
      ]
    },
  ];

  if (user) { // Check if user is logged in
    // Add Dashboard button for logged-in users
    navItems.push({
      title: 'Dashboard',
      icon: <BarChart size={20} />,
      path: `/dashboard/${user.role.toLowerCase()}` // Dynamic path based on user role
    });
    
    // Add user info with logout dropdown
    navItems.push({
      title: user.name, // Display user's name
      icon: <User size={20} />, // Use a User icon
      path: '#',
      subItems: [
        // { title: 'Settings', icon: <UserCog size={16} />, path: '/settings' }, // Keep settings commented out for now
        { title: 'Logout', icon: <LogIn size={16} />, path: '/logout' } // Logout option
      ]
    });
  } else {
    // Add Login item only if not logged in
    navItems.push({
      title: 'Login',
      icon: <LogIn size={20} />,
      path: '#',
      subItems: [
        { title: 'Student', icon: <GraduationCap size={16} />, path: '/login?role=student' },
        { title: 'Faculty', icon: <User size={16} />, path: '/login?role=faculty' },
        { title: 'Admin', icon: <UserCog size={16} />, path: '/login?role=admin' }
      ]
    });
  }
  
  const handleMenuClick = (title: string) => {
    if (activeMenu === title) {
      setActiveMenu(null);
    } else {
      setActiveMenu(title);
    }
  };
  
  const handleSubItemClick = (subItem: { title: string; path: string }) => {
    console.log('handleSubItemClick called with:', subItem);
    if (subItem.title === 'Logout') {
      console.log('Logout initiated');
      removeToken();
      localStorage.removeItem('user_info');
      console.log('Token and user_info removed from local storage');
      // Dispatch a storage event to notify other components (like Header)
      window.dispatchEvent(new Event('storage'));
      console.log('Storage event dispatched');
      // Use navigate to the home page after logout
      navigate('/'); 
      console.log('Navigating to home page');
    } else {
      navigate(subItem.path);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-3">
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/4">
          <h1 className="text-3xl font-extrabold text-purple-600 tracking-wide">
            Anvaya
          </h1>
        </div>
        <div className="w-1/2 ml-auto">
          <div className="grid grid-cols-4 gap-3 md:gap-4 min-w-0">
            {navItems.map((item, idx) => (
              <div
                key={item.title + idx}
                className={`relative col-span-1 ${item.icon && item.title === user?.name ? 'ml-auto justify-self-end' : ''}`}
                ref={el => {
                  if (item.subItems) menuRefs.current[item.title + idx] = el;
                }}
              >
                {item.subItems ? (
                  <button
                    onClick={() => setOpenMenu(openMenu === item.title + idx ? null : item.title + idx)}
                    className="flex flex-col items-center justify-center w-full h-12 bg-white shadow-sm rounded-lg p-2"
                  >
                    <div className="text-purple-600 mb-1">{item.icon}</div>
                    {/* Display user role next to name if logged in */}
                    {user && item.title === user.name ? (
                      <span className="text-xs font-medium flex items-center">
                         {item.title} <span className="text-gray-500 ml-1">({user.role})</span>
                      </span>
                    ) : (
                       item.title && <span className="text-xs font-medium">{item.title}</span>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className="flex flex-col items-center justify-center w-full h-12 bg-white shadow-sm rounded-lg p-2"
                  >
                    <div className="text-purple-600 mb-1">{item.icon}</div>
                    {item.title && <span className="text-xs font-medium">{item.title}</span>}
                  </Link>
                )}
                
                {/* Dropdown: open only if openMenu matches this item */}
                {item.subItems && openMenu === item.title + idx && (
                  <div
                    className="absolute z-20 top-full left-0 w-full mt-1 bg-white shadow-lg rounded-lg overflow-hidden"
                    style={{ minWidth: '10rem' }}
                  >
                    <div className={`grid ${item.title === user?.name ? 'grid-cols-1' : 'grid-cols-2'} gap-1 p-2`}>
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.title}
                          onClick={() => {
                            // Explicitly handle logout click
                            if (subItem.title === 'Logout') {
                              handleSubItemClick(subItem);
                            } else {
                              // For other sub-items, just navigate and close menu
                              navigate(subItem.path);
                            }
                            setOpenMenu(null); // Close the dropdown menu after click
                          }}
                          className={`flex ${item.title === user?.name ? 'items-center gap-2' : 'flex-col items-center justify-center'} p-2 hover:bg-gray-50 rounded w-full text-left`}
                        >
                          <span className="text-purple-600">{subItem.icon}</span>
                          <span className="text-xs font-medium">{subItem.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridNavigation;