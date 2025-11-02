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
import { faPlus, faXmark, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { generarPDF } from '../../components/generarPDF';

const Facturas = (props) => {

    const navigate = useNavigate();
    const [isDeleted,setIsDeleted] = useState(true);
    const [success,setSuccess] = useState(false);

    const {
        cargarPagina: setPagina,
        estadoFacturas,
        dispatchFacturas: dispatch,
        actionFacturas,
    } = useContexto();

    const {
        arrayFacturas,
    } = estadoFacturas;

    const {
        SETARRAYFACTURAS,
    } = actionFacturas;

    useEffect(
        () => {
            setPagina('Facturas');
            const fetchData = async () => {
                const response = await api.get('api/facturas')
                console.log(response)
                dispatch(
                    {
                        payload: Array.isArray(response.data) ? response.data : [],
                        type: SETARRAYFACTURAS,
                    }
                )
            }
            fetchData();
        }
    , [success]);

    return(
        <>
        <header>
            <Header></Header>
        </header>

        <Flex justifyContent='end' p={3} >
            <IconButton colorScheme='blue' size='md' icon={<FontAwesomeIcon icon={faPlus}/>} onClick={() => navigate("/facturas/nuevo")}/>
        </Flex>
        <Stack mt={6}>
            <TableContainer>
                <Table variant='simple'>
                    {arrayFacturas.length > 0 ? (
                        <>
                            <Thead>
                                <Tr>
                                    <Th>Nro Factura</Th>
                                    <Th>Cliente</Th>
                                    <Th>Total</Th>
                                    <Th>Fecha</Th>
                                    <Th>Metodo de pago</Th>
                                    <Th>Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    arrayFacturas.map((item,index) => {
                                        return(
                                            <Tr key={index}>
                                                <Td>{item.nro_factura}</Td>
                                                <Td>{item.cliente_participa_razon_social_log}</Td>
                                                <Td>{item.total}</Td>
                                                <Td>{item.fecha}</Td>
                                                <Td>{item.metodo_pago}</Td>
                                                <Td>
                                                    <IconButton
                                                    colorScheme="blue"
                                                    size="md"
                                                    icon={<FontAwesomeIcon icon={faFilePdf} />}
                                                    onClick={async () => {
                                                        try {
                                                            const response = await api.get(`/api/facturas/${item.nro_factura}/`);
                                                            const facturaSeleccionada = response.data;
                                                            generarPDF(facturaSeleccionada);
                                                        } catch (error) {
                                                            console.error("Error en la solicitud de la factura:", error);
                                                        }
                                                    }}
                                                    />
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

export default Facturas;