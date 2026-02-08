'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useSyncExternalStore } from 'react';
import {
  getProductsServerSnapshot,
  getProductsSnapshot,
  subscribeToProducts,
  updateSellerProduct,
  type SellerProduct,
} from '@/lib/sellerProducts';

const statusStyles: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-slate-200 text-slate-600',
};

export default function SellerProductsPage() {
  const products = useSyncExternalStore(
    subscribeToProducts,
    getProductsSnapshot,
    getProductsServerSnapshot
  );

  const hasProducts = products.length > 0;

  const handleToggleStatus = (product: SellerProduct) => {
    updateSellerProduct(product.id, {
      status: product.status === 'Active' ? 'Inactive' : 'Active',
    });
  };

  const lowStockIds = useMemo(
    () => new Set(products.filter((item) => item.stock < 10).map((item) => item.id)),
    [products]
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your catalog and inventory status.
          </p>
        </div>
        <Link
          href="/seller/products/add"
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm"
        >
          Add Product
        </Link>
      </div>

      {!hasProducts && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-base font-semibold text-slate-900">No products yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Add your first product to start selling.
          </p>
          <Link
            href="/seller/products/add"
            className="mt-4 inline-flex rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Add Product
          </Link>
        </div>
      )}

      {hasProducts && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map((product) => {
                const isLowStock = lowStockIds.has(product.id);
                return (
                  <tr
                    key={product.id}
                    className={isLowStock ? 'bg-amber-50/60' : 'hover:bg-slate-50'}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500">SKU {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">{product.category}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900">₹ {product.price}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{product.stock}</span>
                        {isLowStock && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            Low Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[product.status]
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/seller/products/edit/${product.id}`}
                          className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(product)}
                          className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                        >
                          {product.status === 'Active' ? 'Disable' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
