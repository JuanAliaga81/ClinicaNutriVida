import { Link } from "react-router-dom";

function Navbar(){
    return(
        <>
            <nav className="navbar sm:navbar-expand bg-1 fg-2">
                <div className="container-fluid">
                    <img src="/img/Logo NutriVida.png" width={40}/>

                    <a className="navbar-brand" href="#">Nutrivida</a>

                    <button className="btn-icon navbar-toggler" type="button" data-bs-toggle="drawer" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" aria-hidden="true"></span>
                    </button>

                    <dialog className="drawer drawer-end" tabIndex={-1} id="navbarNavAltMarkup" aria-labelledby="navbarNavAltMarkupLabel">

                        <div className="drawer-header">
                            <h5 className="drawer-title" id="navbarNavAltMarkupLabel">Menu</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="drawer" aria-label="Close"></button>
                        </div>

                        <div className="drawer-body">
                            <div className="nav nav-pills navbar-nav">
                                <div className="nav nav-pills navbar-nav">
                                    <div className="nav-links-centro">
                                        <Link className="nav-link" to="/inicio">Inicio</Link>
                                        <Link className="nav-link" to="/servicios">Servicios</Link>
                                        <Link className="nav-link" to="/nosotros">Nosotros</Link>
                                        <Link className="nav-link" to="/blogs">Blogs</Link>
                                        <Link className="nav-link" to="/contacto">Contacto</Link>
                                    </div>

                                    <div className="nav-acciones">
                                        <Link className="nav-link login" to="/login">
                                        Iniciar Sesión
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dialog>
                </div>
            </nav>
        </>
    )
}

export default Navbar;