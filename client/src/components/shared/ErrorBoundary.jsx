import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: '#14120F', color: '#F4F1E8' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-[#D6294B]" />
          <span className="mono-label text-[#D6294B]">Intermission</span>
          <div className="w-8 h-px bg-[#D6294B]" />
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 64px)',
            textTransform: 'uppercase',
            lineHeight: 0.95,
          }}
        >
          Something broke
          <br />
          off-screen.
        </h1>
        <p className="body-md mt-5 mb-8 max-w-[420px]" style={{ color: 'rgba(244,241,232,0.6)' }}>
          The screenwriter has gone for a chai break. Reloading usually brings them back.
        </p>
        <pre
          className="mono-sm max-w-[520px] overflow-auto px-4 py-3 rounded-[2px] mb-8 text-left"
          style={{ backgroundColor: 'rgba(244,241,232,0.05)', color: 'rgba(244,241,232,0.5)' }}
        >
          {this.state.error?.message}
        </pre>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center font-mono uppercase tracking-[0.1em] font-medium px-6 py-3 text-[14px] rounded-[2px] bg-[#D6294B] text-[#F4F1E8] hover:bg-[#BF2241] transition-colors"
        >
          Reload
        </button>
      </div>
    );
  }
}
