type AvatarNutricionistaProps = {
  nombre: string;
};

export default function AvatarNutricionista({ nombre }: AvatarNutricionistaProps) {
  const iniciales = nombre
    .replace(/^Nut\.\s*/, '')
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('');

  return <span className="nosotros-avatar" aria-hidden="true">{iniciales}</span>;
}
