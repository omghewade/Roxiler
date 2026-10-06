import React, { useState } from 'react';
import { Modal } from './Modal';
import { api } from '../api/client';
import { AlertCircle, Check } from 'lucide-react';

export function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('USER');
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
      setError(`Full name must be between 20 and 60 characters (currently: ${name.trim().length}).`);
      return;
    }

    if (!isPasswordLength || !hasUppercase || !hasSpecial) {
      setError('Password must be 8-16 characters and contain at least one uppercase letter and one special character.');
      return;
    }

    if (!isAddressValid) {
      setError('Address is required and must not exceed 400 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.admin.addUser({
        name: name.trim(),
        email: email.trim(),
        password,
        address: address.trim(),
        role,
      });

      if (res.success) {
        onUserAdded(res.user);
        onClose();
        setName('');
        setEmail('');
        setPassword('');
        setAddress('');
        setRole('USER');
      }
    } catch (err) {
      setError(err.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
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
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            placeholder="e.g. Jonathan Alexander Sterling"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            >
              <option value="USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Initial Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            placeholder="8-16 chars (uppercase + symbol)"
          />
          <div className="mt-2 space-y-1 text-xs">
            <div className={`flex items-center gap-1.5 ${isPasswordLength ? 'text-emerald-600' : 'text-slate-400'}`}>
              <Check className="w-3.5 h-3.5" />
              <span>8-16 characters</span>
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
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
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
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm resize-none"
            placeholder="Full residential or office address"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-sm transition-colors"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
