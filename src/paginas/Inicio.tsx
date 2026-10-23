import { Link } from 'react-router-dom';
import CardServicios from '../componentes/moleculas/CardServicios';
import Carrusel from '../componentes/organismos/Carrusel';

function Inicio() {
  return (
    <>
      <Carrusel />

      <h1>Nuestros Servicios</h1>

      <Link to="/reserva">
        <h2 className='reserva'>Reserva ahora</h2>
      </Link>


      <div className="container py-4 inicio">
        <div className="row g-3">
          <CardServicios
            titulo="Primera Consulta"
            precio="$35.000"
            imagen="/img/Doctor.jpg"
            alt="Primera consulta nutricional"
          />

          <CardServicios
            titulo="Control Nutricional"
            precio="$25.000"
            imagen="/img/PlanPerdida.png"
            alt="Control nutricional"
          />
          <CardServicios
            titulo="Control Nutricional"
            precio="$25.000"
            imagen="/img/Ejercicio.png"
            alt="Control nutricional"
          />
          <CardServicios
            titulo="Control Nutricional"
            precio="$25.000"
            imagen="/img/Taller.png"
            alt="Control nutricional"
          />
        </div>
      </div>
    </>
  );
}

export default Inicio;