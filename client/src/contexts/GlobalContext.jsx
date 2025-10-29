import React, { Children } from "react";
import { useState,createContext,useContext, useReducer } from "react";
import {
    initialValueRepuestos,
    reducerRepuestos,
    actionRepuestos
} from '../utils/reducers/reducer_repuestos';
import { initialValueClientes,reducerClientes,actionClientes } from "../utils/reducers/reducer_clientes";
import { actionProveedores, initialValueProveedores, reducerProveedores } from "../utils/reducers/reducer_proveedores";
import { actionEmpleados, initialValueEmpleados, reducerEmpleados } from "../utils/reducers/reducer_empleados";
import { actionRemitoProveedores, initialValueRemitoProveedores, reducerRemitoProveedores } from "../utils/reducers/reducer_remitos_proveedores";
import { actionVehiculos, initialValueVehiculos, reducerVehiculos } from "../utils/reducers/reducer_vehiculos";
import { actionFacturas, initialValueFacturas, reducerFacturas } from "../utils/reducers/reducer_facturas";


const Context = createContext();

export const ContextProvider = ({children}) => {

    const [pagina,setPagina] = useState('');

    const cargarPagina = (string) => setPagina(string);

    const [estadoRepuestos, dispatchRepuestos] = useReducer(
        reducerRepuestos,
        initialValueRepuestos
    );

    const [estadoClientes, dispatchClientes] = useReducer(
        reducerClientes,
        initialValueClientes
    );

    const [estadoProveedores, dispatchProveedores] = useReducer(
        reducerProveedores,
        initialValueProveedores,
    );

    const [estadoEmpleados, dispatchEmpleados] = useReducer(
        reducerEmpleados,
        initialValueEmpleados
    )

    const [estadoVehiculos, dispatchVehiculos] = useReducer(
        reducerVehiculos,
        initialValueVehiculos
    )

    const [estadoRemitoProveedores, dispatchRemitoProveedores] = useReducer(
        reducerRemitoProveedores,
        initialValueRemitoProveedores
    )

    const [estadoFacturas, dispatchFacturas] = useReducer(
        reducerFacturas,
        initialValueFacturas
    )

    return <Context.Provider value={{
        pagina, 
        cargarPagina, 
        estadoRepuestos, 
        dispatchRepuestos,
        actionRepuestos,
        estadoClientes, 
        dispatchClientes,
        actionClientes,
        estadoProveedores,
        dispatchProveedores,
        actionProveedores,
        estadoEmpleados,
        dispatchEmpleados,
        actionEmpleados,
        estadoRemitoProveedores,
        dispatchRemitoProveedores,
        actionRemitoProveedores,
        actionVehiculos,
        dispatchVehiculos,
        estadoVehiculos,
        actionFacturas,
        dispatchFacturas,
        estadoFacturas,
    }}> {children}</Context.Provider>;
}

export const useContexto = () => useContext(Context);