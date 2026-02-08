'use client';

import Link from 'next/link';

const cashbackHistory = [
  { date: '12 Jan 2026', ref: 'ORD-101', amount: '₹120', status: 'Credited' },
  { date: '18 Jan 2026', ref: 'ORD-102', amount: '₹80', status: 'Pending' },
  { date: '20 Jan 2026', ref: 'Promo Bonus', amount: '₹200', status: 'Credited' },
];

const addresses = [
  {
    id: 'addr-1',
    label: 'Home',
    lines: ['Flat 302, Green Residency,', 'Madhapur, Hyderabad, Telangana – 500081'],
  },
  {
    id: 'addr-2',
    label: 'Work',
    lines: ['12-4-56, Lake View Apartments,', 'Nellore, Andhra Pradesh – 524001'],
  },
];

const returns = [
  { id: 'RET-201', item: 'Wireless Speaker', status: 'Approved' },
  { id: 'RET-202', item: 'Smart Fitness Watch', status: 'In Review' },
];

const payments = [
  { id: 'card-1', label: 'Visa •••• 2145', sub: 'Expires 08/27' },
  { id: 'upi-1', label: 'UPI - shaneel@upi', sub: 'Primary' },
];

const statusStyles: Record<string, string> = {
  Credited: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  'In Review': 'bg-amber-100 text-amber-700',
};

export default function SettingsPage() {
  return (
    <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Back to Home
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account preferences and utilities.</p>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                WC
              </span>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Wallet & Cashback</h2>
                <p className="text-sm text-gray-500">Balance and cashback history.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Wallet Balance</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">₹540</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Pending Cashback</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">₹320</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              {cashbackHistory.map((entry) => (
                <div
                  key={`${entry.date}-${entry.ref}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">{entry.ref}</p>
                    <p className="text-xs text-gray-500">{entry.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{entry.amount}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[entry.status]}`}>
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                AD
              </span>
              <div>
                <h2 className="text-base font-semibold text-gray-900">My Addresses</h2>
                <p className="text-sm text-gray-500">Saved delivery locations.</p>
              </div>
            </div>
            <div className="space-y-3">
              {addresses.map((address) => (
                <div key={address.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{address.label}</p>
                    <div className="flex gap-2">
                      <button type="button" className="text-xs font-medium text-gray-600">
                        Edit
                      </button>
                      <button type="button" className="text-xs font-medium text-red-600">
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {address.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700"
            >
              Add New Address
            </button>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                RR
              </span>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Returns & Refunds</h2>
                <p className="text-sm text-gray-500">Your recent return requests.</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {returns.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">{entry.item}</p>
                    <p className="text-xs text-gray-500">{entry.id}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[entry.status]}`}>
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                PM
              </span>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Payment Methods</h2>
                <p className="text-sm text-gray-500">Saved cards and UPI.</p>
              </div>
            </div>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-900">{payment.label}</p>
                  <p className="text-xs text-gray-500">{payment.sub}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                LG
              </span>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Legal</h2>
                <p className="text-sm text-gray-500">Policies and terms.</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <button type="button" className="w-full text-left font-medium text-gray-700">
                Terms & Conditions
              </button>
              <button type="button" className="w-full text-left font-medium text-gray-700">
                Privacy Policy
              </button>
              <button type="button" className="w-full text-left font-medium text-gray-700">
                Refund Policy
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Logout</h2>
                <p className="text-sm text-gray-500">Sign out from this device.</p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
              >
                Logout
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
