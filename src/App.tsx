import './App.css'
import { Route, Routes } from 'react-router-dom';
import Footer from './componentes/organismos/Footer'

import Navbar from './componentes/organismos/Navbar'
import Inicio from './paginas/Inicio'

function App() {

  return (
    <>
      <Navbar/>
        <Routes>
        <Route
          path="/"
          element={<Inicio/>}
        />
        </Routes>
      
      <Footer/>
    </>
  )
}

export default App
