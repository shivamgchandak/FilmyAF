export default function Input({ label, error, className = '', ...rest }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-medium mb-1 text-bolly-paper/80">{label}</span>
      )}
      <input className={`input ${error ? 'border-bolly-red' : ''} ${className}`} {...rest} />
      {error && <span className="text-bolly-red text-xs mt-1 block">{error}</span>}
    </label>
  );
}
