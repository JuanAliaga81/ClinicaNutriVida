import { describe, expect, it } from 'vitest';
import { crearRepositorioCitas, type NuevaCita } from './citas';

const ejemplo: NuevaCita = {
  paciente: 'Juana Pérez',
  correo: 'juana@example.com',
  nutricionista: 'Nut. Carolina Fuentes M.',
  fecha: '2026-11-20',
  hora: '10:30',
  motivo: 'Evaluación nutricional inicial',
};

describe('repositorio simulado de citas', () => {
  it('lee las solicitudes iniciales', () => {
    expect(crearRepositorioCitas().listar()).toHaveLength(2);
  });

  it('devuelve una copia de la lista para proteger sus datos', () => {
    const repo = crearRepositorioCitas();
    const lista = repo.listar();
    lista.pop();
    expect(repo.listar()).toHaveLength(2);
  });

  it('crea una solicitud con identificador y estado inicial', () => {
    const repo = crearRepositorioCitas([]);
    const creada = repo.crear(ejemplo);
    expect(creada.id).toBe('CIT-001');
    expect(creada.estado).toBe('Solicitada');
    expect(repo.listar()).toHaveLength(1);
  });

  it('crea identificadores consecutivos', () => {
    const repo = crearRepositorioCitas([]);
    repo.crear(ejemplo);
    expect(repo.crear(ejemplo).id).toBe('CIT-002');
  });

  it('actualiza una solicitud existente', () => {
    const repo = crearRepositorioCitas([]);
    const creada = repo.crear(ejemplo);
    const cambios = { ...ejemplo, motivo: 'Control nutricional mensual' };
    expect(repo.actualizar(creada.id, cambios)?.motivo).toBe(cambios.motivo);
  });

  it('informa cuando intenta actualizar un identificador inexistente', () => {
    expect(crearRepositorioCitas([]).actualizar('NO-EXISTE', ejemplo)).toBeNull();
  });

  it('elimina una solicitud existente', () => {
    const repo = crearRepositorioCitas([]);
    const creada = repo.crear(ejemplo);
    expect(repo.eliminar(creada.id)).toBe(true);
    expect(repo.listar()).toHaveLength(0);
  });

  it('informa cuando intenta eliminar un identificador inexistente', () => {
    expect(crearRepositorioCitas([]).eliminar('NO-EXISTE')).toBe(false);
  });
});
