import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "40px",
          maxWidth: "600px",
          margin: "80px auto",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}>
          <h1 style={{ color: "#dc2626", marginBottom: "12px" }}>Something went wrong</h1>
          <p style={{ color: "#64748b", marginBottom: "20px" }}>
            The application encountered an error. Check the browser console for details.
          </p>
          <details style={{ 
            background: "#f8fafc", 
            padding: "16px", 
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "monospace"
          }}>
            <summary style={{ cursor: "pointer", fontWeight: "600", marginBottom: "8px" }}>
              Error details
            </summary>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
