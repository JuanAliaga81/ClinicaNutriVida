type BusquedaServiciosProps = {
  valor: string;
  alCambiar: (valor: string) => void;
};

export default function BusquedaServicios({
  valor,
  alCambiar,
}: BusquedaServiciosProps) {
  return (
    <div>
      <label className="form-label" htmlFor="buscar-servicio">
        Buscar servicio
      </label>

      <input
        id="buscar-servicio"
        className="form-control"
        type="search"
        value={valor}
        onChange={(evento) => alCambiar(evento.target.value)}
        placeholder="Nombre, código o descripción"
      />
    </div>
  );
}
