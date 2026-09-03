import { Link } from 'react-router-dom';

/* Make's footer carried invented stats (10,247 scripts generated). There is no
   stats endpoint, so that column is replaced with the pipeline - true, and it
   explains the product to a first-time visitor. */
const PIPELINE = [
  ['01', 'Director picks the title and the shape'],
  ['02', 'Casting finds people worth arguing'],
  ['03', 'Screenwriter writes the scenes'],
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-baseline gap-1 mb-3">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.01em', lineHeight: 1 }} className="text-[var(--t1)]">FILMY</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.01em', lineHeight: 1 }} className="text-[#D6294B]">AF</span>
            </div>
            <p className="body-sm text-[var(--t3)] leading-relaxed max-w-[260px]">
              Your life is mid. We'll fix that in three acts.
            </p>
          </div>

          <div className="col-span-6 md:col-span-3">
            <p className="mono-label text-[var(--t3)] mb-4">Product</p>
            <div className="flex flex-col gap-3">
              <Link to="/" className="body-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors">Browse</Link>
              <Link to="/generate" className="body-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors">Generate</Link>
              <Link to="/history" className="body-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors">My scripts</Link>
            </div>
          </div>

          <div className="col-span-12 md:col-span-5">
            <p className="mono-label text-[var(--t3)] mb-4">How a script gets made</p>
            <div className="flex flex-col gap-2">
              {PIPELINE.map(([n, label]) => (
                <div key={n} className="flex items-baseline gap-3">
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }} className="text-[var(--t3)]">{n}</span>
                  <span className="body-sm text-[var(--t2)]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-8 mt-8 border-t border-[var(--border)] gap-4 flex-wrap">
          <span className="mono-label text-[var(--t3)]">© 2026 FilmyAF · All takes reserved</span>
        </div>
      </div>
    </footer>
  );
}
