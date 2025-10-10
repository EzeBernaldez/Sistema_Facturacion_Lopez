export const actionRemitoProveedores = {
    SETARRAYREMITOPROVEEDORES: 0,
    SETNUMEROREMITOPROVEEDORES: 1,
    SETFECHA: 2,
    SETMONTOTOTAL: 3,
    SETPAGADO: 4,
    SETPROVEEDOR: 5,
    SETREPUESTOS: 6,
    REINICIARVALORES: 7,
    SETREMITOPROVEEDORES: 8,
} 



export const initialValueRemitoProveedores = {
    arrayRemitoProveedores: [],
    nro_remito: '',
    fecha: '',
    monto_total: 0,
    pagado: '',
    proveedor: '',
    repuestos: [],
}



export const reducerRemitoProveedores = (estado,action) => {

    const { payload, type } = action;

    switch(type){
        case (actionRemitoProveedores.SETARRAYREMITOPROVEEDORES): {
            return ( {...estado, arrayRemitoProveedores: payload});
        }
        case (actionRemitoProveedores.SETREMITOPROVEEDORES): {
                    return ( 
                        {
                            ...estado,
                            ...payload
                    })
                }
        case (actionRemitoProveedores.SETNUMEROREMITOPROVEEDORES): {
            return (  {...estado, nro_remito: payload} )
        }
        case (actionRemitoProveedores.SETFECHA): {
            return ( {...estado, fecha: payload} );
        }
        case (actionRemitoProveedores.SETMONTOTOTAL): {
            return ( {...estado, monto_total:payload} );
        }
        case (actionRemitoProveedores.SETPAGADO): {
            return ( {...estado, pagado: payload} );
        }
        case (actionRemitoProveedores.SETPROVEEDOR): {
            return ( {...estado, proveedor: payload} );
        }
        case (actionRemitoProveedores.SETREPUESTOS): {
            return ( {...estado, repuestos: payload} );
        }
        case (actionRemitoProveedores.REINICIARVALORES): {
            return ( initialValueRemitoProveedores );
        }
        }
    }
