import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmprenderUCC from './Inicio/EmprendedoresUCC.jsx';
import Emprendedores from './Sesiones/Emprendedores.jsx';
import Productos from './Sesiones/Productos.jsx';
import EventosUCC from './Sesiones/Eventos.jsx';
import Contacto from './Sesiones/Contacto.jsx';
import InicioSesion from './Sesiones/InicioSesion.jsx';
import Registro from './Sesiones/Registro.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmprenderUCC />} />
        <Route path="/emprendedores" element={<Emprendedores />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/eventos" element={<EventosUCC />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<InicioSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="*" element={<EmprenderUCC />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;