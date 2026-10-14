import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Oops! Something went wrong.</h2>
          <p style={{ color: 'var(--color-danger)' }}>{this.state.error?.toString()}</p>
          <button className="btn btn-primary mt-md" onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children; 
  }
}
