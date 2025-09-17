import React from "react";
import { useAuth } from "../contexts/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import logoLopez from '../assets/icons/Logo_Lopez_Completo.png';
import { Image } from '@chakra-ui/react';
import { useNavigate, Link } from "react-router-dom";
import { useContexto } from "../contexts/GlobalContext";

const Header = () => {

    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const {
      pagina,
      cargarPagina: setPagina
     } = useContexto();

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary p-0" >
        <div className="container-fluid" style={{
        background: "#DCEAFF",
      }}>
          <a className="navbar-brand" onClick={() => {
            setPagina('Home');
            navigate("/");}}>
            <Image
              cursor='pointer'
                src={logoLopez}
                fit="cover"
                alt="Logo López Repuestos"
                width="120px"
                height="100%"
            />
          </a>
          { currentUser && pagina!== 'Home' && (
            <>
              <div className="position-absolute top-0 end-0 d-flex align-items-center gap-3 pe-2 pt-2">
                <button className="btn btn-secondary" aria-current="page" onClick={() => {
                    logout();
                    navigate('/');
                    }
                }>
                  Cerrar Sesión
                </button>
                  <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                  >
                  <span className="navbar-toggler-icon"></span>
                  </button>
              </div>
              <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" aria-current="page" to="/">
                        Factura
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/vehiculos">
                        Presupuesto
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/remitos">
                        Remito
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/repuestos">
                        Repuestos
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/clientes">
                        Clientes
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/proveedores">
                        Proveedores
                        </Link>
                    </li>
                  </ul>
              </div>              
            </>
          )}

          {!currentUser && (
            <>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <button className=" btn btn-primary" aria-current="page" onClick={() => navigate("/login")}>
                    Iniciar Sesión
                    </button>
                </li>
            </ul>
            </>
          )}

          {currentUser && pagina === 'Home' && (
              <div className="position-absolute top-0 end-0 d-flex align-items-center gap-3 pe-2 pt-2">
                  <button className="btn btn-secondary" aria-current="page" onClick={() => {
                      logout();
                      navigate('/');
                      }
                  }>
                    Cerrar Sesión
                  </button>
                </div>
          )}
        </div>
      </nav>
    </>
  );
};


export default Header;
