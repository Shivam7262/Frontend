import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Grid3X3, 
  User, 
  Heart, 
  Sun, 
  Moon, 
  Settings,
  ChevronUp,
  X
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Main navigation items for mobile bottom nav
  const mobileNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/destinations', label: 'Destinations', icon: MapPin },
    { path: '/categories', label: 'Categories', icon: Grid3X3 },
    { path: '/profile', label: 'Profile', icon: User, isProfile: true },
  ];

  // Desktop navigation items
  const desktopNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/destinations', label: 'Destinations', icon: MapPin },
    { path: '/categories', label: 'Categories', icon: Grid3X3 },
  ];

  const userNavItems = [
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const { user, logout, isAdmin } = useAuth();

  // Profile menu items for mobile expanded view
  const profileMenuItems = [
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    ...(isAdmin() ? [{ path: '/admin', label: 'Admin', icon: Settings }] : []),
  ];

  const handleMobileNavClick = (item) => {
    if (item.isProfile) {
      setIsProfileMenuOpen(!isProfileMenuOpen);
    } else {
      setIsProfileMenuOpen(false);
    }
  };

  const isActiveRoute = (path) => {
    if (path === '/profile') {
      return ['/profile', '/favorites', '/admin'].includes(location.pathname);
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                NextStop
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-8">
              {desktopNavItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === path
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Desktop User Menu */}
                <div className="flex items-center space-x-4">
                  {user ? (
                    <>
                      {userNavItems.map(({ path, label, icon: Icon }) => (
                        <Link
                          key={path}
                          to={path}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                            location.pathname === path
                              ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                              : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{label}</span>
                        </Link>
                      ))}

                      {isAdmin() && (
                        <Link
                          to="/admin"
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                            location.pathname === '/admin'
                              ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                              : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                          }`}
                        >
                          <Settings className="w-4 h-4" />
                          <span className="font-medium">Admin</span>
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <Link
                        to="/profile"
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                          location.pathname === '/profile'
                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                            : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </>
                  )}
                </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar (minimal) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center h-14 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              NextStop
            </span>
          </Link>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Profile Expanded Menu Overlay */}
      {isProfileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsProfileMenuOpen(false)}>
          <div 
            className="fixed bottom-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Menu</h3>
                <button
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-2">
                {profileMenuItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsProfileMenuOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                      location.pathname === path
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 safe-area-pb">
        <div className="px-2 py-2 pb-safe">
          <div className="flex justify-around items-center">
            {mobileNavItems.map(({ path, label, icon: Icon, isProfile }) => (
              <div key={path} className="flex-1 max-w-[80px]">
                {isProfile ? (
                  <button
                    onClick={() => handleMobileNavClick({ isProfile })}
                    className={`w-full flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
                      isActiveRoute(path)
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 scale-105'
                        : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="relative mb-1">
                      <Icon className={`w-5 h-5 transition-transform duration-200 ${
                        isActiveRoute(path) ? 'scale-110' : ''
                      }`} />
                      {isProfileMenuOpen && (
                        <ChevronUp className="w-3 h-3 absolute -top-1 -right-1 text-primary-600 dark:text-primary-400 animate-bounce" />
                      )}
                      {/* Active indicator dot */}
                      {isActiveRoute(path) && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-xs font-medium leading-tight">{label}</span>
                  </button>
                ) : (
                  <Link
                    to={path}
                    onClick={() => handleMobileNavClick({ isProfile: false })}
                    className={`w-full flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
                      location.pathname === path
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 scale-105'
                        : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="relative mb-1">
                      <Icon className={`w-5 h-5 transition-transform duration-200 ${
                        location.pathname === path ? 'scale-110' : ''
                      }`} />
                      {/* Active indicator dot */}
                      {location.pathname === path && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-xs font-medium leading-tight">{label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

    </>
  );
};

export default Navbar;
