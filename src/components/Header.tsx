import { useEffect, useState, useSyncExternalStore } from "react";
import { ChevronUp, Minus, Menu, Plus, Search, ShoppingCart, ShoppingBag, Trash2, X } from "lucide-react";
import {
  clearCart,
  getCart,
  getCartCount,
  getCartTotal,
  removeFromCart,
  subscribeToCart,
  updateCartQuantity,
  type CartItem,
} from "../services/cartStore";
import Checkout from "./Checkout";

const links = [
  { label: "Accueil", href: "#" },
  { label: "Nos Produits", href: "#creations" },
  { label: "À propos", href: "#histoire" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setShowScrollTop(position > 350);
      setScrolled(position > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const cart = useSyncExternalStore(subscribeToCart, getCart, getCart);

  const cartCount = getCartCount(cart);
  const cartTotal = getCartTotal(cart);

  function openCheckout() {
    if (cart.length === 0) return;
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  return (
    <>
    <header className={`sticky top-0 z-[1000] h-[100px] border-b border-stone-200 bg-white transition-all duration-300 ${scrolled ? "bg-white/90 opacity-90 shadow-md backdrop-blur-sm" : "opacity-100 shadow-none"}`}>
      <div className="mx-auto flex h-full max-w-[1420px] items-center px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <a
          href="#"
          aria-label="Maison Délice - Accueil"
          className="flex h-full shrink-0 items-center"
        >
          <img
            src="/logo-header-reference.png"
            alt="Maison Délice"
            className="h-[90px] w-[145px] object-contain sm:h-[94px] sm:w-[180px] object-contain"
          />
        </a>

        {/* Navigation */}
        <nav className="ml-auto hidden h-full items-center gap-[42px] md:flex">
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative flex h-full items-center whitespace-nowrap text-[14px] font-semibold tracking-[-0.01em] transition ${
                index === 0
                  ? "text-[#b96f08] after:absolute after:bottom-[25px] after:left-0 after:right-0 after:h-[2px] after:bg-[#c27a12]"
                  : "text-stone-800 hover:text-[#b96f08]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Search / cart / WhatsApp */}
        <div className="ml-auto flex items-center gap-2 sm:ml-10 sm:gap-[25px]">
          <button
            type="button"
            aria-label="Rechercher"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center text-stone-900 transition hover:text-[#b96f08]"
          >
            <Search size={27} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            aria-label="Panier"
            onClick={() => setCartOpen((value) => !value)}
            className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center text-stone-900 transition hover:text-[#b96f08]"
          >
            <ShoppingCart size={29} strokeWidth={1.7} />
            {cartCount > 0 && (
              <span className="absolute right-[-2px] top-[-3px] flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#b96b0b] px-1 text-[9px] font-bold leading-none text-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full p-1 text-stone-900 md:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          <a
            href="https://wa.me/261341458773?text=Bonjour%20Maison%20Délice%2C%20je%20souhaite%20avoir%20des%20informations."
            target="_blank"
            rel="noreferrer"
            aria-label="Contacter Maison Délice sur WhatsApp"
            title="WhatsApp"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#bd7408] text-white shadow-sm transition hover:bg-[#a96406] sm:h-[72px] sm:w-auto sm:min-w-[248px] sm:justify-start sm:gap-3 sm:px-5 sm:pr-6"
          >
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border-2 border-white sm:h-[40px] sm:w-[40px]">
              <svg viewBox="0 0 24 24" className="h-[25px] w-[25px]" fill="none" aria-hidden="true">
                <path
                  d="M20.5 3.5A10.4 10.4 0 0 0 13.1.5C7.4.1 2.3 4.6 1.4 10.2c-.4 2.4 0 4.8 1.1 6.9L1 23l6.1-1.6a10.6 10.6 0 0 0 5.1 1.3h.1c5.8 0 10.6-4.7 10.6-10.5 0-3.1-1.2-6.1-3.4-8.7Z"
                  fill="currentColor"
                />
                <path
                  d="M17.4 13.8c-.3-.2-1.7-.9-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.7-1.7.1-.2.1-.4 0-.6-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.3s.9 2.6 1 2.8c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.8 3 .7.5-.1 1.7-.7 1.9-1.4.3-.7.3-1.3.2-1.4-.2-.1-.4-.2-.7-.3Z"
                  fill="#fff"
                />
              </svg>
            </span>
            <span className="hidden leading-[1.05] sm:block">
              <span className="block text-[15px] font-semibold">Nous contacter</span>
              <span className="mt-[3px] block text-[14px] font-medium">+261 34 14 587 73</span>
            </span>
          </a>
</div>
      </div>

      {cartOpen && (
        <div className="absolute right-4 top-[76px] w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-white text-stone-900 shadow-2xl sm:right-8">
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
            <div>
              <h2 className="font-semibold">Votre panier</h2>
              <p className="mt-1 text-xs text-stone-500">
                {cartCount} article{cartCount > 1 ? "s" : ""}
              </p>
            </div>
            <button
              type="button"
              aria-label="Fermer le panier"
              onClick={() => setCartOpen(false)}
              className="rounded-full p-2 text-stone-500 hover:bg-stone-100"
            >
              <X size={18} />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <ShoppingBag className="mx-auto text-stone-300" size={32} />
              <p className="mt-4 text-sm text-stone-500">Votre panier est vide.</p>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="mt-5 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white"
              >
                Découvrir nos créations
              </button>
            </div>
          ) : (
            <>
              <div className="max-h-[50vh] overflow-y-auto p-5">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <CartRow key={item.product.id} item={item} />
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-100 bg-stone-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-500">Total</span>
                  <span className="text-lg font-semibold">
                    {cartTotal.toLocaleString("fr-FR")} Ar
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-4 w-full rounded-full bg-[#a9682b] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#8f5725]"
                  onClick={openCheckout}
                >
                  Passer la commande
                </button>

                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-3 flex w-full items-center justify-center gap-2 text-xs text-stone-500 hover:text-red-600"
                >
                  <Trash2 size={14} />
                  Vider le panier
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>

      {open && (
        <div className="fixed left-0 right-0 top-[100px] z-[1100] border-t border-stone-200 bg-white shadow-xl md:hidden">
          <nav className="mx-4 rounded-b-2xl bg-white p-4 text-stone-900">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-100 hover:text-[#b96f08]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}

      {checkoutOpen && (
        <Checkout
          items={cart}
          total={cartTotal}
          onClose={() => {
            setCheckoutOpen(false);
            setCartOpen(false);
          }}
          onSuccess={() => {
            setCartOpen(false);
          }}
        />
      )}

      {showScrollTop && (
        <button
          type="button"
          aria-label="Revenir en haut de la page"
          title="Revenir en haut"
          onClick={scrollToTop}
          className="fixed bottom-24 right-5 z-[9999] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#b97918] text-white shadow-2xl ring-2 ring-white/70 transition hover:-translate-y-1 hover:bg-[#8f5725] sm:bottom-28 sm:right-8"
        >
          <ChevronUp size={22} strokeWidth={2} />
        </button>
      )}
    </>
  );
}

function CartRow({ item }: { item: CartItem }) {
  const { product, quantity } = item;

  return (
    <div className="flex gap-3">
      <img
        src={
          product.image_url ??
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80"
        }
        alt={product.name}
        className="h-16 w-16 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-medium">{product.name}</h3>

          <button
            type="button"
            aria-label={`Supprimer ${product.name}`}
            onClick={() => removeFromCart(product.id)}
            className="shrink-0 text-stone-400 hover:text-red-600"
          >
            <X size={15} />
          </button>
        </div>

        <p className="mt-1 text-xs text-stone-500">
          {product.price.toLocaleString("fr-FR")} Ar
        </p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-stone-200 px-1 py-1">
            <button
              type="button"
              aria-label="Diminuer la quantité"
              onClick={() => updateCartQuantity(product.id, quantity - 1)}
              className="rounded-full p-1 hover:bg-stone-100"
            >
              <Minus size={13} />
            </button>

            <span className="w-5 text-center text-xs font-semibold">
              {quantity}
            </span>

            <button
              type="button"
              aria-label="Augmenter la quantité"
              onClick={() => updateCartQuantity(product.id, quantity + 1)}
              className="rounded-full p-1 hover:bg-stone-100"
            >
              <Plus size={13} />
            </button>
          </div>

          <span className="text-xs font-semibold">
            {(product.price * quantity).toLocaleString("fr-FR")} Ar
          </span>
        </div>
      </div>
    </div>
  );
}
