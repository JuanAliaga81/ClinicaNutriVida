type CardServiciosProps = {
  titulo: string;
  precio: string;
  imagen: string;
  alt: string;
};

function CardServicios({ titulo, precio, imagen, alt }: CardServiciosProps) {
  return (
    <div className="card-servicio-col">
      <div className="card h-100 shadow-sm">
        <img src={imagen} className="card-img-top" alt={alt} />

        <div className="card-body text-center">
          <h5 className="card-title">{titulo}</h5>
          <p className="card-text fw-bold text-success">{precio}</p>
        </div>
      </div>
    </div>
  );
}

export default CardServicios;