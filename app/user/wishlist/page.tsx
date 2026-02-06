import Link from 'next/link';

const wishlistItems = [
  {
    name: 'Wireless Earbuds',
    price: '₹1,999',
    cashback: '5% Cashback',
    image:
      'https://images.unsplash.com/photo-1518449086331-6f3e6b2c1f0b?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Smart Fitness Watch',
    price: '₹2,999',
    cashback: '7% Cashback',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Bluetooth Speaker',
    price: '₹1,499',
    cashback: '6% Cashback',
    image:
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Ergonomic Desk Chair',
    price: '₹8,499',
    cashback: '10% Cashback',
    image:
      'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=500&q=80',
  },
];

export default function UserWishlistPage() {
  const hasItems = wishlistItems.length > 0;

  return (
    <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-6">
          <Link href="/user" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Back to Account
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">Wishlist</h1>
          <p className="mt-1 text-sm text-gray-500">Your saved items, ready when you are.</p>
        </div>

        {!hasItems ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <p className="text-base font-medium text-gray-900">Your wishlist is empty</p>
            <p className="mt-2 text-sm text-gray-500">Discover new favorites and save them here.</p>
            <button
              type="button"
              className="mt-4 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistItems.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-40 w-full rounded-xl object-cover"
                  loading="lazy"
                />
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.price}</p>
                  <span className="mt-3 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                    {item.cashback}
                  </span>
                </div>
                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300"
                  >
                    View Product
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300"
                  >
                    Move to Cart
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:border-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
