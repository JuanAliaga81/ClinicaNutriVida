import TarjetaNutricionista, { type Nutricionista } from '../moleculas/TarjetaNutricionista';

const nutricionistas: Nutricionista[] = [
  {
    id: 'NUT001',
    nombre: 'Nut. Carolina Fuentes M.',
    especialidad: 'Obesidad y síndrome metabólico',
    dias: 'Lunes, miércoles y viernes',
    horario: '09:00 a 17:00',
  },
  {
    id: 'NUT002',
    nombre: 'Nut. Rodrigo Sepúlveda A.',
    especialidad: 'Nutrición deportiva y rendimiento',
    dias: 'Martes, jueves y sábado',
    horario: '09:00 a 14:00',
  },
  {
    id: 'NUT003',
    nombre: 'Nut. Daniela Morales C.',
    especialidad: 'Alimentación vegetariana, vegana y trastornos alimentarios',
    dias: 'Lunes a viernes',
    horario: '08:00 a 13:00',
  },
  {
    id: 'NUT004',
    nombre: 'Nut. Felipe Araya R.',
    especialidad: 'Nutrición pediátrica y familiar',
    dias: 'Martes a viernes',
    horario: '14:00 a 19:00',
  },
];

export default function EquipoNutricionistas() {
  return (
    <section className="nosotros-equipo" aria-labelledby="equipo-titulo">
      <div className="container">
        <p className="nosotros-etiqueta">Profesionales que te acompañan</p>
        <h2 id="equipo-titulo">Nuestro equipo</h2>
        <p className="nosotros-equipo-intro">
          Conoce las áreas de atención y los horarios de nuestros nutricionistas.
        </p>
        <div className="nosotros-grilla">
          {nutricionistas.map((profesional) => (
            <TarjetaNutricionista key={profesional.id} profesional={profesional} />
          ))}
        </div>
      </div>
    </section>
  );
}
