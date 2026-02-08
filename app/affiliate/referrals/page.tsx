'use client';

import Image from 'next/image';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getProductsServerSnapshot,
  getProductsSnapshot,
  subscribeToProducts,
} from '@/lib/sellerProducts';

const sources = ['Web', 'WhatsApp', 'Instagram'] as const;
const devices = ['Mobile', 'Desktop'] as const;
const statuses = ['Clicked', 'Converted'] as const;

type ClickEntry = {
  id: string;
  date: string;
  source: (typeof sources)[number];
  device: (typeof devices)[number];
  status: (typeof statuses)[number];
};

type Campaign = {
  id: string;
  name: string;
  link: string;
  clicks: number;
  orders: number;
  earnings: number;
};

const initialClicks: ClickEntry[] = [
  { id: 'clk-1', date: '08 Feb 2026', source: 'Web', device: 'Mobile', status: 'Clicked' },
  { id: 'clk-2', date: '08 Feb 2026', source: 'Instagram', device: 'Mobile', status: 'Converted' },
  { id: 'clk-3', date: '07 Feb 2026', source: 'WhatsApp', device: 'Desktop', status: 'Clicked' },
  { id: 'clk-4', date: '07 Feb 2026', source: 'Web', device: 'Desktop', status: 'Converted' },
  { id: 'clk-5', date: '06 Feb 2026', source: 'Instagram', device: 'Mobile', status: 'Clicked' },
  { id: 'clk-6', date: '06 Feb 2026', source: 'Web', device: 'Mobile', status: 'Clicked' },
  { id: 'clk-7', date: '05 Feb 2026', source: 'WhatsApp', device: 'Mobile', status: 'Converted' },
  { id: 'clk-8', date: '05 Feb 2026', source: 'Web', device: 'Desktop', status: 'Clicked' },
  { id: 'clk-9', date: '04 Feb 2026', source: 'Instagram', device: 'Mobile', status: 'Clicked' },
  { id: 'clk-10', date: '04 Feb 2026', source: 'Web', device: 'Desktop', status: 'Clicked' },
];

