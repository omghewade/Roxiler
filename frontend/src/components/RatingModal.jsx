import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { StarRating } from './StarRating';
import { api } from '../api/client';
import { AlertCircle } from 'lucide-react';

export function RatingModal({ isOpen, onClose, store, onRatingSubmitted }) {
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (store && store.userSubmittedRating) {
      setRating(store.userSubmittedRating);
    } else {
      setRating(5);
    }
    setError('');
  }, [store, isOpen]);

  if (!store) return null;

  const isModify = !!store.userSubmittedRating;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (rating < 1 || rating > 5) {
      setError('Please choose a rating between 1 and 5 stars.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.ratings.submit({
        storeId: store.id,
        rating,
      });

      if (res.success) {
        onRatingSubmitted(store.id, rating, res.rating.overallRating, res.rating.ratingCount);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit rating.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isModify ? 'Modify Your Rating' : 'Submit Rating'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="text-center py-2">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">Store</div>
          <h4 className="text-lg font-bold text-slate-800">{store.name}</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{store.address}</p>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Choose Your Rating (1 - 5 Stars)
          </div>
          <StarRating
            rating={rating}
            size="xl"
            interactive={true}
            onChange={(newRating) => setRating(newRating)}
          />
          <div className="mt-3 text-sm font-bold text-amber-600">
            {rating} of 5 Stars
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
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
            {loading ? 'Saving...' : isModify ? 'Update Rating' : 'Submit Rating'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
