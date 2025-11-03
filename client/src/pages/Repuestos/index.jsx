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
    InputGroup,
    InputLeftAddon,
    Input
} from '@chakra-ui/react';
import { faPlus, faXmark, faTruck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Repuestos = (props) => {

    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(true);
    const notify = () => toast("Wow so easy!");
    const [filterRepuestos, setFilterRepuestos] = useState('');

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
        REINICIARVALORES,
        SETARRAYREPUESTOS,
    } = actionRepuestos;


    useEffect(
        () => {
            if (filterRepuestos === ''){
                dispatch({
                    type: REINICIARVALORES
                });
                setPagina('Repuestos');
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
        }
    , [isDeleted, filterRepuestos]);

    useEffect(
        () => {
            if(filterRepuestos !== ''){
                const fetchData = async () => {
                    try{
                        const response  = await api.get(`api/repuestos/filter/?search=${encodeURIComponent(filterRepuestos)}`)
                        dispatch( {
                            type: REINICIARVALORES,
                        });
                        dispatch(
                            {
                                payload: Array.isArray(response.data) ? response.data : [],
                                type: SETARRAYREPUESTOS,
                            }
                        )
                    }
                    catch(err){
                        console.log('no entra')
                    }
                }
                fetchData();
            }
        },
        [filterRepuestos]
    )

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

        <Flex justifyContent='space-between' p={3} >
            <InputGroup>
                <InputLeftAddon bg='#A0BDE8'><FontAwesomeIcon icon={faMagnifyingGlass}/></InputLeftAddon>
                <Input width='20vw' onChange={(e) => setFilterRepuestos(e.target.value)} placeholder='Filtrar...'/>
            </InputGroup>
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
                                    <Th>Precio de Venta</Th>
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
                                                    <>
                                                        <Button colorScheme='green' className='ms-3' onClick={() => navigate(`/repuestos/actualizar/${item.codigo}`)}>
                                                            Actualizar
                                                        </Button>
                                                        <IconButton className='ms-3' colorScheme='blue' size='md' icon={<FontAwesomeIcon icon={faTruck}/>} onClick={() => navigate(`/repuestos/${item.codigo}/vehiculo`)}/>
                                                    </>
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