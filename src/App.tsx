import './App.css'
import { Route, Routes } from 'react-router-dom';
import Footer from './componentes/organismos/Footer'
import Navbar from './componentes/organismos/Navbar'
import Inicio from './paginas/Inicio'
import Servicios from './paginas/Servicios'
import Nosotros from './paginas/Nosotros'

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/Inicio" element={<Inicio/>}/>
        <Route path="/Servicios" element={<Servicios/>}/>
        <Route path="/Nosotros" element={<Nosotros/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default App