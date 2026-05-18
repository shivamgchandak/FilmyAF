import { useEffect, useState } from 'react';

const QUOTES = [
  '🎬 Director is shouting "Action!"',
  '🎭 Casting is being finalised…',
  '💃 Choreographer is rehearsing item number…',
  '✍️ Screenwriter is wiping a single dramatic tear…',
  '🎞️ Editor is adding slow-motion punches…',
  '🌧️ Rain machine is being switched on…',
  '🌶️ Adding extra masala…',
];

export default function LoadingDrama() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % QUOTES.length), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="card text-center py-12 animate-fade-in">
      <div className="text-5xl mb-4 animate-bounce">🎬</div>
      <p className="heading text-2xl text-bolly-saffron mb-2">Lights, camera…</p>
      <p className="text-bolly-paper/70 transition-all min-h-[1.5em]">{QUOTES[i]}</p>
      <div className="flex gap-1 justify-center mt-6">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="w-2 h-2 rounded-full bg-bolly-red animate-pulse"
            style={{ animationDelay: `${d * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
