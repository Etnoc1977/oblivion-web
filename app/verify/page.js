'use client';
import { useState, useRef, useEffect } from 'react';
import { formatBytes, formatDate } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function VerifyPage() {
  const [txId, setTxId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => { return () => stopCamera(); }, []);

  async function handleVerify(e) {
    if (e) e.preventDefault();
    if (!txId.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(`${API_URL}/api/deletions/verify/${encodeURIComponent(txId.trim())}`);
      const data = await res.json();
      if (data.success && data.data) { setResult(data.data); }
      else { setError(data.error?.message || 'Deletion record not found'); }
    } catch (e) { setError('Connection failed. Please try again.'); }
    setLoading(false);
  }

  async function startCamera() {
    setShowScanner(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError('Camera access denied. Enter the transaction ID manually.');
      setShowScanner(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setShowScanner(false);
  }

  return (
    <div className="min-h-screen bg-[#090c16]">
      <div className="border-b border-[#1e3a8a]/30 bg-[#111422]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#1e3a8a] to-[#1db4c8] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-lg">O</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm md:text-lg">OBLION</div>
              <div className="text-[#1db4c8] text-[10px] md:text-xs">Deletion Verification</div>
            </div>
          </div>
          <a href="/login" className="text-xs md:text-sm text-gray-400 hover:text-[#1db4c8] transition-colors">Sign in →</a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3">Verify a Deletion</h1>
          <p className="text-gray-400 text-sm md:text-lg px-4">Enter a transaction ID or scan a QR code to verify.</p>
        </div>

        {showScanner && (
          <div className="mb-6 bg-[#111422] border border-[#1e3a8a]/30 rounded-xl p-4 text-center">
            <video ref={videoRef} autoPlay playsInline className="w-full max-w-sm mx-auto rounded-lg mb-4" style={{ maxHeight: '300px', objectFit: 'cover' }} />
            <p className="text-gray-400 text-sm mb-3">Point camera at QR code on certificate</p>
            <button onClick={stopCamera} className="text-red-400 text-sm hover:text-red-300">Close camera</button>
          </div>
        )}

        <div className="max-w-2xl mx-auto mb-6 md:mb-10">
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <input type="text" value={txId} onChange={e => setTxId(e.target.value)}
              placeholder="Enter transaction ID" className="flex-1 px-4 py-3 md:px-5 md:py-4 rounded-xl border text-sm font-mono" />
            <div className="flex gap-2">
              <button type="submit" disabled={loading || !txId.trim()}
                className="flex-1 sm:flex-none bg-gradient-to-r from-[#1e3a8a] to-[#1db4c8] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity text-sm md:text-base">
                {loading ? 'Verifying...' : 'Verify'}
              </button>
              {!showScanner && (
                <button type="button" onClick={startCamera}
                  className="bg-[#111422] border border-[#1e3a8a] text-gray-300 px-4 py-3 rounded-xl hover:border-[#1db4c8] transition-colors" title="Scan QR code">📷</button>
              )}
            </div>
          </form>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto bg-red-900/20 border border-red-700/30 rounded-xl p-4 md:p-6 text-center mb-8">
            <div className="text-2xl md:text-3xl mb-2">✗</div>
            <h3 className="text-red-400 font-semibold text-base md:text-lg mb-1">Not Found</h3>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="max-w-3xl mx-auto">
            <div className={`rounded-xl p-6 md:p-8 text-center mb-6 md:mb-8 border ${
              result.verified ? 'bg-green-900/20 border-green-700/30' : 'bg-yellow-900/20 border-yellow-700/30'
            }`}>
              <div className="text-4xl md:text-5xl mb-2 md:mb-3">{result.verified ? '✓' : '⏳'}</div>
              <h2 className={`text-xl md:text-2xl font-bold ${result.verified ? 'text-green-400' : 'text-yellow-400'}`}>
                {result.verified ? 'DELETION VERIFIED' : 'DELETION PENDING'}
              </h2>
              <p className="text-gray-400 mt-2 text-sm md:text-base px-4">
                {result.verified ? 'This deletion has been completed and recorded on the blockchain.' : 'This deletion is still in progress.'}
              </p>
            </div>

            <div className="bg-[#111422] border border-[#1e3a8a]/30 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Deletion Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 md:gap-y-4 gap-x-8 text-sm">
                <div><span className="text-gray-400 text-xs">Transaction ID</span><div className="text-white font-mono text-xs mt-1 break-all">{result.transactionId}</div></div>
                <div><span className="text-gray-400 text-xs">Status</span><div className="text-green-400 font-semibold mt-1">{result.status}</div></div>
                <div><span className="text-gray-400 text-xs">Files Deleted</span><div className="text-white mt-1">{result.fileCount} file(s) — {formatBytes(result.totalBytes)}</div></div>
                <div><span className="text-gray-400 text-xs">Method</span><div className="text-white mt-1">{result.method} ({result.passes} passes)</div></div>
                <div><span className="text-gray-400 text-xs">Initiated</span><div className="text-white mt-1">{formatDate(result.initiatedAt)}</div></div>
                <div><span className="text-gray-400 text-xs">Completed</span><div className="text-white mt-1">{formatDate(result.completedAt)}</div></div>
              </div>
            </div>

            {result.blockchain?.txHash && (
              <div className="bg-[#111422] border border-[#1db4c8]/20 rounded-xl p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-[#1db4c8] mb-3 md:mb-4">⛓ Blockchain Proof</h3>
                <div className="space-y-3 text-sm">
                  <div><span className="text-gray-400">Network:</span><span className="text-white ml-2">{result.blockchain.network}</span></div>
                  <div><span className="text-gray-400">Block:</span><span className="text-white ml-2">{result.blockchain.block || 'Pending'}</span></div>
                  <div><span className="text-gray-400">Transaction Hash:</span><div className="text-[#1db4c8] font-mono text-xs mt-1 break-all">{result.blockchain.txHash}</div></div>
                  <a href={`https://sepolia.etherscan.io/tx/${result.blockchain.txHash}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 bg-[#1db4c8]/10 border border-[#1db4c8]/30 text-[#1db4c8] px-4 py-2 rounded-lg text-sm hover:bg-[#1db4c8]/20 transition-colors">
                    Verify on Etherscan →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12 md:mt-16 text-gray-600 text-xs md:text-sm">
          <p>Oblion — Beyond Doubt</p>
          <p className="mt-1">ISO/IEC 27040:2024 Compliant • © Studio Conte S.r.l.</p>
        </div>
      </div>
    </div>
  );
}
