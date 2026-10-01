type Props = {
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  text,
  light = false,
}: Props) {
  return (
    <div className="w-full min-w-0 max-w-2xl overflow-hidden">
      <p
        className={`text-xs font-semibold uppercase tracking-[0.3em] ${
          light ? "text-[#d7a267]" : "text-[#a9682b]"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-4 w-full min-w-0 break-words text-[36px] font-light leading-tight tracking-tight sm:text-5xl lg:text-6xl ${
          light ? "text-white" : "text-stone-900"
        }`}
      >
        {title}
      </h2>

      {text && (
        <p
          className={`mt-5 w-full min-w-0 max-w-xl break-words text-base leading-7 ${
            light ? "text-white/65" : "text-stone-600"
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
}