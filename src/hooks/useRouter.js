import { useCallback, useEffect, useState } from "react";

export function useRouter() {
  const [pathname, setPathname] = useState(() => {
    if (typeof window === "undefined") return "/";
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    return path;
  });

  const [hash, setHash] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.location.hash;
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/\/+$/, "") || "/";
      setPathname(path);
      setHash(window.location.hash);
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  const navigate = useCallback((to, options = {}) => {
    if (!to) return;

    if (to.startsWith("http://") || to.startsWith("https://") || to.startsWith("mailto:") || to.startsWith("tel:")) {
      window.location.href = to;
      return;
    }

    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

    // Handle hash links
    if (to.startsWith("#")) {
      if (currentPath !== "/") {
        // We are on another page like /weddings, navigate to /#hash
        window.history.pushState({}, "", `/${to}`);
        setPathname("/");
        setHash(to);
        setTimeout(() => {
          const el = document.querySelector(to);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 100);
      } else {
        window.history.pushState({}, "", to);
        setHash(to);
        const el = document.querySelector(to);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
      return;
    }

    // Handle path navigation
    const targetUrl = new URL(to, window.location.origin);
    const targetPath = targetUrl.pathname.replace(/\/+$/, "") || "/";
    const targetHash = targetUrl.hash;

    window.history.pushState({}, "", to);
    setPathname(targetPath);
    setHash(targetHash);

    if (targetHash) {
      setTimeout(() => {
        const el = document.querySelector(targetHash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (options.scroll !== false) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return {
    pathname,
    hash,
    navigate,
    isWeddings: pathname === "/weddings",
  };
}
