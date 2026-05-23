"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
});

export function ProgressBarProvider() {
  const pathname = usePathname();
  const previousRef = useRef(pathname);
  const startedForPathnameRef = useRef(false);

  const safeStart = () => {
    // Avoid multiple starts without a done()
    if (!startedForPathnameRef.current) {
      startedForPathnameRef.current = true;
      NProgress.start();
    }
  };

  // Inject custom color style on mount
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Cek apakah style sudah ada
    if (document.getElementById("nprogress-custom-color")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "nprogress-custom-color";
    style.textContent = `
      #nprogress .bar {
        background: hsl(var(--primary));
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
      }

      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 15px hsl(var(--primary)), 0 0 8px hsl(var(--primary));
        opacity: 1.0;
        -webkit-transform: rotate(3deg) translate(0px, -4px);
        -ms-transform: rotate(3deg) translate(0px, -4px);
        transform: rotate(3deg) translate(0px, -4px);
      }

      #nprogress {
        pointer-events: none;
      }

      #nprogress.active {
        pointer-events: auto;
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Start progress for all client-side navigations using History API
  useEffect(() => {
    if (typeof window === "undefined") return;

    const { history } = window;
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    const startIfDifferentUrl = (url: string | URL | null | undefined) => {
      try {
        const nextUrl = typeof url === "string" ? url : url?.toString();
        if (!nextUrl) return;

        const current = window.location.pathname;

        // If nextUrl is absolute, parse it. If relative, it still works via URL.
        const parsed = new URL(nextUrl, window.location.origin);
        const nextPathname = parsed.pathname;

        if (nextPathname && nextPathname !== current) {
          safeStart();
        }
      } catch {
        // ignore parse errors
      }
    };

    history.pushState = function pushStatePatched(
      this: History,
      data: unknown,
      unused: string,
      url?: string | URL | null
    ) {
      startIfDifferentUrl(url);
      return originalPushState.apply(this, [data, unused, url] as [
        unknown,
        string,
        string | URL | null | undefined
      ]);
    };

    history.replaceState = function replaceStatePatched(
      this: History,
      data: any,
      unused: string,
      url?: string | URL | null
    ) {
      // For replaceState we still start (usually used for redirects)
      startIfDifferentUrl(url);
      return originalReplaceState.apply(this, [data, unused, url] as any);
    };

    const onPopState = () => {
      // back/forward
      safeStart();
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  // Finish progress when Next.js pathname changes
  useEffect(() => {
    if (previousRef.current !== pathname) {
      NProgress.done();
      previousRef.current = pathname;
      startedForPathnameRef.current = false;
    }
  }, [pathname]);

  return null;
}
