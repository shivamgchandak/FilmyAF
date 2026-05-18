import Button from '../shared/Button.jsx';

export default function GenerateButton({ loading, disabled, onClick }) {
  return (
    <Button onClick={onClick} loading={loading} disabled={disabled} className="w-full text-lg py-4">
      {loading ? 'Director is shouting "Action!" …' : '🎬 Generate the Drama'}
    </Button>
  );
}
