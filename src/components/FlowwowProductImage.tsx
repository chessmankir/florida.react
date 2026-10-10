type Props = {
  src: string | null;
  alt: string;
  className: string;
};

export function FlowwowProductImage({ src, alt, className }: Props) {
  if (!src) return <div className={`grid place-items-center bg-slate-100 text-xs text-slate-400 ${className}`}>Нет фото</div>;
  // The API returns complete remote image URLs; keep them as native img sources.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={`bg-slate-100 object-cover ${className}`} />;
}
