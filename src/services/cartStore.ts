import type { Product } from "./productService";

export type CartItem = {
  product: Product;
  quantity: number;
};

const STORAGE_KEY = "maison-delice-cart";
const listeners = new Set<() => void>();

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

let cartSnapshot: CartItem[] = readCart();

function writeCart(cart: CartItem[]) {
  cartSnapshot = cart;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  listeners.forEach((listener) => listener());
}

export function getCart(): CartItem[] {
  return cartSnapshot;
}

export function addToCart(product: Product) {
  const cart = cartSnapshot.map((item) => ({ ...item }));
  const existing = cart.find((item) => item.product.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }

  writeCart(cart);
}

export function updateCartQuantity(productId: number, quantity: number) {
  const cart = cartSnapshot.map((item) => ({ ...item }));

  if (quantity <= 0) {
    writeCart(cart.filter((item) => item.product.id !== productId));
    return;
  }

  const item = cart.find((item) => item.product.id === productId);
  if (item) item.quantity = quantity;

  writeCart(cart);
}

export function removeFromCart(productId: number) {
  writeCart(cartSnapshot.filter((item) => item.product.id !== productId));
}

export function clearCart() {
  writeCart([]);
}

export function subscribeToCart(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getCartCount(cart: CartItem[]) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(cart: CartItem[]) {
  return cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
}
