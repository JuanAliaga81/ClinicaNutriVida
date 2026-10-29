import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

interface Slide {
  imagen: string;
  titulo: string;
  descripcion: string;
}

const slides: Slide[] = [
  {
    imagen: '/img/Edificio.jpg',
    titulo: 'Establecimiento',
    descripcion: 'Centros totalmente equipados con la maxima comodidad para nuestros clientes.',
  },
  {
    imagen: '/img/Doctor.jpg',
    titulo: 'Atencion Moderna',
    descripcion: 'Agenda tu hora de forma fácil desde tu celular.',
  },
  {
    imagen: '/img/Resultados_Reales.jpg',
    titulo: 'Resultados reales',
    descripcion: 'Mejora tu bienestar con hábitos sostenibles.',
  },
];

const INTERVALO = 4000;

function Carrusel() {
  const [actual, setActual] = useState(0);

  const siguiente = () => setActual((i) => (i + 1) % slides.length);
  const anterior = () => setActual((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setTimeout(siguiente, INTERVALO);
    return () => clearTimeout(timer);
  }, [actual]);

  return (
    <div style={margenExterior}>
      <div style={contenedor}>
        {slides.map((slide, index) => (
          <div
            key={index}
            aria-hidden={index !== actual}
            style={{
              ...capa,
              opacity: index === actual ? 1 : 0,
              zIndex: index === actual ? 1 : 0,
            }}
          >
            <img src={slide.imagen} alt={slide.titulo} style={imagenEstilo} />
            <div style={caption}>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{slide.titulo}</h3>
              <p style={{ margin: '0.4rem 0 0' }}>{slide.descripcion}</p>
            </div>
          </div>
        ))}

        <button onClick={anterior} style={flecha('left')} aria-label="Anterior">
          ‹
        </button>
        <button onClick={siguiente} style={flecha('right')} aria-label="Siguiente">
          ›
        </button>

        <div style={puntos}>
          {slides.map((_, index) => (
            <button
              type="button"
              aria-label={`Ver diapositiva ${index + 1}`}
              aria-pressed={index === actual}
              key={index}
              onClick={() => setActual(index)}
              style={{
                border: 0,
                padding: 0,
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                cursor: 'pointer',
                background: index === actual ? 'white' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Margen alrededor del carrusel (arriba, abajo y a los lados)
const margenExterior: CSSProperties = {
  padding: '24px 16px',
};

const contenedor: CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: '1450px', // ancho máximo, ajústalo a gusto
  height: 'clamp(300px, 52vw, 500px)', // alto del carrusel
  margin: '0 auto', // lo centra
  overflow: 'hidden',
  borderRadius: '16px',
  background: '#000',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
};

const capa: CSSProperties = {
  position: 'absolute',
  inset: 0,
  transition: 'opacity 0.8s ease',
};

const imagenEstilo: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center', // prueba 'center top' si se corta algo importante
  display: 'block',
};

const caption: CSSProperties = {
  position: 'absolute',
  bottom: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  padding: '0.6rem 1.2rem',
  fontSize: '0.9rem',
  borderRadius: '8px',
  textAlign: 'center',
  width: '85%',
  maxWidth: '640px',
};

const puntos: CSSProperties = {
  position: 'absolute',
  bottom: '12px',
  left: 0,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  zIndex: 2,
};

const flecha = (lado: 'left' | 'right'): CSSProperties => ({
  position: 'absolute',
  top: '50%',
  [lado]: '16px',
  transform: 'translateY(-50%)',
  zIndex: 2,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  boxSizing: 'border-box',
  background: 'rgba(0,0,0,0.4)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '44px',
  height: '44px',
  fontSize: '30px',
  lineHeight: 1,
  textAlign: 'center',
  cursor: 'pointer',
});

export default Carrusel;
