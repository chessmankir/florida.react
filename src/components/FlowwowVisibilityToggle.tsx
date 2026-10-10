type FlowwowVisibilityToggleProps = {
  isVisible: boolean;
  onToggle: () => void;
};

export function FlowwowVisibilityToggle({ isVisible, onToggle }: FlowwowVisibilityToggleProps) {
  return (
    <button
      type="button"
      aria-expanded={isVisible}
      className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
      onClick={onToggle}
    >
      {isVisible ? "Скрыть показатели" : "Показать показатели"}
      <svg className={`size-4 transition-transform ${isVisible ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
