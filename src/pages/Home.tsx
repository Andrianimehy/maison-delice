import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";

import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import { getProducts, type Product } from "../services/productService";

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
  const productsCarouselRef = useRef<HTMLDivElement>(null);

  function scrollProducts(direction: "prev" | "next") {
    productsCarouselRef.current?.scrollBy({
      left: direction === "next" ? productsCarouselRef.current.clientWidth * 0.82 : -productsCarouselRef.current.clientWidth * 0.82,
      behavior: "smooth",
    });
  }

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
    <main className="overflow-hidden bg-[#faf8f4]">
      <Header />

      {/* HERO */}
      <Hero />

      {/* NOS CRÉATIONS */}
      <section
        id="creations"
        className="px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Nos créations"
            title="Des recettes simples, faites avec soin."
            text="Du premier geste au dernier coup de four, chaque création est pensée pour retrouver le plaisir des choses bien faites."
          />

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
            <>
              {/* Mobile : carrousel horizontal tactile */}
              <div className="relative mt-14 md:hidden">
                <div
                  ref={productsCarouselRef}
                  className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  aria-label="Carrousel de nos créations"
                >
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="w-[82vw] max-w-[340px] shrink-0 snap-center"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {products.length > 1 && (
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => scrollProducts("prev")}
                      aria-label="Produit précédent"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition active:scale-95"
                    >
                      ‹
                    </button>

                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                      Faites glisser
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollProducts("next")}
                      aria-label="Produit suivant"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition active:scale-95"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>

              {/* Tablette / desktop : grille conservée */}
              <div className="mt-14 hidden gap-x-6 gap-y-14 sm:grid-cols-2 md:grid lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </>
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
              text="Chez DORÉA, nous croyons que les meilleures choses demandent du temps. Nos pâtes reposent, nos viennoiseries sont façonnées avec précision et nos fournées sont préparées avec attention."
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
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85"
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
            eyebrow="Ils aiment DORÉA"
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
            DORÉA
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
            href="mailto:bonjour@dorea.example"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-medium text-stone-900 transition hover:bg-[#f4eadb]"
          >
            Nous contacter
            <ArrowRight size={17} />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-950 px-5 pb-8 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 DORÉA. Tous droits réservés.
          </p>

          <p>
            Boulangerie · Pâtisserie · Café
          </p>
        </div>
      </footer>
    </main>
  );
}