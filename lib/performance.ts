// Performance optimization utilities

// Dynamic import helper for code splitting
export const dynamicImport = <T>(importFn: () => Promise<T>) => {
  return importFn()
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

// Image lazy loading helper
export const lazyLoadImage = (src: string, placeholder?: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = reject
    img.src = src
  })
}

// Local storage with error handling
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch {
      // Silently fail
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {
      // Silently fail
    }
  }
}

// Intersection Observer helper for animations
export const observeIntersection = (
  elements: Element[],
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return null
  }

  const observer = new IntersectionObserver(callback, {
    threshold: 0.1,
    rootMargin: '50px',
    ...options,
  })

  elements.forEach(element => observer.observe(element))

  return observer
}

// Memory cleanup helper
export const cleanupResources = (...cleanupFunctions: (() => void)[]) => {
  return () => {
    cleanupFunctions.forEach(cleanup => {
      try {
        cleanup()
      } catch (error) {
        console.warn('Cleanup error:', error)
      }
    })
  }
}