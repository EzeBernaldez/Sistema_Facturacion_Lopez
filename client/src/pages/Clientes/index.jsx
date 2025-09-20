import { React , useEffect, useState} from 'react';
import { useContexto } from "../../contexts/GlobalContext";
import api from '../../utils/api';
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
    Box,
    Flex,
    IconButton,
    Button,
    background
} from '@chakra-ui/react';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Clientes = (props) => {

    const navigate = useNavigate();

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
            setPagina('Clientes');
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
                                    <Th>Nombre</Th>
                                    <Th>Razon Social</Th>
                                    <Th>CUIT</Th>
                                    <Th>Direccion</Th>
                                    <Th>Correo</Th>
                                    <Th>Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    arrayClientes.map((item) => {
                                        console.log(item)
                                        return(
                                            <Tr>
                                                <Td>{item.codigo}</Td>
                                                <Td>{item.nombre}</Td>
                                                <Td>{item.razon_social}</Td>
                                                <Td>{item.cuit}</Td>
                                                <Td>{item.direccion}</Td>
                                                <Td>{item.correo}</Td>
                                                <Td>
                                                    <Button colorScheme='red'>
                                                        Eliminar
                                                    </Button>
                                                    <Button colorScheme='green' className='ms-3'>
                                                        Actualizar
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
                        </Tbody>
                    )}
                </Table>
            </TableContainer>
        </Stack>
        </>
    )
}

export default Clientes;