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
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <h1 className="heading text-5xl text-bolly-red mb-3">Intermission! 🎬</h1>
          <p className="text-bolly-paper/70 max-w-md mb-6">
            Something broke off-screen. Our screenwriter has gone for a chai break ☕.
          </p>
          <pre className="text-xs text-bolly-paper/50 bg-white/5 rounded-lg p-3 max-w-md overflow-auto">
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary mt-6"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
