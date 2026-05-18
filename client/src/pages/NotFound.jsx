import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">🎬</div>
      <h1 className="heading text-5xl text-bolly-paper mb-2">Cut! Scene not found.</h1>
      <p className="text-bolly-paper/60 mb-6">The page you're looking for has gone off-script.</p>
      <Link to="/" className="btn-primary">Back to the feed</Link>
    </div>
  );
}
