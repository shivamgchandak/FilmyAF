export default function SuggestionChip({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="inline-flex items-start gap-1.5 px-3 py-1.5 bg-transparent border border-[var(--border)] rounded-[2px] text-[var(--t2)] hover:border-[#D6294B] hover:text-[#D6294B] hover:bg-[var(--accent-sub)] transition-all duration-150 cursor-pointer text-left leading-snug max-w-full"
      style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}
    >
      <span className="opacity-50" style={{ fontSize: '10px', lineHeight: 1 }}>↗</span>
      <span className="text-left">{text}</span>
    </button>
  );
}
