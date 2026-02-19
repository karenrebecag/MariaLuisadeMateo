"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none">
                    <path d="M15.5355 8.46447C17.4882 10.4171 17.4882 13.5829 15.5355 15.5355C13.5829 17.4882 10.4171 17.4882 8.46447 15.5355C6.51184 13.5829 6.51184 10.4171 8.46447 8.46447C10.4171 6.51184 13.5829 6.51184 15.5355 8.46447Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.3599 5.63999L19.0699 4.92999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.93018 19.07L5.64018 18.36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.3599 18.36L19.0699 19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.93018 4.92999L5.64018 5.63999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="btn-darklight__icon-box is--absolute">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none">
                    <path d="M18.395 13.027C18.725 12.872 19.077 13.197 18.985 13.55C18.671 14.752 18.054 15.896 17.104 16.846C14.283 19.667 9.77001 19.726 7.02201 16.978C4.27401 14.23 4.33401 9.71601 7.15501 6.89501C8.10501 5.94501 9.24801 5.32801 10.451 5.01401C10.804 4.92201 11.128 5.27401 10.974 5.60401C9.97201 7.74301 10.301 10.305 11.998 12.002C13.694 13.7 16.256 14.029 18.395 13.027Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
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
