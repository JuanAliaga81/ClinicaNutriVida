import { Link } from 'react-router-dom';
import EquipoNutricionistas from '../componentes/organismos/EquipoNutricionistas';
import './Nosotros.css';

export default function Nosotros() {
  return (
    <main className="nosotros-pagina">
      <section className="nosotros-historia container" aria-labelledby="nosotros-titulo">
        <div className="nosotros-historia-imagen">
          <img src="/img/Edificio.jpg" alt="Edificio de la clínica NutriVida" />
        </div>
        <div className="nosotros-historia-texto">
          <p className="nosotros-etiqueta">Conoce NutriVida</p>
          <h1 id="nosotros-titulo">Sobre nosotros</h1>
          <h2>Nuestra historia</h2>
          <p>
            Clínica NutriVida nació en 2016 en Temuco para acercar la asesoría
            nutricional profesional a la comunidad de La Araucanía.
          </p>
          <p>
            Acompañamos a cada persona con planes de alimentación personalizados
            y atención cercana. Hoy contamos con cuatro nutricionistas de distintas
            especialidades y atendemos, en promedio, a 60 pacientes por semana.
          </p>
          <Link className="nosotros-enlace" to="/servicios">Conoce nuestros servicios</Link>
        </div>
      </section>

      <EquipoNutricionistas />
    </main>
  );
}
