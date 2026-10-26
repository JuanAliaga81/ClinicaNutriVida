import './Footer.css';

function Footer() {
  return (
    <footer className="footer-nutrivida text-white pt-5 pb-4">
      <div className="container">
        <div className="footer-grid">
          <section className="footer-column">
            <h5>NutriVida</h5>
            <p>
              Somos una clínica de nutrición dedicada a ayudarte a alcanzar tus objetivos de salud
              a través de planes alimenticios personalizados y acompañamiento profesional
              en cada etapa de tu proceso.
            </p>
          </section>

          <section className="footer-column">
            <h5>Contacto</h5>
            <ul className="footer-list">
              <li><i className="fa-solid fa-location-dot" aria-hidden="true" />Av. Alemania 1234, Temuco</li>
              <li><i className="fa-solid fa-phone" aria-hidden="true" />+56 9 1234 5678</li>
              <li><i className="fa-solid fa-envelope" aria-hidden="true" />contacto@nutrivida.cl</li>
            </ul>
          </section>

          <section className="footer-column">
            <h5>Síguenos</h5>
            <div className="footer-social">
              <a href="https://instagram.com" aria-label="Instagram NutriVida"><i className="fa-brands fa-instagram" aria-hidden="true" /></a>
              <a href="https://facebook.com" aria-label="Facebook NutriVida"><i className="fa-brands fa-facebook" aria-hidden="true" /></a>
              <a href="https://wa.me/56912345678" aria-label="WhatsApp NutriVida"><i className="fa-brands fa-whatsapp" aria-hidden="true" /></a>
              <a href="https://maps.google.com" aria-label="Ubicación de NutriVida"><i className="fa-solid fa-location-dot" aria-hidden="true" /></a>
            </div>
          </section>
        </div>

        <hr className="footer-divider" />
        <div className="footer-copyright">
          <small>&copy; 2026 Clínica NutriVida. Todos los derechos reservados.</small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
