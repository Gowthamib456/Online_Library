import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { ShoppingCart, LogOut, User as UserIcon, BookOpen, LayoutDashboard, ExternalLink } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const isOnAdminPage = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={isAdmin ? '/admin' : '/home'} className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="text-blue-400" />
          Dualite Library
        </Link>

        <div className="flex items-center gap-6">
          {/* Admin Specific Navigation */}
          {isAdmin && (
            <div className="flex items-center gap-4 mr-4">
              {isOnAdminPage ? (
                <Link 
                  to="/home" 
                  className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition border border-slate-700"
                >
                  <ExternalLink size={14} /> View User Site
                </Link>
              ) : (
                <Link 
                  to="/admin" 
                  className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
                >
                  <LayoutDashboard size={14} /> Back to Dashboard
                </Link>
              )}
            </div>
          )}

          {/* User Navigation (Visible to User OR Admin when not on dashboard) */}
          {(!isAdmin || !isOnAdminPage) && (
            <>
              <Link to="/home" className="hover:text-blue-300 transition hidden md:block">Browse</Link>
              <Link to="/profile" className="hover:text-blue-300 transition hidden md:block">My Orders</Link>
              <Link to="/cart" className="relative hover:text-blue-300 transition">
                <ShoppingCart />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            </>
          )}
          
          <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
            <div className="flex items-center gap-2">
              <UserIcon size={18} />
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">{user.name}</span>
                {isAdmin && <span className="text-[10px] text-blue-400 font-mono uppercase">Admin</span>}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
