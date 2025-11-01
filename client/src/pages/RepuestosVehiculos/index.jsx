import { React, useEffect, useState } from 'react';
import { useContexto } from "../../contexts/GlobalContext";
import api from '../../utils/api';
import Header from '../../components/Header';
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
  Text,
  Spacer,
  RadioCard,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  TabIndicator
} from '@chakra-ui/react';
import { faPlus, faXmark,faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const RepuestosVehiculos = () => {
  const navigate = useNavigate();
  const [isDeleted, setIsDeleted] = useState(true);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const { codigo }=useParams()

  const {
    cargarPagina: setPagina,
    estadoVehiculos,
    dispatchVehiculos: dispatch,
    actionVehiculos,
  } = useContexto();

  const { arrayVehiculos } = estadoVehiculos;
  const { SETARRAYVEHICULOS } = actionVehiculos;

  useEffect(() => {
    setPagina('Vehiculos');
    const fetchData = async () => {
      const response = await api.get(`api/repuestos/${codigo}/vehiculo`);
      dispatch({
        payload: Array.isArray(response.data) ? response.data : [],
        type: SETARRAYVEHICULOS,
      });
    };
    fetchData();
  }, [isDeleted]);

  const deleteVehiculo = async (id) => {
    try {
      await api.delete(`api/pertenece/${id}/${codigo}/`);
      setIsDeleted(!isDeleted);
      toast.success("Vehículo eliminado correctamente");
    } catch (err) {
      console.log('Error al eliminar el vehículo');
    }
  };


  return (
    <>
      <Header />      
        <Tabs variant='unstyled' mt={4}>
            <Flex justifyContent="center">
                <TabList mb='0.5rem'>
                    <Tab >Camiones</Tab>
                    <Tab >Semirremolques</Tab>
                </TabList>
            </Flex>
          <TabIndicator mt='-1.5px' height='2px' bg='blue.500' borderRadius='1px'></TabIndicator>
          <TabPanels>
            <TabPanel>
              <Flex justifyContent="end" p={0}>
                <IconButton colorScheme='blue' size='md' me="94%" height="2rem" icon={<FontAwesomeIcon icon={faLeftLong}/>} onClick={() => navigate(-1)}/>
                <IconButton
                  colorScheme="blue"
                  size="md"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={() => navigate(`/repuestos/${codigo}/vehiculo/nuevo`)}
                />
              </Flex>
              <Stack mt={0}>

                <TableContainer>
                    <Table variant="simple">
                        {arrayVehiculos.length > 0 ? (
                            <>
                                <Thead>
                                    <Tr>
                                        <Th>Código</Th>
                                        <Th>Marca</Th>
                                        <Th>Modelo</Th>
                                        <Th>Motor</Th>
                                        <Th>Año de Fabricación</Th>
                                        <Th>Acciones</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {arrayVehiculos.filter(item => item.tipo_vehiculo === "Camion").map((item) => (
                                        <Tr key={item.codigo_vehiculos}>
                                            <Td>{item.codigo_vehiculos}</Td>
                                            <Td>{item.marca}</Td>
                                            <Td>{item.modelo}</Td>
                                            <Td>{item.motor}</Td>
                                            <Td>{item.ano_fabricacion}</Td>
                                            <Td>
                                                <Button
                                                    colorScheme="red"
                                                    onClick={() => setIsDeleted(false)}
                                                    onDoubleClick={() => deleteVehiculo(item.codigo_vehiculos)}
                                                >
                                                    {isDeleted
                                                    ? `Eliminar`
                                                    : `¿Desea eliminar el vehículo?`}
                                                </Button>
                                                {!isDeleted && (
                                                    <IconButton
                                                    icon={<FontAwesomeIcon icon={faXmark} color="black" />}
                                                    onClick={() => setIsDeleted(true)}
                                                    />
                                                )}
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </>
                        ) : (
                            <Tbody>
                            <Tr>
                                <Td>No hay camiones asociados al repuesto</Td>
                            </Tr>
                            </Tbody>
                        )}
                    </Table>
                </TableContainer>
            </Stack>
            </TabPanel>
            <TabPanel>
              <Flex justifyContent="end" p={0}>
                <IconButton colorScheme='blue' size='md' me="94%" height="2rem" icon={<FontAwesomeIcon icon={faLeftLong}/>} onClick={() => navigate("/repuestos")}/>
                <IconButton
                  colorScheme="blue"
                  size="md"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={() => navigate(`/repuestos/${codigo}/vehiculo/nuevo`)}
                />
              </Flex>
              <Stack mt={0}>

                <TableContainer>
                    <Table variant="simple">
                        {arrayVehiculos.length > 0 ? (
                            <>
                                <Thead>
                                    <Tr>
                                        <Th>Código</Th>
                                        <Th>Marca</Th>
                                        <Th>Modelo</Th>
                                        <Th>Tipo de Semirremolque</Th>
                                        <Th>Año de Fabricación</Th>
                                        <Th>Acciones</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {arrayVehiculos.filter(item => item.tipo_vehiculo === "Semirremolque").map((item) => (
                                        <Tr key={item.codigo_vehiculos}>
                                            <Td>{item.codigo_vehiculos}</Td>
                                            <Td>{item.marca}</Td>
                                            <Td>{item.modelo}</Td>
                                            <Td>{item.tipo_semirremolque}</Td>
                                            <Td>{item.ano_fabricacion}</Td>
                                            <Td>
                                                 <Button
                                                    colorScheme="red"
                                                    onClick={() => setIsDeleted(false)}
                                                    onDoubleClick={() => deleteVehiculo(item.codigo_vehiculos)}
                                                >
                                                    {isDeleted
                                                    ? `Eliminar`
                                                    : `¿Desea eliminar el vehículo?`}
                                                </Button>
                                                {!isDeleted && (
                                                    <IconButton
                                                    icon={<FontAwesomeIcon icon={faXmark} color="black" />}
                                                    onClick={() => setIsDeleted(true)}
                                                    />
                                                )}
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </>
                        ) : (
                            <Tbody>
                            <Tr>
                                <Td>No hay semirremolques asociados al repuesto</Td>
                            </Tr>
                            </Tbody>
                        )}
                    </Table>
                </TableContainer>
            </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
    </>
  );
};

export default RepuestosVehiculos;
