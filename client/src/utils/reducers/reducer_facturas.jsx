export const actionFacturas = {
    SETARRAYFACTURAS: 8,
    SETNROFACTURA: 0,
    SETTOTAL: 1,
    SETFECHA: 2,
    SETMETODOPAGO: 3,
    SETEMPLEADO: 4,
    SETREPUESTOS: 5,
    SETCLIENTES: 6,
    REINICIARVALORES: 7,
} 



export const initialValueFacturas = {
    arrayFacturas: [],
    nro_factura: '',
    total: 0,
    fecha: '',
    metodo_pago: '',
    empleado: '',
    repuestos: [],
}



export const reducerFacturas = (estado,action) => {

    const { payload, type } = action;

    switch(type){
        case (actionFacturas.SETNROFACTURA): {
            return ( {...estado, nro_factura: payload});
        }
        case (actionFacturas.SETARRAYFACTURAS): {
            return (  {...estado, arrayFacturas: payload} )
        }
        case (actionFacturas.SETTOTAL): {
            return ( {...estado, total: payload} );
        }
        case (actionFacturas.SETFECHA): {
            return ( {...estado,fecha:payload} );
        }
        case (actionFacturas.SETMETODOPAGO): {
            return ( {...estado, metodo_pago: payload} );
        }
        case (actionFacturas.SETEMPLEADO): {
            return ( {...estado, empleado:payload} );
        }
        case (actionFacturas.SETREPUESTOS): {
            return ( {...estado, repuestos: payload} );
        }
        case (actionFacturas.REINICIARVALORES): {
            return ( initialValueFacturas );
        }
        }
    }
