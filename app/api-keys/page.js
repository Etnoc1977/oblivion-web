'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import AppShell from '@/components/AppShell';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadKeys(); }, []);

  async function loadKeys() {
    setLoading(true);
    const res = await api('/api/auth/api-keys');
    if (res.success) setKeys(res.data || []);
    setLoading(false);
  }

  async function createKey() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    const res = await api('/api/auth/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name: newKeyName }),
    });
    if (res.success) {
      setNewKey(res.data.key);
      setNewKeyName('');
      loadKeys();
    }
    setCreating(false);
  }

  async function revokeKey(id) {
    if (!confirm('Revoke this API key? This cannot be undone.')) return;
    await api(`/api/auth/api-keys/${id}`, { method: 'DELETE' });
    loadKeys();
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">API Keys</h1>
          <p className="text-gray-400 mt-1">Manage keys for the desktop app and integrations</p>
        </div>

        {/* New key display */}
        {newKey && (
          <div className="bg-dark-100 border border-teal-400/30 rounded-xl p-6 mb-6">
            <h3 className="text-teal-400 font-semibold mb-2">New API Key Created</h3>
            <p className="text-gray-400 text-sm mb-3">Copy this key now — it will not be shown again.</p>
            <div className="bg-dark-300 rounded-lg p-4 mb-3">
              <code className="text-white text-sm break-all select-all">{newKey}</code>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(newKey); }}
              className="text-sm text-teal-400 hover:text-teal-300 mr-4">Copy to clipboard</button>
            <button onClick={() => setNewKey('')}
              className="text-sm text-gray-500 hover:text-gray-300">Dismiss</button>
          </div>
        )}

        {/* Create key */}
        <div className="bg-dark-100 border border-navy-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Create New Key</h2>
          <div className="flex gap-3">
            <input type="text" value={newKeyName} onChange={e => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g. Desktop App, CI/CD)"
              className="flex-1 px-4 py-3 rounded-lg border text-sm"
              onKeyDown={e => e.key === 'Enter' && createKey()} />
            <button onClick={createKey} disabled={creating || !newKeyName.trim()}
              className="bg-gradient-to-r from-navy-500 to-teal-400 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap">
              {creating ? 'Creating...' : 'Create Key'}
            </button>
          </div>
        </div>

        {/* Keys list */}
        <div className="bg-dark-100 border border-navy-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Active Keys</h2>

          {loading ? (
            <div className="text-teal-400 py-8 text-center">Loading...</div>
          ) : (
            <div className="space-y-3">
              {keys.map(key => (
                <div key={key.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    key.is_active ? 'bg-dark-50 border-navy-700/30' : 'bg-dark-300 border-red-900/30 opacity-60'
                  }`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{key.name}</span>
                      {!key.is_active && (
                        <span className="text-xs text-red-400 bg-red-900/30 px-2 py-0.5 rounded-full">Revoked</span>
                      )}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 font-mono">{key.key_prefix}</div>
                    <div className="text-gray-500 text-xs mt-1">
                      Created: {formatDate(key.created_at)}
                      {key.last_used_at && ` • Last used: ${formatDate(key.last_used_at)}`}
                    </div>
                  </div>
                  {key.is_active && (
                    <button onClick={() => revokeKey(key.id)}
                      className="text-sm text-red-400 hover:text-red-300 border border-red-700/30 px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition-all">
                      Revoke
                    </button>
                  )}
                </div>
              ))}
              {keys.length === 0 && (
                <p className="text-gray-500 text-center py-8">No API keys yet. Create one above.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
