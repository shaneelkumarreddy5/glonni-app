'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getProductsServerSnapshot,
  getProductsSnapshot,
  subscribeToProducts,
  updateSellerProduct,
  type SellerProductStatus,
} from '@/lib/sellerProducts';

const statusOptions: SellerProductStatus[] = ['Active', 'Inactive'];

export default function SellerEditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { productId } = resolvedParams;
  const router = useRouter();
  const products = useSyncExternalStore(
    subscribeToProducts,
    getProductsSnapshot,
    getProductsServerSnapshot
  );
  const product = useMemo(
    () => products.find((item) => item.id === productId) || null,
    [products, productId]
  );

  const [price, setPrice] = useState(product?.price ?? 0);
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [status, setStatus] = useState<SellerProductStatus>(product?.status ?? 'Active');
  const [showToast, setShowToast] = useState(false);

  React.useEffect(() => {
    if (!product) return;
    setPrice(product.price);
    setStock(product.stock);
    setStatus(product.status);
  }, [product]);

  if (!product) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Product not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          This product is missing or was removed.
        </p>
        <Link
          href="/seller/products"
          className="mt-4 inline-flex rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
        >
          Back to Products
        </Link>
      </section>
    );
  }

  const handleSave = () => {
    updateSellerProduct(product.id, {
      price,
      stock,
      status,
    });
    setShowToast(true);
    setTimeout(() => {
      router.push('/seller/products');
    }, 600);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Edit Product</h1>
          <p className="mt-1 text-sm text-slate-500">Update price, stock, or status.</p>
        </div>
        <Link
          href="/seller/products"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
        >
          Cancel
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Basic Info
            </h2>
            <div className="mt-4 grid gap-4">
              <label className="text-sm font-semibold text-slate-700">
                Product Name
                <input
                  value={product.name}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Category
                  <input
                    value={product.category}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Brand
                  <input
                    value={product.brand}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <label className="text-sm font-semibold text-slate-700">
                Description
                <textarea
                  value={product.description}
                  readOnly
                  className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Pricing & Inventory
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Selling Price
                <input
                  type="number"
                  value={price}
                  onChange={(event) => setPrice(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Stock Quantity
                <input
                  type="number"
                  value={stock}
                  onChange={(event) => setStock(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Status
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as SellerProductStatus)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">
                SKU
                <input
                  value={product.sku}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Preview
            </h2>
            <div className="mt-4 flex flex-col items-start gap-3">
              <Image
                src={product.image}
                alt={product.name}
                width={560}
                height={160}
                className="h-40 w-full rounded-xl object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                <p className="text-xs text-slate-500">Category: {product.category}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Actions
            </h2>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={handleSave}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              >
                Save Changes
              </button>
              <Link
                href="/seller/products"
                className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600"
              >
                Cancel
              </Link>
            </div>
          </section>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          Product updated successfully
        </div>
      )}
    </section>
  );
}
