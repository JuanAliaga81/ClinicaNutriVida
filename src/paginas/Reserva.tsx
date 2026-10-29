import GestorReservas from "../componentes/organismos/GestorReservas";
import "./Reserva.css";

export default function Reserva() {
  return (
    <main className="pagina-reserva">
      <header className="reserva-encabezado">
        <div>
          <p className="reserva-etiqueta">NutriVida · Atención nutricional</p>
          <h1>Reserva tu hora</h1>
        </div>
        <p>Solicita una atención o administra tus solicitudes.</p>
      </header>

      <GestorReservas />
    </main>
  );
}
