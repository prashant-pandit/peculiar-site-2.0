import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { images, navLinks } from "../../constants";
import { VinylMark } from "../ui";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const getInitialActiveHref = () => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.replace(/\/+$/, "") || "/";
      if (path === "/weddings") return "/weddings";
    }
    return navLinks[0][1];
  };

  const [activeHref, setActiveHref] = useState(getInitialActiveHref);

  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.replace(/\/+$/, "") || "/";
      if (path === "/weddings") {
        setActiveHref("/weddings");
        return;
      }
      if (navLinks.some(([, href]) => href === window.location.hash)) {
        setActiveHref(window.location.hash);
      }
    };

    const updateActiveLink = () => {
      const path = window.location.pathname.replace(/\/+$/, "") || "/";
      if (path === "/weddings") {
        setActiveHref("/weddings");
        return;
      }

      const activeLink = navLinks.find(([, href]) => {
        if (!href.startsWith("#")) return false;
        const section = document.querySelector(href);
        if (!section) return false;

        const bounds = section.getBoundingClientRect();
        return bounds.top <= 150 && bounds.bottom > 150;
      });

      if (activeLink) {
        setActiveHref(activeLink[1]);
      }
    };

    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      updateActiveLink();
    };

    handleLocation();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", handleLocation);
    window.addEventListener("popstate", handleLocation);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", handleLocation);
      window.removeEventListener("popstate", handleLocation);
    };
  }, []);

  const handleNavClick = (e, href) => {
    const isWeddings = window.location.pathname.replace(/\/+$/, "") === "/weddings";

    if (href === "/weddings") {
      setActiveHref("/weddings");
      if (!isWeddings) {
        e.preventDefault();
        window.history.pushState({}, "", "/weddings");
        window.dispatchEvent(new PopStateEvent("popstate"));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (isWeddings) {
      if (href === "#footer") {
        const el = document.querySelector("#footer");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else if (href.startsWith("#")) {
        e.preventDefault();
        window.location.href = `/${href}`;
      }
      return;
    }

    setActiveHref(href);
  };

  const handleLogoClick = (e) => {
    const isWeddings = window.location.pathname.replace(/\/+$/, "") === "/weddings";
    if (isWeddings) {
      e.preventDefault();
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveHref(navLinks[0][1]);
    }
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition duration-300 ${
        scrolled || open
          ? "border-b border-outline-variant/20 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-container-max items-center justify-between px-margin-mobile py-3 md:px-4">
        <a
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2 font-syne text-2xl font-bold text-on-surface md:text-3xl"
        >
          <VinylMark />
          <img
            src={images.logo_w}
            alt="Peculiar Beats DJ logo"
            className="w-[175px] md:w-[210px]"
          />
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(([item, href]) => (
            <a
              key={item}
              href={href}
              className={`nav-link ${activeHref === href ? "active" : ""}`}
              onClick={(e) => handleNavClick(e, href)}
            >
              {item}
            </a>
          ))}
        </div>
        <a
          href="/#booking"
          className="btn-primary hidden md:inline-flex"
          onClick={(e) => {
            const isWeddings = window.location.pathname.replace(/\/+$/, "") === "/weddings";
            if (isWeddings) {
              e.preventDefault();
              window.location.href = "/#booking";
            } else {
              setActiveHref("#booking");
            }
          }}
        >
          Book Now
        </a>
        <button
          className="icon-button md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((value) => !value)}
        >
          <Menu size={22} />
        </button>
      </div>
      {open && (
        <div className="border-t border-outline-variant/20 px-margin-mobile pb-5 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map(([item, href]) => (
              <a
                key={item}
                href={href}
                className={`nav-link w-fit ${activeHref === href ? "active" : ""}`}
                onClick={(e) => {
                  handleNavClick(e, href);
                  setOpen(false);
                }}
              >
                {item}
              </a>
            ))}
            <a
              href="/#booking"
              className="btn-primary w-full"
              onClick={(e) => {
                const isWeddings = window.location.pathname.replace(/\/+$/, "") === "/weddings";
                if (isWeddings) {
                  e.preventDefault();
                  window.location.href = "/#booking";
                } else {
                  setActiveHref("#booking");
                }
                setOpen(false);
              }}
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
