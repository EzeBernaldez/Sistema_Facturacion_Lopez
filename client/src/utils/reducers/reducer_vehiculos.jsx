export const actionVehiculos = {
    SETARRAYVEHICULOS: 0,
    SETCODIGO: 1,
    SETMODELO: 2,
    SETAÑOFABRICACION: 3,
    SETMARCA:4,
    SETMOTOR:5,
    SETTIPOSEMIRREMOLQUE:6,
    SETTIPOVEHICULO:7,
    REINICIARVALORES:8,
} 

export const initialValueVehiculos = {
    arrayVehiculos: [],
    codigo: '',
    modelo: '',
    año_fabricacion: '',
    marca: '',
    motor: '',
    tipo_semirremolque: '',
    tipo_vehiculo: '',
}

export const reducerVehiculos = (estado,action) => {

    const { payload, type } = action;

    switch(type){
        case (actionVehiculos.SETARRAYVEHICULOS): {
            return ( {...estado, arrayVehiculos: payload});
        }
        case (actionVehiculos.SETCODIGO): {
            return (  {...estado, codigo: payload} )
        }
        case (actionVehiculos.SETMODELO): {
            return ( {...estado, modelo: payload} );
        }
        case (actionVehiculos.SETAÑOFABRICACION): {
            return ( {...estado, año_fabricacion:payload} );
        }
        case (actionVehiculos.SETMARCA): {
            return ( {...estado, marca: payload} );
        }
        case (actionVehiculos.SETMOTOR): {
            return ( {...estado, motor: payload} );
        }
        case (actionVehiculos.SETTIPOSEMIRREMOLQUE): {
            return ( {...estado, tipo_semirremolque: payload} );
        }
        case (actionVehiculos.SETTIPOVEHICULO): {
            return ( {...estado, tipo_vehiculo: payload} );
        }
        case (actionVehiculos.REINICIARVALORES): {
            return ( initialValueVehiculos );
        }
        }
    }