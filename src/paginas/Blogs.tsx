import './PaginasExtra.css';

const articulos = [
  { titulo: 'Los beneficios de un buen desayuno', imagen: '/img/Beneficios.jfif', alt: 'Desayuno saludable', texto: 'Un desayuno equilibrado aporta energía y puede ayudarte a comenzar el día con mayor concentración. Incluye alimentos variados, como fruta, cereales integrales y una fuente de proteína.' },
  { titulo: '5 mitos comunes sobre las dietas', imagen: '/img/Imagen2.jfif', alt: 'Alimentos saludables', texto: 'No existe una única dieta adecuada para todas las personas. La alimentación debe adaptarse a tus necesidades y objetivos, con orientación profesional y hábitos sostenibles.' },
];

export default function Blogs() {
  return <main className="pagina-extra container py-5">
    <header className="text-center mb-5"><p className="extra-eyebrow">Nutrición y bienestar</p><h1>Consejos para una vida saludable</h1><p className="lead">Artículos y recomendaciones del equipo NutriVida.</p></header>
    <div className="row g-4">{articulos.map((articulo) => <article className="col-12 col-md-6" key={articulo.titulo}>
      <div className="card h-100 shadow-sm"><img className="card-img-top extra-blog-img" src={articulo.imagen} alt={articulo.alt} /><div className="card-body"><h2 className="h4">{articulo.titulo}</h2><p>{articulo.texto}</p></div></div>
    </article>)}</div>
  </main>;
}
