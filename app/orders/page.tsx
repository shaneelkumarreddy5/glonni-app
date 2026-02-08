'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getOrdersServerSnapshot,
  getOrdersSnapshot,
  subscribeToOrders,
  updateStoredOrderReturn,
  type ReturnReason,
  type ReturnResolution,
  type StoredOrder,
} from '@/lib/orderStorage';

const tabs = ['All', 'Active', 'Delivered', 'Returns'] as const;

type TabKey = (typeof tabs)[number];

const statusStyles: Record<StoredOrder['status'], string> = {
  Delivered: 'bg-green-100 text-green-800',
  'In Transit': 'bg-amber-100 text-amber-800',
};

const cashbackStyles: Record<'Tracked' | 'Pending' | 'Credited', string> = {
  Tracked: 'bg-sky-100 text-sky-700',
  Pending: 'bg-amber-100 text-amber-700',
  Credited: 'bg-green-100 text-green-700',
};

const returnStatusStyles: Record<'Requested' | 'Picked Up' | 'Refunded', string> = {
  Requested: 'bg-amber-100 text-amber-700',
  'Picked Up': 'bg-sky-100 text-sky-700',
  Refunded: 'bg-green-100 text-green-700',
};

const timelineSteps = ['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'];
const returnReasons: ReturnReason[] = ['Damaged product', 'Wrong item', 'Not satisfied'];
const returnResolutions: ReturnResolution[] = ['Refund to Wallet', 'Replacement'];

type StoredReturn = {
  orderId: string;
  status?: string;
  timeline?: string[];
  refundMethod?: string;
  refundAmount?: number;
  pickupDate?: string;
};

const returnsEvent = 'glonni_returns_update';
let cachedReturns: StoredReturn[] | null = null;

const getReturnsSnapshot = (): StoredReturn[] => {
  if (typeof window === 'undefined') return [];
  if (cachedReturns) return cachedReturns;
  try {
    const raw = window.localStorage.getItem('returns');
    const parsed = raw ? (JSON.parse(raw) as StoredReturn[]) : [];
    cachedReturns = Array.isArray(parsed) ? parsed : [];
    return cachedReturns;
  } catch {
    return [];
  }
};

const getReturnsServerSnapshot = () => [] as StoredReturn[];

