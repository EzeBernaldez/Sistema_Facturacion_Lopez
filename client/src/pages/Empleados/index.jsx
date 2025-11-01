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
    MenuButton,
    MenuList,
    MenuItem,
    Menu,
    Text,
} from '@chakra-ui/react';
import { faPlus, faXmark, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';

const Empleados = () => {

    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(true);
    const notify = () => toast("Wow so easy!");
    const [success,setSuccess] = useState(false);

    const {
        cargarPagina: setPagina,
        estadoEmpleados,
        dispatchEmpleados: dispatch,
        actionEmpleados,
    } = useContexto();

    const {
        arrayEmpleados,
    } = estadoEmpleados;

    const {
        SETARRAYEMPLEADOS,
    } = actionEmpleados;


    useEffect(
        () => {
            setPagina('Empleados');
            const fetchData = async () => {
                const response = await api.get('api/empleados')
                dispatch(
                    {
                        payload: Array.isArray(response.data) ? response.data : [],
                        type: SETARRAYEMPLEADOS,
                    }
                )
            }
            fetchData();
        }
    , [success]);

    const deleteEmpleados = async (id) => {
        try{
            await api.delete(`api/empleados/empleado/${id}`);
            setIsDeleted(!isDeleted);
            toast.success("Empleado eliminado correctamente");
            setSuccess(!success);
        }catch (err){
            console.log('Error al eliminar el empleado');
        }
    };

    return(
        <>
        <header>
            <Header></Header>
        </header>

        <Flex justifyContent='end' p={3} >
            <IconButton colorScheme='blue' size='md' icon={<FontAwesomeIcon icon={faPlus}/>} onClick={() => navigate("/empleados/nuevo")}/>
        </Flex>
        <Stack mt={6}>
            <TableContainer>
                <Table variant='simple'>
                    {arrayEmpleados.length > 0 ? (
                        <>
                            <Thead>
                                <Tr>
                                    <Th>Dni</Th>
                                    <Th>Nombre</Th>
                                    <Th>Apellido</Th>
                                    <Th>Teléfonos</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    arrayEmpleados.map((item, index) => {
                                        return(
                                            <Tr key={index}>
                                                <Td>{item.dni_empleado}</Td>
                                                <Td>{item.nombre}</Td>
                                                <Td>{item.apellido}</Td>
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
                                                    onDoubleClick={() => deleteEmpleados(item.dni_empleado)}>
                                                        { isDeleted ? `Eliminar` : `¿Desea eliminar el empleado?` } 
                                                    </Button>
                                                    { isDeleted && (
                                                    <Button colorScheme='green' className='ms-3' onClick={() => navigate(`/empleados/actualizar/${item.dni_empleado}`)}>
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


export default Empleados;