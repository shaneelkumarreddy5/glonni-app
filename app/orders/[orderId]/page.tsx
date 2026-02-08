'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getOrdersServerSnapshot,
  getOrdersSnapshot,
  subscribeToOrders,
  updateStoredOrderReturn,
  type ReturnReason,
  type ReturnResolution,
} from '@/lib/orderStorage';

const steps = ['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'];
const returnReasons: ReturnReason[] = ['Damaged product', 'Wrong item', 'Not satisfied'];
const returnResolutions: ReturnResolution[] = ['Refund to Wallet', 'Replacement'];
const returnTimeline = ['Requested', 'Pickup Scheduled', 'Picked Up', 'Refunded'] as const;

const statusStepIndex: Record<string, number> = {
  'In Transit': 2,
  Delivered: 3,
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { orderId } = resolvedParams;
  const orders = useSyncExternalStore(subscribeToOrders, getOrdersSnapshot, getOrdersServerSnapshot);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<ReturnReason>('Damaged product');
  const [selectedResolution, setSelectedResolution] = useState<ReturnResolution>('Refund to Wallet');
  const order = useMemo(
    () => orders.find((item) => item.id === orderId) || null,
    [orders, orderId]
  );

  if (!order) {
    return (
      <main className="bg-gray-50">
        <div className="mx-auto w-full max-w-4xl px-4 py-10">
          <Link href="/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Back to Orders
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">Order not found</h1>
          <p className="mt-2 text-sm text-gray-500">We could not locate this order.</p>
        </div>
      </main>
    );
  }

  const activeStep = statusStepIndex[order.status] ?? 0;
  const returnStatusStep = order.returnRequest?.statusStep || 'Return Requested';
  const returnStepIndex = (() => {
    if (returnStatusStep === 'Pickup Scheduled') return 1;
    if (returnStatusStep === 'Item Picked Up') return 2;
    if (returnStatusStep === 'Refund Initiated') return 3;
    if (order.returnRequest?.refundStatus) return 3;
    return 0;
  })();

  const handleReturnSubmit = () => {
    updateStoredOrderReturn(order.id, {
      reason: selectedReason,
      resolution: selectedResolution,
      statusStep: 'Return Requested',
      refundStatus: selectedResolution === 'Refund to Wallet' ? 'Initiated' : undefined,
    });
    setShowReturnModal(false);
  };

  return (
    <>
      <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="mb-6">
          <Link href="/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Back to Orders
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">Order Details</h1>
          <p className="mt-1 text-sm text-gray-500">Order ID: {order.id}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Order Status</h2>
            <div className="mt-5 space-y-3">
              {steps.map((step, index) => {
                const isActive = index <= activeStep;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
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

            <div className="mt-6 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="mt-1 text-xs text-gray-500">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Delivery Address</h2>
              <p className="mt-3 text-sm text-gray-600">{order.address}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Seller</span>
                  <span className="font-medium text-gray-900">{order.seller}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Item total</span>
                  <span className="font-medium text-gray-900">₹{order.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cashback earned</span>
                  <span className="font-semibold text-green-700">₹{order.cashbackTotal}</span>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-2">
                  <span>Total paid</span>
                  <span className="font-semibold text-gray-900">₹{order.total}</span>
                </div>
              </div>
            </div>

            {order.returnRequest ? (
              <Link
                href="#return-status"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:border-gray-300"
              >
                Track Return
              </Link>
            ) : (
              order.status === 'Delivered' && (
                <button
                  type="button"
                  onClick={() => setShowReturnModal(true)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
                >
                  Return / Replace
                </button>
              )
            )}

            {order.returnRequest && (
              <div
                id="return-status"
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-base font-semibold text-gray-900">Return Status</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Reason: {order.returnRequest.reason}
                </p>
                <div className="mt-4 space-y-3">
                  {returnTimeline.map((step, index) => {
                    const isActive = index <= returnStepIndex;
                    return (
                      <div key={step} className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
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
                <div className="mt-4 border-t border-dashed border-gray-200 pt-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Refund method</span>
                    <span className="font-semibold text-gray-900">
                      {order.returnRequest.resolution === 'Refund to Wallet'
                        ? 'Wallet'
                        : 'Replacement'}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Refund amount</span>
                    <span className="font-semibold text-gray-900">₹{order.total}</span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
      </main>
    {showReturnModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Return Request</h3>
            <button
              type="button"
              onClick={() => setShowReturnModal(false)}
              className="text-sm font-medium text-gray-500"
            >
              Close
            </button>
          </div>
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
