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

const RepuestosSeleccionar = () => {

    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    let repuestosFiltrados = [];
    const {
            cargarPagina: setPagina,
            pagina,
            estadoRepuestos,
            dispatchRepuestos: dispatch,
            actionRepuestos,
        } = useContexto();
    const [paginaAnterior, setPaginaAnterior] = useState(pagina);


    const {
        arrayRepuestos,
    } = estadoRepuestos;

    const {
        SETARRAYREPUESTOS,
    } = actionRepuestos;


    useEffect(
        () => {
            setPagina('RepuestosSeleccionar');
            const fetchData = async () => {
                const response = await api.get('api/repuestos')
                dispatch(
                    {
                        payload: Array.isArray(response.data) ? response.data : [],
                        type: SETARRAYREPUESTOS,
                    }
                )
            }
            fetchData();
        }
    , []);

    const seleccionaRepuesto = (item) => {

        const pathAnterior = location.pathname.replace(/\/repuestos\/seleccionar\/?.*$/,"");


        if (paginaAnterior === 'Facturas'){ 
            navigate(pathAnterior, {
                state: { repuestoSeleccionado: item,
                    index: params.proveedor 
                }
            })
        }
        // Esto es porque el primer parámetro es proveedor dentro del link, por lo tanto cuando no le mandamos un proveedor toma a index como primer parámetro y se sigue llamando
        else{
            navigate(pathAnterior, {
                state: { repuestoSeleccionado: item,
                    ...(params.index != undefined && { index: params.index })
                },
                replace: true });
        }
    };

    if (paginaAnterior !== 'Facturas'){
        repuestosFiltrados = arrayRepuestos.filter((item) => item.suministra_read?.some(
        (proveedor) => proveedor.proveedor_suministra === params.proveedor
        ));
    } else{
        repuestosFiltrados = arrayRepuestos;
    }

    const volver = () => {
        const pathAnterior = location.pathname.replace(/\/repuestos\/seleccionar\/?.*$/,"");
        navigate(pathAnterior);
    };

    return(
        <>
        <header>
            <Header></Header>
        </header>
        
        <Stack mt={6}>
            <TableContainer>
                <Table variant='simple'>
                    {repuestosFiltrados.length > 0 ? (
                        <>
                            <Thead>
                                <Tr>
                                    <Th>Código</Th>
                                    <Th>Descripción</Th>
                                    <Th>Marca</Th>
                                    <Th>Precio de Venta</Th>
                                    <Th>Stock</Th>
                                    <Th>Tipo</Th>
                                    <Th>Proveedores</Th>

                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    repuestosFiltrados.map((item, index) => {
                                        return(
                                            <Tr key={index}>
                                                <Td>{item.codigo}</Td>
                                                <Td>{item.descripcion}</Td>
                                                <Td>{item.marca}</Td>
                                                <Td>{item.precio_venta}</Td>
                                                <Td>{item.stock}</Td>
                                                <Td>{item.tipo}</Td>
                                                <Td>
                                                    {
                                                        item.suministra_read.length > 0 ? (
                                                            <>
                                                            {
                                                                item.suministra_read.map((proveedor,index) =>
                                                                    `${index+1}: ${proveedor.proveedor_suministra} ` )
                                                            }
                                                            </>
                                                        ) : item.suministra[0]
                                                    }
                                                </Td>
                                                <Td>
                                                    <Button colorScheme='blue' 
                                                    onClick={
                                                        () => seleccionaRepuesto(item.codigo)
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


export default RepuestosSeleccionar;