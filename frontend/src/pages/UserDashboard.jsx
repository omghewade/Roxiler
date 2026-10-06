import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { StarRating } from '../components/StarRating';
import { RatingModal } from '../components/RatingModal';
import { api } from '../api/client';
import {
  Search,
  Star,
  Store,
  MapPin,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Edit3,
} from 'lucide-react';

export function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const [selectedStore, setSelectedStore] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [searchName, searchAddress, sortBy, sortOrder]);

  async function fetchStores() {
    setLoading(true);
    try {
      const res = await api.stores.getAll({
        searchName,
        searchAddress,
        sortBy,
        sortOrder,
      });
      if (res.success) {
        setStores(res.stores);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSort(column) {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  }

  function openRatingModal(store) {
    setSelectedStore(store);
    setIsRatingModalOpen(true);
  }

  function handleRatingSubmitted(storeId, newRating, newOverallRating, newRatingCount) {
    setStores((prevStores) =>
      prevStores.map((s) =>
        s.id === storeId
          ? {
              ...s,
              userSubmittedRating: newRating,
              overallRating: newOverallRating,
              ratingCount: newRatingCount,
            }
          : s
      )
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Explore & Rate Stores
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse registered stores, view overall ratings, and share your 1-5 star reviews
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search by store name..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Search by address..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500 font-medium">
            <span>Sort By:</span>
            <button
              onClick={() => handleSort('name')}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
                sortBy === 'name'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Name
              {sortBy === 'name' ? (
                sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronsUpDown className="w-3 h-3 text-slate-400" />
              )}
            </button>
            <button
              onClick={() => handleSort('overall_rating')}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
                sortBy === 'overall_rating'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Rating
              {sortBy === 'overall_rating' ? (
                sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronsUpDown className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-medium">
            Loading store catalog...
          </div>
        ) : stores.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <Store className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No stores found</h3>
            <p className="text-sm text-slate-400 mt-1">Try refining your name or address search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => {
              const hasRated = store.userSubmittedRating !== null;

              return (
                <div
                  key={store.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base font-bold text-slate-800 leading-snug">
                        {store.name}
                      </h3>
                      <div className="shrink-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {store.overallRating !== null ? Number(store.overallRating).toFixed(1) : 'New'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{store.address}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                          Overall Rating
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <StarRating rating={store.overallRating || 0} size="sm" />
                          <span className="text-xs text-slate-400">({store.ratingCount || 0})</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                          Your Rating
                        </div>
                        {hasRated ? (
                          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                            ★ {store.userSubmittedRating} / 5
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic mt-0.5">Not rated</div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => openRatingModal(store)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        hasRated
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
                      }`}
                    >
                      {hasRated ? (
                        <>
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modify Your Rating</span>
                        </>
                      ) : (
                        <>
                          <Star className="w-3.5 h-3.5" />
                          <span>Submit a Rating</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {isRatingModalOpen && selectedStore && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => {
            setIsRatingModalOpen(false);
            setSelectedStore(null);
          }}
          store={selectedStore}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </div>
  );
}
