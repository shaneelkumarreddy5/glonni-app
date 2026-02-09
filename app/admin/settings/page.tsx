'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

const initialCategories = [
  { id: 'cat-1', name: 'Apparel', status: 'Active' },
  { id: 'cat-2', name: 'Home & Living', status: 'Active' },
  { id: 'cat-3', name: 'Accessories', status: 'Active' },
  { id: 'cat-4', name: 'Footwear', status: 'Disabled' },
];

const initialBanners = [
  { id: 'bn-1', name: 'Summer Cashback', status: 'Enabled' },
  { id: 'bn-2', name: 'Vendor Spotlight', status: 'Enabled' },
  { id: 'bn-3', name: 'Festive Deals', status: 'Disabled' },
];

export default function AdminSettingsPage() {
  const [commissionUser, setCommissionUser] = useState('6');
  const [commissionVendor, setCommissionVendor] = useState('12');
  const [minPayout, setMinPayout] = useState('500');
  const [returnWindow, setReturnWindow] = useState('7');
  const [codEnabled, setCodEnabled] = useState(true);

  const [affiliateEnabled, setAffiliateEnabled] = useState(true);
  const [vendorRegistrationEnabled, setVendorRegistrationEnabled] = useState(true);
  const [walletCashbackEnabled, setWalletCashbackEnabled] = useState(true);

  const [categories, setCategories] = useState(initialCategories);
  const [banners, setBanners] = useState(initialBanners);
  const [newCategory, setNewCategory] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const bannerPlaceholder = useMemo(
    () =>
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="160" viewBox="0 0 480 160"><rect width="480" height="160" fill="%231e293b"/><rect x="20" y="20" width="440" height="120" rx="18" fill="%230f172a" stroke="%23334155"/><text x="240" y="92" text-anchor="middle" fill="%23cbd5f5" font-family="Arial" font-size="18">Banner Preview</text></svg>',
    []
  );

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1400);
  };

  const handleSave = () => {
    showToast('Settings saved');
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const next = {
      id: `cat-${Date.now()}`,
      name: newCategory.trim(),
      status: 'Active',
    };
    setCategories((prev) => [next, ...prev]);
    setNewCategory('');
    showToast('Category added');
  };

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id
          ? { ...cat, status: cat.status === 'Active' ? 'Disabled' : 'Active' }
          : cat
      )
    );
    showToast('Category updated');
  };

  const renameCategory = (id: string) => {
    const nextName = window.prompt('Edit category name');
    if (!nextName) return;
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name: nextName } : cat))
    );
    showToast('Category updated');
  };

  const toggleBanner = (id: string) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id
          ? { ...banner, status: banner.status === 'Enabled' ? 'Disabled' : 'Enabled' }
          : banner
      )
    );
    showToast('Banner updated');
  };

  return (
    <section className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          System Settings
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Platform Control</h1>
        <p className="mt-1 text-sm text-slate-400">
          Configure platform policies, payouts, and merchandising content.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Platform Configuration</h2>
            <p className="mt-1 text-sm text-slate-400">
              Default commissions and operational policies.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900"
          >
            Save
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Default commission % (affiliate)
            </label>
            <input
              value={commissionUser}
              onChange={(event) => setCommissionUser(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Default vendor commission %
            </label>
            <input
              value={commissionVendor}
              onChange={(event) => setCommissionVendor(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Minimum payout threshold
            </label>
            <input
              value={minPayout}
              onChange={(event) => setMinPayout(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Return window (days)
            </label>
            <input
              value={returnWindow}
              onChange={(event) => setReturnWindow(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCodEnabled((prev) => !prev)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                codEnabled
                  ? 'bg-emerald-500/20 text-emerald-200'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {codEnabled ? 'COD Enabled' : 'COD Disabled'}
            </button>
            <span className="text-xs text-slate-400">Cash on delivery</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Category Management</h2>
              <p className="mt-1 text-sm text-slate-400">Organize storefront taxonomy.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <input
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              placeholder="New category"
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900"
            >
              Add
            </button>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-100">{category.name}</p>
                  <p className="text-xs text-slate-500">{category.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => renameCategory(category.id)}
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200"
                  >
                    {category.status === 'Active' ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Banner Management</h2>
            <p className="mt-1 text-sm text-slate-400">Control homepage banners.</p>
          </div>
          <div className="mt-4 space-y-3">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="h-24 overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
                  <Image
                    src={bannerPlaceholder}
                    alt="Banner preview"
                    width={480}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-slate-100">{banner.name}</p>
                    <p className="text-xs text-slate-500">{banner.status}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleBanner(banner.id)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                      banner.status === 'Enabled'
                        ? 'bg-emerald-500/20 text-emerald-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {banner.status === 'Enabled' ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Feature Toggles</h2>
          <p className="mt-1 text-sm text-slate-400">Turn key platform modules on or off.</p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setAffiliateEnabled((prev) => !prev)}
            className={`rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] ${
              affiliateEnabled
                ? 'bg-emerald-500/20 text-emerald-200'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {affiliateEnabled ? 'Affiliate Program: On' : 'Affiliate Program: Off'}
          </button>
          <button
            type="button"
            onClick={() => setVendorRegistrationEnabled((prev) => !prev)}
            className={`rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] ${
              vendorRegistrationEnabled
                ? 'bg-emerald-500/20 text-emerald-200'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {vendorRegistrationEnabled ? 'Vendor Registration: On' : 'Vendor Registration: Off'}
          </button>
          <button
            type="button"
            onClick={() => setWalletCashbackEnabled((prev) => !prev)}
            className={`rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] ${
              walletCashbackEnabled
                ? 'bg-emerald-500/20 text-emerald-200'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {walletCashbackEnabled ? 'Wallet Cashback: On' : 'Wallet Cashback: Off'}
          </button>
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}
