"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[QG] Client error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <h2 className="text-2xl font-display text-imperial-gold mb-4">
            Erreur du Quartier Général
          </h2>
          <p className="text-imperial-muted mb-6 max-w-md">
            Une erreur inattendue est survenue. Veuillez rafraîchir la page.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: undefined });
              window.location.reload();
            }}
            className="px-6 py-2 bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40 rounded-lg hover:bg-imperial-gold/30 transition-colors"
          >
            Rafraîchir
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
