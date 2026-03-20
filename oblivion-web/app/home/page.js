'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      router.push('/dashboard');
      return;
    }
    setReady(true);

    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#090c16] flex items-center justify-center">
        <div className="text-[#1db4c8] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090c16] text-gray-300">

      {/* NAV */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#090c16]/95 backdrop-blur-md border-b border-[#1e3a8a]/30' : ''
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#1e3a8a] to-[#1db4c8] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">OBLIVION</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#how" className="text-gray-400 hover:text-[#1db4c8] transition-colors">How it works</a>
            <a href="#features" className="text-gray-400 hover:text-[#1db4c8] transition-colors">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-[#1db4c8] transition-colors">Pricing</a>
            <a href="/verify" className="text-gray-400 hover:text-[#1db4c8] transition-colors">Verify</a>
            <a href="/login" className="bg-gradient-to-r from-[#1e3a8a] to-[#1db4c8] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              Sign in
            </a>
          </div>
          <a href="/login" className="md:hidden bg-gradient-to-r from-[#1e3a8a] to-[#1db4c8] text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Sign in
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 border border-[#1db4c8]/30 rounded-full text-[#1db4c8] text-xs font-semibold tracking-wide">
            ISO/IEC 27040:2024 COMPLIANT
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Prove you deleted it.
            <br />
            <span className="text-[#1db4c8]">Forever.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Blockchain-verified secure deletion certificates for enterprises
            that need legally defensible proof of data destruction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login" className="bg-gradient-to-r from-[#1e3a8a] to-[#1db4c8] text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Get started free
            </a>
            <a href="/verify" className="border border-[#1e3a8a] text-gray-300 px-8 py-4 rounded-xl font-semibold hover:border-[#1db4c8] hover:text-[#1db4c8] transition-all">
              Verify a certificate
            </a>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-[#1e3a8a]/20 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-gray-500">
          <span>GDPR Compliant</span>
          <span>ISO 27040:2024</span>
          <span>Ethereum Blockchain</span>
          <span>DoD 5220.22-M</span>
          <span>eIDAS 2.0 Ready</span>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
              Deleting files isn't enough.
              <br />You need proof.
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              GDPR Article 17 gives individuals the right to erasure. When they exercise it,
              you must delete their data — and be able to prove you did.
            </p>
            <p className="text-gray-400 leading-relaxed">
              A digitally signed certificate can be forged. A blockchain record cannot.
              Oblivion creates an immutable, timestamped proof of every deletion
              that no one — not even us — can alter or backdate.
            </p>
          </div>
          <div className="bg-[#0d101c] border border-[#1e3a8a]/30 rounded-2xl p-8 font-mono text-sm">
            <div className="text-gray-500 mb-3">// On-chain record</div>
            <div className="text-[#1db4c8]">OBLIVION_CERT<span className="text-gray-600">|</span></div>
            <div className="text-gray-400">v2.2<span className="text-gray-600">|</span>DELETION_CERTIFICATE</div>
            <div className="text-gray-400">files:<span className="text-white">3</span><span className="text-gray-600">|</span>size:<span className="text-white">2.4MB</span></div>
            <div className="text-gray-400">method:<span className="text-white">DoD 5220.22-M</span></div>
            <div className="text-gray-400">standard:<span className="text-white">ISO/IEC 27040:2024</span></div>
            <div className="text-gray-400">hw_mfr:<span className="text-white">Dell Inc.</span></div>
            <div className="text-gray-400">media:<span className="text-white">SSD</span></div>
            <div className="text-gray-400">outcome:<span className="text-green-400">VERIFIED_DELETED</span></div>
            <div className="mt-3 text-gray-600 text-xs">Block #7,234,891 · Ethereum Sepolia</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 bg-[#0b0e18]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Three steps. Permanent proof.</h2>
            <p className="text-gray-400">From file selection to blockchain-sealed certificate in under a minute.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Select & describe', desc: 'Right-click any file. Describe its contents. Hardware and IP are auto-detected.' },
              { step: '02', title: 'Secure overwrite', desc: 'Multi-pass military-grade overwrite. Each pass verified. File path checked before and after.' },
              { step: '03', title: 'Blockchain seal', desc: 'Cryptographic hashes recorded on Ethereum. PDF certificate generated. Immutable forever.' },
            ].map((item) => (
              <div key={item.step} className="group">
                <div className="text-[#1db4c8] text-5xl font-bold mb-4 opacity-30 group-hover:opacity-100 transition-opacity">{item.step}</div>
                <h3 className="text-white font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Built for compliance teams</h2>
            <p className="text-gray-400">Every detail designed for legal defensibility.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Blockchain verification', desc: 'Every deletion is recorded on the Ethereum blockchain. Immutable, timestamped, independently verifiable by anyone.' },
              { title: 'Hardware fingerprinting', desc: 'Auto-detects computer manufacturer, model, serial number, drive model, and media type via WMI. Full traceability.' },
              { title: 'Forensic path tracking', desc: 'Records full file path before deletion, verifies the file existed, then confirms it is gone. Before ✓ → After ✗.' },
              { title: 'Content descriptions', desc: 'Operators describe what each file contained. Text stays in the PDF only — blockchain stores SHA-256 hashes as fingerprints.' },
              { title: 'Operator identity', desc: 'Auto-generated operator code, session code, local and public IP addresses. Only hashes go on-chain — full details in the certificate.' },
              { title: 'ISO 27040:2024 compliant', desc: 'Follows Section 10.6.7 requirements for media sanitization documentation. PDF certificates with full audit trail.' },
              { title: 'Multi-pass overwrite', desc: 'DoD 5220.22-M (3-pass), NSA 7-pass, or single zero-fill. Each pass independently verified and recorded.' },
              { title: 'API + web dashboard', desc: 'REST API for integrations. Web portal for deletion history, usage tracking, certificate downloads, and public verification.' },
            ].map((feat) => (
              <div key={feat.title} className="bg-[#0d101c] border border-[#1e3a8a]/20 rounded-xl p-6 hover:border-[#1db4c8]/30 transition-colors">
                <h3 className="text-white font-semibold mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVACY TABLE */}
      <section className="py-24 px-6 bg-[#0b0e18]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Privacy by design</h2>
            <p className="text-gray-400">Sensitive data never touches the blockchain. Only hashes.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e3a8a]/30">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Data</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">PDF Certificate</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Blockchain</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">API</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[
                  ['File name & size', '✓', 'Hash only', '✓'],
                  ['Content description', '✓ Full text', 'SHA-256 hash', '✓'],
                  ['File path (before/after)', '✓ Full path', 'Hash only', '✓'],
                  ['Hardware details', '✓', '✓ (serials hashed)', '✓'],
                  ['Operator code', '✓', 'Hash only', '✓'],
                  ['IP addresses', '✓', 'Never', '✓'],
                  ['Deletion method & passes', '✓', '✓', '✓'],
                ].map(([label, pdf, chain, api], i) => (
                  <tr key={i} className="border-b border-[#1e3a8a]/10 hover:bg-[#0d101c] transition-colors">
                    <td className="py-3 px-4 text-white">{label}</td>
                    <td className="py-3 px-4 text-center text-[#1db4c8]">{pdf}</td>
                    <td className="py-3 px-4 text-center text-gray-400">{chain}</td>
                    <td className="py-3 px-4 text-center text-[#1db4c8]">{api}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Simple pricing</h2>
            <p className="text-gray-400">Start free. Pay per deletion when you scale.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-[#0d101c] border border-[#1e3a8a]/20 rounded-xl p-8">
              <div className="text-gray-400 text-sm font-semibold mb-2">FREE</div>
              <div className="text-4xl font-bold text-white mb-1">€0</div>
              <div className="text-gray-500 text-sm mb-6">50 deletions/month</div>
              <ul className="space-y-3 text-sm text-gray-400 mb-8">
                <li className="flex items-center gap-2"><span className="text-[#1db4c8]">✓</span> Blockchain recording</li>
                <li className="flex items-center gap-2"><span className="text-[#1db4c8]">✓</span> PDF certificates</li>
                <li className="flex items-center gap-2"><span className="text-[#1db4c8]">✓</span> API access</li>
                <li className="flex items-center gap-2"><span className="text-[#1db4c8]">✓</span> Web dashboard</li>
              </ul>
              <a href="/login" className="block text-center border border-[#1e3a8a] text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-[#1db4c8] hover:text-[#1db4c8] transition-all">Get started</a>
            </div>

            <div className="bg-[#0d101c] border border-[#1db4c8]/40 rounded-xl p-8 relative ring-1 ring-[#1db4c8]/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1db4c8] text-[#090c16] text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
              <div className="text-[#1db4c8] text-sm font-semibold mb-2">PRO</div>
              <div className="text-4xl font-bold text-white mb-1">€0.15</div>
              <div className="text-gray-500 text-sm mb-6">per deletion after free tier</div>
              <ul className="space-y-3 text-sm text-gray-400 mb-8">
                <li className="flex items-center gap-2"><span className="text-[#1db4c8]">✓</span> Everything in Free</li>
                <li className="flex items-center gap-2"><span className="text-[#1db4c8]">✓</span> Unlimited deletions</li>
                <li className="flex items-center gap-2"><span className="text-[#1db4c8]">✓</span> Priority support</li>
                <li className="flex items-center gap-2"><span className="text-[#1db4c8]">✓</span> Usage analytics</li>
              </ul>
              <a href="/login" className="block text-center bg-gradient-to-r from-[#1e3a8a] to-[#1db4c8] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">Start free, upgrade later</a>
            </div>

            <div className="bg-[#0d101c] border border-[#1e3a8a]/20 rounded-xl p-8">
              <div className="text-gray-400 text-sm font-semibold mb-2">ENTERPRISE</div>
              <div className="text-4xl font-bold text-white mb-1">Custom</div>
              <div className="text-gray-500 text-sm mb-6">volume discounts</div>
              <ul className="space-y-3 text-sm text-gray-400 mb-8">
                <li className="flex items-center gap-2"><span className="text-[#1db4c8]">✓</span> Dedicated infrastructure</li>
                <li className="flex items-center gap-2"><span className="text-[#1db4c8]">✓</span> On-premise deployment</li>
                <li className="flex items-center gap-2"><span className="text-[#1db4c8]">✓</span> QTSP integration</li>
                <li className="flex items-center gap-2"><span className="text-[#1db4c8]">✓</span> Custom SLA</li>
              </ul>
              <a href="mailto:info@oblivion.studio" className="block text-center border border-[#1e3a8a] text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-[#1db4c8] hover:text-[#1db4c8] transition-all">Contact sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#0b0e18]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stop hoping you deleted it.<br /><span className="text-[#1db4c8]">Know you did.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">50 free deletions per month. No credit card required.</p>
          <a href="/login" className="inline-block bg-gradient-to-r from-[#1e3a8a] to-[#1db4c8] text-white px-10 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity">Get started free</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1e3a8a]/20 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#1e3a8a] to-[#1db4c8] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">O</span>
                </div>
                <span className="text-white font-bold">OBLIVION</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">Blockchain-verified secure deletion for enterprises.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Product</h4>
              <div className="space-y-2 text-sm">
                <a href="#features" className="block text-gray-500 hover:text-[#1db4c8] transition-colors">Features</a>
                <a href="#pricing" className="block text-gray-500 hover:text-[#1db4c8] transition-colors">Pricing</a>
                <a href="/verify" className="block text-gray-500 hover:text-[#1db4c8] transition-colors">Verify certificate</a>
                <a href="/login" className="block text-gray-500 hover:text-[#1db4c8] transition-colors">Dashboard</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Compliance</h4>
              <div className="space-y-2 text-sm">
                <span className="block text-gray-500">ISO/IEC 27040:2024</span>
                <span className="block text-gray-500">GDPR Article 17</span>
                <span className="block text-gray-500">DoD 5220.22-M</span>
                <span className="block text-gray-500">eIDAS 2.0</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
              <div className="space-y-2 text-sm">
                <span className="block text-gray-500">Studio Conte S.r.l.</span>
                <a href="mailto:info@oblivion.studio" className="block text-gray-500 hover:text-[#1db4c8] transition-colors">info@oblivion.studio</a>
                <span className="block text-gray-500">Milan, Italy</span>
              </div>
            </div>
          </div>
          <div className="border-t border-[#1e3a8a]/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs">© 2026 Studio Conte S.r.l. All rights reserved.</p>
            <p className="text-gray-600 text-xs">Blockchain-verified data destruction</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
