import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerUsuarioActual, type Usuario } from '../../datos/auth';
import './Navbar-extra.css';

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(() => obtenerUsuarioActual());

  useEffect(() => {
    const actualizar = () => setUsuario(obtenerUsuarioActual());
    window.addEventListener('nutrivida-auth', actualizar);
    window.addEventListener('storage', actualizar);
    return () => {
      window.removeEventListener('nutrivida-auth', actualizar);
      window.removeEventListener('storage', actualizar);
    };
  }, []);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav className="navbar bg-1 fg-2 navbar-nutrivida">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/inicio" onClick={cerrarMenu}>
          <img src="/img/Logo NutriVida.png" width={40} height={40} alt="" />
          <span>NutriVida</span>
        </Link>
        <button
          className="btn-icon navbar-toggler"
          type="button"
          aria-controls="navbarNavAltMarkup"
          aria-expanded={menuAbierto}
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="navbar-toggler-icon" aria-hidden="true" />
        </button>
        <div id="navbarNavAltMarkup" className={`navbar-menu ${menuAbierto ? 'is-open' : ''}`}>
          <div className="nav-links-centro">
            <Link className="nav-link" to="/inicio" onClick={cerrarMenu}>Inicio</Link>
            <Link className="nav-link" to="/servicios" onClick={cerrarMenu}>Servicios</Link>
            <Link className="nav-link" to="/nosotros" onClick={cerrarMenu}>Nosotros</Link>
            <Link className="nav-link" to="/blogs" onClick={cerrarMenu}>Blogs</Link>
            <Link className="nav-link" to="/contacto" onClick={cerrarMenu}>Contacto</Link>
          </div>
          <div className="nav-acciones">
            <Link className="nav-link reserva" to="/agendar" onClick={cerrarMenu}>Reserva tu hora</Link>
            {usuario?.rol === 'Administrador' && <Link className="nav-link nav-admin" to="/admin" onClick={cerrarMenu}>Administración</Link>}
            {usuario ? <Link className="nav-link login" to="/perfil" onClick={cerrarMenu}>Mi perfil</Link> : <Link className="nav-link login" to="/login" onClick={cerrarMenu}>Iniciar sesión</Link>}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
