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

const ProveedoresSeleccionar = () => {

    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        cargarPagina: setPagina,
        estadoProveedores,
        dispatchProveedores: dispatch,
        actionProveedores,
        estadoRepuestos,
        dispatchRepuestos,
        actionRepuestos,
    } = useContexto();

    const {
        arrayProveedores,
    } = estadoProveedores;

    const {
        SETARRAYPROVEEDORES,
    } = actionProveedores;

    const {
        SETREDIRECT, 
        SETSUMINISTRA,
    } = actionRepuestos;


    useEffect(
        () => {
            setPagina('ProveedoresSeleccionar');
            const fetchData = async () => {
                const response = await api.get('api/proveedores')
                dispatch(
                    {
                        payload: Array.isArray(response.data) ? response.data : [],
                        type: SETARRAYPROVEEDORES,
                    }
                )
            }
            fetchData();
        }
    , []);

    const seleccionaProveedor = (item) => {

        const pathAnterior = location.pathname.replace(/\/proveedores\/seleccionar\/(\d+)$/,"");

        navigate(pathAnterior, {
            state: { proveedorSeleccionado: item,
                index: params.index,
            },
            replace: true });
    };


    return(
        <>
        <header>
            <Header></Header>
        </header>

        <Flex justifyContent='end' p={3} >
            <IconButton colorScheme='blue' size='md' icon={<FontAwesomeIcon icon={faPlus}/>} onClick={() => navigate("/proveedores/nuevo")}/>
        </Flex>
        
        <Stack mt={6}>
            <TableContainer>
                <Table variant='simple'>
                    {arrayProveedores.length > 0 ? (
                        <>
                            <Thead>
                                <Tr>
                                    <Th>Código de proveedor</Th>
                                    <Th>Correo</Th>
                                    <Th>Nombre</Th>
                                    <Th>Dirección</Th>
                                    <Th>Teléfonos</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    arrayProveedores.map((item, index) => {
                                        return(
                                            <Tr key={index}>
                                                <Td>{item.codigo_proveedores}</Td>
                                                <Td>{item.correo}</Td>
                                                <Td>{item.nombre}</Td>
                                                <Td>{item.direccion}</Td>
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
                                                        () => seleccionaProveedor(item.codigo_proveedores)
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
                            <Button onClick={() => navigate('/repuestos/nuevo')}>Volver</Button>
                        </Tbody>
                    )}
                </Table>
            </TableContainer>
        </Stack>
        

        </>
    )
}


export default ProveedoresSeleccionar;