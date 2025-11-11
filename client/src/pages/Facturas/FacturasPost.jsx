import React, { useState } from "react";
import Header from "../../components/Header";
import * as Yup from 'yup';
import { useFormik, FormikProvider, FieldArray } from 'formik';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Button,
    Collapse,
    Alert,
    AlertIcon,
    IconButton,
    Heading,
    Stack,
    Text,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    NumberInput,
    NumberInputField,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputStepper,
    VStack,
    HStack,
    Select,
    Flex,
    Grid,
    useToast,
    Input
} from '@chakra-ui/react';
import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import api from "../../utils/api";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from 'react-toastify';
import AutoComplete from "../../components/AutoComplete";
import { useContexto } from "../../contexts/GlobalContext";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { generarPDF } from "../../components/generarPDF";

const FacturasPost = () => {
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const toastC = useToast({
        position: 'top',

    });

    let [dataClientes, setDataClientes] = useState('');
    let [dataEmpleados, setDataEmpleados] = useState('');

    const {
        estadoFacturas,
        actionFacturas,
        dispatchFacturas: dispatch,
        cargarPagina: setPagina,
        pagina,
    } = useContexto();

    const formik = useFormik({
        initialValues: {
            metodo_pago: estadoFacturas.metodo_pago || '',
            cliente_participa: estadoFacturas.cliente_participa || '',
            empleado_hace: estadoFacturas.empleado_hace || '',
            se_facturan_en: estadoFacturas.se_facturan_en || [{
                codigo_repuesto: '',
                descripcion: '',
                cantidad: 0,
                precio: 0,
                subtotal: 0,
            }]
        },
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            try{

                const repuestosConSubtotal = values.se_facturan_en.map(item => ({
                    ...item,
                    subtotal: Number(item.cantidad) * Number(item.precio)
                }));

                const total = repuestosConSubtotal.reduce((sum, item) => sum + item.subtotal, 0)
                
                const fechaActual = new Date().toISOString().split('T')[0];
                const payload = {
                    ...values,
                    se_facturan_en: repuestosConSubtotal,
                    fecha: fechaActual,
                    total: total,
                };

                dispatch({
                    type: actionFacturas.REINICIARVALORES, 
                })
                console.log(payload)
                await api.post(`/api/facturas`, payload);
                
                setLoading(false);
                formik.resetForm();
                toast.success("La factura se cargó correctamente")
                const ultima = await api.get(`/api/facturas/ultima/`);
                generarPDF(ultima.data)
                navigate('/facturas');
            }
            catch (err){

                setLoading(false);
                if (err.response?.status === 400) {
                    const data = err.response.data;
                    Object.keys(data).forEach((field) => {
                        const errorMessage = Array.isArray(data[field]) ? data[field][0] : data[field];
                        if (formik.values.hasOwnProperty(field)) {
                            formik.setFieldError(field,errorMessage);
                        } 
                        else{
                            setError(errorMessage);
                        }

                        toastC({
                            status: 'error',
                            isClosable: true,
                            title: (data !== 'se_facturan_en') ? `404 - Error al crear la factura` : `${error}`, 
                        })
                    })
                } else {
                    setError('Error al crear la factura. Intente nuevamente.');
                    toastC({
                            status: 'error',
                            isClosable: true,
                            title: error,
                        })
                }
                console.error('Error:', err.response?.data);
            }
        },
        validationSchema: Yup.object({
            cliente_participa: Yup.string().trim().required('Debe ingresar el cliente.'),
            empleado_hace: Yup.string().trim().required('Debe ingresar el empleado'),
            se_facturan_en: Yup.array()
                .of(
                    Yup.object().shape({
                    codigo_repuesto: Yup.string().required("Debe ingresar el código del repuesto"),
                    descripcion: Yup.string().required("Debe ingresar el código del repuesto"),
                    cantidad: Yup.number().min(1, 'La cantidad debe ser mayor a 1').required('Debe ingresar la cantidad requerida del repuesto'),
                    precio: Yup.number().required('Debe ingresar el precio del repuesto'),
                    })
                )
                .min(1, "Debe ingresar al menos un repuesto")
                .test('repuestos-unicos', 'No pueden haber repuestos repetidos', function (value) {
                    if (!value) return true;
                    const repuestos = value.map(item => item.codigo_repuesto);
                    const repuestosUnicos = [...new Set(repuestos)];
                    return repuestos.length === repuestosUnicos.length;
                }),
        })
    });
    
    // Para traer información de clientes
    useEffect(
        () => {
            let timeout;
            const fetchData = async () =>{
                try{
                    if (formik.values.cliente_participa.length >= 1){
                        const response = await api.get(`api/clientes/cliente/${formik.values.cliente_participa}`);
                        setDataClientes(response.data);
                    }
                }
                catch(err){
                    setDataClientes('');
                }
            }

            timeout = setTimeout(() => {
                fetchData();
            }, 300)

            return () => {
                clearTimeout(timeout);
            }
        },
        [formik.values.cliente_participa]
    );

    // Para traer información de repuestos e inicializar el precio del mismo
    useEffect(
        () => {
            let timeout;
            const fetchData = async () =>{
                try{
                    formik.values.se_facturan_en.map( async(item, index) => {
                        if (item.codigo_repuesto.length >= 1){
                            try{
                                const response = await api.get(`api/repuestos/${item.codigo_repuesto}`);
                                const repuestoDato = response.data;
                                if (formik.values.se_facturan_en?.[index]?.precio == 0){
                                    formik.setFieldValue(`se_facturan_en.${index}.precio`, repuestoDato.precio_venta);
                                }
                                if (formik.values.se_facturan_en?.[index]?.codigo_repuesto !== null){
                                    formik.setFieldValue(`se_facturan_en.${index}.descripcion`, repuestoDato.descripcion);
                                }
                                console.log(formik.values.se_facturan_en?.[index]?.descripcion)

                            }
                            catch(err){
                                console.log('entraaaa')
                                formik.setFieldError(`se_facturan_en.${index}.codigo_repuesto`, 'No se encuentra')
                                toastC({
                                    status: 'error',
                                    isClosable: true,
                                    title: `El repuesto ${item.codigo_repuesto} no se encuentra`,
                                })
                            }
                        }
                    })
                }
                catch(err){
                    console.log('entra')
                    toastC({
                        status: 'error',
                        isClosable: true, 
                        title: err,
                    })
                }
            }

            timeout = setTimeout(() => {
                fetchData();
            }, 300)

            return () => {
                clearTimeout(timeout);
            }
        },[formik.values.se_facturan_en]);

    // Para traer información de empleados
    useEffect(
        () => {
            let timeout;
            const fetchData = async () =>{
                try{
                    if (formik.values.empleado_hace.length > 1){
                        const response = await api.get(`api/empleados/empleado/${formik.values.empleado_hace}`);
                        setDataEmpleados(response.data);
                    }
                }
                catch(err){
                    setDataEmpleados('');
                }
            }

            timeout = setTimeout(() => {
                fetchData();
            }, 300);

            return () => {
                clearTimeout(timeout)
            };
        },
        [formik.values.empleado_hace]
    );

    useEffect(() => {
        dispatch({
            payload: formik.values,
            type: actionFacturas.SETFACTURA, 
        });
    }, [formik.values, dispatch]);

    useEffect(() => {

        setPagina('Facturas')

        if (location.state?.clienteSeleccionado){
            const clienteAux = location.state.clienteSeleccionado;

            formik.setFieldValue('cliente_participa', String(clienteAux).trim());

            window.history.replaceState({}, document.title);
        }

        if (location.state?.empleadoSeleccionado){
            const empleadoAux = location.state.empleadoSeleccionado;

            formik.setFieldValue('empleado_hace', String(empleadoAux).trim());

            window.history.replaceState({}, document.title);
        }

        if (location.state?.repuestoSeleccionado && location.state?.index){
            const indice = Number(location.state.index);

            const repuestoSeleccionado = location.state.repuestoSeleccionado;

            const repuestoSeleccionadoLimpio = String(repuestoSeleccionado).trim();

            const nuevosRepuestos = formik.values.se_facturan_en.map((item, i) => {
            if (i === indice) {
                return {
                ...item,
                codigo_repuesto: repuestoSeleccionadoLimpio
                };
            }
            return item;
            });
            
            formik.setFieldValue('se_facturan_en', nuevosRepuestos);

            window.history.replaceState({}, document.title);
        }
    }, [location.state])


    return(
        <>
        <header>
            <Header />
        </header>
        <main>
            <VStack justifyContent='start' alignItems='start' width='100%' bg="#E8F1FF" p={5} >
                <form onSubmit={formik.handleSubmit} style={{width: '100%'}}>
                <Box width='100%'>
                    <Heading as='h2' textAlign='start' color='teal'>Factura</Heading>
                    <Flex align='center' justify='space-between' gap={4} p={3} mt={2} ms={5}>
                        <Text textAlign='start' whiteSpace='pre' p={3} mt={2} ms={5}>
                            <Text display='inline' fontWeight='bold'>Fecha de factura:</Text>                {new Date().toISOString().split('T')[0]}
                        </Text>

                        <FormControl 
                            display='flex'
                            alignItems='center'
                            width='auto'
                            isInvalid={
                                formik.touched.metodo_pago && 
                                !!formik.errors.metodo_pago
                            }
                        >
                            <FormLabel htmlFor="metodo_pago" minW='120px' mb={0}>Método de Pago:</FormLabel>
                            <Select placeholder="Seleccione una opción" width='200px' id='metodo_pago' name="metodo_pago" value={formik.values.metodo_pago} onChange={formik.handleChange}>
                                <option value="efectivo">Efectivo</option>
                                <option value="debito">Débito</option>
                                <option value="cheque">Cheque</option>
                                <option value="transferencia">Transferencia</option>
                                <option value="credito">Crédito</option>
                            </Select>
                            <FormErrorMessage>
                                {formik.errors.metodo_pago}
                            </FormErrorMessage>
                        </FormControl>
                    </Flex>

                    <Box width='100%' mb={5}>
                        <Flex mb={5} borderBottom='1px solid #777' ms={1} width='100%'>
                            <Heading as='h3' fontSize='2xl' width='50%' textAlign='start' color='teal'>Cliente</Heading>
                            <Text width='50%' textAlign='end' me={2}>{dataClientes.razon_social}</Text>
                        </Flex>
                        <Box>
                            <FormControl 
                                flex={1} 
                                isInvalid={
                                    formik.touched.cliente_participa && 
                                    !!formik.errors.cliente_participa
                                }
                                
                            >
                                <Box display='flex' gap={2}>
                                    <AutoComplete
                                    para='clientes'
                                    value={formik.values.cliente_participa}
                                    onChange={(value) => {
                                        formik.setFieldValue('cliente_participa', value);
                                    }}
                                    onSelect={(value) => {
                                        formik.setFieldValue('cliente_participa', value)
                                    }}
                                    error={formik.errors.cliente_participa}
                                    touched={formik.touched.cliente_participa}
                                    ></AutoComplete>
                                    <Button 
                                        type="button"
                                        colorScheme="blue"
                                        boxShadow='md'
                                        onClick={() => {
                                            navigate(`clientes/seleccionar/`);
                                        }}
                                    >
                                        Buscar
                                    </Button>
                                </Box>
                                <FormErrorMessage>
                                    {formik.errors.cliente_participa}
                                </FormErrorMessage>
                            </FormControl>
                            {dataClientes && (
                            <VStack alignItems='start' mt={2} ms={4}>
                                <Text>Domicilio: {dataClientes.direccion}</Text>
                                <Text>CUIT: {dataClientes.cuit}</Text>
                                <Text>Condición IVA: {dataClientes.condicion_iva}</Text>
                                <Text>Nombre: {dataClientes.nombre}</Text>

                            </VStack>
                            )}
                        </Box>
                    </Box>

                </Box>
                    <Box width='100%' mb={5}>
                        <Flex mb={5} borderBottom='1px solid #777' ms={1} width='100%'>
                            <Heading as='h3' fontSize='2xl' width='50%' textAlign='start' color='teal'>Empleado</Heading>
                            <Text width='50%' textAlign='end' me={2}>{dataEmpleados.nombre}</Text>
                        </Flex>
                        <Box>
                            <FormControl 
                                flex={1} 
                                isInvalid={
                                    formik.touched.empleado_hace && 
                                    !!formik.errors.empleado_hace
                                }
                                mb={3}
                            >
                                <Box display='flex' gap={2}>
                                    <AutoComplete
                                    para='empleados'
                                    value={formik.values.empleado_hace}
                                    onChange={(value) => {
                                        formik.setFieldValue('empleado_hace', value);
                                    }}
                                    onSelect={(value) => {
                                        formik.setFieldValue('empleado_hace', value)
                                    }}
                                    error={formik.errors.empleado_hace}
                                    touched={formik.touched.empleado_hace}
                                    ></AutoComplete>
                                    <Button 
                                        type="button"
                                        colorScheme="blue"
                                        boxShadow='md'
                                        onClick={() => {
                                            navigate(`empleados/seleccionar/`);
                                        }}
                                    >
                                        Buscar
                                    </Button>
                                </Box>
                                <FormErrorMessage>
                                    {formik.errors.empleado_hace}
                                </FormErrorMessage>
                            </FormControl>
                            {dataEmpleados && (
                                <VStack alignItems='start' mt={2} ms={4}>
                                    <Text>DNI: {dataEmpleados.dni_empleado}</Text>
                                    <Text>Nombre: {dataEmpleados.nombre}</Text>
                                    <Text>Apellido: {dataEmpleados.apellido}</Text>
                                </VStack>
                            )}
                        </Box>
                    </Box>

                    <Box width='100%' mb={2}>
                        <Flex mb={5} borderBottom='1px solid #777' ms={1} width='100%'>
                            <Heading as='h3' fontSize='2xl' width='50%' textAlign='start' color='teal'>Repuestos</Heading>
                        </Flex>
                        <FormikProvider value={formik.getFieldProps('se_facturan_en')}>
                            <FieldArray name="se_facturan_en">
                            {({ push, remove }) => (
                                <>
                                <Box gap={2} mb={3} width='100%'>
                                    <Grid templateColumns='30% 30% 10% 20% 10%' gap={2} borderBottom='1px solid #777' m={2} mt={8}>
                                        <Box color='teal'>Repuesto</Box>
                                        <Box color='teal'>Descripcion</Box>
                                        <Box color='teal'>Cantidad</Box>
                                        <Box color='teal'>Precio</Box>
                                        <Box color='teal'>Acciones</Box>
                                    </Grid>
                                    {formik.values.se_facturan_en.map((item, index) => (
                                        <>
                                        <Grid templateColumns='30% 30% 10% 20% 10%' gap={2}>
                                            <Box justifySelf='center' alignSelf='center' width='100%'>
                                                <FormControl 
                                                    flex={1} 
                                                    isInvalid={
                                                        formik.touched.se_facturan_en?.[index]?.codigo_repuesto && 
                                                        !!formik.errors.se_facturan_en?.[index]?.codigo_repuesto
                                                    }
                                                    mb={3}
                                                >
                                                    <Box display='flex' gap={2}>
                                                        <AutoComplete
                                                        para='repuestos'
                                                        value={formik.values.se_facturan_en?.[index]?.codigo_repuesto}
                                                        onChange={(value) => {
                                                            formik.setFieldValue(`se_facturan_en.${index}.codigo_repuesto`, value);
                                                        }}
                                                        onSelect={(value) => {
                                                            formik.setFieldValue(`se_facturan_en.${index}.codigo_repuesto`, value)
                                                        }}
                                                        error={formik.errors.se_facturan_en?.[index]?.codigo_repuesto}
                                                        touched={formik.touched.se_facturan_en?.[index]?.codigo_repuesto}
                                                        ></AutoComplete>
                                                        <IconButton 
                                                            type="button"
                                                            colorScheme="blue"
                                                            boxShadow='md'
                                                            size='md'
                                                            onClick={() => {
                                                                navigate(`repuestos/seleccionar/${index}`);
                                                            }}
                                                            icon={<FontAwesomeIcon icon={faMagnifyingGlass} size="sm"/>}
                                                        >
                                                        </IconButton>
                                                    </Box>
                                                        <FormErrorMessage>
                                                            {formik.errors.se_facturan_en?.[index]?.codigo_repuesto}
                                                        </FormErrorMessage>
                                                </FormControl>
                                            </Box>

                                            <Box justifySelf='center' alignSelf='center' width='100%'>
                                                <FormControl
                                                    flex={1}
                                                    isInvalid={
                                                    formik.touched.se_facturan_en?.[index]?.descripcion &&
                                                    !!formik.errors.se_facturan_en?.[index]?.descripcion
                                                    }
                                                    mb={3}
                                                >
                                                    <Text id="descripcion">{formik.values.se_facturan_en?.[index].descripcion || ""}</Text>
                                                </FormControl>
                                            </Box>

                                            <Box justifySelf='center' alignSelf='center' width='100%'>
                                                <FormControl 
                                                    flex={1} 
                                                    isInvalid={
                                                        formik.touched.se_facturan_en?.[index]?.cantidad && 
                                                        !!formik.errors.se_facturan_en?.[index]?.cantidad
                                                    }
                                                    mb={3}
                                                >
                                                    <NumberInput id="cantidad" min={1} step={1} value={formik.values.se_facturan_en?.[index]?.cantidad}
                                                    onChange={(value) => formik.setFieldValue(`se_facturan_en.${index}.cantidad`, value)}>
                                                        <NumberInputField />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                    <FormErrorMessage>
                                                        {formik.errors.se_facturan_en?.[index]?.cantidad}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            </Box>

                                            <Box justifySelf='center' alignSelf='center' width='100%'>
                                                <FormControl 
                                                    flex={1} 
                                                    isInvalid={
                                                        formik.touched.se_facturan_en?.[index]?.precio && 
                                                        !!formik.errors.se_facturan_en?.[index]?.precio
                                                    }
                                                    mb={3}
                                                >
                                                    <NumberInput id="precio" min={0} precision={2} step={100} value={formik.values.se_facturan_en?.[index].precio}
                                                    onChange={(value) => formik.setFieldValue(`se_facturan_en.${index}.precio`, value)}>
                                                        <NumberInputField />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                    <FormErrorMessage>
                                                        {formik.errors.se_facturan_en?.[index]?.precio}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            </Box>        
                                            
                                            <Box justifySelf='start' alignSelf='baseline' width='100%'>
                                                <IconButton size='sm' boxShadow='sm' colorScheme="red" icon={<FontAwesomeIcon icon={faXmark} color='black' fade/> 
                                                    } 
                                                    onClick={ () => {
                                                    const nuevoRepuesto = formik.values.se_facturan_en.filter((_, i) => i !== index);
                                                    formik.setFieldValue('se_facturan_en', nuevoRepuesto);
                                                }
                                                    }
                                                    isDisabled= {
                                                        formik.values.se_facturan_en.length === 1
                                                    }
                                                />
                                            </Box>
                                        </Grid>
                                    </>
                                    ))}
                                </Box>


                                <Button
                                    type="button"
                                    colorScheme="blue"
                                    width='100%'
                                    onClick={() => {
                                        formik.setFieldValue('se_facturan_en', [
                                            ...formik.values.se_facturan_en,
                                            {
                                                codigo_repuesto: '',
                                                descripcion: '',
                                                cantidad: 0,
                                                precio: 0,
                                                subtotal: 0,
                                            }
                                        ]);
                                    }}
                                    mb={4}
                                >
                                    Agregar Repuesto
                                </Button>
                            </>
                            )}
                            </FieldArray>
                            {formik.errors.se_facturan_en && typeof formik.errors.se_facturan_en === 'string' && (
                                <Alert status="error" mb={4}>
                                    <AlertIcon />
                                    {formik.errors.se_facturan_en}
                                </Alert>
                            )}
                    </FormikProvider>
                </Box>

                <VStack alignItems='flex-end' mt={6}>
                    <Button mt={4} colorScheme="teal" type="submit" isLoading={loading} spinner={<BeatLoader size={8} color="white" />}>
                        Confirmar
                    </Button>
                </VStack>

            </form>

            </VStack>
        </main>
        </>
    )
}

export default FacturasPost;