export default function EmptyState({ emoji = '🎬', title, description, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="heading text-2xl text-bolly-paper mb-2">{title}</h3>
      {description && <p className="text-bolly-paper/60 max-w-md mx-auto mb-6">{description}</p>}
      {action}
    </div>
  );
}
