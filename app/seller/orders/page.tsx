'use client';

import Link from 'next/link';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getSellerOrdersServerSnapshot,
  getSellerOrdersSnapshot,
  subscribeToSellerOrders,
  type SellerOrder,
  type SellerOrderStatus,
} from '@/lib/sellerOrders';

const tabs: Array<'All' | SellerOrderStatus> = [
  'All',
  'New',
  'Packed',
  'Shipped',
  'Delivered',
  'Returned',
];

const statusStyles: Record<SellerOrderStatus, string> = {
  New: 'bg-amber-100 text-amber-700',
  Packed: 'bg-indigo-100 text-indigo-700',
  Shipped: 'bg-sky-100 text-sky-700',
  Delivered: 'bg-green-100 text-green-700',
  Returned: 'bg-rose-100 text-rose-700',
};

const paymentStyles: Record<SellerOrder['paymentStatus'], string> = {
  Paid: 'bg-green-100 text-green-700',
  COD: 'bg-slate-200 text-slate-600',
};

export default function SellerOrdersPage() {
  const orders = useSyncExternalStore(
    subscribeToSellerOrders,
    getSellerOrdersSnapshot,
    getSellerOrdersServerSnapshot
  );
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesTab = activeTab === 'All' || order.status === activeTab;
      const matchesSearch = !normalized || order.id.toLowerCase().includes(normalized);
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchTerm]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Track fulfillment progress and buyer details.</p>
        </div>
        <div className="min-w-[240px]">
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Search order ID
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="ORD-30241"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredOrders.map((order) => {
              const isNew = order.status === 'New';
              const primaryItem = order.items[0];
              return (
                <tr key={order.id} className={isNew ? 'bg-amber-50/60' : 'hover:bg-slate-50'}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{order.id}</td>
                  <td className="px-4 py-3">{order.date}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{primaryItem?.name}</td>
                  <td className="px-4 py-3">{primaryItem?.quantity}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">₹ {order.amount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        paymentStyles[order.paymentStatus]
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                      {order.hasReturn && (
                        <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                          Return Requested
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/seller/orders/${order.id}`}
                        className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
                      >
                        View
                      </Link>
                      {order.hasReturn && (
                        <Link
                          href="/seller/returns"
                          className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600"
                        >
                          Returns
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
