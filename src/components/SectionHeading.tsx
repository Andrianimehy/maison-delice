type Props = {
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
};

export default function SectionHeading({ eyebrow, title, text, light = false }: Props) {
  return (
    <div className="max-w-2xl">
      <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${light ? "text-[#d7a267]" : "text-[#a9682b]"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-4 text-4xl font-light leading-tight tracking-tight sm:text-5xl lg:text-6xl ${light ? "text-white" : "text-stone-900"}`}>
        {title}
      </h2>
      {text && (
        <p className={`mt-5 max-w-xl text-base leading-7 ${light ? "text-white/65" : "text-stone-600"}`}>
          {text}
        </p>
      )}
    </div>
  );
}
