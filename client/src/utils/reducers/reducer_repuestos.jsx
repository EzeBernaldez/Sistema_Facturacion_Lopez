export const actionRepuestos = {
    SETARRAYREPUESTOS: 8,
    SETCODIGO: 0,
    SETDESCRIPCION: 1,
    SETMARCA: 2,
    SETPRECIOVENTA: 3,
    SETSTOCK: 4,
    SETTIPO: 5,
    SETPORCENTAJERECARGO: 6,
    REINICIARVALORES: 7,
} 



export const initialValueRepuestos = {
    arrayRepuestos: [],
    codigo: '',
    descripcion: '',
    marca: '',
    precio_venta: '',
    stock: 0,
    tipo: '',
    porcentaje_recargo: 0,
}



export const reducerRepuestos = (estado,action) => {

    const { payload, type } = action;

    switch(type){
        case (actionRepuestos.SETCODIGO): {
            return ( {...estado, codigo: payload});
        }
        case (actionRepuestos.SETARRAYREPUESTOS): {
            return (  {...estado, arrayRepuestos: payload} )
        }
        case (actionRepuestos.SETDESCRIPCION): {
            return ( {...estado, descripcion: payload} );
        }
        case (actionRepuestos.SETMARCA): {
            return ( {...estado,marca:payload} );
        }
        case (actionRepuestos.SETPRECIOVENTA): {
            return ( {...estado, precio_venta: payload} );
        }
        case (actionRepuestos.SETSTOCK): {
            return ( {...estado, stock:payload} );
        }
        case (actionRepuestos.SETTIPO): {
            return ( {...estado, tipo: payload} );
        }
        case (actionRepuestos.SETPORCENTAJERECARGO): {
            return ( {...estado, porcentaje_recargo: payload} );
        }
        case (actionRepuestos.REINICIARVALORES): {
            return ( initialValueRepuestos );
        }
        }
    }
