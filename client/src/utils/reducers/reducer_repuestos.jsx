
export const actionRepuestos = {
    SETARRAYREPUESTOS: 8,
    SETREPUESTO: 0,
    REINICIARVALORES: 7,
    SETSUMINISTRA: 10,
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
    suministra: [{
        proveedor_suministra: '',
        codigo_origen: '',
        cantidad: 0,
    }],
}



export const reducerRepuestos = (estado,action) => {

    const { payload, type } = action;


    switch(type){
        case (actionRepuestos.SETARRAYREPUESTOS): {
            return (  {...estado, arrayRepuestos: payload} )
        }
        case (actionRepuestos.SETREPUESTO): {
            return ( 
                {
                    ...estado,
                    ...payload
            })
        }
        case (actionRepuestos.SETSUMINISTRA): {
            return ( 
                {...estado, 
                    suministra: payload
                } 
            );
        }
        case (actionRepuestos.REINICIARVALORES): {
            return ( initialValueRepuestos );
        }
        }
    }
