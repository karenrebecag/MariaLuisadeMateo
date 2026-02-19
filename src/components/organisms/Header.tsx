"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Sun, Moon } from "lucide-react";
import { Logo } from "@/src/components/atoms/Logo";

const navLinks = [
  { label: "Obras", href: "#gallery" },
  { label: "Bio", href: "#bio" },
  { label: "Contacto", href: "#contact" },
];

export function Header() {
  const [navActive, setNavActive] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);

  // Dark mode
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  }, []);

  // Hide on scroll down, show on scroll up / top
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (navActive) {
        lastScrollY.current = y;
        return;
      }
      if (y <= 10) {
        setHidden(false);
      } else if (y > lastScrollY.current + 5) {
        setHidden(true);
      } else if (y < lastScrollY.current - 5) {
        setHidden(false);
      }
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navActive]);

  // Toggle nav
  const toggleNav = useCallback(() => {
    setNavActive((prev) => !prev);
  }, []);

  // Close nav
  const closeNav = useCallback(() => {
    setNavActive(false);
  }, []);

  // ESC to close + Shift+T to toggle theme
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && navActive) closeNav();

      // Shift+T to toggle theme (skip if typing)
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (e.shiftKey && e.key === "T" && tag !== "input" && tag !== "textarea" && !(e.target as HTMLElement).isContentEditable) {
        e.preventDefault();
        toggleTheme();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navActive, closeNav, toggleTheme]);

  return (
    <nav
      ref={navRef}
      data-navigation-status={navActive ? "active" : "not-active"}
      className="navigation"
      style={{
        transform: hidden ? "translateY(-120%)" : "translateY(0)",
        transition: "transform 0.5s cubic-bezier(0.625, 0.05, 0, 1)",
      }}
    >
      {/* Dark overlay */}
      <div className="navigation__dark-bg" onClick={closeNav} />

      <div className="centered-nav">
        <div className="centered-nav__bg" />

        {/* Header bar: logo + theme toggle + hamburger */}
        <div className="centered-nav__header">
          <Logo className="centered-nav__logo-wrap" />

          <div className="centered-nav__actions">
            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-darklight"
              aria-label={isDark ? "Modo claro" : "Modo oscuro"}
            >
              <div className="btn-darklight__icon">
                <div className="btn-darklight__icon-box">
                  <Sun size={18} strokeWidth={1.5} />
                </div>
                <div className="btn-darklight__icon-box is--absolute">
                  <Moon size={18} strokeWidth={1.5} />
                </div>
              </div>
            </button>

            {/* Hamburger toggle */}
            <button
              type="button"
              onClick={toggleNav}
              className="centered-nav__toggle"
              aria-label={navActive ? "Cerrar menu" : "Abrir menu"}
            >
              <div className="centered-nav__toggle-bar" />
              <div className="centered-nav__toggle-bar" />
            </button>
          </div>
        </div>

        {/* Expandable content */}
        <div className="centered-nav__content">
          <div className="centered-nav__inner">
            <ul className="centered-nav__ul">
              {navLinks.map((link, i) => (
                <li
                  key={link.label}
                  data-navigation-item=""
                  className="centered-nav__li"
                  style={{ transitionDelay: `${i * 0.05}s` }}
                >
                  <a
                    href={link.href}
                    className="hamburger-nav__a"
                    onClick={closeNav}
                  >
                    <p
                      className="hamburger-nav__p"
                      style={{ transitionDelay: `${i * 0.05}s` }}
                    >
                      {link.label}
                    </p>
                  </a>
                </li>
              ))}
            </ul>

            {/* Contact banner with marquee */}
            <div
              data-navigation-item=""
              className="centered-nav__banner-w"
              style={{ transitionDelay: `${navLinks.length * 0.05}s` }}
            >
              <a href="#contact" className="centered-nav__banner" onClick={closeNav}>
                <div className="centered-nav__banner-row">
                  <div data-css-marquee-list="" className="centered-nav__banner-item">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="centered-nav__banner-inner">
                        <p className="centered-nav__banner-text">Contacto</p>
                      </div>
                    ))}
                  </div>
                  <div data-css-marquee-list="" className="centered-nav__banner-item">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="centered-nav__banner-inner">
                        <p className="centered-nav__banner-text">Contacto</p>
                      </div>
                    ))}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
