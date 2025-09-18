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

const Repuestos = (props) => {

    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(true);
    const notify = () => toast("Wow so easy!");

    const {
        cargarPagina: setPagina,
        estadoRepuestos,
        dispatchRepuestos: dispatch,
        actionRepuestos,
    } = useContexto();

    const {
        arrayRepuestos,
    } = estadoRepuestos;

    const {
        SETARRAYREPUESTOS,
    } = actionRepuestos;


    useEffect(
        () => {
            setPagina('Repuestos');
            const fetchData = async () => {
                const response = await api.get('api/repuestos/')
                dispatch(
                    {
                        payload: Array.isArray(response.data) ? response.data : [],
                        type: SETARRAYREPUESTOS,
                    }
                )
            }
            fetchData();
        }
    , [isDeleted]);

    const deleteRepuesto = async (id) => {
        try{
            await api.delete(`api/repuestos/${id}`);
            setIsDeleted(!isDeleted);
            toast.success("Repuesto eliminado correctamente");
        }catch (err){
            console.log('Error al eliminar el repuesto');
        }
    };

    return(
        <>
        <header>
            <Header></Header>
        </header>

        <Flex justifyContent='end' p={3} >
            <IconButton colorScheme='blue' size='md' icon={<FontAwesomeIcon icon={faPlus}/>} onClick={() => navigate("/repuestos/nuevo")}/>
        </Flex>
        <Stack mt={6}>
            <TableContainer>
                <Table variant='simple'>
                    {arrayRepuestos.length > 0 ? (
                        <>
                            <Thead>
                                <Tr>
                                    <Th>Código</Th>
                                    <Th>Descripción</Th>
                                    <Th>Marca</Th>
                                    <Th>Precio</Th>
                                    <Th>Stock</Th>
                                    <Th>Tipo</Th>
                                    <Th>Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    arrayRepuestos.map((item) => {
                                        return(
                                            <Tr>
                                                <Td>{item.codigo}</Td>
                                                <Td>{item.descripcion}</Td>
                                                <Td>{item.marca}</Td>
                                                <Td>{item.precio_venta}</Td>
                                                <Td>{item.stock}</Td>
                                                <Td>{item.tipo}</Td>
                                                <Td>
                                                    <Button colorScheme='red' 
                                                    onClick={() => setIsDeleted(false)}
                                                    onDoubleClick={() => deleteRepuesto(item.codigo)}>
                                                        { isDeleted ? `Eliminar` : `¿Desea eliminar el repuesto?` } 
                                                    </Button>
                                                    { isDeleted && (
                                                    <Button colorScheme='green' className='ms-3' onClick={() => navigate(`/repuestos/actualizar/${item.codigo}`)}>
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

export default Repuestos;