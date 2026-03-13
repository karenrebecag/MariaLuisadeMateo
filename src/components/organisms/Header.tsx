"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Sun, Moon } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/src/i18n/navigation";
import { Logo } from "@/src/components/atoms/Logo";
import { gsap } from "@/src/lib/gsap-registry";

export function Header() {
  const t = useTranslations("nav");
  const th = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { label: t("bio"), href: "#bio" },
    { label: t("obras"), href: "#obras" },
  ];

  const [navActive, setNavActive] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

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

  // Toggle nav
  const toggleNav = useCallback(() => {
    setNavActive((prev) => !prev);
  }, []);

  // Close nav
  const closeNav = useCallback(() => {
    setNavActive(false);
  }, []);

  // Hide on scroll down, show on scroll up / top
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (navActive) {
        closeNav();
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
  }, [navActive, closeNav]);

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

  const switchLocale = useCallback(() => {
    const nextLocale = locale === "es" ? "en" : "es";
    router.replace(pathname, { locale: nextLocale });
  }, [locale, router, pathname]);

  // Animate socials in/out on nav toggle
  useEffect(() => {
    const container = socialsRef.current;
    if (!container) return;
    const links = container.querySelectorAll<HTMLElement>(".centered-nav__social-link");

    if (navActive) {
      gsap.set(container, { display: "flex", width: "auto" });
      gsap.fromTo(
        links,
        { opacity: 0, scale: 0.5, x: 8 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.45,
          ease: "back.out(1.7)",
          stagger: 0.06,
        }
      );
    } else {
      gsap.to(links, {
        opacity: 0,
        scale: 0.5,
        x: 8,
        duration: 0.25,
        ease: "power2.in",
        stagger: { each: 0.04, from: "end" },
        onComplete: () => {
          gsap.set(container, { display: "none", width: 0 });
        },
      });
    }
  }, [navActive]);

  const contactLabel = t("contact");

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

        {/* Header bar: logo + actions */}
        <div className="centered-nav__header">
          <Logo className="centered-nav__logo-wrap" />

          <div className="centered-nav__actions">
            {/* Socials — only visible when nav is active */}
            <div ref={socialsRef} className="centered-nav__header-socials" style={{ display: "none", width: 0 }}>
              <a
                href="https://www.instagram.com/maria_luisa_de_mateo/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="centered-nav__social-link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.94 7.88C21.9206 7.0503 21.7652 6.2294 21.48 5.45C21.2283 4.78181 20.8322 4.17742 20.32 3.68C19.8226 3.16776 19.2182 2.77166 18.55 2.52C17.7706 2.23484 16.9497 2.07945 16.12 2.06C15.06 2 14.72 2 12 2C9.28 2 8.94 2 7.88 2.06C7.0503 2.07945 6.2294 2.23484 5.45 2.52C4.78181 2.77166 4.17742 3.16776 3.68 3.68C3.16743 4.17518 2.77418 4.78044 2.53 5.45C2.23616 6.22734 2.07721 7.04915 2.06 7.88C2 8.94 2 9.28 2 12C2 14.72 2 15.06 2.06 16.12C2.07721 16.9508 2.23616 17.7727 2.53 18.55C2.77418 19.2196 3.16743 19.8248 3.68 20.32C4.17742 20.8322 4.78181 21.2283 5.45 21.48C6.2294 21.7652 7.0503 21.9206 7.88 21.94C8.94 22 9.28 22 12 22C14.72 22 15.06 22 16.12 21.94C16.9497 21.9206 17.7706 21.7652 18.55 21.48C19.2134 21.219 19.816 20.8242 20.3201 20.3201C20.8242 19.816 21.219 19.2134 21.48 18.55C21.7652 17.7706 21.9206 16.9497 21.94 16.12C21.94 15.06 22 14.72 22 12C22 9.28 22 8.94 21.94 7.88ZM20.14 16C20.1327 16.6348 20.0178 17.2637 19.8 17.86C19.6327 18.2913 19.3773 18.683 19.0501 19.0101C18.723 19.3373 18.3313 19.5927 17.9 19.76C17.3037 19.9778 16.6748 20.0927 16.04 20.1C15.04 20.15 14.67 20.16 12.04 20.16C9.41 20.16 9.04 20.16 8.04 20.1C7.38073 20.1148 6.72401 20.0132 6.1 19.8C5.66869 19.6327 5.27698 19.3773 4.94985 19.0501C4.62272 18.723 4.36734 18.3313 4.2 17.9C3.97775 17.2911 3.86271 16.6482 3.86 16C3.86 15 3.8 14.63 3.8 12C3.8 9.37 3.8 9 3.86 8C3.86271 7.35178 3.97775 6.70893 4.2 6.1C4.36734 5.66869 4.62272 5.27698 4.94985 4.94985C5.27698 4.62272 5.66869 4.36734 6.1 4.2C6.70893 3.97775 7.35178 3.86271 8 3.86C9 3.86 9.37 3.8 12 3.8C14.63 3.8 15 3.8 16 3.86C16.6348 3.86728 17.2637 3.98225 17.86 4.2C18.2913 4.36734 18.683 4.62272 19.0101 4.94985C19.3373 5.27698 19.5927 5.66869 19.76 6.1C19.9959 6.7065 20.1245 7.34942 20.14 8C20.19 9 20.2 9.37 20.2 12C20.2 14.63 20.19 15 20.14 16Z" fill="currentColor"/>
                  <path d="M12 6.86C10.9834 6.86 9.98964 7.16146 9.14437 7.72625C8.2991 8.29104 7.64029 8.0938 7.25126 10.033C6.86222 10.9722 6.76044 12.0057 6.95876 13.0028C7.15709 13.9998 7.64663 14.9157 8.36547 15.6345C9.08431 16.3534 10.0002 16.8429 10.9972 17.0412C11.9943 17.2396 13.0278 17.1378 13.967 16.7487C14.9062 16.3597 15.709 15.7009 16.2738 14.8556C16.8385 14.0104 17.14 13.0166 17.14 12C17.14 10.6368 16.5985 9.32941 15.6345 8.36547C14.6706 7.40153 13.3632 6.86 12 6.86ZM12 15.33C11.3414 15.33 10.6976 15.1347 10.15 14.7688C9.60234 14.4029 9.17552 13.8828 8.92348 13.2743C8.67144 12.6659 8.6055 11.9963 8.73399 11.3503C8.86247 10.7044 9.17963 10.111 9.64533 9.64533C10.111 9.17963 10.7044 8.86247 11.3503 8.73399C11.9963 8.6055 12.6659 8.67144 13.2743 8.92348C13.8828 9.17552 14.4029 9.60234 14.7688 10.15C15.1347 10.6976 15.33 11.3414 15.33 12C15.33 12.4373 15.2439 12.8703 15.0765 13.2743C14.9092 13.6784 14.6639 14.0454 14.3547 14.3547C14.0454 14.6639 13.6784 14.9092 13.2743 15.0765C12.8703 15.2439 12.4373 15.33 12 15.33Z" fill="currentColor"/>
                  <path d="M17.34 5.46001C17.1027 5.46001 16.8707 5.53039 16.6733 5.66224C16.476 5.7941 16.3222 5.98152 16.2313 6.20079C16.1405 6.42006 16.1168 6.66134 16.1631 6.89411C16.2094 7.12689 16.3236 7.34071 16.4915 7.50853C16.6593 7.67636 16.8731 7.79065 17.1059 7.83695C17.3387 7.88325 17.5799 7.85949 17.7992 7.76866C18.0185 7.67784 18.2059 7.52403 18.3378 7.32669C18.4696 7.12935 18.54 6.89734 18.54 6.66001C18.54 6.34175 18.4136 6.03652 18.1885 5.81148C17.9635 5.58643 17.6583 5.46001 17.34 5.46001Z" fill="currentColor"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/DeMateoVenturini"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="centered-nav__social-link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.833 22V13.2H6.669V9.6H9.833V6.849C9.833 3.726 11.694 2 14.541 2C15.4757 2.01295 16.4082 2.09417 17.331 2.243V5.311H15.76C15.4921 5.27507 15.2196 5.29992 14.9626 5.38371C14.7057 5.4675 14.4709 5.60808 14.2757 5.79502C14.0805 5.98195 13.9299 6.21044 13.8351 6.46354C13.7403 6.71663 13.7037 6.98783 13.728 7.257V9.6H17.185L16.633 13.2H13.733V22H9.833Z" fill="currentColor"/>
                </svg>
              </a>
              <a
                href="https://www.artsy.net/artist/de-mateo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Artsy"
                className="centered-nav__social-link"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/idxgFpdOYs_1771604835460.svg"
                  alt="Artsy"
                  width={16}
                  height={16}
                  className="centered-nav__social-icon"
                />
              </a>
            </div>

            {/* Language toggle */}
            <button
              type="button"
              onClick={switchLocale}
              className="btn-darklight"
              aria-label={locale === "es" ? "Switch to English" : "Cambiar a Español"}
              style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              {locale === "es" ? "EN" : "ES"}
            </button>

            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-darklight"
              aria-label={isDark ? th("lightMode") : th("darkMode")}
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
              aria-label={navActive ? th("closeMenu") : th("openMenu")}
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
                        <p className="centered-nav__banner-text">{contactLabel}</p>
                      </div>
                    ))}
                  </div>
                  <div data-css-marquee-list="" className="centered-nav__banner-item">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="centered-nav__banner-inner">
                        <p className="centered-nav__banner-text">{contactLabel}</p>
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
