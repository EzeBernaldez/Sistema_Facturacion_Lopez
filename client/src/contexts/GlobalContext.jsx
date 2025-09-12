import React, { Children } from "react";
import { useState,createContext,useContext, useReducer } from "react";
import {
    initialValueRepuestos,
    reducerRepuestos,
    actionRepuestos
} from '../utils/reducers/reducer_repuestos';


const Context = createContext();

export const ContextProvider = ({children}) => {

    const [pagina,setPagina] = useState('');

    const cargarPagina = (string) => setPagina(string);

    const [estadoRepuestos, dispatchRepuestos] = useReducer(
        reducerRepuestos,
        initialValueRepuestos
    );

    return <Context.Provider value={{
        pagina, 
        cargarPagina, 
        estadoRepuestos, 
        dispatchRepuestos,
        actionRepuestos,
    }}> {children}</Context.Provider>;
}

export const useContexto = () => useContext(Context);