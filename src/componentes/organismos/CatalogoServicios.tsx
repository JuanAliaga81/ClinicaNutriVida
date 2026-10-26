import { useEffect, useState } from 'react';
import BusquedaServicios from '../atomos/BusquedaServicios';
import CardCatalogoServicio from '../moleculas/CardCatalogoServicio';
import { listarServicios, type Servicio } from '../../datos/catalogo';
import './CatalogoServicios.css';

export default function CatalogoServicios() {
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [servicios, setServicios] = useState<Servicio[]>(() => listarServicios());

  useEffect(() => {
    const actualizar = () => setServicios(listarServicios());
    window.addEventListener('nutrivida-servicios', actualizar);
    window.addEventListener('storage', actualizar);
    return () => {
      window.removeEventListener('nutrivida-servicios', actualizar);
      window.removeEventListener('storage', actualizar);
    };
  }, []);

  const tipos = ['Todos', ...new Set(servicios.map((servicio) => servicio.tipo))];
  const visibles = servicios.filter((servicio) => {
    const coincideTipo = tipo === 'Todos' || servicio.tipo === tipo;
    const texto = `${servicio.codigo} ${servicio.nombre} ${servicio.descripcion}`.toLocaleLowerCase('es-CL');
    return coincideTipo && texto.includes(busqueda.trim().toLocaleLowerCase('es-CL'));
  });

  return (
    <section className="catalogo-servicios" aria-label="Catálogo de servicios">
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-8"><BusquedaServicios valor={busqueda} alCambiar={setBusqueda} /></div>
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="tipo-servicio">Tipo de servicio</label>
          <select id="tipo-servicio" className="form-select" value={tipo} onChange={(evento) => setTipo(evento.target.value)}>
            {tipos.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
          </select>
        </div>
      </div>
      <p role="status">{visibles.length} {visibles.length === 1 ? 'servicio encontrado' : 'servicios encontrados'}</p>
      {visibles.length === 0 ? <p>No hay servicios que coincidan con tu búsqueda.</p> : (
        <div className="row g-3">{visibles.map((servicio) => <CardCatalogoServicio key={servicio.codigo} servicio={servicio} />)}</div>
      )}
    </section>
  );
}