export default function AffiliateReferralsPage() {
  const referralCode = 'GLONNI-AF-1024';
  const referralLink = `https://glonni.app/?ref=${referralCode}`;
  const [toast, setToast] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState('');
  const [clicks, setClicks] = useState(initialClicks);
  const products = useSyncExternalStore(
    subscribeToProducts,
    getProductsSnapshot,
    getProductsServerSnapshot
  );
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'cmp-1',
      name: 'Summer Instagram',
      link: `${referralLink}&campaign=summer-ig`,
      clicks: 320,
      orders: 14,
      earnings: 5200,
    },
    {
      id: 'cmp-2',
      name: 'WhatsApp Broadcast',
      link: `${referralLink}&campaign=wa-broadcast`,
      clicks: 210,
      orders: 9,
      earnings: 3400,
    },
  ]);

  const totalClicks = clicks.length + campaigns.reduce((sum, item) => sum + item.clicks, 0);
  const totalOrders = campaigns.reduce((sum, item) => sum + item.orders, 0) +
    clicks.filter((item) => item.status === 'Converted').length;
  const uniqueClicks = Math.max(1, Math.round(totalClicks * 0.72));
  const conversionRate = totalClicks === 0 ? 0 : Math.round((totalOrders / totalClicks) * 100);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1200);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      showToast('Referral link copied');
    } catch {
      showToast('Unable to copy link');
    }
  };

  const buildProductLink = (productId: string) =>
    `https://glonni.app/product/${productId}?ref=${referralCode}`;

  const handleCopyProductLink = async (productId: string) => {
    try {
      await navigator.clipboard.writeText(buildProductLink(productId));
      showToast('Product referral link copied');
    } catch {
      showToast('Unable to copy link');
    }
  };

  const handleShare = async (productId: string, channel: 'generic' | 'whatsapp' | 'telegram') => {
    const link = buildProductLink(productId);
    const text = `Check this on Glonni: ${link}`;

    if (channel === 'whatsapp') {
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      showToast('WhatsApp share opened');
      return;
    }

    if (channel === 'telegram') {
      const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(
        'Check this on Glonni'
      )}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      showToast('Telegram share opened');
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Glonni Referral', text: 'Check this on Glonni', url: link });
        showToast('Share sheet opened');
        return;
      } catch {
        showToast('Unable to share');
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(link);
      showToast('Link copied for sharing');
    } catch {
      showToast('Unable to share');
    }
  };

  const handleCreateCampaign = () => {
    if (!campaignName.trim()) return;
    const slug = campaignName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCampaign: Campaign = {
      id: `cmp-${Date.now()}`,
      name: campaignName.trim(),
      link: `${referralLink}&campaign=${slug}`,
      clicks: 0,
      orders: 0,
      earnings: 0,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
    setCampaignName('');
    showToast('Campaign link created');
  };

  const addClick = (context: 'primary' | string) => {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const entry: ClickEntry = {
      id: `clk-${Date.now()}`,
      date: '08 Feb 2026',
      source,
      device,
      status,
    };

    setClicks((prev) => [entry, ...prev].slice(0, 10));

    if (context !== 'primary') {
      setCampaigns((prev) =>
        prev.map((item) =>
          item.id === context
            ? {
                ...item,
                clicks: item.clicks + 1,
                orders: status === 'Converted' ? item.orders + 1 : item.orders,
                earnings: status === 'Converted' ? item.earnings + 450 : item.earnings,
              }
            : item
        )
      );
    }
  };

  const metrics = useMemo(
    () => [
      { label: 'Total Clicks', value: totalClicks.toLocaleString('en-IN') },
      { label: 'Unique Clicks', value: uniqueClicks.toLocaleString('en-IN') },
      { label: 'Conversion Rate', value: `${conversionRate}%` },
    ],
    [totalClicks, uniqueClicks, conversionRate]
  );

  const referralProducts = useMemo(
    () =>
      products.map((product, index) => {
        const rate = 0.05 + (index % 3) * 0.01;
        const commission = Math.round(product.price * rate);
        return {
          ...product,
          rate,
          commission,
          link: buildProductLink(product.id),
        };
      }),
    [products]
  );

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Referral Links</h1>
        <p className="mt-1 text-sm text-slate-500">
          Share your referral links and track clicks in real time.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Primary Referral Link
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{referralCode}</p>
            <p className="mt-1 text-sm text-slate-500 break-all">{referralLink}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Copy Link
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Share
            </button>
            <button
              type="button"
              onClick={() => addClick('primary')}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Simulate Click
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {metric.label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{metric.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Product-wise Referral Links</h2>
            <p className="mt-1 text-sm text-slate-500">
              Share individual products with your affiliate code attached.
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Read-only catalog
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {referralProducts.map((product) => (
            <div
              key={product.id}
              className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={320}
                    height={220}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">{product.name}</p>
                <p className="mt-1 text-sm text-slate-600">₹ {product.price.toLocaleString('en-IN')}</p>
                <p className="mt-2 text-xs font-semibold text-emerald-700">
                  Commission ₹ {product.commission.toLocaleString('en-IN')} ({Math.round(product.rate * 100)}%)
                </p>
                <p className="mt-3 text-xs text-slate-500 break-all">{product.link}</p>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleCopyProductLink(product.id)}
                  className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                >
                  Copy Link
                </button>
                <button
                  type="button"
                  onClick={() => handleShare(product.id, 'generic')}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                >
                  Share
                </button>
                <button
                  type="button"
                  onClick={() => handleShare(product.id, 'whatsapp')}
                  className="rounded-xl border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700"
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => handleShare(product.id, 'telegram')}
                  className="rounded-xl border border-sky-200 px-3 py-2 text-xs font-semibold text-sky-700"
                >
                  Telegram
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Campaign Links</h2>
            <p className="mt-1 text-sm text-slate-500">Create custom campaigns for tracking.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              value={campaignName}
              onChange={(event) => setCampaignName(event.target.value)}
              placeholder="Campaign name"
              className="w-48 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleCreateCampaign}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Create
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3">Clicks</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Earnings</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{campaign.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 break-all">{campaign.link}</td>
                  <td className="px-4 py-3">{campaign.clicks}</td>
                  <td className="px-4 py-3">{campaign.orders}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">₹ {campaign.earnings}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => addClick(campaign.id)}
                      className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
                    >
                      Add Click
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Clicks</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Last 10
          </span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Device</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {clicks.map((click) => (
                <tr key={click.id}>
                  <td className="px-4 py-3">{click.date}</td>
                  <td className="px-4 py-3">{click.source}</td>
                  <td className="px-4 py-3">{click.device}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        click.status === 'Converted'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {click.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}
