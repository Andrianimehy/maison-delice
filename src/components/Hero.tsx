import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate h-[430px] overflow-hidden bg-[#2a160b] sm:h-[500px]">
      <img
        src="/hero-maison-delice.jpg"
        alt="Tartelette chocolat framboises — Maison Délice"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#241207]/80 via-[#2a1307]/42 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1420px] items-center px-5 sm:px-10 lg:px-[70px]">
        <div className="max-w-[650px] pt-1 text-white">
          <h1 className="font-serif text-[42px] font-medium leading-[0.92] tracking-[-0.025em] sm:text-[78px] lg:text-[104px]">
            Maison <span className="italic font-normal text-[#e6aa3e]">Délice</span>
          </h1>

          <div className="mt-4 flex items-center gap-2 pl-[72px] sm:mt-5 sm:gap-3 sm:pl-[122px]">
            <span className="h-px w-[72px] bg-[#e2a338] sm:w-[120px]" />
            <span className="text-[20px] leading-none text-[#f4d79d] sm:text-[25px]">♥</span>
            <span className="h-px w-[72px] bg-[#e2a338] sm:w-[120px]" />
          </div>

          <p className="mt-3 pl-1 font-serif text-[15px] italic leading-6 text-white/95 sm:mt-4 sm:text-[22px] sm:leading-8">
            Des saveurs qui créent des moments heureux
          </p>

          <a
            href="#creations"
            className="group mt-5 inline-flex items-center gap-3 rounded-full bg-[#cf830d] px-7 py-3.5 text-[14px] font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#e39a1f] sm:mt-6 sm:gap-4 sm:px-10 sm:py-[18px] sm:text-[17px]"
          >
            Découvrir nos produits
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1 sm:h-[23px] sm:w-[23px]" />
          </a>
        </div>
      </div>
    </section>
  );
}
