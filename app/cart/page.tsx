'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { useCart } from '@/lib/CartContext';

export default function CartPage() {
  const { items, increaseQty, decreaseQty, removeFromCart } = useCart();

  const summary = useMemo(() => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const itemTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = 350;
    const delivery = 0;
    const totalCashback = items.reduce((total, item) => total + item.cashback * item.quantity, 0);
    const payable = Math.max(itemTotal - discount + delivery, 0);

    return { totalItems, itemTotal, discount, delivery, totalCashback, payable };
  }, [items]);

  const isEmpty = items.length === 0;

  return (
    <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            aria-label="Back to Home"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 6 9 12l6 6" />
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">My Cart</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
          <section className="space-y-4">
            {isEmpty ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
                <p className="text-base font-semibold text-gray-900">Your cart is empty</p>
                <p className="mt-2 text-sm text-gray-500">Add products to see them here.</p>
                <Link
                  href="/"
                  className="mt-4 inline-flex rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={120}
                    height={120}
                    className="h-28 w-28 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                        <p className="mt-1 text-xs text-gray-500">Standard</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decreaseQty(item.id)}
                          className="h-8 w-8 rounded-full border border-gray-200 text-gray-700"
                        >
                          -
                        </button>
                        <span className="min-w-[24px] text-center text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQty(item.id)}
                          className="h-8 w-8 rounded-full border border-gray-200 text-gray-700"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">₹{item.price}</p>
                        <p className="mt-1 text-xs text-green-700">
                          ₹{item.cashback} cashback after delivery
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Subtotal: ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              ))
            )}
          </section>

          <aside className="space-y-4">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Price Summary</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Total items</span>
                  <span className="font-medium text-gray-900">{summary.totalItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Item total</span>
                  <span className="font-medium text-gray-900">₹{summary.itemTotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span className="font-medium text-gray-900">-₹{summary.discount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery charges</span>
                  <span className="font-medium text-gray-900">
                    {summary.delivery === 0 ? 'Free' : `₹${summary.delivery}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total cashback</span>
                  <span className="font-semibold text-green-700">₹{summary.totalCashback}</span>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3 text-base">
                  <span className="font-semibold text-gray-900">Final payable</span>
                  <span className="font-semibold text-gray-900">₹{summary.payable}</span>
                </div>
              </div>
              {isEmpty ? (
                <button
                  type="button"
                  disabled
                  className="mt-5 w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-gray-900 opacity-60"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <Link
                  href="/checkout"
                  className="mt-5 block w-full rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-300"
                >
                  Proceed to Checkout
                </Link>
              )}
            </div>

            <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-800">
              ₹{summary.totalCashback} cashback will be credited after delivery
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
