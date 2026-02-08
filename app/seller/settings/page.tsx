'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type KycStatus = 'Not Submitted' | 'Under Review' | 'Approved';

type KycCard = {
  title: string;
  status: KycStatus;
};

const kycCards: KycCard[] = [
  { title: 'PAN Card', status: 'Under Review' },
  { title: 'GST Certificate', status: 'Not Submitted' },
  { title: 'Bank Proof', status: 'Approved' },
];

const kycStyles: Record<KycStatus, string> = {
  'Not Submitted': 'bg-slate-100 text-slate-600',
  'Under Review': 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
};

export default function SellerSettingsPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [storeName, setStoreName] = useState('Glonni Studio');
  const [category, setCategory] = useState('Apparel & Lifestyle');
  const [email, setEmail] = useState('seller@glonni.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('27 Skyline Plaza, Mumbai, Maharashtra');
  const [gstNumber] = useState('27AADCG1234K1ZV');

  const [accountHolder, setAccountHolder] = useState('Glonni Studio LLP');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber] = useState('XXXX-XXXX-8899');
  const [ifsc, setIfsc] = useState('HDFC0001289');

  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyReturns, setNotifyReturns] = useState(true);
  const [notifySettlements, setNotifySettlements] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
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
          <p className="mt-1 text-sm text-slate-500">
            Manage store profile, KYC, and settlement preferences.
          </p>
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Store Profile</h2>
          <button
            type="button"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Store Name
            <input
              value={storeName}
              onChange={(event) => setStoreName(event.target.value)}
              disabled={!isEditing}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Business Category
            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={!isEditing}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Contact Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={!isEditing}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Contact Phone
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={!isEditing}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700 md:col-span-2">
            Store Address
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              disabled={!isEditing}
              className="mt-2 min-h-[110px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            GST Number
            <input
              value={gstNumber}
              readOnly
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">KYC Information</h2>
        <p className="mt-1 text-sm text-slate-500">KYC approval required for settlements.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {kycCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    kycStyles[card.status]
                  }`}
                >
                  {card.status}
                </span>
              </div>
              <button
                type="button"
                className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600"
              >
                Upload
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Bank & Settlement Details</h2>
        <p className="mt-1 text-sm text-slate-500">Payouts will be credited to this account.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Account Holder Name
            <input
              value={accountHolder}
              onChange={(event) => setAccountHolder(event.target.value)}
              disabled={!isEditing}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Bank Name
            <input
              value={bankName}
              onChange={(event) => setBankName(event.target.value)}
              disabled={!isEditing}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Account Number
            <input
              value={accountNumber}
              readOnly
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            IFSC Code
            <input
              value={ifsc}
              onChange={(event) => setIfsc(event.target.value)}
              disabled={!isEditing}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>
        </div>
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
            <span>Return notifications</span>
            <input
              type="checkbox"
              checked={notifyReturns}
              onChange={(event) => setNotifyReturns(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
            <span>Settlement notifications</span>
            <input
              type="checkbox"
              checked={notifySettlements}
              onChange={(event) => setNotifySettlements(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Support & Policies</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          <Link href="#" className="rounded-xl border border-slate-200 px-4 py-3">
            Seller Support
          </Link>
          <Link href="#" className="rounded-xl border border-slate-200 px-4 py-3">
            Return Policy
          </Link>
          <Link href="#" className="rounded-xl border border-slate-200 px-4 py-3">
            Settlement Policy
          </Link>
          <Link href="#" className="rounded-xl border border-slate-200 px-4 py-3">
            Terms & Conditions
          </Link>
        </div>
      </section>

      {showToast && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          Store profile updated
        </div>
      )}
    </section>
  );
}
