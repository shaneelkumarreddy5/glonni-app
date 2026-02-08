'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { addSellerProduct, generateSku } from '@/lib/sellerProducts';

type PreviewImage = {
  id: string;
  url: string;
  name: string;
};

const categories = ['Apparel', 'Footwear', 'Accessories', 'Home', 'Bags', 'Beauty'];

export default function SellerAddProductPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [mrp, setMrp] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [showToast, setShowToast] = useState(false);

  const sku = useMemo(() => (name ? generateSku(name) : 'AUTO-000'), [name]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const next = files.map((file) => ({
      id: `${file.name}-${file.size}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setImages(next);
  };

  const handleSave = () => {
    addSellerProduct({
      name: name || 'Untitled product',
      category,
      brand: brand || 'Glonni',
      description: description || 'No description added yet.',
      mrp: mrp || 0,
      price: price || mrp || 0,
      stock,
      status: 'Active',
      sku,
      image:
        images[0]?.url ||
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80',
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
          <h1 className="text-2xl font-semibold text-slate-900">Add Product</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create a new listing for your storefront.
          </p>
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
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Premium linen shirt"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Category
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Brand
                  <input
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    placeholder="Brand name"
                  />
                </label>
              </div>
              <label className="text-sm font-semibold text-slate-700">
                Description
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Short product description."
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
                MRP
                <input
                  type="number"
                  value={mrp}
                  onChange={(event) => setMrp(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
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
                SKU
                <input
                  value={sku}
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
              Media
            </h2>
            <div className="mt-4">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-sm font-semibold text-slate-700">Upload Images</span>
                <span className="text-xs">PNG, JPG up to 5MB</span>
              </label>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative h-20 w-full overflow-hidden rounded-xl border border-slate-200"
                    >
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
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
                Save Product
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
          Product saved successfully
        </div>
      )}
    </section>
  );
}
