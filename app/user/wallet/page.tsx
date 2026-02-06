import Link from 'next/link';

const transactions = [
  { date: '12 Jan 2026', reference: 'ORD-101', amount: '+120', status: 'Credited' },
  { date: '18 Jan 2026', reference: 'ORD-102', amount: '+80', status: 'Pending' },
  { date: '20 Jan 2026', reference: 'Promo Bonus', amount: '+200', status: 'Credited' },
];

const statusStyles: Record<string, string> = {
  Credited: 'bg-green-100 text-green-800',
  Pending: 'bg-amber-100 text-amber-800',
  Reversed: 'bg-red-100 text-red-700',
};

export default function UserWalletPage() {
  return (
    <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-6">
          <Link href="/user" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Back to Account
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">Wallet & Cashback</h1>
          <p className="mt-1 text-sm text-gray-500">Track your balance and cashback activity.</p>
        </div>

        <section className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-200">Wallet Balance</p>
              <p className="mt-2 text-3xl font-semibold">₹540</p>
            </div>
            <div className="grid gap-3 text-sm text-slate-200">
              <div className="flex items-center justify-between gap-6">
                <span>Total Cashback Earned</span>
                <span className="font-semibold text-white">₹1,240</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span>Pending Cashback</span>
                <span className="font-semibold text-white">₹320</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            disabled
            className="mt-6 w-full rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white/70"
          >
            Use Cashback
          </button>
        </section>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Cashback History</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {transactions.map((txn) => (
                  <tr key={`${txn.reference}-${txn.date}`}>
                    <td className="px-4 py-3">{txn.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{txn.reference}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{txn.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyles[txn.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <h2 className="text-base font-semibold">Cashback Rules</h2>
          <ul className="mt-2 space-y-1 text-amber-800">
            <li>Cashback is credited after order delivery.</li>
            <li>Cashback can be used for future purchases.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
