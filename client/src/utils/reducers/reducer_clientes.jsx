export const actionClientes = {
    SETARRAYCLIENTES: 8,
    SETCODIGO: 0,
    SETCORREO: 1,
    SETCONDICIONIVA: 2,
    SETNOMBRE: 3,
    SETRAZONSOCIAL: 4,
    SETTELEFENOS: 5,
    SETCUIT: 6,
    SETDIRECCION: 7,
    REINICIARVALORES: 8,
} 



export const initialValueClientes = {
    arrayClientes: [],
    codigo: '',
    correo: '',
    condicion_iva: '',
    nombre: '',
    razon_social: '',
    telefonos_clientes: [],
    cuit: '',
    direccion: '',
}



export const reducerClientes = (estado,action) => {

    const { payload, type } = action;

    switch(type){
        case (actionClientes.SETCODIGO): {
            return ( {...estado, codigo: payload});
        }
        case (actionClientes.SETARRAYCLIENTES): {
            return (  {...estado, arrayClientes: payload} )
        }
        case (actionClientes.SETCORREO): {
            return ( {...estado, correo: payload} );
        }
        case (actionClientes.SETCONDICIONIVA): {
            return ( {...estado,condicion_iva:payload} );
        }
        case (actionClientes.SETNOMBRE): {
            return ( {...estado, nombre: payload} );
        }
        case (actionClientes.SETRAZONSOCIAL): {
            return ( {...estado, razon_social:payload} );
        }
        case (actionClientes.SETTELEFENOS): {
            return ( {...estado, telefonos: payload} );
        }
        case (actionClientes.SETCUIT): {
            return ( {...estado, cuit: payload} );
        }
        case (actionClientes.SETDIRECCION): {
            return ( {...estado, direccion: payload} );
        }
        case (actionClientes.REINICIARVALORES): {
            return ( initialValueClientes );
        }
        }
    }
