import AvatarNutricionista from '../atomos/AvatarNutricionista';

export type Nutricionista = {
  id: string;
  nombre: string;
  especialidad: string;
  dias: string;
  horario: string;
};

export default function TarjetaNutricionista({ profesional }: { profesional: Nutricionista }) {
  return (
    <article className="nosotros-tarjeta">
      <AvatarNutricionista nombre={profesional.nombre} />
      <h3>{profesional.nombre}</h3>
      <p className="nosotros-especialidad">{profesional.especialidad}</p>
      <p className="nosotros-horario">
        <strong>Atención:</strong> {profesional.dias}<br />
        {profesional.horario}
      </p>
    </article>
  );
}
