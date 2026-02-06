import Link from 'next/link';
import { mockOrders } from './mockOrders';

const statusStyles: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-800',
  'In Transit': 'bg-amber-100 text-amber-800',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function UserOrdersPage() {
  return (
    <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/user" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Back to Account
            </Link>
            <h1 className="mt-2 text-2xl font-semibold text-gray-900">My Orders</h1>
            <p className="mt-1 text-sm text-gray-500">All your recent purchases in one place.</p>
          </div>
        </div>

        <div className="grid gap-4">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-center"
            >
              <img
                src={order.image}
                alt={order.name}
                className="h-24 w-24 rounded-xl object-cover"
                loading="lazy"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-base font-semibold text-gray-900">{order.name}</h2>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[order.status] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>Order ID: {order.id}</span>
                  <span>Placed: {order.date}</span>
                  <span className="font-medium text-gray-900">{order.price}</span>
                </div>
              </div>
              <Link
                href={`/user/orders/${order.id}`}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:shadow-sm"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
