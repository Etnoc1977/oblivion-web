'use client';
import { useState, useEffect } from 'react';
import { api, getUser } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import AppShell from '@/components/AppShell';

const plans = [
  {
    id: 'free', name: 'Free', price: 0, period: '',
    features: ['50 deletions/month', 'API access', 'Blockchain recording', 'PDF certificates'],
    cta: 'Current Plan',
  },
  {
    id: 'starter', name: 'Starter', price: 2900, period: '/month',
    features: ['500 deletions/month', 'Priority API', 'Advanced analytics', 'Email support', 'Usage dashboard'],
    cta: 'Upgrade to Starter', popular: false,
  },
  {
    id: 'pro', name: 'Pro', price: 9900, period: '/month',
    features: ['5,000 deletions/month', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'Multi-user', 'Audit reports'],
    cta: 'Upgrade to Pro', popular: true,
  },
  {
    id: 'enterprise', name: 'Enterprise', price: null, period: '',
    features: ['Unlimited deletions', 'Dedicated infrastructure', 'On-premise option', '24/7 phone support', 'Custom SLA', 'QTSP integration'],
    cta: 'Contact Sales',
  },
];

export default function CheckoutPage() {
  const [usage, setUsage] = useState(null);
  const [activating, setActivating] = useState(false);
  const [message, setMessage] = useState('');
  const user = getUser();

  useEffect(() => {
    api('/api/billing/usage').then(res => {
      if (res.success) setUsage(res.data);
    });
  }, []);

  async function activateStripe() {
    setActivating(true);
    setMessage('');
    const res = await api('/api/billing/setup-stripe', { method: 'POST' });
    if (res.success) {
      setMessage('Stripe billing activated! Usage beyond the free tier will be billed monthly.');
    } else {
      setMessage(res.error?.message || 'Failed to activate billing');
    }
    setActivating(false);
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Plans & Billing</h1>
          <p className="text-gray-400 mt-2">Scale your secure deletion infrastructure</p>
        </div>

        {/* Current usage */}
        {usage && (
          <div className="bg-dark-100 border border-navy-700 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm">Current period usage</div>
                <div className="text-white text-2xl font-bold mt-1">
                  {usage.currentMonth.filesDeleted} / {usage.currentMonth.freeTierLimit} free
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-sm">Amount due</div>
                <div className="text-teal-400 text-2xl font-bold mt-1">
                  {formatCurrency(usage.currentMonth.amountCents)}
                </div>
              </div>
            </div>

            {/* Usage bar */}
            <div className="mt-4 h-2 bg-dark-300 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-navy-500 to-teal-400 rounded-full transition-all"
                style={{ width: `${Math.min(100, (usage.currentMonth.filesDeleted / usage.currentMonth.freeTierLimit) * 100)}%` }} />
            </div>
            <div className="text-gray-500 text-xs mt-2">
              {usage.currentMonth.freeRemaining} free deletions remaining this month
            </div>
          </div>
        )}

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map(plan => (
            <div key={plan.id}
              className={`bg-dark-100 border rounded-xl p-6 relative ${
                plan.popular ? 'border-teal-400 ring-1 ring-teal-400/20' :
                user?.plan === plan.id ? 'border-navy-500' : 'border-navy-700'
              }`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-400 text-dark-400 text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </div>
              )}

              <h3 className="text-white font-bold text-lg mb-2">{plan.name}</h3>
              <div className="mb-4">
                {plan.price !== null ? (
                  <span className="text-3xl font-bold text-white">{formatCurrency(plan.price)}</span>
                ) : (
                  <span className="text-2xl font-bold text-white">Custom</span>
                )}
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-teal-400">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                disabled={user?.plan === plan.id}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  user?.plan === plan.id
                    ? 'bg-navy-700 text-gray-400 cursor-default'
                    : plan.popular
                      ? 'bg-gradient-to-r from-navy-500 to-teal-400 text-white hover:opacity-90'
                      : 'border border-navy-700 text-gray-300 hover:border-teal-400 hover:text-teal-400'
                }`}>
                {user?.plan === plan.id ? '✓ Current Plan' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Stripe activation */}
        <div className="bg-dark-100 border border-navy-700 rounded-xl p-6 max-w-2xl mx-auto text-center">
          <h3 className="text-white font-semibold mb-2">Usage-Based Billing</h3>
          <p className="text-gray-400 text-sm mb-4">
            Beyond the free tier, each deletion costs {usage ? formatCurrency(usage.pricing.perDeletionCents) : '€0.15'}.
            Activate Stripe to enable automatic billing.
          </p>

          {message && (
            <div className="bg-teal-400/10 border border-teal-400/30 rounded-lg p-3 mb-4">
              <p className="text-teal-400 text-sm">{message}</p>
            </div>
          )}

          <button onClick={activateStripe} disabled={activating}
            className="bg-gradient-to-r from-navy-500 to-teal-400 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity">
            {activating ? 'Activating...' : 'Activate Stripe Billing'}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
