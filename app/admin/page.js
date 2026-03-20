'use client';
import { useState, useEffect } from 'react';
import { api, isAdmin } from '@/lib/api';
import { formatBytes, formatDate, formatCurrency } from '@/lib/utils';
import AppShell from '@/components/AppShell';
import StatCard from '@/components/StatCard';

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [dashRes, usersRes] = await Promise.all([
        api('/api/admin/dashboard'),
        api('/api/admin/users'),
      ]);

      if (dashRes.success) setData(dashRes.data);
      else setError(dashRes.error?.message || 'Failed to load dashboard');

      if (usersRes.success) setUsers(usersRes.data);
    } catch (e) {
      setError('Connection failed');
    }
    setLoading(false);
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Platform overview and management</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-teal-400 text-center py-20">Loading dashboard...</div>
        ) : data && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Users" value={data.users.total} icon="👥" color="navy" />
              <StatCard label="Total Deletions" value={data.deletions.total} icon="🗑️" color="teal" />
              <StatCard label="Files Deleted" value={data.deletions.totalFiles} icon="📄" color="green" />
              <StatCard label="Revenue (Month)" value={formatCurrency(data.revenue.thisMonthCents)}
                sub={`${data.deletions.thisMonth} deletions this month`} icon="💰" color="purple" />
            </div>

            {/* Plan Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-dark-100 border border-navy-700 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Plan Distribution</h2>
                <div className="space-y-3">
                  {Object.entries(data.users.planDistribution || {}).map(([plan, count]) => (
                    <div key={plan} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          plan === 'free' ? 'bg-gray-500' :
                          plan === 'starter' ? 'bg-teal-400' :
                          plan === 'pro' ? 'bg-navy-500' : 'bg-purple-500'
                        }`} />
                        <span className="text-gray-300 capitalize">{plan}</span>
                      </div>
                      <span className="text-white font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-dark-100 border border-navy-700 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Recent Deletions</h2>
                <div className="space-y-3">
                  {(data.recentDeletions || []).slice(0, 5).map((del, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-navy-700/50 last:border-0">
                      <div>
                        <div className="text-sm text-white font-mono">{del.transactionId.slice(0, 24)}...</div>
                        <div className="text-xs text-gray-500">{formatDate(del.initiatedAt)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-teal-400">{del.fileCount} file(s)</div>
                        <div className="text-xs text-gray-500">{formatBytes(del.totalBytes)}</div>
                      </div>
                    </div>
                  ))}
                  {(!data.recentDeletions || data.recentDeletions.length === 0) && (
                    <p className="text-gray-500 text-sm">No deletions yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Users Table */}
            {users && (
              <div className="bg-dark-100 border border-navy-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Users ({users.pagination?.total || 0})</h2>
                  <button onClick={loadData}
                    className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                    Refresh
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-navy-700">
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Company</th>
                        <th className="text-left py-3 px-4">Plan</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-right py-3 px-4">Deletions</th>
                        <th className="text-right py-3 px-4">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(users.users || []).map(user => (
                        <tr key={user.id} className="border-b border-navy-700/30 hover:bg-dark-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="text-white">{user.fullName || 'N/A'}</div>
                            <div className="text-gray-500 text-xs">{user.email}</div>
                          </td>
                          <td className="py-3 px-4 text-gray-300">{user.company || '—'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.plan === 'free' ? 'bg-gray-700 text-gray-300' :
                              user.plan === 'pro' ? 'bg-navy-500/30 text-teal-400' :
                              'bg-teal-400/20 text-teal-400'
                            }`}>{user.plan}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-xs ${user.role === 'admin' ? 'text-yellow-400' : 'text-gray-400'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-white">{user.deletionCount}</td>
                          <td className="py-3 px-4 text-right text-gray-500 text-xs">{formatDate(user.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
