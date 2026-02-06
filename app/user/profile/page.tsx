import Link from 'next/link';

const addresses = [
  {
    id: 'address-1',
    label: 'Home',
    lines: ['Flat 302, Green Residency,', 'Madhapur, Hyderabad, Telangana – 500081'],
  },
  {
    id: 'address-2',
    label: 'Work',
    lines: ['12-4-56, Lake View Apartments,', 'Nellore, Andhra Pradesh – 524001'],
  },
];

export default function UserProfilePage() {
  return (
    <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-6">
          <Link href="/user" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Back to Account
          </Link>
        </div>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Shaneel Kumar"
                className="h-16 w-16 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Shaneel Kumar</h1>
                <p className="mt-1 text-sm text-gray-600">shaneel@example.com</p>
                <p className="text-sm text-gray-500">+91-XXXXXXXXXX</p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300"
            >
              Edit Profile
            </button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-gray-600">
                  Full Name
                  <input
                    type="text"
                    value="Shaneel Kumar"
                    disabled
                    className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  />
                </label>
                <label className="text-sm font-medium text-gray-600">
                  Email Address
                  <input
                    type="email"
                    value="shaneel@example.com"
                    disabled
                    className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  />
                </label>
                <label className="text-sm font-medium text-gray-600">
                  Phone Number
                  <input
                    type="text"
                    value="+91-XXXXXXXXXX"
                    disabled
                    className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Saved Addresses</h2>
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300"
                >
                  Add New Address
                </button>
              </div>
              <div className="mt-4 grid gap-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{address.label}</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-xs font-medium text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {address.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
              <div className="mt-4 space-y-4 text-sm text-gray-700">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-500">Get order and cashback updates.</p>
                  </div>
                  <button
                    type="button"
                    className="h-6 w-11 rounded-full bg-gray-900 p-1"
                  >
                    <span className="block h-4 w-4 rounded-full bg-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-xs text-gray-500">Receive delivery status via SMS.</p>
                  </div>
                  <button
                    type="button"
                    className="h-6 w-11 rounded-full bg-gray-200 p-1"
                  >
                    <span className="block h-4 w-4 rounded-full bg-white" />
                  </button>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700" htmlFor="language">
                    Language
                  </label>
                  <select
                    id="language"
                    className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Telugu</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  disabled
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:border-red-300"
                >
                  Logout
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
