export default function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const base =
    variant === 'primary' ? 'btn-primary' :
    variant === 'secondary' ? 'btn-secondary' :
    'btn-ghost';
  return (
    <button
      className={`${base} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="animate-pulse">⏳</span> : null}
      {children}
    </button>
  );
}
