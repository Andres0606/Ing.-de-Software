import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmprenderUCC from './Inicio/EmprendedoresUCC.jsx';
import InicioSesion from './Sesiones/InicioSesion.jsx';
import Registro from './Sesiones/Registro.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmprenderUCC />} />
        <Route path="/login" element={<InicioSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="*" element={<EmprenderUCC />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;