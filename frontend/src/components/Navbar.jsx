import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChangePasswordModal } from './ChangePasswordModal';
import { LogOut, KeyRound, Store, Shield, User } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function getRoleBadge() {
    if (!user) return null;
    if (user.role === 'ADMIN') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
          <Shield className="w-3.5 h-3.5" />
          System Administrator
        </span>
      );
    }
    if (user.role === 'STORE_OWNER') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <Store className="w-3.5 h-3.5" />
          Store Owner
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <User className="w-3.5 h-3.5" />
        Normal User
      </span>
    );
  }

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20 text-lg">
                R
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  ROXILER
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-400 border-l border-slate-200 pl-2">
                  Store Ratings Platform
                </span>
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-semibold text-slate-800 truncate max-w-[200px]">{user.name}</div>
                  <div className="text-xs text-slate-500 truncate max-w-[200px]">{user.email}</div>
                </div>

                {getRoleBadge()}

                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  title="Update Password"
                >
                  <KeyRound className="w-4 h-4" />
                </button>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {isPasswordModalOpen && (
        <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
      )}
    </>
  );
}
