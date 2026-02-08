'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AffiliateSettingsPage() {
  const router = useRouter();
  const [name, setName] = useState('Rhea Kapoor');
  const [email, setEmail] = useState('affiliate@glonni.com');
  const [phone, setPhone] = useState('+91 98100 44321');
  const [affiliateCode] = useState('GLONNI-AF-1024');

  const [payoutType, setPayoutType] = useState<'Bank' | 'UPI'>('Bank');
  const [accountHolder, setAccountHolder] = useState('Rhea Kapoor');
  const [bankName, setBankName] = useState('ICICI Bank');
  const [upiId, setUpiId] = useState('rhea@upi');
  const [showToast, setShowToast] = useState(false);

  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyApprovals, setNotifyApprovals] = useState(true);
  const [notifyPayouts, setNotifyPayouts] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1200);
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Manage affiliate profile and payout settings.</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
        >
          Logout
        </button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Profile Info</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Affiliate Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Phone
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Affiliate Code
            <input
              value={affiliateCode}
              readOnly
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Payout Method</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Bank', 'UPI'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPayoutType(option as 'Bank' | 'UPI')}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                payoutType === option
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Account Holder Name
            <input
              value={accountHolder}
              onChange={(event) => setAccountHolder(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          {payoutType === 'Bank' ? (
            <label className="text-sm font-semibold text-slate-700">
              Bank Name
              <input
                value={bankName}
                onChange={(event) => setBankName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
          ) : (
            <label className="text-sm font-semibold text-slate-700">
              UPI ID
              <input
                value={upiId}
                onChange={(event) => setUpiId(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Save Payout Method
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <label className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
            <span>Order notifications</span>
            <input
              type="checkbox"
              checked={notifyOrders}
              onChange={(event) => setNotifyOrders(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
            <span>Commission approval notifications</span>
            <input
              type="checkbox"
              checked={notifyApprovals}
              onChange={(event) => setNotifyApprovals(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
            <span>Payout notifications</span>
            <input
              type="checkbox"
              checked={notifyPayouts}
              onChange={(event) => setNotifyPayouts(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Support & Policies</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          <Link href="#" className="rounded-xl border border-slate-200 px-4 py-3">
            Affiliate Policy
          </Link>
          <Link href="#" className="rounded-xl border border-slate-200 px-4 py-3">
            Commission Structure
          </Link>
          <Link href="#" className="rounded-xl border border-slate-200 px-4 py-3">
            Support Contact
          </Link>
        </div>
      </section>

      {showToast && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          Settings saved
        </div>
      )}
    </section>
  );
}
