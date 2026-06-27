import React from "react";
import { socialLinks } from "../../constants";

export default function Footer() {
  return (
    <footer className="footer-frame" id="footer">
      <div className="footer-marquee" aria-hidden="true">
        <div className="footer-marquee-track">
          {[0, 1].map((group) => (
            <span className="footer-marquee-text" key={group}>
              PECULIAR BEATS
            </span>
          ))}
        </div>
      </div>
      <div className="footer-content">
        <div className="footer-socials">
          {socialLinks.map(({ name, color, link, icon: Icon }) => (
            <a
              href={link}
              className="footer-social-link"
              style={{ "--social-color": color }}
              key={name}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow Peculiar Beats on ${name}`}
            >
              <span className="footer-social-icon" aria-hidden="true">
                <Icon size={15} />
              </span>
              {name}
            </a>
          ))}
        </div>
        <div className="footer-copyright">
          ©2026 Peculiar Beats. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
