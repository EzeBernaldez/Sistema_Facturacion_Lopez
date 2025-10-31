export const actionFacturas = {
    SETARRAYFACTURAS: 0,
    SETFACTURA: 1,
    REINICIARVALORES: 2,
} 



export const initialValueFacturas = {
    arrayFacturas: [],
    metodo_pago: '',
    cliente_participa: '',
    empleado_hace: '',
    se_facturan_en: [{
        codigo_repuesto: '',
        cantidad: 0,
        precio: 0,
        subtotal: 0,
    }]
}



export const reducerFacturas = (estado,action) => {

    const { payload, type } = action;

    switch(type){
        case (actionFacturas.SETARRAYFACTURAS): {
            return (  {...estado, arrayFacturas: payload} )
        }
        case (actionFacturas.SETFACTURA): {
            return ( 
                {
                    ...estado,
                    ...payload
            })
        }
        case (actionFacturas.REINICIARVALORES): {
            return ( initialValueFacturas );
        }
        }
    }
