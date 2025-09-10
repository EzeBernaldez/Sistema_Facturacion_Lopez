import React, { Children } from "react";
import { useState,createContext,useContext } from "react";


const Context = createContext();

export const ContextProvider = ({children}) => {

    const [pagina,setPagina] = useState('');

    const cambiarPagina = (string) => setPagina(string);

    return <Context.Provider value={{pagina, cambiarPagina}}> {children}</Context.Provider>;
}

export const useContexto = () => useContext(Context);