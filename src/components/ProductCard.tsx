import { ArrowUpRight, Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "../services/productService";
import { addToCart } from "../services/cartStore";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart(product);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1200);
  }

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[1.25rem] bg-stone-100 shadow-sm ring-1 ring-stone-200/70">
        <img
          src={
            product.image_url ??
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85"
          }
          alt={product.name}
          className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />

        <button
          type="button"
          aria-label={`Ajouter ${product.name} au panier`}
          onClick={handleAddToCart}
          className={`absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition hover:scale-105 ${
            added
              ? "bg-[#b87832] text-white"
              : "bg-white text-stone-900"
          }`}
        >
          {added ? (
            <Check size={18} strokeWidth={2} />
          ) : (
            <ShoppingBag size={18} strokeWidth={1.7} />
          )}
        </button>
      </div>

      <div className="flex items-start justify-between gap-4 px-1 pt-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a9682b]">
            Maison Délice
          </p>

          <h3 className="mt-2 text-xl font-medium text-stone-900">
            {product.name}
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-6 text-stone-500">
            {product.description ?? "Une création Maison Délice préparée avec soin."}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-stone-900">
            {product.price.toLocaleString("fr-FR")} Ar
          </p>

          <ArrowUpRight
            size={17}
            className="ml-auto mt-3 text-stone-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </article>
  );
}
