function Footer() {
  return (
    <footer className="text-white pt-5 pb-4" style={{ backgroundColor: "#1e3a2f" }}>
    <div className="container">
        <div className="row">

            <div className="col-md-4 mb-4">
                <h5>NutriVida</h5>
                <p className="text-white-50">
                    Somos una clínica de nutrición dedicada a ayudarte a alcanzar tus objetivos de salud 
                    a través de planes alimenticios personalizados y acompañamiento profesional 
                    en cada etapa de tu proceso.
                </p>
            </div>
            <div className="col-md-3 mb-4">
                <h5>Contacto</h5>
                <ul className="list-unstyled text-white-50">
                    <li><i className="fa-solid fa-location-dot me-2"></i>Av. Alemania 1234, Temuco</li>
                    <li><i className="fa-solid fa-phone me-2"></i>+56 9 1234 5678</li>
                    <li><i className="fa-solid fa-envelope me-2"></i>contacto@nutrivida.cl</li>
                </ul>
            </div>

            <div className="col-md-3 mb-4">
                <h5>Síguenos</h5>
                <a href="https://instagram.com" className="text-white me-3 fs-4"><i className="fa-brands fa-instagram"></i></a>
                <a href="https://facebook.com" className="text-white me-3 fs-4"><i className="fa-brands fa-facebook"></i></a>
                <a href="https://wa.me/56912345678" className="text-white me-3 fs-4"><i className="fa-brands fa-whatsapp"></i></a>
                <a href="https://maps.google.com" className="text-white fs-4"><i className="fa-solid fa-location-dot"></i></a>
            </div>

        </div>

        <hr className="text-white-50"/>

        <div className="text-center text-white-50">
            <small>&copy; 2026 Clínica NutriVida. Todos los derechos reservados.</small>
        </div>
    </div>
</footer>
  );
}

export default Footer;