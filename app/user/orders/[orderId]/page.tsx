import Link from 'next/link';
import { mockOrders } from '../mockOrders';

const statusStyles: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-800',
  'In Transit': 'bg-amber-100 text-amber-800',
  Cancelled: 'bg-red-100 text-red-700',
};

const timelineSteps = ['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'];

const statusStepIndex: Record<string, number> = {
  Delivered: 3,
  'In Transit': 2,
  Cancelled: 1,
};

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const order = mockOrders.find((item) => item.id === params.orderId);

  if (!order) {
    return (
      <main className="bg-gray-50">
        <div className="mx-auto w-full max-w-4xl px-6 py-12">
          <Link href="/user/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Back to Orders
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">Order not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            We could not locate this order. Please check the order ID.
          </p>
        </div>
      </main>
    );
  }

  const currentStep = statusStepIndex[order.status] ?? 0;

  return (
    <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-6">
          <Link href="/user/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Back to Orders
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                statusStyles[order.status] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">Order ID: {order.id}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <img
                src={order.image}
                alt={order.name}
                className="h-28 w-28 rounded-xl object-cover"
                loading="lazy"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{order.name}</h2>
                <p className="mt-2 text-sm text-gray-600">Placed on {order.date}</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{order.price}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900">Order Timeline</h3>
              <div className="mt-4 space-y-3">
                {timelineSteps.map((step, index) => {
                  const isActive = index <= currentStep;
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                          isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step}
                        </p>
                        {step === 'Delivered' && order.status === 'Delivered' && (
                          <p className="text-xs text-gray-500">Package delivered safely.</p>
                        )}
                        {step === 'Out for Delivery' && order.status === 'In Transit' && (
                          <p className="text-xs text-gray-500">Rider is on the way.</p>
                        )}
                        {order.status === 'Cancelled' && step === 'Shipped' && (
                          <p className="text-xs text-gray-500">Order was cancelled before dispatch.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">Delivery Address</h3>
              <p className="mt-3 text-sm text-gray-600">{order.address}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">Payment Summary</h3>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Item price</span>
                  <span className="font-medium text-gray-900">{order.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cashback earned</span>
                  <span className="font-semibold text-green-700">{order.cashback}</span>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-2">
                  <span>Total paid</span>
                  <span className="font-semibold text-gray-900">{order.price}</span>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
                Cashback Earned: {order.cashback}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">Actions</h3>
              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:shadow-sm"
                >
                  Download Invoice
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:shadow-sm"
                >
                  Track Order
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:shadow-sm"
                >
                  Need Help
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
