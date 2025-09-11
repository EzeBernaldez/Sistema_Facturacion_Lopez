import React from "react";
import { useAuth } from "../contexts/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import logoLopez from '../assets/icons/Logo_Lopez_Completo.png';
import { Image } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { useContexto } from "../contexts/GlobalContext";

export const Header = () => {

    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const {
      pagina,
     } = useContexto();

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary p-0" >
        <div className="container-fluid" style={{
        background: "#DCEAFF",
      }}>
          <a className="navbar-brand" href="#">
            <Image
                src={logoLopez}
                fit="cover"
                alt="Logo López Repuestos"
                width="120px"
                height="100%"
            />
          </a>
          { currentUser && pagina !== 'Home' && (
            <>
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
            <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
                <ul className="navbar-nav ">
                  <li className="nav-item">
                      <a className="nav-link " aria-current="page" href="#">
                      Factura
                      </a>
                  </li>
                  <li className="nav-item">
                      <a className="nav-link" href="#">
                      Presupuesto
                      </a>
                  </li>
                  <li className="nav-item">
                      <a className="nav-link" href="#">
                      Remito
                      </a>
                  </li>
                  <li className="nav-item">
                      <a className="nav-link" href="#">
                      Repuestos
                      </a>
                  </li>
                  <li className="nav-item">
                      <a className="nav-link" href="#">
                      Clientes
                      </a>
                  </li>
                  <li className="nav-item">
                      <a className="nav-link" aria-disabled="true">
                      Proveedores
                      </a>
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

          {currentUser && (
            <>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <button className=" btn btn-secondary" aria-current="page" onClick={() => {
                        logout();
                      }
                    }>
                    Cerrar Sesión
                    </button>
                </li>
            </ul>
            </>
          )}
        </div>
      </nav>
    </>
  );
};
