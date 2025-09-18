import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Repuestos from './pages/Repuestos/index';
import RepuestosPost from './pages/Repuestos/RepuestosPost';
import RepuestosPatch from './pages/Repuestos/RepuestosPatch';
import './App.css';

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/repuestos" element={<Repuestos />}/>
            <Route path='/repuestos/nuevo' element={<RepuestosPost />} />
            <Route path='/repuestos/actualizar/:codigo' element={<RepuestosPatch />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;