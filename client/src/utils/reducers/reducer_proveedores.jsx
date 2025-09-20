export const actionProveedores = {
    SETARRAYPROVEEDORES: 0,
    SETCODIGOPROVEEDORES: 1,
    SETCORREO: 2,
    SETNOMBRE: 3,
    SETDIRECCION: 4,
    SETTELEFENOS: 5,
    REINICIARVALORES: 6,
} 



export const initialValueProveedores = {
    arrayProveedores: [],
    codigo_proveedores: '',
    correo: '',
    nombre: '',
    direccion: '',
    telefonos: [],
}



export const reducerProveedores = (estado,action) => {

    const { payload, type } = action;

    switch(type){
        case (actionProveedores.SETCODIGOPROVEEDORES): {
            return ( {...estado, codigo_proveedores: payload});
        }
        case (actionProveedores.SETCORREO): {
            return (  {...estado, correo: payload} )
        }
        case (actionProveedores.SETNOMBRE): {
            return ( {...estado, nombre: payload} );
        }
        case (actionProveedores.SETDIRECCION): {
            return ( {...estado, direccion:payload} );
        }
        case (actionProveedores.SETTELEFENOS): {
            return ( {...estado, telefonos: payload} );
        }
        case (actionProveedores.SETARRAYPROVEEDORES): {
            return ( {...estado, arrayProveedores: payload} );
        }
        case (actionProveedores.REINICIARVALORES): {
            return ( initialValueProveedores );
        }
        }
    }
