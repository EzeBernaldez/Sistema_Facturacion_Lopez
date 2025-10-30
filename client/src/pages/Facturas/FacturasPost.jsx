import React, { useState } from "react";
import Header from "../../components/Header";
import * as Yup from 'yup';
import { useFormik, FormikProvider, FieldArray } from 'formik';
import { useNavigate } from "react-router-dom";
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
    VStack
} from '@chakra-ui/react';
import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import api from "../../utils/api";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from 'react-toastify';
import AutoComplete from "../../components/AutoComplete";


const ClientesPatch = () => {
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const { codigo } = useParams();
    const navigate = useNavigate();
    let [dataClientes, setDataClientes] = useState('');
    let [dataEmpleados, setDataEmpleados] = useState('');

    const formik = useFormik({
        initialValues: {
            metodo_pago: '',
            cliente_participa: '',
            empleado_hace: '',
            se_facturan_en: [{
                codigo_repuesto: '',
                cantidad: 0,
                precio: 0,
                subtotal: 0,
            }]
        },
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            try{

                let total = 0;
                
                formik.values.se_facturan_en.map((item, index) => {
                    const subtotalParcial = Number(formik.values.se_facturan_en?.[index]?.cantidad * formik.values.se_facturan_en?.[index]?.precio);
                    formik.setFieldValue(`se_facturan_en.${index}.subtotal`, subtotalParcial);
                    total += subtotalParcial;
                }) 

                const fechaActual = new Date().toISOString().split('T')[0];
                const payload = {
                    ...values,
                    fecha: fechaActual,
                    total: total,
                    metodo_pago: 'efectivo',
                };

                console.log(payload)

                await api.post(`/api/facturas`, payload);
                
                setLoading(false);
                formik.resetForm();
                toast.success("La factura se cargó correctamente")
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
                    })
                } else {
                    setError('Error al actualizar el cliente. Intente nuevamente.');
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
                    cantidad: Yup.number().min(1, 'La cantidad debe ser mayor a 1').required('Debe ingresar la cantidad requerida del repuesto'),
                    precio: Yup.number().required('Debe ingresar el precio del repuesto'),
                    })
                )
                .min(1, "Debe ingresar al menos un teléfono"),
        })
    });
    
    useEffect(
        () => {
            const fetchData = async () =>{
                try{
    
                    const response = await api.get(`api/clientes/cliente/${formik.values.cliente_participa}`);
                    setDataClientes(JSON.stringify(response.data));
                
                }
                catch(err){
                    setDataClientes('');
                }
            }
            fetchData();
        },
        [formik.values.cliente_participa]
    )

    useEffect(
        () => {
            const fetchData = async () =>{
                try{
    
                    const response = await api.get(`api/empleados/empleado/${formik.values.empleado_hace}`);
                    setDataEmpleados(JSON.stringify(response.data));
                
                }
                catch(err){
                    setDataEmpleados('');
                }
            }
            fetchData();
        },
        [formik.values.empleado_hace]
    );


    return(
        <>
        <Collapse in={!!error} animateOpacity>
                <Box
                    position="fixed"
                    top="1rem"
                    left='50%'
                    transform="translateX(-50%)"
                    zIndex={9999}
                    w="90%"
                    maxW="lg"
                >
                    <Alert status='error' variant="left-accent" borderRadius="md" boxShadow="md">
                    <AlertIcon />
                        {error}
                    </Alert>
                </Box>
        </Collapse>
        <header>
            <Header />
        </header>
        <main>
            <Stack alignItems='center' justifyContent='center' width='100%' bg="#E8F1FF" p={5}>
                <form onSubmit={formik.handleSubmit}>
                    <Box borderRadius='lg' boxShadow="md" p={8} width='90%' opacity='0.95' bg='#DAE8FD' mt={4}>
                        <Heading as='h2' fontSize='2xl' mb={4}>Cliente</Heading>
                        <Box>
                            <FormControl 
                                flex={1} 
                                isInvalid={
                                    formik.touched.cliente_participa && 
                                    !!formik.errors.cliente_participa
                                }
                                mb={3}
                            >
                                <FormLabel>Cliente</FormLabel>
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
                            <Accordion defaultIndex={[0]} allowToggle>
                                <AccordionItem>
                                    <h3>
                                        <AccordionButton _expanded={{ bg: 'teal', color: 'white' }} borderRadius='lg'>
                                            <Box as='span' flex={1} textAlign='left' >
                                                Ver Detalle del Cliente
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h3>
                                    <AccordionPanel pb={2}>
                                            <Text>
                                                {dataClientes}
                                            </Text>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                            )}
                        </Box>
                    </Box>


                    <Box borderRadius='lg' boxShadow="md" p={8} width='90%' opacity='0.95' bg='#DAE8FD' mt={4}>
                        <Heading as='h2' fontSize='2xl' mb={4}>Empleado</Heading>
                        <Box>
                            <FormControl 
                                flex={1} 
                                isInvalid={
                                    formik.touched.empleado_hace && 
                                    !!formik.errors.empleado_hace
                                }
                                mb={3}
                            >
                                <FormLabel>Empleado</FormLabel>
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
                            <Accordion defaultIndex={[0]} allowMultiple>
                                <AccordionItem>
                                    <h3>
                                        <AccordionButton _expanded={{ bg: 'teal', color: 'white' }} borderRadius='lg'>
                                            <Box as='span' flex={1} textAlign='left' >
                                                Ver Detalle del Empleado
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h3>
                                    <AccordionPanel pb={2}>
                                            <Text>
                                                {dataEmpleados}
                                            </Text>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                            )}
                        </Box>
                    </Box>

                    <Box borderRadius='lg' boxShadow="md" p={8} width='90%' opacity='0.95' bg='#DAE8FD' mt={4}>
                        <FormikProvider value={formik.getFieldProps('se_facturan_en')}>
                            <FieldArray name="se_facturan_en">
                            {({ push, remove }) => (
                                <>
                                <Box gap={2} mb={3} width='100%'>
                                    <Accordion allowMultiple defaultIndex={[0]}>
                                        {formik.values.se_facturan_en.map((item, index) => (
                                            <>
                                            <AccordionItem mb={3} borderRadius='lg'
                                            boxShadow="md">
                                                <h2>
                                                    <AccordionButton  _expanded={{ bg: 'teal', color: 'white' }} borderRadius='lg' >
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
                                                        <Box as='span' flex='1' textAlign='center'>
                                                            Repuesto {index + 1}
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                
                                                <AccordionPanel pb={4} >
                                                    <FormControl 
                                                        flex={1} 
                                                        isInvalid={
                                                            formik.touched.se_facturan_en?.[index]?.codigo_repuesto && 
                                                            !!formik.errors.repuestos?.[index]?.codigo_repuesto
                                                        }
                                                        mb={3}
                                                    >
                                                        <FormLabel>Repuesto</FormLabel>
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
                                                                <Button 
                                                                    type="button"
                                                                    colorScheme="blue"
                                                                    boxShadow='md'
                                                                    onClick={() => {
                                                                        navigate(`repuestos/seleccionar/${formik.values.proveedor}/${index}`);
                                                                    }}
                                                                >
                                                                    Buscar
                                                                </Button>
                                                            </Box>
                                                            <FormErrorMessage>
                                                                {formik.errors.se_facturan_en?.[index]?.codigo_repuesto}
                                                            </FormErrorMessage>
                                                    </FormControl>

                                                    <FormControl 
                                                        flex={1} 
                                                        isInvalid={
                                                            formik.touched.se_facturan_en?.[index]?.precio && 
                                                            !!formik.errors.se_facturan_en?.[index]?.precio
                                                        }
                                                        mb={3}
                                                    >
                                                        <FormLabel htmlFor="precio">Precio:</FormLabel>
                                                        <NumberInput id="precio" min={0} precision={2} step={0.05} value={formik.values.se_facturan_en?.[index].precio}
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

                                                    <FormControl 
                                                        flex={1} 
                                                        isInvalid={
                                                            formik.touched.se_facturan_en?.[index]?.cantidad && 
                                                            !!formik.errors.se_facturan_en?.[index]?.cantidad
                                                        }
                                                        mb={3}
                                                    >
                                                        <FormLabel htmlFor="cantidad">Cantidad</FormLabel>
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



                                                </AccordionPanel>
                                                
                                        </AccordionItem>
                                        </>
                                        ))}
                                    </Accordion>
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
                    </FormikProvider>
                </Box>

                <VStack alignItems='flex-end' mt={6}>
                    <Button mt={4} colorScheme="teal" type="submit" isLoading={loading} spinner={<BeatLoader size={8} color="white" />}>
                        Confirmar
                    </Button>
                </VStack>

            </form>

            </Stack>
        </main>
        </>
    )
}

export default ClientesPatch;