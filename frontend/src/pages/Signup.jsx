import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Check } from 'lucide-react';

export function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isNameLengthValid = name.trim().length >= 20 && name.trim().length <= 60;
  const isAddressValid = address.trim().length > 0 && address.trim().length <= 400;
  const isPasswordLength = password.length >= 8 && password.length <= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!isNameLengthValid) {
      setError(`Name must be between 20 and 60 characters (currently: ${name.trim().length}).`);
      return;
    }

    if (!isPasswordLength || !hasUppercase || !hasSpecial) {
      setError('Password must meet all required security constraints.');
      return;
    }

    if (!isAddressValid) {
      setError('Address is required and must not exceed 400 characters.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        address: address.trim(),
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-emerald-50/20 to-slate-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 my-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-500/20">
            R
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Create Normal User Account
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Join ROXILER to review and rate registered stores
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Full Name
              </label>
              <span
                className={`text-xs ${
                  isNameLengthValid ? 'text-emerald-600 font-medium' : 'text-slate-400'
                }`}
              >
                {name.trim().length}/60 (min 20)
              </span>
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
              placeholder="e.g. Jonathan Alexander Sterling"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
              placeholder="8-16 characters"
            />
            <div className="mt-2 space-y-1 text-xs">
              <div className={`flex items-center gap-1.5 ${isPasswordLength ? 'text-emerald-600' : 'text-slate-400'}`}>
                <Check className="w-3.5 h-3.5" />
                <span>8 to 16 characters</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-600' : 'text-slate-400'}`}>
                <Check className="w-3.5 h-3.5" />
                <span>At least 1 uppercase letter</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-600' : 'text-slate-400'}`}>
                <Check className="w-3.5 h-3.5" />
                <span>At least 1 special character</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Address
              </label>
              <span className="text-xs text-slate-400">{address.trim().length}/400</span>
            </div>
            <textarea
              rows="3"
              required
              maxLength={400}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all resize-none"
              placeholder="Your complete residential address (up to 400 characters)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Complete Sign Up'}</span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
