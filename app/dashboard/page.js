'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatBytes, formatDate, formatCurrency } from '@/lib/utils';
import AppShell from '@/components/AppShell';
import StatCard from '@/components/StatCard';

export default function DashboardPage() {
  const [deletions, setDeletions] = useState(null);
  const [usage, setUsage] = useState(null);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [delRes, usageRes] = await Promise.all([
      api('/api/deletions?limit=50'),
      api('/api/billing/usage'),
    ]);
    if (delRes.success) setDeletions(delRes.data);
    if (usageRes.success) setUsage(usageRes.data);
    setLoading(false);
  }

  async function viewDetail(id) {
    setSelected(id);
    const res = await api(`/api/deletions/${id}`);
    if (res.success) setDetail(res.data);
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Deletions</h1>
          <p className="text-gray-400 mt-1">Track your secure deletion history</p>
        </div>

        {/* Usage Stats */}
        {usage && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="This Month" value={usage.currentMonth.filesDeleted}
              sub={`of ${usage.currentMonth.freeTierLimit} free`} icon="📅" color="navy" />
            <StatCard label="Free Remaining" value={usage.currentMonth.freeRemaining}
              icon="🎁" color="teal" />
            <StatCard label="All Time Files" value={usage.allTime.filesDeleted}
              sub={formatBytes(usage.allTime.bytesDeleted)} icon="🗑️" color="green" />
            <StatCard label="Total Billed" value={formatCurrency(usage.allTime.amountCents)}
              sub={`${formatCurrency(usage.pricing.perDeletionCents)}/deletion`} icon="💰" color="purple" />
          </div>
        )}

        {/* Detail Modal */}
        {detail && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => { setDetail(null); setSelected(null); }}>
            <div className="bg-dark-100 border border-navy-700 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Deletion Details</h2>
                <button onClick={() => { setDetail(null); setSelected(null); }} className="text-gray-500 hover:text-white text-2xl">×</button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div><span className="text-gray-400">Transaction:</span><br/><span className="text-white font-mono text-xs">{detail.transactionId}</span></div>
                <div><span className="text-gray-400">Status:</span><br/><span className="text-green-400 font-semibold">{detail.status}</span></div>
                <div><span className="text-gray-400">Method:</span><br/><span className="text-white">{detail.method} ({detail.passes} passes)</span></div>
                <div><span className="text-gray-400">Blockchain:</span><br/><span className="text-teal-400 font-mono text-xs">{detail.blockchainTxHash?.slice(0, 20) || 'N/A'}...</span></div>
                <div><span className="text-gray-400">Initiated:</span><br/><span className="text-white">{formatDate(detail.initiatedAt)}</span></div>
                <div><span className="text-gray-400">Completed:</span><br/><span className="text-white">{formatDate(detail.completedAt)}</span></div>
              </div>

              {/* Files list */}
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Files ({detail.files?.length || 0})</h3>
              <div className="space-y-2">
                {(detail.files || []).map((f, i) => (
                  <div key={i} className="bg-dark-300 border border-navy-700/30 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{f.fileName}</div>
                        <div className="text-gray-500 text-xs truncate">{f.filePath}</div>
                        {f.contentDescription && (
                          <div className="text-gray-400 text-xs mt-1 italic">{f.contentDescription.slice(0, 120)}</div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-teal-400 text-sm">{formatBytes(f.fileSize)}</div>
                        {f.piiDetected?.length > 0 && (
                          <div className="text-yellow-400 text-xs mt-1">⚠ PII: {f.piiDetected.join(', ')}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {detail.blockchainTxHash && (
                <a href={`https://sepolia.etherscan.io/tx/${detail.blockchainTxHash}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-4 text-sm text-teal-400 hover:underline">
                  View on Etherscan →
                </a>
              )}

              {/* Certificate Actions */}
              <div className="mt-6 pt-4 border-t border-navy-700 flex items-center gap-3">
                <button onClick={async () => {
                    const res = await api(`/api/certificates/${detail.id}/download`);
                    if (res.success && res.data?.url) {
                      window.open(res.data.url, '_blank');
                    } else {
                      // No certificate stored — offer to regenerate
                      if (confirm('No certificate stored yet. Generate one now?')) {
                        const regen = await api(`/api/certificates/${detail.id}/regenerate`, { method: 'POST' });
                        if (regen.success) {
                          alert('Certificate generated! Click Download again.');
                        } else {
                          alert(regen.error?.message || 'Failed to generate certificate');
                        }
                      }
                    }
                  }}
                  className="bg-gradient-to-r from-navy-500 to-teal-400 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                  📄 Download Certificate
                </button>
                <button onClick={async () => {
                    const res = await api(`/api/certificates/${detail.id}/regenerate`, { method: 'POST' });
                    if (res.success) {
                      alert('Certificate regenerated from deletion data.');
                    } else {
                      alert(res.error?.message || 'Failed to regenerate');
                    }
                  }}
                  className="border border-navy-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-teal-400 hover:text-teal-400 transition-all">
                  🔄 Regenerate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deletions Table */}
        <div className="bg-dark-100 border border-navy-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Deletion History ({deletions?.pagination?.total || 0})
            </h2>
            <button onClick={loadData} className="text-sm text-teal-400 hover:text-teal-300">Refresh</button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-teal-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-navy-700">
                    <th className="text-left py-3 px-4">Transaction ID</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Files</th>
                    <th className="text-right py-3 px-4">Size</th>
                    <th className="text-left py-3 px-4">Blockchain</th>
                    <th className="text-right py-3 px-4">Date</th>
                    <th className="text-right py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {(deletions?.deletions || []).map(del => (
                    <tr key={del.id} className="border-b border-navy-700/30 hover:bg-dark-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-white">{del.transactionId.slice(0, 28)}...</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          del.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                          del.status === 'processing' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-gray-700 text-gray-300'
                        }`}>{del.status}</span>
                      </td>
                      <td className="py-3 px-4 text-right text-white">{del.fileCount}</td>
                      <td className="py-3 px-4 text-right text-gray-300">{formatBytes(del.totalBytes)}</td>
                      <td className="py-3 px-4">
                        {del.blockchainTxHash ? (
                          <span className="text-teal-400 text-xs font-mono">{del.blockchainTxHash.slice(0, 12)}...</span>
                        ) : (
                          <span className="text-gray-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-500 text-xs">{formatDate(del.initiatedAt)}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => viewDetail(del.id)}
                          className="text-teal-400 hover:text-teal-300 text-xs">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!deletions?.deletions || deletions.deletions.length === 0) && (
                <p className="text-center text-gray-500 py-10">No deletions recorded yet. Use the desktop app to get started.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
