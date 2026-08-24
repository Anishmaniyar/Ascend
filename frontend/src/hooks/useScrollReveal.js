"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useScrollReveal — reveals an element when it enters the viewport.
 * Returns a ref to attach to the element and an `isInView` boolean.
 *
 * @param {Object} opts
 * @param {number} opts.threshold — IntersectionObserver threshold (default 0.15)
 * @param {string} opts.rootMargin — rootMargin (default "0px 0px -60px 0px")
 * @param {boolean} opts.triggerOnce — only animate once (default true)
 */
export function useScrollReveal({
  threshold = 0.15,
  rootMargin = "0px 0px -60px 0px",
  triggerOnce = true,
} = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) observer.unobserve(el);
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView };
}
