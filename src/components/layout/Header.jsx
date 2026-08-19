import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Music } from "lucide-react";
import { images, navLinks } from "../../constants";
import { VinylMark } from "../ui";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLinkActive = (href) => {
    if (href.startsWith("/#")) {
      return location.pathname === "/" && location.hash === href.replace("/", "");
    }
    return location.pathname === href;
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition duration-300 ${
        scrolled || open
          ? "border-b border-outline-variant/20 bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-container-max items-center justify-between px-margin-mobile py-3 md:px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-syne text-2xl font-bold text-on-surface md:text-3xl"
        >
          <VinylMark />
          <img
            src={images.logo_w}
            alt="Peculiar Beats DJ logo"
            className="w-[175px] md:w-[210px]"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(([item, href]) => (
            <Link
              key={item}
              to={href}
              className={`nav-link ${isLinkActive(href) ? "active" : ""}`}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/releases"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-black"
          >
            <Music size={14} /> Vault
          </Link>
          <Link
            to="/#booking"
            className="btn-primary hidden md:inline-flex"
          >
            Book Now
          </Link>
          <button
            className="icon-button md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((value) => !value)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-outline-variant/20 px-margin-mobile pb-5 md:hidden bg-background/95 backdrop-blur-xl">
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map(([item, href]) => (
              <Link
                key={item}
                to={href}
                className={`nav-link w-fit ${isLinkActive(href) ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/releases"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/10 py-2.5 text-sm font-semibold text-primary"
                onClick={() => setOpen(false)}
              >
                <Music size={16} /> Browse Music Releases
              </Link>
              <Link
                to="/#booking"
                className="btn-primary w-full text-center"
                onClick={() => setOpen(false)}
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
