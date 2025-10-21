import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useContexto } from "../../contexts/GlobalContext";
import { useNavigate , useLocation, useParams } from "react-router-dom";
import  Header  from '../../components/Header';
import {
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Stack,
    Flex,
    IconButton,
    Button,
} from '@chakra-ui/react';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import { array } from "yup";

const EmpleadosSeleccionar = () => {

    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        cargarPagina: setPagina,
        estadoEmpleados,
        dispatchEmpleados: dispatch,
        actionEmpleados,
    } = useContexto();

    const {
        arrayEmpleados,
    } = estadoEmpleados;

    const {
        SETARRAYEMPLEADOS,
    } = actionEmpleados;


    useEffect(
        () => {
            setPagina('EmpleadosSeleccionar');
            const fetchData = async () => {
                const response = await api.get('api/empleados')
                dispatch(
                    {
                        payload: Array.isArray(response.data) ? response.data : [],
                        type: SETARRAYEMPLEADOS,
                    }
                )
            }
            fetchData();
        }
    , []);

    const seleccionaEmpleado = (item) => {

        const pathAnterior = location.pathname.replace(/\/empleados\/seleccionar\/?.*$/,"");

        navigate(pathAnterior, {
            state: { empleadoSeleccionado: item,
                ...(params.index != undefined && { index: params.index })
            },
            replace: true });
    };


    return(
        <>
        <header>
            <Header></Header>
        </header>

        <Flex justifyContent='end' p={3} >
            <IconButton colorScheme='blue' size='md' icon={<FontAwesomeIcon icon={faPlus}/>} onClick={() => navigate("/empleados/nuevo")}/>
        </Flex>
        
        <Stack mt={6}>
            <TableContainer>
                <Table variant='simple'>
                    {arrayProveedores.length > 0 ? (
                        <>
                            <Thead>
                                <Tr>
                                    <Th>DNI</Th>
                                    <Th>Nombre</Th>
                                    <Th>Apellido</Th>
                                    <Th>Teléfonos</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    arrayEmpleados.map((item, index) => {
                                        return(
                                            <Tr key={index}>
                                                <Td>{item.dni_empleado}</Td>
                                                <Td>{item.nombre}</Td>
                                                <Td>{item.apellido}</Td>
                                                <Td>
                                                    {
                                                        item.telefonos.length > 0 ? (
                                                            <>
                                                            {
                                                                item.telefonos.map((telefono,index) =>
                                                                    `${index+1}: ${telefono.numero} ` )
                                                            }
                                                            </>
                                                        ) : item.telefonos[0]
                                                    }
                                                </Td>
                                                <Td>
                                                    <Button colorScheme='blue' 
                                                    onClick={
                                                        () => seleccionaEmpleado(item.dni_empleado)
                                                    }
                                                    >
                                                        Seleccionar 
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        );
                                    })
                                }
                            </Tbody>
                        </>
                    ) :
                    (
                        <Tbody>
                            <Tr>
                                <Td>No hay elementos para mostrar</Td>
                            </Tr>
                            <Button onClick={() => navigate('/facturas/nuevo')}>Volver</Button>
                        </Tbody>
                    )}
                </Table>
            </TableContainer>
        </Stack>
        

        </>
    )
}


export default EmpleadosSeleccionar;