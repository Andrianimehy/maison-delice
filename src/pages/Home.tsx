import { useEffect, useState } from "react";
import {
  ArrowRight,
  Clock3,
  MapPin,
  Sparkles,
  Phone,
  CupSoda,
  Leaf,
  Truck,
  Heart,
} from "lucide-react";

import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import { getProducts, type Product } from "../services/productService";

const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M14 8h3V4.5c-.5-.1-1.7-.2-3.1-.2-3.1 0-5.2 1.9-5.2 5.3V12H5.3v4h3.4v8h4.2v-8h3.5l.6-4h-4.1V10c0-1.2.3-2 1.1-2Z"/>
  </svg>
);

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const WhatsAppIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M20.5 3.5A10.4 10.4 0 0 0 13.1.5C7.4.1 2.3 4.6 1.4 10.2c-.4 2.4 0 4.8 1.1 6.9L1 23l6.1-1.6a10.6 10.6 0 0 0 5.1 1.3h.1c5.8 0 10.6-4.7 10.6-10.5 0-3.1-1.2-6.1-3.4-8.7Z"
      fill="currentColor"
    />
    <path
      d="M17.4 13.8c-.3-.2-1.7-.9-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.7-1.7.1-.2.1-.4 0-.6-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.3s.9 2.6 1 2.8c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.8 3 .7.5-.1 1.7-.7 1.9-1.4.3-.7.3-1.3.2-1.4-.2-.1-.4-.2-.7-.3Z"
      fill="#fff"
    />
  </svg>
);

const linksForFooter = [
  ["Accueil", "#"],
  ["À propos", "#histoire"],
  ["Nos Produits", "#creations"],
  ["Contact", "#contact"],
] as const;

