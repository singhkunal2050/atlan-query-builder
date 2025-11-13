import { onCLS, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals'

export function reportWebVitals() {
  const logMetric = (metric: Metric) => {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    })
  }

  onCLS(logMetric)  // Cumulative Layout Shift
  // onFID(logMetric)  // First Input Delay
  onLCP(logMetric)  // Largest Contentful Paint
  onFCP(logMetric)  // First Contentful Paint
  onTTFB(logMetric) // Time to First Byte
}

