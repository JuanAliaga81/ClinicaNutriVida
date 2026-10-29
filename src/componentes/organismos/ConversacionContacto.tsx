import type { MensajeConversacion } from '../../datos/mensajesContacto';
import AreaTexto from '../atomos/AreaTexto';

type ConversacionContactoProps = {
  id: string;
  entradas: MensajeConversacion[];
  nombreUsuario: string;
  respuesta: string;
  alCambiar: (valor: string) => void;
  onEnviar: () => void;
  esAdministrador?: boolean;
};

export default function ConversacionContacto({
  id, entradas, nombreUsuario, respuesta, alCambiar, onEnviar, esAdministrador = false,
}: ConversacionContactoProps) {
  const campoId = `respuesta-${id}`;
  return (
    <>
      <div className="chat-conversacion" aria-label={`Conversación con ${esAdministrador ? nombreUsuario : 'NutriVida'}`}>
        {entradas.map((entrada) => (
          <div className={`chat-fila chat-${entrada.autor}`} key={entrada.id}>
            <div className="chat-burbuja">
              <span>{entrada.autor === 'admin' ? 'NutriVida' : nombreUsuario}</span>
              <p>{entrada.texto}</p>
              <time>{entrada.fecha}</time>
            </div>
          </div>
        ))}
      </div>
      <form className="chat-responder" onSubmit={(evento) => { evento.preventDefault(); onEnviar(); }}>
        <label className="visually-hidden" htmlFor={campoId}>Responder en esta conversación</label>
        <AreaTexto id={campoId} rows={2} maxLength={1000} placeholder="Escribe una respuesta..."
          value={respuesta} onChange={(evento) => alCambiar(evento.target.value)} />
        <button className={esAdministrador ? 'admin-crear' : 'btn btn-success'} type="submit" disabled={!respuesta.trim()}>
          {esAdministrador ? 'Enviar respuesta' : 'Enviar'}
        </button>
      </form>
    </>
  );
}
