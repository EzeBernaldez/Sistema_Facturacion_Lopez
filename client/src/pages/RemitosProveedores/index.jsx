import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useContexto } from "../../contexts/GlobalContext";
import { useNavigate } from "react-router-dom";
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

const RemitoProveedores = () => {

    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(true);
    const notify = () => toast("Wow so easy!");
    const [success,setSuccess] = useState(false);

    const {
        cargarPagina: setPagina,
        estadoRemitoProveedores,
        dispatchRemitoProveedores: dispatch,
        actionRemitoProveedores,
    } = useContexto();

    const {
        arrayRemitoProveedores,
    } = estadoRemitoProveedores;

    const {
        SETARRAYREMITOPROVEEDORES,
    } = actionRemitoProveedores;


    useEffect(
        () => {
            setPagina('RemitoProveedores');
            const fetchData = async () => {
                const response = await api.get('api/remito_proveedores')
                dispatch(
                    {
                        payload: Array.isArray(response.data) ? response.data : [],
                        type: SETARRAYREMITOPROVEEDORES,
                    }
                )
            }
            fetchData();
        }
    , [success]);

    const deleteRemitoProveedores = async (id) => {
        try{
            await api.delete(`api/remito_proveedores/remito_proveedor/${id}`);
            setIsDeleted(!isDeleted);
            toast.success("Remito de Proveedor eliminado correctamente");
            setSuccess(!success);
        }catch (err){
            console.log('Error al eliminar el remito del proveedor');
        }
    };

    return(
        <>
        <header>
            <Header></Header>
        </header>

        <Flex justifyContent='end' p={3} >
            <IconButton colorScheme='blue' size='md' icon={<FontAwesomeIcon icon={faPlus}/>} onClick={() => navigate("/remito_proveedores/nuevo")}/>
        </Flex>
        <Stack mt={6}>
            <TableContainer>
                <Table variant='simple'>
                    {arrayRemitoProveedores.length > 0 ? (
                        <>
                            <Thead>
                                <Tr>
                                    <Th>Número de remito</Th>
                                    <Th>Proveedor</Th>
                                    <Th>Repuestos</Th>
                                    <Th>Monto Total</Th>
                                    <Th>Pagado</Th>
                                    <Th>Fecha</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    arrayRemitoProveedores.map((item, index) => {
                                        return(
                                            <Tr key={index}>
                                                <Td>{item.nro_remito}</Td>
                                                <Td>{item.proveedor_proviene_de_read.codigo_proveedores} - {item.proveedor_proviene_de_read.nombre}</Td>
                                                <Td>
                                                    {
                                                        item.contiene_read.length > 0 ? (
                                                            <>
                                                            {
                                                                item.contiene_read.map((repuesto,index) =>
                                                                    `${index+1}: ${repuesto.codigo_contiene} ` )
                                                            }
                                                            </>
                                                        ) : item.contiene_read[0]
                                                    }
                                                </Td>
                                                <Td>{item.monto_total}</Td>
                                                <Td>{item.pagado}</Td>
                                                <Td>{item.fecha}</Td>
                                                <Td>
                                                    <Button colorScheme='red' 
                                                    onClick={() => setIsDeleted(false)}
                                                    onDoubleClick={() => deleteRemitoProveedores(item.nro_remito)}>
                                                        { isDeleted ? `Eliminar` : `¿Desea eliminar el remito?` } 
                                                    </Button>
                                                    { !isDeleted && (
                                                        <IconButton ms={1} icon={<FontAwesomeIcon icon={faXmark} color='black' fade/> 
                                                        } 
                                                        onClick={() => setIsDeleted(true)}/>
                                                    ) }
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


export default RemitoProveedores;