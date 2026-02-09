const metrics = [
  { label: 'Total Users', value: '12,450' },
  { label: 'Active Vendors', value: '182' },
  { label: 'Total Orders', value: '48,900' },
  { label: 'Total Revenue', value: '₹ 3.2 Cr' },
];

const alerts = [
  '5 vendors pending approval',
  '12 returns awaiting review',
  'Payout batch pending',
];

export default function AdminDashboardPage() {
  return (
    <section className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Admin Overview
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Monitor global performance and platform health.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {metric.label}
            </p>
            <p className="mt-4 text-2xl font-semibold text-slate-100">{metric.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">System Alerts</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Priority
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
            >
              <p className="text-sm text-slate-200">{alert}</p>
              <span className="rounded-full border border-amber-400/60 px-3 py-1 text-xs font-semibold text-amber-300">
                Action needed
              </span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
