import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { SortableTable } from '../components/SortableTable';
import { StarRating } from '../components/StarRating';
import { api } from '../api/client';
import {
  Store,
  Star,
  Users,
  Search,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchOwnerData();
  }, [searchName, searchEmail, sortBy, sortOrder]);

  async function fetchOwnerData() {
    setLoading(true);
    try {
      const res = await api.owner.getDashboard({
        searchName,
        searchEmail,
        sortBy,
        sortOrder,
      });
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSort(columnKey) {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
  }

  const raterColumns = [
    {
      key: 'name',
      label: 'Customer Name',
      className: 'font-semibold text-slate-800',
    },
    {
      key: 'email',
      label: 'Customer Email',
    },
    {
      key: 'address',
      label: 'Address',
      className: 'max-w-xs truncate',
    },
    {
      key: 'rating',
      label: 'Rating Given',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <StarRating rating={row.rating} size="sm" />
          <span className="text-xs font-bold text-amber-600">({row.rating}/5)</span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Submitted Date',
      render: (row) => (
        <span className="text-xs text-slate-400">
          {row.date ? new Date(row.date).toLocaleDateString() : '—'}
        </span>
      ),
    },
  ];

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400">
          Loading store dashboard...
        </div>
      </div>
    );
  }

  if (!data?.store) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">No Store Assigned</h2>
          <p className="text-sm text-slate-500 mt-2">
            Your store owner account is active, but no store is currently linked to your profile. Please contact a System Administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
              <Store className="w-3.5 h-3.5" />
              Store Performance
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{data.store.name}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{data.store.address}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 self-start md:self-auto">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Average Rating
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-black text-amber-400">
                  {data.averageRating !== null ? Number(data.averageRating).toFixed(1) : 'N/A'}
                </span>
                <StarRating rating={data.averageRating || 0} size="md" />
              </div>
            </div>

            <div className="h-10 w-px bg-white/10" />

            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Total Reviews
              </div>
              <span className="text-3xl font-black text-emerald-400">
                {data.totalRatings}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Customer Ratings History</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed list of users who submitted reviews for your store
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Search user name..."
                  className="w-full sm:w-48 pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Search user email..."
                  className="w-full sm:w-48 pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <SortableTable
            columns={raterColumns}
            data={data.raters || []}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            emptyMessage="No customers have rated this store yet."
          />
        </div>
      </main>
    </div>
  );
}
