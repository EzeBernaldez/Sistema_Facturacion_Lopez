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
  TabIndicator,
  Checkbox
} from '@chakra-ui/react';
import { faPlus, faXmark,faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const RepuestosVehiculosPatch = () => {
  const navigate = useNavigate();
  const [isDeleted, setIsDeleted] = useState(true);
  const { codigo }=useParams()

  const {
    cargarPagina: setPagina,
    estadoVehiculos,
    dispatchVehiculos: dispatch,
    actionVehiculos,
  } = useContexto();

  const { arrayVehiculos } = estadoVehiculos;
  const { SETARRAYVEHICULOS } = actionVehiculos;

  const [selectedRows, setSelectedRows] = useState([]);
  

  const handleRowSelection = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  useEffect(() => {
    setPagina('Vehiculos');
    const fetchData = async () => {
      const response = await api.get(`api/repuestos/${codigo}/vehiculo/nuevo`);
      dispatch({
        payload: Array.isArray(response.data) ? response.data : [],
        type: SETARRAYVEHICULOS,
      });
    };
    fetchData();
  }, [isDeleted]);


  const handleGuardar = async () => {
  if (selectedRows.length === 0) {
    toast.warning("Seleccioná al menos un vehículo");
    return;
  }

  const data = {
    codigo_repuesto: codigo,
    codigos_vehiculos: selectedRows,
  };

  console.log(data)

  try {
    await api.post("api/pertenece/", data);
    toast.success("Vehículos asociados correctamente");
    navigate(`/repuestos/${codigo}/vehiculo/`);
  } catch (err) {
    console.error(err);
    toast.error("Error al asociar los vehículos");
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
                <IconButton colorScheme='blue' size='md' me="96.7%" height="2rem" icon={<FontAwesomeIcon icon={faLeftLong}/>} onClick={() => navigate(`/repuestos/${codigo}/vehiculo/`)}/>
              </Flex>
              <Stack mt={0}>

                <TableContainer>
                    <Table variant="simple">
                        {arrayVehiculos.length > 0 ? (
                            <>
                                <Thead>
                                    <Tr>
                                        <Td>-</Td>
                                        <Th>Código</Th>
                                        <Th>Marca</Th>
                                        <Th>Modelo</Th>
                                        <Th>Motor</Th>
                                        <Th>Año de Fabricación</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                  {arrayVehiculos
                                    .filter(item => item.tipo_vehiculo === "Camion")
                                    .map((item) => {
                                      const isSelected = selectedRows.includes(item.codigo_vehiculos);
                                      return (
                                        <Tr
                                          key={item.codigo_vehiculos}
                                          onClick={() => handleRowSelection(item.codigo_vehiculos)}
                                          cursor="pointer"
                                          bg={isSelected ? "blue.200" : "transparent"}
                                          _hover={{ bg: isSelected ? "blue.200" : "gray.100" }}
                                          transition="background-color 0.2s ease"
                                        >
                                          <Td>
                                            <Checkbox
                                              isChecked={isSelected}
                                              pointerEvents="none" // para que no bloquee el click del <Tr>
                                            />
                                          </Td>
                                          <Td>{item.codigo_vehiculos}</Td>
                                          <Td>{item.marca}</Td>
                                          <Td>{item.modelo}</Td>
                                          <Td>{item.motor}</Td>
                                          <Td>{item.ano_fabricacion}</Td>
                                        </Tr>
                                      );
                                    })}
                                </Tbody>
                            </>
                        ) : (
                            <Tbody>
                            <Tr>
                                <Td>No hay camiones disponibles para repuesto</Td>
                            </Tr>
                            </Tbody>
                        )}
                    </Table>
                </TableContainer>
            </Stack>
            </TabPanel>
            <TabPanel>
              <Flex justifyContent="end" p={0}>
                <IconButton colorScheme='blue' size='md' me="96.7%" height="2rem" icon={<FontAwesomeIcon icon={faLeftLong}/>} onClick={() => navigate(`/repuestos/${codigo}/vehiculo/`)}/>
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
                                    </Tr>
                                </Thead>
                                <Tbody>
                                  {arrayVehiculos
                                    .filter(item => item.tipo_vehiculo === "Semirremolque")
                                    .map((item) => {
                                      const isSelected = selectedRows.includes(item.codigo_vehiculos);
                                      return (
                                        <Tr
                                          key={item.codigo_vehiculos}
                                          onClick={() => handleRowSelection(item.codigo_vehiculos)}
                                          cursor="pointer"
                                          bg={isSelected ? "blue.200" : "transparent"}
                                          _hover={{ bg: isSelected ? "blue.200" : "gray.100" }}
                                          transition="background-color 0.2s ease"
                                        >
                                          <Td>
                                            <Checkbox
                                              isChecked={isSelected}
                                              pointerEvents="none" // para que no bloquee el click del <Tr>
                                            />
                                          </Td>
                                          <Td>{item.codigo_vehiculos}</Td>
                                          <Td>{item.marca}</Td>
                                          <Td>{item.modelo}</Td>
                                          <Td>{item.tipo_semirremolque}</Td>
                                          <Td>{item.ano_fabricacion}</Td>
                                        </Tr>
                                      );
                                    })}
                                </Tbody>
                            </>
                        ) : (
                            <Tbody>
                            <Tr>
                                <Td>No hay semirremolques disponibles para repuesto</Td>
                            </Tr>
                            </Tbody>
                        )}
                    </Table>
                </TableContainer>
            </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Flex justifyContent="end" p={0} me="4rem" mt="4rem">
          {selectedRows.length ===0 ? (
            <Button>
            </Button>
          ):(
            <Button colorScheme="green" onClick={()=>handleGuardar()}>
              Agregar vehiculos
            </Button>
          )}
        </Flex>
    </>
  );
};

export default RepuestosVehiculosPatch;
