'use client';

const payouts = [
  { id: 'PAY-7801', date: '07 Feb 2026', amount: 6200, method: 'Bank', status: 'Pending' },
  { id: 'PAY-7798', date: '31 Jan 2026', amount: 4800, method: 'UPI', status: 'Processed' },
  { id: 'PAY-7792', date: '24 Jan 2026', amount: 3500, method: 'Bank', status: 'Processed' },
  { id: 'PAY-7784', date: '17 Jan 2026', amount: 2200, method: 'UPI', status: 'Failed' },
];

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Processed: 'bg-green-100 text-green-700',
  Failed: 'bg-rose-100 text-rose-700',
};

const formatCurrency = (value: number) => `₹ ${value.toLocaleString('en-IN')}`;

export default function AffiliatePayoutsPage() {
  const summaryCards = [
    { label: 'Available Balance', value: '₹ 12,250', helper: 'Ready to withdraw' },
    { label: 'Pending Amount', value: '₹ 6,200', helper: 'Awaiting approval' },
    { label: 'Total Paid Out', value: '₹ 0', helper: 'This month' },
    { label: 'Next Payout Date', value: '12 Feb 2026', helper: 'Weekly cycle' },
  ];

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Payouts</h1>
        <p className="mt-1 text-sm text-slate-500">
          Payouts are processed weekly after approval.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {card.label}
            </p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.helper}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Payout History</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Last 4
          </span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Payout ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {payouts.map((payout) => (
                <tr key={payout.id}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{payout.id}</td>
                  <td className="px-4 py-3">{payout.date}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">
                    {formatCurrency(payout.amount)}
                  </td>
                  <td className="px-4 py-3">{payout.method}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[payout.status]}`}>
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
