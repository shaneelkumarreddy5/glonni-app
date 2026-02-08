import Link from 'next/link';

export default function SellerDashboardPage() {
  const metrics = [
    {
      label: 'Total Orders',
      value: '128',
      helper: 'Last 30 days',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 7l2 10h12l2-10M9 7V5a3 3 0 013-3h0a3 3 0 013 3v2" />
        </svg>
      ),
    },
    {
      label: 'Active Products',
      value: '24',
      helper: 'In stock',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v10l-8 4-8-4V7l8-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l8-4M12 12L4 8" />
        </svg>
      ),
    },
    {
      label: 'Total Revenue',
      value: '₹ 3,45,200',
      helper: 'After refunds',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
        </svg>
      ),
    },
    {
      label: 'Pending Returns',
      value: '3',
      helper: 'Need review',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 0115.3-6.3M21 12a9 9 0 01-15.3 6.3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4v6h6" />
        </svg>
      ),
    },
  ];

  const recentOrders = [
    {
      id: 'GLN-21084',
      product: 'Aether Linen Shirt',
      quantity: 2,
      amount: '₹ 3,480',
      status: 'Paid',
    },
    {
      id: 'GLN-21083',
      product: 'Flux Leather Wallet',
      quantity: 1,
      amount: '₹ 1,250',
      status: 'Shipped',
    },
    {
      id: 'GLN-21082',
      product: 'Nova Running Shoes',
      quantity: 1,
      amount: '₹ 5,999',
      status: 'Delivered',
    },
    {
      id: 'GLN-21081',
      product: 'Luna Travel Tote',
      quantity: 1,
      amount: '₹ 2,600',
      status: 'Paid',
    },
    {
      id: 'GLN-21080',
      product: 'Aura Ceramic Mug',
      quantity: 4,
      amount: '₹ 1,560',
      status: 'Shipped',
    },
    {
      id: 'GLN-21079',
      product: 'Atlas Duffel Bag',
      quantity: 1,
      amount: '₹ 3,200',
      status: 'Delivered',
    },
  ];

  const statusStyles: Record<string, string> = {
    Paid: 'bg-amber-100 text-amber-700',
    Shipped: 'bg-sky-100 text-sky-700',
    Delivered: 'bg-green-100 text-green-700',
  };

  const lowStockItems = [
    { name: 'Sage Cotton Tee', stock: 6 },
    { name: 'Nimbus Desk Lamp', stock: 4 },
    { name: 'Ridge Trail Backpack', stock: 2 },
  ];

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        Seller Dashboard Loaded
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Vendor Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Here is your business overview for the last 30 days.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {card.label}
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                {card.icon}
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.helper}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2.2fr,1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Updated today
            </span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{order.id}</td>
                    <td className="px-4 py-3">{order.product}</td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{order.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href="/seller/orders"
                        className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Low Stock Products</h2>
          <p className="mt-1 text-sm text-slate-500">Reorder to avoid missing sales.</p>
          <div className="mt-5 space-y-4">
            {lowStockItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">Stock: {item.stock} units</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Low Stock
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
