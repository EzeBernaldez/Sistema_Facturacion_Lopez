import React, { useState } from "react";
import Header from "../../components/Header";
import * as Yup from 'yup';
import { useFormik, FormikProvider, FieldArray } from 'formik';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    VStack,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Button,
    Collapse,
    Alert,
    AlertIcon,
    Textarea,
    IconButton,
    Heading,
    Stack,
    Select,
    SimpleGrid,
    Flex,
    Text,
} from '@chakra-ui/react';
import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import api from "../../utils/api";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from 'react-toastify';


const ClientesPatch = () => {
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const { codigo } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchRepuesto = async () => {
            try {
                const response = await api.get(`/api/clientes/cliente/${codigo}`);
                const { telefonos, ...datos } = response.data;
                const cliente = {
                    ...datos,
                    telefonos_clientes: telefonos,
                };
                formik.setValues(cliente);
            } catch (err) {
                console.error("Error actualizando cliente:", err);
            }
        };
        fetchRepuesto();
    }, [codigo]);

    const formik = useFormik({
        initialValues: {
            codigo: '',
            correo: '',
            nombre: '',
            condicion_iva: '',
            razon_social: '',
            cuit: '',
            direccion: '',
            telefonos_clientes: [{numero: ''}],
        },
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            try{
                const payload = {
                    ...values
                };
                await api.patch(`/api/clientes/cliente/${codigo}`, payload);
                
                setLoading(false);
                formik.resetForm();
                toast.success("El cliente se actualizó correctamente")
                navigate('/clientes');
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
            correo: Yup.string().email('Debe ingresar un correo válido').max(254,'Debe ingresar un email más acotado').required('Debe ingresar un correo.'),
            condicion_iva: Yup.string().trim().required('Debe ingresar una condicion de iva.'),
            nombre: Yup.string().trim(),
            razon_social: Yup.string().max(50,'Debe ingresar una razón social más corta').required("Debe ingresar una razon social"),
            cuit: Yup.string().max(50, 'Debe ingresar un cuit válido.').required('Debe ingresar un cuit'),
            direccion: Yup.string().required('Debe ingresar una direccion'),
            telefonos_clientes: Yup.array()
                .of(
                    Yup.object().shape({
                    numero: Yup.string().required("Número obligatorio"),
                    })
                )
                .min(1, "Debe ingresar al menos un teléfono"),
        })
    });
    
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
                <Box borderRadius='lg' boxShadow="md" p={8} width='90%' opacity='0.95' bg='#DAE8FD' mt={5}>
                    <Heading as='h2' fontSize='2xl' mb={4}>Cliente</Heading>
                    <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                        {/* Cliente */}
                        <FormControl>
                        <FormLabel fontWeight="medium">Id Cliente</FormLabel>
                        <Input placeholder="Jose Luis" />
                        </FormControl>

                        {/* Teléfono */}
                        <FormControl>
                        <FormLabel fontWeight="medium">Nombre</FormLabel>
                        <Input placeholder="506 7070-7888" />
                        </FormControl>

                        {/* Email */}
                        <FormControl>
                        <FormLabel fontWeight="medium">Correo</FormLabel>
                        <Input placeholder="jose@test.com" type="email" />
                        </FormControl>
                        
                    </SimpleGrid>

                    <SimpleGrid columns={[1, 2, 3]} spacing={6} mt={6}>
                        {/* Vendedor */}
                        <FormControl>
                        <FormLabel fontWeight="medium">Razon Social</FormLabel>
                        <Input placeholder="razon social"/>
                        </FormControl>

                        {/* Fecha */}
                        <FormControl>
                        <FormLabel fontWeight="medium">CUIT</FormLabel>
                        <Input placeholder="cuit"/>
                        </FormControl>

                        {/* Pago */}
                        <FormControl>
                        <FormLabel fontWeight="medium">Direccion</FormLabel>
                        <Input placeholder="direccion"/>
                        </FormControl>

                    </SimpleGrid>
                    
                    <Flex justifyContent="end">
                        <Button colorScheme="blue" type="submit" mt={6} ms={3} icon={faMagnifyingGlass}>
                            <FontAwesomeIcon icon={faPlus} fontSize='1rem
                                '/>
                            <Text ms={1}>Nuevo Cliente</Text>
                        </Button>
                        <Button colorScheme="teal" type="submit" mt={6} ms={3} icon={faMagnifyingGlass}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} fontSize='1rem
                                '/>
                            <Text ms={1}>Buscar Cliente</Text>
                        </Button>
                        
                    </Flex>
                </Box>
            </Stack>
        </main>
        </>
    )
}

export default ClientesPatch;