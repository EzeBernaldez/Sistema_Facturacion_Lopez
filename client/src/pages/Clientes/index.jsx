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
    background,
    MenuButton,
    MenuList,
    MenuItem,
    Menu,
    Text,
} from '@chakra-ui/react';
import { faPlus, faXmark, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Clientes = (props) => {

    const navigate = useNavigate();
    const [isDeleted,setIsDeleted] = useState(true);
    const [success,setSuccess] = useState(false);

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
    , [success]);

    const deleteClientes = async (id) => {
        try{
            await api.delete(`api/clientes/cliente/${id}`);
            setIsDeleted(!isDeleted);
            toast.success("Cliente eliminado correctamente");
            setSuccess(!success);
        }catch (err){
            console.log('Error al eliminar el cliente');
        }
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
                                    <Th>Nombre</Th>
                                    <Th>Razon Social</Th>
                                    <Th>Condición IVA</Th>
                                    <Th>CUIT</Th>
                                    <Th>Direccion</Th>
                                    <Th>Correo</Th>
                                    <Th>Teléfonos</Th>
                                    <Th>Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    arrayClientes.map((item,index) => {
                                        return(
                                            <Tr key={index}>
                                                <Td>{item.codigo_clientes}</Td>
                                                <Td>{item.nombre}</Td>
                                                <Td>{item.razon_social}</Td>
                                                <Td>{item.condicion_iva}</Td>
                                                <Td>{item.cuit}</Td>
                                                <Td>{item.direccion}</Td>
                                                <Td>{item.correo}</Td>
                                                <Td>
                                                    {
                                                        item.telefonos.length > 0 ? (
                                                            <>
                                                                <Menu>
                                                                    <MenuButton
                                                                        as={IconButton}
                                                                        aria-label="Opciones de Teléfono"
                                                                        icon={<FontAwesomeIcon icon={faPhone}/>}
                                                                        size="sm"
                                                                        variant="outline"
                                                                        colorScheme="blue"
                                                                    >
                                                                        <Text ml={2}>{item.telefonos.length}</Text>
                                                                    </MenuButton>
                                                                    <MenuList>
                                                                        <Text fontWeight="bold" px={3} py={1}>Números Registrados:</Text>
                                                                        {item.telefonos.map((t, index) => (
                                                                            <MenuItem 
                                                                                key={index}
                                                                                onClick={() => navigator.clipboard.writeText(t.numero)} 
                                                                            >
                                                                                {t.numero} 
                                                                            </MenuItem>
                                                                        ))}
                                                                    </MenuList>
                                                                </Menu>
                                                            </>
                                                        ) : item.telefonos[0]
                                                    }
                                                </Td>
                                                <Td>
                                                    <Button colorScheme='red'
                                                    onClick={() => setIsDeleted(false)}
                                                    onDoubleClick={() => {
                                                        deleteClientes(item.codigo_clientes)
                                                    }}>
                                                        { isDeleted ? `Eliminar` : `¿Desea eliminar el cliente?` }
                                                    </Button>
                                                    { isDeleted && (
                                                    <Button colorScheme='green' className='ms-3' onClick={() => navigate(`/clientes/actualizar/${item.codigo_clientes}`)}>
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

export default Clientes;