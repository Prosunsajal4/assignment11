import { useEffect, useState } from "react";

/* global gtag */

// Modern: Web Vitals monitoring component
const WebVitalsMonitor = () => {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    // Modern: Dynamic import for web-vitals to reduce bundle size
    import("web-vitals")
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        // Core Web Vitals
        getCLS((metric) => {
          console.log("CLS:", metric);
          setMetrics((prev) => ({ ...prev, cls: metric }));
          // Send to analytics in production
          if (import.meta.env.MODE === "production") {
            sendToAnalytics("CLS", metric);
          }
        });

        getFID((metric) => {
          console.log("FID:", metric);
          setMetrics((prev) => ({ ...prev, fid: metric }));
          if (import.meta.env.MODE === "production") {
            sendToAnalytics("FID", metric);
          }
        });

        getFCP((metric) => {
          console.log("FCP:", metric);
          setMetrics((prev) => ({ ...prev, fcp: metric }));
          if (import.meta.env.MODE === "production") {
            sendToAnalytics("FCP", metric);
          }
        });

        getLCP((metric) => {
          console.log("LCP:", metric);
          setMetrics((prev) => ({ ...prev, lcp: metric }));
          if (import.meta.env.MODE === "production") {
            sendToAnalytics("LCP", metric);
          }
        });

        getTTFB((metric) => {
          console.log("TTFB:", metric);
          setMetrics((prev) => ({ ...prev, ttfb: metric }));
          if (import.meta.env.MODE === "production") {
            sendToAnalytics("TTFB", metric);
          }
        });
      })
      .catch((error) => {
        console.warn("Web Vitals library not available:", error);
      });

    // Modern: Monitor memory usage
    if ("memory" in performance) {
      const memoryMonitor = setInterval(() => {
        const memory = performance.memory;
        console.log("Memory Usage:", {
          used: Math.round((memory.usedJSHeapSize / 1048576) * 100) / 100,
          total: Math.round((memory.totalJSHeapSize / 1048576) * 100) / 100,
          limit: Math.round((memory.jsHeapSizeLimit / 1048576) * 100) / 100,
        });
      }, 10000); // Check every 10 seconds

      return () => clearInterval(memoryMonitor);
    }
  }, []);

  // Modern: Send metrics to analytics service
  const sendToAnalytics = (name, metric) => {
    // Replace with your analytics service
    console.log(`Sending ${name} to analytics:`, metric);

    // Example: Google Analytics 4
    if (typeof gtag !== "undefined") {
      gtag("event", name.toLowerCase(), {
        value: Math.round(metric.value * 1000), // Convert to milliseconds
        event_category: "Web Vitals",
        event_label: metric.id,
        non_interaction: true,
      });
    }
  };

  // Modern: Performance observer for additional metrics
  useEffect(() => {
    if ("PerformanceObserver" in window) {
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log("Long task detected:", entry);
          if (import.meta.env.MODE === "production") {
            sendToAnalytics("Long Task", {
              value: entry.duration,
              id: entry.name,
            });
          }
        }
      });

      try {
        longTaskObserver.observe({ entryTypes: ["longtask"] });
      } catch {
        console.warn("Long task monitoring not supported");
      }

      // Monitor layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log("Layout shift detected, CLS:", clsValue);
      });

      try {
        layoutShiftObserver.observe({ entryTypes: ["layout-shift"] });
      } catch {
        console.warn("Layout shift monitoring not supported");
      }

      return () => {
        longTaskObserver.disconnect();
        layoutShiftObserver.disconnect();
      };
    }
  }, []);

  // Modern: Development-only metrics display
  if (import.meta.env.MODE === "development") {
    return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
        <div className="font-bold mb-2">Web Vitals</div>
        {metrics.cls && <div>CLS: {metrics.cls.value.toFixed(3)}</div>}
        {metrics.fid && <div>FID: {Math.round(metrics.fid.value)}ms</div>}
        {metrics.fcp && <div>FCP: {Math.round(metrics.fcp.value)}ms</div>}
        {metrics.lcp && <div>LCP: {Math.round(metrics.lcp.value)}ms</div>}
        {metrics.ttfb && <div>TTFB: {Math.round(metrics.ttfb.value)}ms</div>}
      </div>
    );
  }

  return null;
};

export default WebVitalsMonitor;
