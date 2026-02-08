'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useCart } from '@/lib/CartContext';
import { addStoredOrder, createOrderId } from '@/lib/orderStorage';

type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'COD';
type DeliveryMethod = 'Standard' | 'Express';

const addresses = [
  {
    id: 'addr-1',
    label: 'Home',
    name: 'Shaneel Kumar',
    phone: '+91-XXXXXXXXXX',
    lines: ['Flat 302, Green Residency,', 'Madhapur, Hyderabad, Telangana – 500081'],
  },
  {
    id: 'addr-2',
    label: 'Work',
    name: 'Shaneel Kumar',
    phone: '+91-XXXXXXXXXX',
    lines: ['12-4-56, Lake View Apartments,', 'Nellore, Andhra Pradesh – 524001'],
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id ?? '');
  const [payment, setPayment] = useState<PaymentMethod>('UPI');
  const [delivery, setDelivery] = useState<DeliveryMethod>('Standard');
  const [showAddressModal, setShowAddressModal] = useState(false);

  const summary = useMemo(() => {
    const itemsTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = 350;
    const cashbackTotal = items.reduce((total, item) => total + item.cashback * item.quantity, 0);
    const payable = Math.max(itemsTotal - discount, 0);
    return { itemsTotal, discount, cashbackTotal, payable };
  }, [items]);

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? addresses[0];

  const handlePlaceOrder = () => {
    if (items.length === 0 || !selectedAddress) return;

    const orderId = createOrderId();
    const order = addStoredOrder({
      id: orderId,
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        cashback: item.cashback,
        image: item.image,
      })),
      total: summary.payable,
      cashbackTotal: summary.cashbackTotal,
      status: 'In Transit',
      createdAt: '08 Feb 2026',
      expectedDelivery: '14 Feb 2026',
      address: `${selectedAddress.lines.join(' ')}`,
      seller: 'Glonni Verified Seller',
    });

    clearCart();
    router.push(`/order-success?orderId=${order.id}`);
  };

  return (
    <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <Link href="/cart" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Back to Cart
            </Link>
            <h1 className="mt-2 text-2xl font-semibold text-gray-900">Checkout</h1>
            <p className="mt-1 text-sm text-gray-500">Complete your purchase securely.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Delivery Address</h2>
                  <p className="mt-1 text-sm text-gray-500">Choose where you want your order delivered.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(true)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(true)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700"
                  >
                    Add New Address
                  </button>
                </div>
              </div>
              {selectedAddress && (
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{selectedAddress.label}</p>
                    <span className="text-xs text-gray-500">Selected</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900">{selectedAddress.name}</p>
                  <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    {selectedAddress.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Delivery Method</h2>
              <div className="mt-4 grid gap-3 text-sm">
                <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">Standard Delivery (FREE)</p>
                    <p className="mt-1 text-xs text-gray-500">Estimated delivery: 14 Feb 2026</p>
                  </div>
                  <input
                    type="radio"
                    name="delivery"
                    value="Standard"
                    checked={delivery === 'Standard'}
                    onChange={() => setDelivery('Standard')}
                    className="h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">Express Delivery (₹99)</p>
                    <p className="mt-1 text-xs text-gray-500">Estimated delivery: 12 Feb 2026</p>
                  </div>
                  <input
                    type="radio"
                    name="delivery"
                    value="Express"
                    checked={delivery === 'Express'}
                    onChange={() => setDelivery('Express')}
                    className="h-4 w-4"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Payment Method</h2>
              <div className="mt-4 grid gap-3 text-sm">
                {([
                  { key: 'UPI', label: 'UPI (Recommended)' },
                  { key: 'Card', label: 'Credit / Debit Card' },
                  { key: 'NetBanking', label: 'Net Banking' },
                  { key: 'COD', label: 'Cash on Delivery' },
                ] as const).map((option) => (
                  <label
                    key={option.key}
                    className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
                  >
                    <span className="text-gray-700">{option.label}</span>
                    <input
                      type="radio"
                      name="payment"
                      value={option.key}
                      checked={payment === option.key}
                      onChange={() => setPayment(option.key)}
                      className="h-4 w-4"
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Order Items</h2>
              <div className="mt-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={72}
                      height={72}
                      className="h-18 w-18 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="mt-1 text-xs text-gray-500">Qty {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">₹{item.price * item.quantity}</div>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-sm text-gray-500">Your cart is empty.</p>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Price Summary</h2>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-sm text-gray-500">Your cart is empty.</p>
                )}
              </div>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Items total</span>
                  <span className="font-medium text-gray-900">₹{summary.itemsTotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span className="font-medium text-gray-900">-₹{summary.discount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cashback</span>
                  <span className="font-semibold text-green-700">₹{summary.cashbackTotal}</span>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3 text-base">
                  <span className="font-semibold text-gray-900">Total payable</span>
                  <span className="font-semibold text-gray-900">₹{summary.payable}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={items.length === 0}
                className="mt-5 w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Place Order
              </button>
            </div>
            <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-800">
              ₹{summary.cashbackTotal} cashback will be credited after delivery
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">Total Payable</p>
            <p className="text-base font-semibold text-gray-900">₹{summary.payable}</p>
          </div>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={items.length === 0}
            className="rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Place Order
          </button>
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Address</h3>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="text-sm font-medium text-gray-500"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {addresses.map((address) => (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => {
                    setSelectedAddressId(address.id);
                    setShowAddressModal(false);
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                    selectedAddressId === address.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">{address.label}</p>
                  <p className="mt-1 text-xs text-gray-500">{address.lines.join(' ')}</p>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Add New Address
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
