import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Repuestos from './pages/Repuestos/index';
import RepuestosPost from './pages/Repuestos/RepuestosPost';
import RepuestosPatch from './pages/Repuestos/RepuestosPatch';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Clientes from './pages/Clientes/index'
import ClientesPost from './pages/Clientes/ClientesPost'


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
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/nuevo" element={<ClientesPost />} />

          </Routes>
        </div>
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
      </Router>
  );
}

export default App;