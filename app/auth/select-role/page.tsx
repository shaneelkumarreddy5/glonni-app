import Link from "next/link";

export default function SelectRolePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Select Your Role</h1>
        <div className="mt-6 flex flex-col gap-2">
          <Link href="/" className="text-gray-900 hover:text-gray-600">
            User
          </Link>
          <Link href="/seller" className="text-gray-900 hover:text-gray-600">
            Seller
          </Link>
          <Link href="/affiliate" className="text-gray-900 hover:text-gray-600">
            Affiliate
          </Link>
        </div>
      </div>
    </main>
  );
}
