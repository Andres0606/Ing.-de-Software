import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import EmprenderUCC from './src/Components/Inicio/EmprendedoresUCC.jsx';
import Emprendedores from './src/Components/Inicio/Emprendedores.jsx';
import Productos from './src/Components/Inicio/Productos.jsx';
import EventosUCC from './src/Components/Inicio/Eventos.jsx';
import Contacto from './src/Components/Inicio/Contacto.jsx';

import InicioSesion from './src/Components/Sesiones/InicioSesion.jsx';
import Registro from './src/Components/Sesiones/Registro.jsx';
import Perfil from './src/Components/Perfil/Perfil.jsx';

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
  <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<EmprenderUCC />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
