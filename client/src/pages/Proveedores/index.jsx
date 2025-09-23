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

const Proveedores = () => {

    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(true);
    const notify = () => toast("Wow so easy!");
    const [success,setSuccess] = useState(false);

    const {
        cargarPagina: setPagina,
        estadoProveedores,
        dispatchProveedores: dispatch,
        actionProveedores,
    } = useContexto();

    const {
        arrayProveedores,
    } = estadoProveedores;

    const {
        SETARRAYPROVEEDORES,
    } = actionProveedores;


    useEffect(
        () => {
            setPagina('Proveedores');
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
    , [success]);

    const deleteProveedores = async (id) => {
        try{
            await api.delete(`api/proveedores/proveedor/${id}`);
            setIsDeleted(!isDeleted);
            toast.success("Proveedor eliminado correctamente");
            setSuccess(!success);
        }catch (err){
            console.log('Error al eliminar el proveedor');
        }
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
                                    arrayProveedores.map((item) => {
                                        return(
                                            <Tr>
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
                                                    <Button colorScheme='red' 
                                                    onClick={() => setIsDeleted(false)}
                                                    onDoubleClick={() => deleteProveedores(item.codigo)}>
                                                        { isDeleted ? `Eliminar` : `¿Desea eliminar el proveedor?` } 
                                                    </Button>
                                                    { isDeleted && (
                                                    <Button colorScheme='green' className='ms-3' onClick={() => navigate(`/proveedores/actualizar/${item.codigo_proveedores}`)}>
                                                        Actualizar
                                                    </Button>
                                                    )}
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


export default Proveedores;