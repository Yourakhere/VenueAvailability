import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LogInIcon, LogOut, Menu, School2Icon, UsersIcon, X, User, ChevronDown } from 'lucide-react';
import { logout } from '../Store/slicer';
import { useState } from 'react';
import { MdDashboard } from 'react-icons/md';
import LoginModal from './LoginModal'; 

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl fixed top-0 left-0 right-0 z-50 border-b border-blue-700/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggleMobileMenu}
                className="mr-2 text-blue-200 hover:text-white transition-colors duration-200 md:hidden p-2 hover:bg-blue-700/50 rounded-lg"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <Link to="/" className="flex items-center group">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-800 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                    <School2Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-200 via-blue-100 to-cyan-200 bg-clip-text text-transparent font-[poppins]">
                    VENUEIFY
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {user && (
                <Link
                  to="/"
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg hover:bg-blue-700/60 transition-all duration-200 text-blue-100 hover:text-white font-medium"
                >
                  <MdDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              )}

              {user && user.role === "superadmin" && (
                <>
                  <Link
                    to="/all-users"
                    className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg hover:bg-blue-700/60 transition-all duration-200 text-blue-100 hover:text-white font-medium"
                  >
                    <UsersIcon className="h-4 w-4" />
                    <span>All Members</span>
                  </Link>

                   
                </>
              )}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-blue-700/40 hover:bg-blue-700/60 rounded-xl transition-colors duration-200 border border-blue-600/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-blue-50">{user.name || 'User'}</div>
                      <div className="text-blue-300 text-xs capitalize">{user.role}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-red-500/50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:block">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="hidden md:flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/50"
                >
                  <LogInIcon className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}

              {/* Mobile Login/Logout Button */}
              <div className="md:hidden">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="p-2.5 bg-red-100/80 hover:bg-red-700 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className="p-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-colors duration-200"
                  >
                    <LogInIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-gradient-to-b from-blue-800 to-blue-900 border-t border-blue-700/50 rounded-b-xl shadow-xl">
              <div className="flex flex-col space-y-1 px-4 py-4">
                {user && (
                  <Link
                    to="/"
                    className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-blue-700/60 transition-all duration-200 text-blue-100 hover:text-white font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MdDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                )}
                
                {user ? (
                  <>
                    {user.role === "superadmin" && (
                      <>
                        <Link
                          to="/all-users"
                          className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-blue-700/60 transition-all duration-200 text-blue-100 hover:text-white font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <UsersIcon className="h-5 w-5" />
                          <span>All Members</span>
                        </Link>

                         
                      </>
                    )}

                    <div className="pt-3 border-t border-blue-700/50">
                      <div className="flex items-center space-x-3 py-3 px-4 bg-blue-700/40 rounded-lg border border-blue-600/50 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-sm">
                          <div className="font-semibold text-blue-50">{user.name || 'User'}</div>
                          <div className="text-blue-300 text-xs capitalize">{user.role}</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className="flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 font-medium"
                  >
                    <LogInIcon className="h-5 w-5" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      {loginModalOpen && (
        <LoginModal 
          isOpen={loginModalOpen} 
          onClose={() => setLoginModalOpen(false)} 
        />
      )}
    </>
  );
}

export default Navbar;