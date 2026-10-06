import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal ScrollToTop
 * Ensures that whenever a user navigates to a new page/route,
 * the window and document instantly jump to the absolute top (0, 0)
 * rather than retaining the previous page's scroll position or slowly
 * scrolling up in the middle of page transitions.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    // Disable browser's manual scroll restoration so back/forward or route changes don't glitch
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (hash) {
      // If navigating to an anchor hash (e.g. #reviews), scroll to that element
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Force instant scroll behavior even if global CSS has scroll-behavior: smooth
    const prevHtmlScrollBehavior = document.documentElement.style.scrollBehavior;
    const prevBodyScrollBehavior = document.body.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';

    // Immediate synchronous reset
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Follow-up frames to catch any deferred DOM hydration, images or layout shifts
    const frameId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Restore previous scroll behavior
      document.documentElement.style.scrollBehavior = prevHtmlScrollBehavior;
      document.body.style.scrollBehavior = prevBodyScrollBehavior;
    });

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 40);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
      document.documentElement.style.scrollBehavior = prevHtmlScrollBehavior;
      document.body.style.scrollBehavior = prevBodyScrollBehavior;
    };
  }, [pathname, search, hash]);

  return null;
}

export default ScrollToTop;
