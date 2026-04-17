import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("WebGL/Canvas Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="w-full h-full flex items-center justify-center bg-black text-soft-gold text-xs uppercase tracking-widest text-center p-10">
          <div className="max-w-xs">
            <p className="mb-4 opacity-60">Enhanced 3D experience unavailable</p>
            <p className="text-[10px] opacity-30 italic font-light">
              Your browser or hardware may not support WebGL. 
              Continuing with standard luxury experience.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
