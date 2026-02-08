'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/lib/CartContext';

const heroSlides = [
  {
    title: 'Mega Cashback',
    subtitle: 'Earn up to ₹500 today',
    detail: 'Shop verified sellers and unlock rewards instantly.',
  },
  {
    title: 'Pay via UPI',
    subtitle: 'Get Extra Cashback',
    detail: 'Fast checkout with exclusive UPI benefits.',
  },
  {
    title: 'Top Deals',
    subtitle: 'From Verified Sellers',
    detail: 'Handpicked offers across every category.',
  },
];

const categories = [
  { label: 'Electronics', icon: 'EL' },
  { label: 'Fashion', icon: 'FA' },
  { label: 'Beauty', icon: 'BE' },
  { label: 'Home', icon: 'HO' },
  { label: 'Grocery', icon: 'GR' },
  { label: 'More', icon: 'MO' },
];

const sponsoredProducts = [
  {
    id: 'SP-101',
    name: 'Noise Cancelling Headphones',
    title: 'Noise Cancelling Headphones',
    priceValue: 4299,
    price: '₹4,299',
    cashbackValue: 200,
    cashback: '₹200 Cashback',
    image:
      'https://images.unsplash.com/photo-1518449086331-6f3e6b2c1f0b?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'SP-102',
    name: 'Smart Fitness Watch',
    title: 'Smart Fitness Watch',
    priceValue: 2899,
    price: '₹2,899',
    cashbackValue: 150,
    cashback: '₹150 Cashback',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'SP-103',
    name: 'Ergonomic Desk Chair',
    title: 'Ergonomic Desk Chair',
    priceValue: 6499,
    price: '₹6,499',
    cashbackValue: 240,
    cashback: '₹240 Cashback',
    image:
      'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'SP-104',
    name: 'Wireless Speaker',
    title: 'Wireless Speaker',
    priceValue: 1799,
    price: '₹1,799',
    cashbackValue: 120,
    cashback: '₹120 Cashback',
    image:
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=500&q=80',
  },
];

const forYouProducts = [
  {
    id: 'FY-201',
    name: '4K Action Camera',
    title: '4K Action Camera',
    mrp: '₹4,999',
    priceValue: 3499,
    price: '₹3,499',
    cashbackValue: 175,
    cashback: '5% Cashback',
    image:
      'https://images.unsplash.com/photo-1519183071298-a2962eadcdb2?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'FY-202',
    name: 'Premium Backpack',
    title: 'Premium Backpack',
    mrp: '₹2,999',
    priceValue: 2299,
    price: '₹2,299',
    cashbackValue: 138,
    cashback: '6% Cashback',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'FY-203',
    name: 'Smart Home Lamp',
    title: 'Smart Home Lamp',
    mrp: '₹1,599',
    priceValue: 1299,
    price: '₹1,299',
    cashbackValue: 52,
    cashback: '4% Cashback',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'FY-204',
    name: 'Bluetooth Earbuds',
    title: 'Bluetooth Earbuds',
    mrp: '₹1,999',
    priceValue: 1599,
    price: '₹1,599',
    cashbackValue: 80,
    cashback: '5% Cashback',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'FY-205',
    name: 'Compact Air Fryer',
    title: 'Compact Air Fryer',
    mrp: '₹3,299',
    priceValue: 2799,
    price: '₹2,799',
    cashbackValue: 196,
    cashback: '7% Cashback',
    image:
      'https://images.unsplash.com/photo-1545632274-8f2a81c66d83?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'FY-206',
    name: 'Leather Laptop Sleeve',
    title: 'Leather Laptop Sleeve',
    mrp: '₹1,299',
    priceValue: 999,
    price: '₹999',
    cashbackValue: 50,
    cashback: '5% Cashback',
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=500&q=80',
  },
];

const trustItems = [
  { label: '100% Secure Payments', icon: 'SP' },
  { label: 'Verified Sellers', icon: 'VS' },
  { label: 'Easy Returns', icon: 'ER' },
];

export default function Home() {
  const { addToCart, totalItems } = useCart();
  const [activeSlide, setActiveSlide] = useState(0);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const allProducts = useMemo(
    () => [...sponsoredProducts, ...forYouProducts],
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!lastAdded) return;
    const timer = setTimeout(() => setLastAdded(null), 2000);
    return () => clearTimeout(timer);
  }, [lastAdded]);

  const handleAddToCart = (productId: string) => {
    const product = allProducts.find((item) => item.id === productId);
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.priceValue,
      cashback: product.cashbackValue,
      image: product.image,
    });
    setLastAdded(productId);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4">
          <div className="text-lg font-semibold text-gray-900">Glonni</div>
          <div className="flex-1">
            <label className="relative block">
              <input
                type="search"
                placeholder="Search for products, brands"
                className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none"
              />
            </label>
          </div>
          <Link
            href="/cart"
            aria-label="My Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 6h15l-1.5 9h-12L6 6Z" />
              <path d="M6 6 4.5 3H2" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            {mounted && (
              <span className="absolute -right-1 -top-1 rounded-full bg-green-600 px-1.5 text-[10px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4">
        <section className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-green-700 via-green-600 to-green-500 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-green-100">Cashback Fest</p>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              {heroSlides[activeSlide].title}
            </h1>
            <p className="text-lg text-green-50">{heroSlides[activeSlide].subtitle}</p>
            <p className="text-sm text-green-100">{heroSlides[activeSlide].detail}</p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={`slide-${index}`}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
                className={`h-2 w-2 rounded-full transition ${
                  activeSlide === index ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.label}
                href="/plp"
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-4 text-center text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                  {category.icon}
                </span>
                {category.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Sponsored Products</h2>
            <Link href="/plp" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Explore more
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {sponsoredProducts.map((product) => (
              <div
                key={product.name}
                className="min-w-[220px] rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link href="/pdp">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={260}
                  height={180}
                  className="h-36 w-full rounded-xl object-cover"
                />
                <p className="mt-3 text-sm font-semibold text-gray-900">{product.name}</p>
                <p className="mt-1 text-sm text-gray-600">{product.price}</p>
                <span className="mt-3 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                  {product.cashback}
                </span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleAddToCart(product.id)}
                  className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
                >
                  {lastAdded === product.id ? 'Added to cart' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">For You</h2>
            <Link href="/plp" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              See all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {forYouProducts.map((product) => (
              <div
                key={product.name}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link href="/pdp">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={320}
                  height={220}
                  className="h-40 w-full rounded-xl object-cover"
                />
                <p className="mt-3 text-sm font-semibold text-gray-900">{product.name}</p>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <span className="text-gray-400 line-through">{product.mrp}</span>
                  <span className="font-semibold text-gray-900">{product.price}</span>
                </div>
                <span className="mt-3 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                  {product.cashback}
                </span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleAddToCart(product.id)}
                  className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
                >
                  {lastAdded === product.id ? 'Added to cart' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-gray-200 bg-white px-6 py-8 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-3">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                  {item.icon}
                </span>
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}