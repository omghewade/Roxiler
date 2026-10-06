import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { SortableTable } from '../components/SortableTable';
import { StarRating } from '../components/StarRating';
import { AddStoreModal } from '../components/AddStoreModal';
import { AddUserModal } from '../components/AddUserModal';
import { api } from '../api/client';
import {
  Users,
  Store,
  Star,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Building2,
  Shield,
  User,
} from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stores');
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [storeSearchName, setStoreSearchName] = useState('');
  const [storeSearchEmail, setStoreSearchEmail] = useState('');
  const [storeSearchAddress, setStoreSearchAddress] = useState('');
  const [storeSortBy, setStoreSortBy] = useState('name');
  const [storeSortOrder, setStoreSortOrder] = useState('asc');

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearchName, setUserSearchName] = useState('');
  const [userSearchEmail, setUserSearchEmail] = useState('');
  const [userSearchAddress, setUserSearchAddress] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('');
  const [userSortBy, setUserSortBy] = useState('name');
  const [userSortOrder, setUserSortOrder] = useState('asc');

  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'stores') {
      fetchStores();
    } else {
      fetchUsers();
    }
  }, [
    activeTab,
    storeSearchName,
    storeSearchEmail,
    storeSearchAddress,
    storeSortBy,
    storeSortOrder,
    userSearchName,
    userSearchEmail,
    userSearchAddress,
    userFilterRole,
    userSortBy,
    userSortOrder,
  ]);

  async function fetchStats() {
    setLoadingStats(true);
    try {
      const res = await api.admin.getStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  }

  async function fetchStores() {
    setLoadingStores(true);
    try {
      const res = await api.admin.getStores({
        searchName: storeSearchName,
        searchEmail: storeSearchEmail,
        searchAddress: storeSearchAddress,
        sortBy: storeSortBy,
        sortOrder: storeSortOrder,
      });
      if (res.success) {
        setStores(res.stores);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStores(false);
    }
  }

  async function fetchUsers() {
    setLoadingUsers(true);
    try {
      const res = await api.admin.getUsers({
        searchName: userSearchName,
        searchEmail: userSearchEmail,
        searchAddress: userSearchAddress,
        role: userFilterRole,
        sortBy: userSortBy,
        sortOrder: userSortOrder,
      });
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  }

  function handleStoreSort(columnKey) {
    if (storeSortBy === columnKey) {
      setStoreSortOrder(storeSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setStoreSortBy(columnKey);
      setStoreSortOrder('asc');
    }
  }

  function handleUserSort(columnKey) {
    if (userSortBy === columnKey) {
      setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortBy(columnKey);
      setUserSortOrder('asc');
    }
  }

  const storeColumns = [
    {
      key: 'name',
      label: 'Store Name',
      className: 'font-semibold text-slate-800',
    },
    {
      key: 'email',
      label: 'Contact Email',
    },
    {
      key: 'address',
      label: 'Address',
      className: 'max-w-xs truncate',
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (store) => (
        <div className="flex items-center gap-2">
          <StarRating rating={store.rating || 0} size="sm" showLabel={true} />
          <span className="text-xs text-slate-400">({store.ratingCount || 0})</span>
        </div>
      ),
    },
    {
      key: 'ownerName',
      label: 'Assigned Owner',
      sortable: false,
      render: (store) =>
        store.ownerName ? (
          <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
            {store.ownerName}
          </span>
        ) : (
          <span className="text-xs text-slate-400 italic">None</span>
        ),
    },
  ];

  const userColumns = [
    {
      key: 'name',
      label: 'Full Name',
      className: 'font-semibold text-slate-800',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'address',
      label: 'Address',
      className: 'max-w-xs truncate',
    },
    {
      key: 'role',
      label: 'Role',
      render: (user) => {
        if (user.role === 'ADMIN') {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <Shield className="w-3 h-3" />
              Admin
            </span>
          );
        }
        if (user.role === 'STORE_OWNER') {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              <Store className="w-3 h-3" />
              Store Owner
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <User className="w-3 h-3" />
            Normal User
          </span>
        );
      },
    },
    {
      key: 'rating',
      label: 'Store Rating (Owner)',
      render: (user) => {
        if (user.role !== 'STORE_OWNER') {
          return <span className="text-xs text-slate-400">—</span>;
        }
        return user.rating !== null ? (
          <div className="flex items-center gap-1.5">
            <StarRating rating={user.rating} size="sm" showLabel={true} />
            <span className="text-xs text-slate-400">({user.ratingCount})</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">No ratings yet</span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              System Administration
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Platform dashboard for managing stores, users, and overall ratings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddStoreOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Store</span>
            </button>
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-purple-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Users</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">
                {loadingStats ? '...' : stats.totalUsers}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Stores</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">
                {loadingStats ? '...' : stats.totalStores}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Submitted Ratings</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">
                {loadingStats ? '...' : stats.totalRatings}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="border-b border-slate-200 px-6 pt-4 flex gap-8">
            <button
              onClick={() => setActiveTab('stores')}
              className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'stores'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Store className="w-4 h-4" />
              Registered Stores ({stores.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'users'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Users className="w-4 h-4" />
              User Directory ({users.length})
            </button>
          </div>

          {activeTab === 'stores' && (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={storeSearchName}
                    onChange={(e) => setStoreSearchName(e.target.value)}
                    placeholder="Filter by Store Name"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={storeSearchEmail}
                    onChange={(e) => setStoreSearchEmail(e.target.value)}
                    placeholder="Filter by Email"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={storeSearchAddress}
                    onChange={(e) => setStoreSearchAddress(e.target.value)}
                    placeholder="Filter by Address"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <SortableTable
                columns={storeColumns}
                data={stores}
                sortBy={storeSortBy}
                sortOrder={storeSortOrder}
                onSort={handleStoreSort}
                emptyMessage="No stores match the filtering criteria."
              />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={userSearchName}
                    onChange={(e) => setUserSearchName(e.target.value)}
                    placeholder="Filter by Name"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={userSearchEmail}
                    onChange={(e) => setUserSearchEmail(e.target.value)}
                    placeholder="Filter by Email"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={userSearchAddress}
                    onChange={(e) => setUserSearchAddress(e.target.value)}
                    placeholder="Filter by Address"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <select
                    value={userFilterRole}
                    onChange={(e) => setUserFilterRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    <option value="">All Roles</option>
                    <option value="ADMIN">System Administrator</option>
                    <option value="USER">Normal User</option>
                    <option value="STORE_OWNER">Store Owner</option>
                  </select>
                </div>
              </div>

              <SortableTable
                columns={userColumns}
                data={users}
                sortBy={userSortBy}
                sortOrder={userSortOrder}
                onSort={handleUserSort}
                emptyMessage="No users match the filtering criteria."
              />
            </div>
          )}
        </div>
      </main>

      {isAddStoreOpen && (
        <AddStoreModal
          isOpen={isAddStoreOpen}
          onClose={() => setIsAddStoreOpen(false)}
          onStoreAdded={() => {
            fetchStores();
            fetchStats();
          }}
        />
      )}

      {isAddUserOpen && (
        <AddUserModal
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          onUserAdded={() => {
            fetchUsers();
            fetchStats();
          }}
        />
      )}
    </div>
  );
}
