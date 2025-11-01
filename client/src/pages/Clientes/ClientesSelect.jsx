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
        estadoClientes,
        dispatchClientes: dispatch,
        actionClientes,
    } = useContexto();

    const {
        arrayClientes,
    } = estadoClientes;

    const {
        SETARRAYCLIENTES,
    } = actionClientes;


    useEffect(
        () => {
            setPagina('ClientesSeleccionar');
            const fetchData = async () => {
                const response = await api.get('api/clientes')
                dispatch(
                    {
                        payload: Array.isArray(response.data) ? response.data : [],
                        type: SETARRAYCLIENTES,
                    }
                )
            }
            fetchData();
        }
    , []);

    const seleccionaCliente = (item) => {

        const pathAnterior = location.pathname.replace(/\/clientes\/seleccionar\/?.*$/,"");

        navigate(pathAnterior, {
            state: { clienteSeleccionado: item,
                ...(params.index != undefined && { index: params.index })
            },
            replace: true });
    };

    const volver = () => {
        const pathAnterior = location.pathname.replace(/\/clientes\/seleccionar\/?.*$/,"");
        navigate(pathAnterior);
    };

    return(
        <>
        <header>
            <Header></Header>
        </header>

        <Flex justifyContent='end' p={3} >
            <IconButton colorScheme='blue' size='md' icon={<FontAwesomeIcon icon={faPlus}/>} onClick={() => navigate("/clientes/nuevo")}/>
        </Flex>
        
        <Stack mt={6}>
            <TableContainer>
                <Table variant='simple'>
                    {arrayClientes.length > 0 ? (
                        <>
                            <Thead>
                                <Tr>
                                    <Th>Código</Th>
                                    <Th>Correo</Th>
                                    <Th>Nombre</Th>
                                    <Th>Condición Iva</Th>
                                    <Th>Razón social</Th>
                                    <Th>Telefonos</Th>
                                    <Th>Cuit</Th>
                                    <Th>Dirección</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    arrayClientes.map((item, index) => {
                                        return(
                                            <Tr key={index}>
                                                <Td>{item.codigo}</Td>
                                                <Td>{item.correo}</Td>
                                                <Td>{item.nombre}</Td>
                                                <Td>{item.condicion_iva}</Td>
                                                <Td>{item.razon_social}</Td>
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
                                                <Td>{item.cuit}</Td>
                                                <Td>{item.direccion}</Td>
                                                <Td>
                                                    <Button colorScheme='blue' 
                                                    onClick={
                                                        () => seleccionaCliente(item.codigo)
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
                            <Button onClick={() => volver()}>Volver</Button>
                        </Tbody>
                    )}
                </Table>
            </TableContainer>
        </Stack>
        

        </>
    )
}


export default EmpleadosSeleccionar;