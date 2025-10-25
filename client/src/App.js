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
import Clientes from './pages/Clientes/index';
import ClientesPost from './pages/Clientes/ClientesPost';
import Proveedores from './pages/Proveedores/index';
import ProveedoresPost from './pages/Proveedores/ProveedoresPost';
import ClientesPatch from './pages/Clientes/ClientesPatch'; 
import ProveedoresPatch from './pages/Proveedores/ProveedoresPatch';
import Empleados from './pages/Empleados';
import EmpleadosPost from './pages/Empleados/EmpleadosPost';
import EmpleadosPatch from './pages/Empleados/EmpleadosPatch';
import EmpleadosSeleccionar from './pages/Empleados/EmpleadosSelect';
import ProveedoresSeleccionar from './pages/Proveedores/ProveedoresSelect';
import RemitoProveedores from './pages/RemitosProveedores/index';
import RemitoProveedoresPost from './pages/RemitosProveedores/RemitoPost';
import RepuestosSeleccionar from './pages/Repuestos/RepuestosSelect';
import Vehiculos from "./pages/Vehiculos/index"
import CamionPost from './pages/Vehiculos/CamionPost';
import SemirremolquePost from './pages/Vehiculos/SemirremolquePost';
import CamionPatch from './pages/Vehiculos/CamionPatch';
import SemirremolquePatch from './pages/Vehiculos/SemirremolquePatch';


function App() {
  return (
      <Router basename='/'>
        <div className="App" style={{
          backgroundColor: "#E8F1FF",
          height: '100vh'
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/repuestos" element={<Repuestos />}/>
            <Route path='/repuestos/nuevo' element={<RepuestosPost />} />
            <Route path='/repuestos/actualizar/:codigo' element={<RepuestosPatch />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/nuevo" element={<ClientesPost />} />
            <Route path='/clientes/actualizar/:codigo' element={<ClientesPatch />} />
            <Route path='/proveedores' element={<Proveedores />} />
            <Route path='/proveedores/nuevo' element={<ProveedoresPost />} />
            <Route path='/proveedores/actualizar/:codigo' element={<ProveedoresPatch />} />
            <Route path='/empleados' element={<Empleados />} />
            <Route path='/empleados/nuevo' element={<EmpleadosPost />} />
            <Route path='/empleados/actualizar/:dni' element={<EmpleadosPatch />} />
            <Route path=':tipo/:accion?/:codigo?/proveedores/seleccionar/:index?' element={<ProveedoresSeleccionar />} />
            <Route path=':tipo/:accion?/:codigo?/empleados/seleccionar/:index?' element={<EmpleadosSeleccionar />} />
            <Route path=':tipo/:accion?/:codigo?/repuestos/seleccionar/:proveedor?/:index?' element={<RepuestosSeleccionar />} />
            <Route path='/remito_proveedores' element={<RemitoProveedores />} />
            <Route path='/remito_proveedores/nuevo' element={<RemitoProveedoresPost />} />
            <Route path='/vehiculos' element={<Vehiculos />}/>
            <Route path='/vehiculos/camion_nuevo' element={<CamionPost />}/>
            <Route path='/vehiculos/semirremolque_nuevo' element={<SemirremolquePost />}/>
            <Route path='/vehiculos/actualizar/camion/:codigo' element={<CamionPatch />}/>
            <Route path='/vehiculos/actualizar/semirremolque/:codigo' element={<SemirremolquePatch />}/>

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