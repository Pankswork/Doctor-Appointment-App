import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Spline Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold text-red-500 mb-4">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-cyan-500 text-white px-6 py-2 rounded-full hover:bg-cyan-600 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