const subscribeToReturns = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    cachedReturns = null;
    callback();
  };
  window.addEventListener('storage', handler);
  window.addEventListener(returnsEvent, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(returnsEvent, handler);
  };
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('All');
  const [activeReturnOrderId, setActiveReturnOrderId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<ReturnReason>('Damaged product');
  const [selectedResolution, setSelectedResolution] = useState<ReturnResolution>('Refund to Wallet');
  const orders = useSyncExternalStore(subscribeToOrders, getOrdersSnapshot, getOrdersServerSnapshot);
  const returns = useSyncExternalStore(
    subscribeToReturns,
    getReturnsSnapshot,
    getReturnsServerSnapshot
  );

  const filteredOrders = useMemo(() => {
    if (activeTab === 'Returns') {
      return [];
    }
    if (activeTab === 'Active') {
      return orders.filter((order) => order.status !== 'Delivered');
    }
    if (activeTab === 'Delivered') {
      return orders.filter((order) => order.status === 'Delivered');
    }
    return orders;
  }, [activeTab, orders]);

  const resolveReturnStatus = (entry: StoredReturn): 'Requested' | 'Picked Up' | 'Refunded' => {
    if (entry.status === 'Refunded') return 'Refunded';
    if (entry.status === 'Picked Up') return 'Picked Up';
    if (entry.status === 'Requested') return 'Requested';
    const timeline = entry.timeline ?? [];
    if (timeline.includes('Refunded') || timeline.includes('Refund Initiated')) return 'Refunded';
    if (timeline.includes('Item Picked Up') || timeline.includes('Picked Up')) return 'Picked Up';
    return 'Requested';
  };

  const activeReturnOrder = orders.find((order) => order.id === activeReturnOrderId) || null;

  const handleReturnSubmit = () => {
    if (!activeReturnOrderId) return;
    updateStoredOrderReturn(activeReturnOrderId, {
      reason: selectedReason,
      resolution: selectedResolution,
      statusStep: 'Return Requested',
      refundStatus: selectedResolution === 'Refund to Wallet' ? 'Initiated' : undefined,
    });
    setActiveReturnOrderId(null);
  };

  return (
    <>
      <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
            <p className="mt-1 text-sm text-gray-500">Track deliveries and cashback status.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5">
          {activeTab === 'Returns' && returns.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
              <p className="text-base font-semibold text-gray-900">No returns yet</p>
              <p className="mt-2 text-sm text-gray-500">
                Returned items will appear here once requested.
              </p>
            </div>
          )}
          {activeTab === 'Returns' && returns.length > 0 && (
            <div className="grid gap-5">
              {returns.map((entry) => {
                const order = orders.find((item) => item.id === entry.orderId) || null;
                const statusLabel = resolveReturnStatus(entry);
                return (
                  <Link
                    key={entry.orderId}
                    href={`/orders/${entry.orderId}`}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                      <Image
                        src={order?.items[0]?.image || '/'}
                        alt={order?.items[0]?.title || 'Returned item'}
                        width={96}
                        height={96}
                        className="h-24 w-24 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h2 className="text-base font-semibold text-gray-900">
                              {order?.items[0]?.title || 'Returned item'}
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">Order ID: {entry.orderId}</p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              returnStatusStyles[statusLabel]
                            }`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">
                            Refund: ₹{entry.refundAmount ?? order?.total ?? 0}
                          </span>
                          <span>Method: {entry.refundMethod || 'Wallet'}</span>
                          {entry.pickupDate && <span>Pickup: {entry.pickupDate}</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          {filteredOrders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
              <p className="text-base font-semibold text-gray-900">No orders yet</p>
              <p className="mt-2 text-sm text-gray-500">Place your first order to see it here.</p>
              <Link
                href="/"
                className="mt-4 inline-flex rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
              >
                Continue Shopping
              </Link>
            </div>
          )}
          {filteredOrders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                <Image
                  src={order.items[0]?.image || '/'}
                  alt={order.items[0]?.title || 'Order item'}
                  width={120}
                  height={120}
                  className="h-28 w-28 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">
                        {order.items[0]?.title || 'Order Item'}
                      </h2>
                      <p className="mt-1 text-xs text-gray-500">Order ID: {order.id}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                    <span className="font-semibold text-gray-900">₹{order.total}</span>
                    <span className="text-green-700">Cashback: ₹{order.cashbackTotal}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        cashbackStyles[order.status === 'Delivered' ? 'Credited' : 'Pending']
                      }`}
                    >
                      {order.status === 'Delivered' ? 'Credited' : 'Pending'}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {timelineSteps.map((step, index) => {
                      const isActive = order.status === 'Delivered' || index <= 2;
                      return (
                        <div key={`${order.id}-${step}`} className="flex items-center gap-2">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                              isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span className={`text-sm ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
                  <Link
                    href={`/orders/${order.id}`}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300"
                  >
                    View Details
                  </Link>
                  {order.status === 'Delivered' && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveReturnOrderId(order.id);
                        setSelectedReason('Damaged product');
                        setSelectedResolution('Refund to Wallet');
                      }}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300"
                    >
                      Return / Replace
                    </button>
                  )}
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      </main>
      {activeReturnOrder && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Return Request</h3>
            <button
              type="button"
              onClick={() => setActiveReturnOrderId(null)}
              className="text-sm font-medium text-gray-500"
            >
              Close
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Order ID: {activeReturnOrder.id}
          </p>
          <div className="mt-4 space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Reason
              <select
                value={selectedReason}
                onChange={(event) => setSelectedReason(event.target.value as ReturnReason)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
              >
                {returnReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Resolution
              <select
                value={selectedResolution}
                onChange={(event) => setSelectedResolution(event.target.value as ReturnResolution)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
              >
                {returnResolutions.map((resolution) => (
                  <option key={resolution} value={resolution}>
                    {resolution}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={handleReturnSubmit}
            className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Submit Request
          </button>
        </div>
      </div>
      )}
    </>
  );
}
