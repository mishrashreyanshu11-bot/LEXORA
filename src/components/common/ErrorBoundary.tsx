import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import { LexoraSymbol } from './LexoraSymbol';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LEXORA ErrorBoundary caught an uncaught exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      // Clear corrupt context cache while preserving critical credentials if possible
      sessionStorage.clear();
      localStorage.removeItem('lexora_stories_v3');
      localStorage.removeItem('lexora_parts_v3');
      localStorage.removeItem('lexora_reading_progress_v3');
      localStorage.removeItem('lexora_challenges');
      localStorage.removeItem('lexora_certificates');
    } catch (e) {
      console.warn('Could not reset local storage:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#06070a] text-slate-100 flex items-center justify-center p-6 selection:bg-[#e5b95a]/30 selection:text-amber-100">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-lg w-full bg-gradient-to-br from-[#121008] via-[#090b10] to-black rounded-3xl border-2 border-amber-500/40 p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(243,186,56,0.2)] text-center space-y-6">
            <div className="flex flex-col items-center justify-center space-y-3">
              <LexoraSymbol size={56} glow={true} animated={false} />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                <span>Sanctuary Resilience Active</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Restoring Sanctuary Balance
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                LEXORA encountered an unexpected rendering hiccup. Your published works and credentials are safe.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/20 text-left text-xs font-mono text-slate-400 space-y-1 overflow-x-auto max-h-32">
                <p className="text-amber-300/90 font-semibold">{this.state.error.name}: {this.state.error.message}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#ffd700] via-[#f3ba38] to-[#d4af37] text-black font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Sanctuary</span>
              </button>

              <button
                onClick={this.handleResetCache}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-200 font-sans text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Clear Cache &amp; Reset</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
