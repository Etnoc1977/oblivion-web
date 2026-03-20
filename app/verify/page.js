'use client';
import { useState } from 'react';
import { formatBytes, formatDate } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function VerifyPage() {
  const [txId, setTxId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleVerify(e) {
    e.preventDefault();
    if (!txId.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/api/deletions/verify/${encodeURIComponent(txId.trim())}`);
      const data = await res.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error?.message || 'Deletion record not found');
      }
    } catch (e) {
      setError('Connection failed. Please check the transaction ID and try again.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-dark-400">
      {/* Header */}
      <div className="border-b border-navy-700 bg-dark-100">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-navy-500 to-teal-400 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <div>
              <div className="text-white font-bold text-lg">OBLIVION</div>
              <div className="text-teal-400 text-xs">Deletion Verification</div>
            </div>
          </div>
          <a href="/login" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">
            Sign in →
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Verify a Deletion Certificate</h1>
          <p className="text-gray-400 text-lg">
            Enter a transaction ID to independently verify that a secure deletion was performed
            and recorded on the blockchain.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleVerify} className="max-w-2xl mx-auto mb-10">
          <div className="flex gap-3">
            <input type="text" value={txId} onChange={e => setTxId(e.target.value)}
              placeholder="Enter transaction ID (e.g. ISO27040_1773933816_1D5FA93B)"
              className="flex-1 px-5 py-4 rounded-xl border text-sm font-mono" />
            <button type="submit" disabled={loading || !txId.trim()}
              className="bg-gradient-to-r from-navy-500 to-teal-400 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap">
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-900/20 border border-red-700/30 rounded-xl p-6 text-center mb-8">
            <div className="text-3xl mb-3">✗</div>
            <h3 className="text-red-400 font-semibold text-lg mb-1">Not Found</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="max-w-3xl mx-auto">
            {/* Verification Badge */}
            <div className={`rounded-xl p-8 text-center mb-8 border ${
              result.verified
                ? 'bg-green-900/20 border-green-700/30'
                : 'bg-yellow-900/20 border-yellow-700/30'
            }`}>
              <div className="text-5xl mb-3">{result.verified ? '✓' : '⏳'}</div>
              <h2 className={`text-2xl font-bold ${result.verified ? 'text-green-400' : 'text-yellow-400'}`}>
                {result.verified ? 'DELETION VERIFIED' : 'DELETION PENDING'}
              </h2>
              <p className="text-gray-400 mt-2">
                {result.verified
                  ? 'This deletion has been completed and independently recorded on the blockchain.'
                  : 'This deletion is still in progress or has not been confirmed yet.'}
              </p>
            </div>

            {/* Details */}
            <div className="bg-dark-100 border border-navy-700 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Deletion Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <span className="text-gray-400">Transaction ID</span>
                  <div className="text-white font-mono text-xs mt-1">{result.transactionId}</div>
                </div>
                <div>
                  <span className="text-gray-400">Status</span>
                  <div className="text-green-400 font-semibold mt-1">{result.status}</div>
                </div>
                <div>
                  <span className="text-gray-400">Files Deleted</span>
                  <div className="text-white mt-1">{result.fileCount} file(s) — {formatBytes(result.totalBytes)}</div>
                </div>
                <div>
                  <span className="text-gray-400">Method</span>
                  <div className="text-white mt-1">{result.method} ({result.passes} passes)</div>
                </div>
                <div>
                  <span className="text-gray-400">Initiated</span>
                  <div className="text-white mt-1">{formatDate(result.initiatedAt)}</div>
                </div>
                <div>
                  <span className="text-gray-400">Completed</span>
                  <div className="text-white mt-1">{formatDate(result.completedAt)}</div>
                </div>
              </div>
            </div>

            {/* Blockchain Proof */}
            {result.blockchain?.txHash && (
              <div className="bg-dark-100 border border-teal-400/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-400 mb-4">⛓ Blockchain Proof</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Network:</span>
                    <span className="text-white ml-2">{result.blockchain.network}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Block:</span>
                    <span className="text-white ml-2">{result.blockchain.block || 'Pending'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Transaction Hash:</span>
                    <div className="text-teal-400 font-mono text-xs mt-1 break-all">{result.blockchain.txHash}</div>
                  </div>
                  <a href={`https://sepolia.etherscan.io/tx/${result.blockchain.txHash}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 bg-teal-400/10 border border-teal-400/30 text-teal-400 px-4 py-2 rounded-lg text-sm hover:bg-teal-400/20 transition-colors">
                    Verify on Etherscan →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-600 text-sm">
          <p>Oblivion — Blockchain-Verified Secure Deletion Platform</p>
          <p className="mt-1">ISO/IEC 27040:2024 Compliant • © Studio Conte S.r.l.</p>
        </div>
      </div>
    </div>
  );
}