const testimonials = [
  {
    quote:
      "Une vraie parenthèse gourmande. Les viennoiseries sont incroyablement fraîches.",
    author: "Élodie M.",
  },
  {
    quote:
      "J'adore l'ambiance et surtout le pain de campagne. Simple, généreux et délicieux.",
    author: "Thomas R.",
  },
  {
    quote:
      "La tarte aux fruits est devenue notre petit rituel du week-end.",
    author: "Claire D.",
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const data = await getProducts();

        setProducts(data);
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);

        setError(
          "Impossible de charger nos créations pour le moment."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="overflow-x-clip bg-[#faf8f4]">
      <Header />

      {/* HERO */}
      <Hero />

      {/* SERVICES */}
      <section className="border-b border-stone-200 bg-[#faf8f1]">
        <div className="mx-auto grid max-w-[1420px] grid-cols-1 divide-y divide-stone-200 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
          {[
            [CupSoda, "Produits artisanaux", "Préparés avec passion"],
            [Leaf, "Ingrédients de qualité", "Sélectionnés avec soin"],
            [Truck, "Livraison rapide", "À Antananarivo et environs"],
            [Heart, "Satisfaction garantie", "La qualité avant tout"],
          ].map(([Icon, title, text]) => {
            const ServiceIcon = Icon as typeof CupSoda;
            return (
              <div key={title as string} className="flex min-h-[122px] items-center gap-5 px-8 py-6 lg:px-12">
                <span className="flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-full border-2 border-[#d4890d] text-[#d4890d]">
                  <ServiceIcon size={34} strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold text-[#162033]">{title as string}</h3>
                  <p className="mt-2 text-[14px] text-slate-500">{text as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* NOS CRÉATIONS */}
      <section
        id="creations"
        className="bg-[#faf8f1] px-5 py-12 sm:px-8 lg:px-10 lg:py-14"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#b97918]">
              Nos produits
            </p>
            <div className="mx-auto mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-[#c98a25]" />
              <span className="text-[#c98a25]">✦</span>
              <span className="h-px w-12 bg-[#c98a25]" />
            </div>
            <h2 className="mt-3 font-serif text-4xl font-medium text-[#121a27] sm:text-5xl">
              Nos Délicieuses Pâtisseries
            </h2>
            <p className="mt-2 text-base leading-7 text-slate-500">
              Des créations gourmandes pour tous les moments
            </p>
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {["Tous", "Gâteaux", "Tartes", "Viennoiseries", "Biscuits", "Desserts"].map((label, index) => (
              <span
                key={label}
                className={`rounded-full px-6 py-3 text-sm font-medium ${
                  index === 0
                    ? "bg-[#c78317] text-white shadow-sm"
                    : "border border-stone-200 bg-white text-stone-600"
                }`}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Chargement */}
          {loading && (
            <div className="mt-14 flex min-h-40 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-[#a9682b]" />

                <p className="mt-4 text-sm text-stone-500">
                  Chargement de nos créations...
                </p>
              </div>
            </div>
          )}

          {/* Erreur */}
          {!loading && error && (
            <div className="mt-14 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

              <p className="mt-2 text-xs text-red-500">
                Vérifiez votre connexion Supabase et les policies RLS.
              </p>
            </div>
          )}

          {/* Aucun produit */}
          {!loading && !error && products.length === 0 && (
            <div className="mt-14 rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center">
              <p className="text-sm text-stone-500">
                Aucun produit disponible pour le moment.
              </p>
            </div>
          )}

          {/* Produits */}
          {!loading && !error && products.length > 0 && (
            <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NOTRE HISTOIRE */}
      <section
        id="histoire"
        className="bg-[#211a15] px-5 py-24 text-white sm:px-8 lg:px-10 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Notre savoir-faire"
              title="Le goût du temps, le geste de l'artisan."
              text="Chez Maison Délice, nous croyons que les meilleures choses demandent du temps. Nos pâtes reposent, nos viennoiseries sont façonnées avec précision et nos fournées sont préparées avec attention."
              light
            />

            <a
              href="#contact"
              className="mt-9 inline-flex items-center gap-3 text-sm font-medium text-white transition hover:text-[#d7a267]"
            >
              Découvrir notre histoire
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=88"
              alt="Sélection de pains artisanaux"
              className="aspect-[4/5] w-full rounded-[2rem] object-cover"
              loading="lazy"
            />

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-[#d7a267] p-5 text-stone-950 shadow-xl sm:block">
              <Sparkles size={20} />

              <p className="mt-3 text-sm font-semibold">
                Fait maison
              </p>

              <p className="mt-1 text-xs text-stone-800/70">
                Chaque jour
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AVIS */}
      <section className="px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Ils aiment Maison Délice"
            title="Quelques mots de nos clients."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote
                key={item.author}
                className="rounded-[1.5rem] border border-stone-200 bg-white p-7"
              >
                <div className="text-[#b87832]">
                  ★★★★★
                </div>

                <p className="mt-6 text-lg leading-8 text-stone-700">
                  “{item.quote}”
                </p>

                <footer className="mt-6 text-sm font-medium text-stone-500">
                  {item.author}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* INFORMATIONS */}
      <section className="bg-[#eee5d8] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div className="flex gap-4">
            <Clock3 className="mt-1 shrink-0 text-[#a9682b]" />

            <div>
              <h3 className="font-medium text-stone-900">
                Ouvert chaque jour
              </h3>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Du lundi au samedi
                <br />
                7h00 — 19h00
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <MapPin className="mt-1 shrink-0 text-[#a9682b]" />

            <div>
              <h3 className="font-medium text-stone-900">
                Venez nous voir
              </h3>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                12 rue des Gourmands
                <br />
                Antananarivo
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Sparkles className="mt-1 shrink-0 text-[#a9682b]" />

            <div>
              <h3 className="font-medium text-stone-900">
                Commandes
              </h3>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Préparez votre commande
                <br />
                à l'avance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="relative overflow-hidden bg-stone-950 px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d7a267]">
            Maison Délice
          </p>

          <h2 className="mt-5 text-4xl font-light leading-tight text-white sm:text-6xl">
            Un café, une pâtisserie,
            <br />
            <span className="font-serif italic">
              un moment pour vous.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/65">
            Passez nous voir ou préparez votre prochaine commande
            en quelques clics.
          </p>

          <a
            href="https://wa.me/261341458773?text=Bonjour%20Maison%20Délice%2C%20je%20souhaite%20passer%20une%20commande."
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#1ebe5d]"
          >
            <WhatsAppIcon size={20} />
            Nous contacter sur WhatsApp
          </a>
        </div>
      </section>

      {/* WHATSAPP */}
      <a
        href="https://wa.me/261341458773?text=Bonjour%20Maison%20Délice%2C%20je%20souhaite%20avoir%20des%20informations."
        target="_blank"
        rel="noreferrer"
        aria-label="Discuter avec Maison Délice sur WhatsApp"
        title="Discuter sur WhatsApp"
        className="fixed bottom-6 right-5 z-[9998] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl ring-2 ring-white/80 transition hover:scale-105 hover:bg-[#1ebe5d] sm:bottom-8 sm:right-8"
      >
        <WhatsAppIcon size={28} />
      </a>

      {/* FOOTER */}
      <footer className="bg-[#271608] px-5 pb-6 pt-5 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1320px] gap-8 md:grid-cols-[1.15fr_1.1fr_1fr_1.2fr]">
          <div className="flex items-center">
            <img
              src="/logo-footer-reference.png"
              alt="Maison Délice"
              className="h-[112px] w-[180px] object-contain object-center"
            />
          </div>

          <div className="border-l border-white/15 pl-8">
            <h3 className="text-[16px] font-semibold text-[#e7b252]">
              Liens rapides
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-x-10 gap-y-2 text-[14px] text-white/90">
              {linksForFooter.map(([label, href]) => (
                <a key={label} href={href} className="transition hover:text-[#e7b252]">
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="border-l border-white/15 pl-8">
            <h3 className="text-[16px] font-semibold text-[#e7b252]">
              Nous suivre
            </h3>
            <div className="mt-4 flex gap-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877f2] text-white transition hover:scale-105"
              >
                <FacebookIcon size={20} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white transition hover:scale-105"
              >
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>

          <div className="border-l border-white/15 pl-8">
            <h3 className="text-[16px] font-semibold text-[#e7b252]">
              Nous contacter
            </h3>
            <a
              href="https://wa.me/261341458773"
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-3 text-[14px] text-white/90 hover:text-[#e7b252]"
            >
              <WhatsAppIcon size={21} />
              +261 34 14 587 73
            </a>
            <a
              href="mailto:contact@maisondelice.mg"
              className="mt-3 flex items-center gap-3 text-[14px] text-white/90 hover:text-[#e7b252]"
            >
              <span className="text-lg">✉</span>
              contact@maisondelice.mg
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}