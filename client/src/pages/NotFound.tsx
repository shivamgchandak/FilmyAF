import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div
      className="dark min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundColor: '#14120F', color: '#F4F1E8' }}
    >
      <title>Scene not found · FilmyAF</title>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(244,241,232,0.035) 1px, transparent 1px)', backgroundSize: '5px 5px' }}
      />
      <div className="film-strip absolute top-0 inset-x-0" />
      <div className="film-strip absolute bottom-0 inset-x-0" />

      <div className="relative z-10 text-center max-w-[520px]">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-px bg-[#D6294B]" />
          <span className="mono-label text-[#D6294B]">Take 404</span>
          <div className="w-8 h-px bg-[#D6294B]" />
        </div>
        <h1
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 8vw, 88px)', textTransform: 'uppercase', lineHeight: 0.92, letterSpacing: '-0.01em' }}
        >
          Cut! Scene
          <br />
          <span style={{ color: '#D6294B' }}>not found.</span>
        </h1>
        <p className="body-md mt-6 mb-9" style={{ color: 'rgba(244,241,232,0.6)' }}>
          The page you're looking for went off-script.
        </p>
        <Link to="/"><Button size="lg">Back to the feed</Button></Link>
      </div>
    </div>
  );
}
