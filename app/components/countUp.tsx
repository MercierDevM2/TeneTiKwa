// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUp({ end = 0, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let hasStarted = false;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) {
        hasStarted = true;
        observer.disconnect();

        let start = 0;
        const step = end / (duration / 16);

        const interval = setInterval(() => {
          start += step;

          if (start >= end) {
            setCount(end);
            clearInterval(interval);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
      }
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}</span>;
}