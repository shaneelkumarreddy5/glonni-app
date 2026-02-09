'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { useParams } from 'next/navigation';
import {
  getAdminOrdersServerSnapshot,
  getAdminOrdersSnapshot,
  subscribeToAdminOrders,
  updateAdminOrder,
  type AdminOrderStatus,
} from '@/lib/adminOrders';

const orderStatusOptions: AdminOrderStatus[] = [
  'Placed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export default function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const orders = useSyncExternalStore(
    subscribeToAdminOrders,
    getAdminOrdersSnapshot,
    getAdminOrdersServerSnapshot
  );

  const order = useMemo(
    () => orders.find((entry) => entry.id === orderId),
    [orders, orderId]
  );

  const [pendingStatus, setPendingStatus] = useState<AdminOrderStatus | ''>('');
  const [internalNote, setInternalNote] = useState(order?.internalNote ?? '');
  const [toast, setToast] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<'status' | 'payment' | 'note' | null>(null);

  const effectiveStatus = pendingStatus || order?.orderStatus || 'Placed';
  const hasStatusChange = !!order && pendingStatus !== '' && pendingStatus !== order.orderStatus;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1400);
  };

  const applyStatusChange = () => {
    if (!order) return;
    updateAdminOrder(order.id, { orderStatus: effectiveStatus });
    setPendingStatus('');
    setConfirmAction(null);
    showToast('Order status updated');
  };

  const resolvePayment = () => {
    if (!order) return;
    updateAdminOrder(order.id, { paymentStatus: 'Paid' });
    setConfirmAction(null);
    showToast('Payment marked as resolved');
  };

  const saveNote = () => {
    if (!order) return;
    updateAdminOrder(order.id, { internalNote });
    setConfirmAction(null);
    showToast('Internal note saved');
  };

  if (!order) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-200">
        Order not found.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Order Detail
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">{order.id}</h1>
        <p className="mt-1 text-sm text-slate-400">Placed on {order.date}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Order Summary
          </h2>
          <div className="mt-4 space-y-2 text-sm text-slate-200">
            <p>Amount: ₹ {order.value.toLocaleString('en-IN')}</p>
            <p>Status: {order.orderStatus}</p>
            <p>Return: {order.returnStatus}</p>
            <p>Payment: {order.paymentStatus}</p>
          </div>
          <div className="mt-4">
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Override Status
            </label>
            <select
              value={effectiveStatus}
              onChange={(event) => setPendingStatus(event.target.value as AdminOrderStatus)}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            >
              {orderStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            User Details
          </h2>
          <div className="mt-4 space-y-2 text-sm text-slate-200">
            <p>Name: {order.userName}</p>
            <p>Email: {order.userEmail}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Vendor Details
          </h2>
          <div className="mt-4 space-y-2 text-sm text-slate-200">
            <p>Vendor: {order.vendorName}</p>
            <p>Vendor ID: {order.vendorId}</p>
          </div>
        </section>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Product Items
          </h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-100">{item.name}</p>
                  <p className="text-xs text-slate-500">Qty {item.qty}</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">
                  ₹ {(item.price * item.qty).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Payment Info
            </h2>
            <div className="mt-4 space-y-2 text-sm text-slate-200">
              <p>Method: {order.paymentMethod}</p>
              <p>Transaction: {order.transactionId}</p>
              <p>Status: {order.paymentStatus}</p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmAction('payment')}
              className="mt-4 w-full rounded-xl border border-amber-500/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200"
            >
              Mark Payment Resolved
            </button>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Cashback / Commission
            </h2>
            <div className="mt-4 space-y-2 text-sm text-slate-200">
              <p>Cashback: ₹ {order.cashback.toLocaleString('en-IN')}</p>
              <p>Commission: ₹ {order.commission.toLocaleString('en-IN')}</p>
            </div>
          </section>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Internal Admin Note
        </h2>
        <textarea
          value={internalNote}
          onChange={(event) => setInternalNote(event.target.value)}
          placeholder="Add an internal note..."
          rows={4}
          className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setConfirmAction('note')}
            className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900"
          >
            Save Note
          </button>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setConfirmAction('status')}
          disabled={!hasStatusChange}
          className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
            hasStatusChange
              ? 'bg-slate-100 text-slate-900'
              : 'cursor-not-allowed bg-slate-800 text-slate-500'
          }`}
        >
          Save Status
        </button>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <h3 className="text-lg font-semibold text-slate-100">Confirm Action</h3>
            <p className="mt-2 text-sm text-slate-300">
              {confirmAction === 'status'
                ? `Override order status to ${effectiveStatus}?`
                : confirmAction === 'payment'
                  ? 'Mark payment as resolved?'
                  : 'Save internal note?'}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmAction === 'status') {
                    applyStatusChange();
                    return;
                  }
                  if (confirmAction === 'payment') {
                    resolvePayment();
                    return;
                  }
                  saveNote();
                }}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}
