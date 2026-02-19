"use client";

import { Text } from "@/src/components/atoms/Typography";

export function Footer() {
  return (
    <footer className="sticky-footer">
      <div className="sticky-footer__container">
        <div className="sticky-footer__content">
          {/* Links row */}
          <div className="sticky-footer__links-row">
            <div className="sticky-footer__col">
              <p className="sticky-footer__eyebrow">( Paginas )</p>
              <div className="sticky-footer__links">
                <a href="#gallery" className="sticky-footer__a">
                  Obras
                </a>
                <a href="#bio" className="sticky-footer__a">
                  Bio
                </a>
                <a href="#contact" className="sticky-footer__a">
                  Contacto
                </a>
              </div>
            </div>

            <div className="sticky-footer__col">
              <p className="sticky-footer__eyebrow">( Redes )</p>
              <div className="sticky-footer__links">
                {/* TODO: reemplazar con URLs reales de los perfiles */}
                <a
                  href="https://instagram.com/demateo.art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sticky-footer__a"
                >
                  Instagram
                </a>
                <a
                  href="https://behance.net/demateo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sticky-footer__a"
                >
                  Behance
                </a>
              </div>
            </div>

            <div className="sticky-footer__col">
              <p className="sticky-footer__eyebrow">( Contacto )</p>
              <div className="sticky-footer__links">
                <a href="mailto:hello@demateo.art" className="sticky-footer__a">
                  hello@demateo.art
                </a>
              </div>
            </div>
          </div>

          {/* Bottom logo row */}
          <div className="sticky-footer__logo-row">
            <p className="sticky-footer__eyebrow">
              No es solo pintura, es realidad.
            </p>
            <span className="sticky-footer__brand">de Mateo</span>
            <Text variant="caption" className="sticky-footer__copy">
              {"\u00A9 2026 Maria Luisa de Mateo. Todos los derechos reservados."}
            </Text>
          </div>
        </div>
      </div>
    </footer>
  );
}
