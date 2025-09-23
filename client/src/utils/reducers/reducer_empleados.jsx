export const actionEmpleados = {
    SETARRAYEMPLEADOS: 0,
    SETDNIEMPLEADO: 1,
    SETNOMBRE: 2,
    SETAPELLIDO: 3,
    SETTELEFENOS: 4,
    REINICIARVALORES: 8,
} 



export const initialValueEmpleados = {
    arrayEmpleados: [],
    dni_empleado: '',
    nombre: '',
    apellido: '',
    telefonos_empleados: [],
}



export const reducerEmpleados = (estado,action) => {

    const { payload, type } = action;

    switch(type){
        case (actionEmpleados.SETARRAYEMPLEADOS): {
            return ( {...estado, arrayEmpleados: payload});
        }
        case (actionEmpleados.SETDNIEMPLEADO): {
            return (  {...estado, dniEmpleado: payload} )
        }
        case (actionEmpleados.SETNOMBRE): {
            return ( {...estado, nombre: payload} );
        }
        case (actionEmpleados.SETAPELLIDO): {
            return ( {...estado,apellido:payload} );
        }
        case (actionEmpleados.SETTELEFENOS): {
            return ( {...estado, nombre: payload} );
        }
        case (actionEmpleados.REINICIARVALORES): {
            return ( initialValueEmpleados );
        }
        }
    }
