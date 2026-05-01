import { Component } from "react";
import { motion } from "framer-motion";

class ModernErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Modern: Log to external service in production
    if (import.meta.env.MODE === "production") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#fff7ed_0%,#fefce8_35%,#f1f5ff_100%)] dark:bg-[linear-gradient(135deg,#0b0f19_0%,#111827_45%,#0f172a_100%)] p-4"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-40 bg-[radial-gradient(circle_at_20%_15%,rgba(255,122,89,0.25),transparent_40%),radial-gradient(circle_at_85%_10%,rgba(99,102,241,0.25),transparent_35%),radial-gradient(circle_at_10%_85%,rgba(16,185,129,0.22),transparent_40%)]"
          />
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <svg
                viewBox="0 0 120 120"
                role="img"
                aria-label="Warning illustration"
                className="mx-auto h-20 w-20"
              >
                <defs>
                  <linearGradient id="warnGlow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="url(#warnGlow)"
                  opacity="0.15"
                />
                <polygon
                  points="60,16 110,104 10,104"
                  fill="url(#warnGlow)"
                  stroke="#fb7185"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <rect x="56" y="44" width="8" height="32" rx="4" fill="#fff" />
                <circle cx="60" cy="88" r="5" fill="#fff" />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-200"
            >
              We're on it
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-800 dark:text-white mb-4"
            >
              Oops! Something went wrong
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 mb-6"
            >
              We encountered an unexpected error. Don't worry, our team has been
              notified.
            </motion.p>

            {import.meta.env.MODE === "development" && this.state.error && (
              <motion.details
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6 text-left bg-gray-100 dark:bg-gray-700 p-4 rounded-xl text-sm"
              >
                <summary className="cursor-pointer font-semibold text-red-600 dark:text-red-400 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="whitespace-pre-wrap text-red-600 dark:text-red-400">
                  {this.state.error?.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </motion.details>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <motion.button
                onClick={this.handleRetry}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>

              <motion.button
                onClick={() => (window.location.href = "/")}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go Home
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-sm text-gray-500 dark:text-gray-400"
            >
              If this problem persists, please contact our support team.
            </motion.div>
          </motion.div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ModernErrorBoundary;
