import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom';
import Footer from './componentes/organismos/Footer'
import Navbar from './componentes/organismos/Navbar'
import Inicio from './paginas/Inicio'
import Servicios from './paginas/Servicios'
import DetalleServicio from './paginas/DetalleServicio'
import Nosotros from './paginas/Nosotros'
import Reserva from './paginas/Reserva'
import Blogs from './paginas/Blogs'
import Contacto from './paginas/Contacto'
import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Perfil from './paginas/Perfil'
import Citas from './paginas/Citas'
import Agendar from './paginas/Agendar'
import Confirmacion from './paginas/Confirmacion'
import Administracion from './paginas/Administracion'

function App() {
  return <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Navigate to="/inicio" replace />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/servicios/:codigo" element={<DetalleServicio />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/admin" element={<Administracion />} />
      <Route path="/agendar" element={<Agendar />} />
      <Route path="/citas" element={<Citas />} />
      <Route path="/confirmacion" element={<Confirmacion />} />
      <Route path="/reserva" element={<Reserva />} />
      <Route path="*" element={<main className="container py-5"><h1>Página no encontrada</h1><p>Usa el menú para volver a NutriVida.</p></main>} />
    </Routes>
    <Footer />
  </>
}

export default App
