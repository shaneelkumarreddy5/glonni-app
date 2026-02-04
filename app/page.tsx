import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Welcome to Glonni 🚀</h1>
        <nav className="flex flex-col gap-2">
          <Link href="/" className="text-gray-900 hover:text-gray-600">
            Home
          </Link>
          <Link href="/" className="text-gray-900 hover:text-gray-600">
            User Dashboard
          </Link>
          <Link href="/admin" className="text-gray-900 hover:text-gray-600">
            Admin Dashboard
          </Link>
          <Link href="/seller" className="text-gray-900 hover:text-gray-600">
            Seller Dashboard
          </Link>
          <Link href="/affiliate" className="text-gray-900 hover:text-gray-600">
            Affiliate Dashboard
          </Link>
          <Link href="/auth/login" className="text-gray-900 hover:text-gray-600">
            Login
          </Link>
          <Link href="/auth/register" className="text-gray-900 hover:text-gray-600">
            Register
          </Link>
        </nav>
      </div>
    </main>
  );
}