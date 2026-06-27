import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { images, navLinks } from "../../constants";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState(navLinks[0][1]);

  useEffect(() => {
    const updateActiveLink = () => {
      const activeLink = navLinks.find(([, href]) => {
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

    const onHashChange = () => {
      if (navLinks.some(([, href]) => href === window.location.hash)) {
        setActiveHref(window.location.hash);
      }
    };

    onHashChange();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

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
          href="#"
          className="font-syne text-2xl font-bold text-on-surface md:text-3xl"
        >
          <img
            src={images.logo_w}
            alt="Peculiar Beats DJ logo"
            className="w-[210px]"
          />
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(([item, href]) => (
            <a
              key={item}
              href={href}
              className={`nav-link ${activeHref === href ? "active" : ""}`}
              onClick={() => setActiveHref(href)}
            >
              {item}
            </a>
          ))}
        </div>
        <a
          href="#booking"
          className="btn-primary hidden md:inline-flex"
          onClick={() => setActiveHref("#booking")}
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
                onClick={() => {
                  setActiveHref(href);
                  setOpen(false);
                }}
              >
                {item}
              </a>
            ))}
            <a
              href="#booking"
              className="btn-primary w-full"
              onClick={() => {
                setActiveHref("#booking");
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
