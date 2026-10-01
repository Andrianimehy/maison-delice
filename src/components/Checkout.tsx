import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { clearCart, type CartItem } from "../services/cartStore";
import { createOrder } from "../services/orderService";

type CheckoutProps = {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
};

export default function Checkout({
  items,
  total,
  onClose,
  onSuccess,
}: CheckoutProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Votre panier est vide.");
      return;
    }

    setSubmitting(true);

    try {
      const order = await createOrder({
        customer_name: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        items,
      });

      setOrderId(order.id);
      clearCart();
      setSuccess(true);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(
        "Impossible d'enregistrer la commande. Vérifiez votre connexion et les permissions Supabase."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-100 bg-white px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a9682b]">
              Maison Délice
            </p>
            <h2 className="mt-1 text-xl font-semibold text-stone-900">
              {success ? "Commande confirmée" : "Finaliser ma commande"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full p-2 text-stone-500 hover:bg-stone-100"
          >
            <X size={19} />
          </button>
        </div>

        {success ? (
          <div className="px-6 py-12 text-center">
            <CheckCircle2 className="mx-auto text-green-600" size={56} />
            <h3 className="mt-5 text-2xl font-semibold text-stone-900">
              Merci pour votre commande !
            </h3>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-stone-500">
              Votre commande a bien été enregistrée dans notre système.
            </p>

            {orderId !== null && (
              <p className="mt-5 rounded-xl bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700">
                Numéro de commande : #{orderId}
              </p>
            )}

            <button
              type="button"
              onClick={onClose}
              className="mt-7 rounded-full bg-stone-900 px-7 py-3.5 text-sm font-medium text-white hover:bg-stone-800"
            >
              Continuer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6 rounded-2xl bg-[#f7f1e9] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} article(s)
                </span>
                <span className="text-lg font-semibold text-stone-900">
                  {total.toLocaleString("fr-FR")} Ar
                </span>
              </div>

              <div className="mt-3 space-y-1">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between gap-4 text-xs text-stone-500"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>
                      {(item.product.price * item.quantity).toLocaleString(
                        "fr-FR"
                      )}{" "}
                      Ar
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Field
                label="Nom complet"
                value={customerName}
                onChange={setCustomerName}
                required
                placeholder="Votre nom"
              />

              <Field
                label="Téléphone"
                type="tel"
                value={phone}
                onChange={setPhone}
                required
                placeholder="03X XX XXX XX"
              />

              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="vous@example.com"
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Adresse / lieu de livraison
                </label>
                <textarea
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  rows={3}
                  placeholder="Adresse ou indications pour la livraison"
                  className="w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#a9682b] focus:ring-2 focus:ring-[#a9682b]/10"
                />
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#a9682b] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#8f5725] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Enregistrement...
                </>
              ) : (
                `Confirmer la commande — ${total.toLocaleString("fr-FR")} Ar`
              )}
            </button>

            <p className="mt-3 text-center text-[11px] leading-5 text-stone-400">
              La commande sera enregistrée dans notre système avec le statut
              « pending ».
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-stone-700">
        {label}
        {required && <span className="ml-1 text-[#a9682b]">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#a9682b] focus:ring-2 focus:ring-[#a9682b]/10"
      />
    </div>
  );
}
