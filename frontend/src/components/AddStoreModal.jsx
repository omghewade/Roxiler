import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { api } from '../api/client';
import { AlertCircle, Check } from 'lucide-react';

export function AddStoreModal({ isOpen, onClose, onStoreAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadOwners();
    }
  }, [isOpen]);

  async function loadOwners() {
    try {
      const res = await api.admin.getUsers({ role: 'STORE_OWNER' });
      if (res.success) {
        setOwners(res.users);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const isNameLengthValid = name.trim().length >= 20 && name.trim().length <= 60;
  const isAddressValid = address.trim().length > 0 && address.trim().length <= 400;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!isNameLengthValid) {
      setError(`Store name must be between 20 and 60 characters (current: ${name.trim().length}).`);
      return;
    }

    if (!isAddressValid) {
      setError(`Address must be under 400 characters.`);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
        ownerId: ownerId || null,
      };

      const res = await api.admin.addStore(payload);
      if (res.success) {
        onStoreAdded(res.store);
        onClose();
        setName('');
        setEmail('');
        setAddress('');
        setOwnerId('');
      }
    } catch (err) {
      setError(err.message || 'Failed to create store.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Store" maxWidth="max-w-lg">
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
              Store Name
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
            placeholder="e.g. Apex Electronics & Gadgets Hub"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Store Contact Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            placeholder="contact@example.com"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Store Address
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
            placeholder="Enter physical address (up to 400 characters)"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Assign Store Owner (Optional)
          </label>
          <select
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
          >
            <option value="">No owner assigned</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
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
            {loading ? 'Creating...' : 'Create Store'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
