import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate h-[475px] overflow-hidden bg-[#2a160b] sm:h-[500px]">
      <img
        src="/hero-maison-delice.jpg"
        alt="Tartelette chocolat framboises — Maison Délice"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Darker left side exactly where the typography sits in the reference. */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#241207]/80 via-[#2a1307]/42 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1420px] items-center px-6 sm:px-10 lg:px-[70px]">
        <div className="max-w-[650px] pt-2 text-white">
          <h1 className="font-serif text-[62px] font-medium leading-[0.9] tracking-[-0.025em] sm:text-[78px] lg:text-[104px]">
            Maison <span className="italic font-normal text-[#e6aa3e]">Délice</span>
          </h1>

          <div className="mt-5 flex items-center gap-3 pl-[120px] sm:pl-[122px]">
            <span className="h-px w-[120px] bg-[#e2a338]" />
            <span className="text-[25px] leading-none text-[#f4d79d]">♥</span>
            <span className="h-px w-[120px] bg-[#e2a338]" />
          </div>

          <p className="mt-4 pl-1 font-serif text-[18px] italic leading-8 text-white/95 sm:text-[22px]">
            Des saveurs qui créent des moments heureux
          </p>

          <a
            href="#creations"
            className="group mt-6 inline-flex items-center gap-4 rounded-full bg-[#cf830d] px-10 py-[18px] text-[17px] font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#e39a1f]"
          >
            Découvrir nos produits
            <ArrowRight size={23} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
