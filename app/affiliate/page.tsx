export default function AffiliateDashboardPage() {
  const metrics = [
    {
      label: 'Total Clicks',
      value: '1,248',
      helper: 'Last 30 days',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h6m6 0h6M12 3v6m0 6v6" />
        </svg>
      ),
    },
    {
      label: 'Orders Generated',
      value: '42',
      helper: 'Attributed sales',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M6 7l1 10h10l1-10" />
        </svg>
      ),
    },
    {
      label: 'Total Earnings',
      value: '₹ 18,450',
      helper: 'Commission earned',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
        </svg>
      ),
    },
    {
      label: 'Pending Payout',
      value: '₹ 6,200',
      helper: 'Next cycle',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      ),
    },
  ];

  const activities = [
    { label: 'User clicked your link', time: '2 min ago', tone: 'bg-sky-100 text-sky-700' },
    { label: 'Order placed via referral', time: '1 hour ago', tone: 'bg-emerald-100 text-emerald-700' },
    { label: 'Commission approved', time: '3 hours ago', tone: 'bg-violet-100 text-violet-700' },
    { label: 'User clicked your link', time: 'Yesterday', tone: 'bg-sky-100 text-sky-700' },
    { label: 'Order placed via referral', time: 'Yesterday', tone: 'bg-emerald-100 text-emerald-700' },
    { label: 'Commission approved', time: '2 days ago', tone: 'bg-violet-100 text-violet-700' },
  ];

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        Affiliate Dashboard Loaded
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Affiliate Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track referral performance and earnings at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Live feed
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {activities.map((activity, index) => (
            <div
              key={`${activity.label}-${index}`}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{activity.label}</p>
                <p className="text-xs text-slate-500">{activity.time}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${activity.tone}`}>
                Update
              </span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
