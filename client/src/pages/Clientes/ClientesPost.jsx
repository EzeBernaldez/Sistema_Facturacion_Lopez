import React, { useState } from "react";
import Header from "../../components/Header";
import * as Yup from 'yup';
import { Field, FieldArray, useFormik, FormikProvider } from 'formik';
import { useNavigate } from "react-router-dom";
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
} from '@chakra-ui/react';
import api from "../../utils/api";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


const ClientesPost = () => {

    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            codigo: '',
            correo: '',
            condicion_iva: '',
            nombre: '',
            razon_social: '',
            telefonos_clientes: [{numero:""}],
            cuit: '',
            direccion: '',
        },
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            try{

                const payload = {
                    ...values
                };
                await api.post('/api/clientes', payload);
                
                setLoading(false);
                formik.resetForm();
                toast.success("Cliente cargado correctamente");
                if (pagina === 'ClientesSeleccionar'){
                    navigate('/facturas/nuevo/clientes/seleccionar');
                }
                else{
                    navigate('/clientes');
                }
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
                    setError('Error al crear el cliente. Intente nuevamente.');
                }
                console.error('Error:', err.response?.data);
            }
        },
        validationSchema: Yup.object({
            codigo: Yup.string().trim().max(30, 'Debe ingresar un código menor a 30 dígitos').required('Debe ingresar un código de repuesto.'),
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
                <Box borderRadius='lg' boxShadow="md" p={8} width='80%' opacity='0.95' bg='#DAE8FD'>
                    <Heading as='h2' fontSize='2xl' mb={4}>Nuevo Cliente</Heading>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack gap="4" alignItems='flex-start'>
                            <FormControl width='100%' isInvalid={formik.touched.codigo && !!formik.errors.codigo}>
                                <FormLabel htmlFor="codigo">Código:</FormLabel>
                                <Input
                                id="codigo"
                                width='100%'
                                border='1px solid #A0BDE8'
                                {...formik.getFieldProps("codigo")}
                                />
                                <FormErrorMessage>{formik.errors.codigo}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.correo && !!formik.errors.correo}>
                                <FormLabel htmlFor="correo">Correo:</FormLabel>
                                <Textarea
                                    id='correo'
                                    placeholder="Ingrese la descripción de su producto"
                                    {...formik.getFieldProps('correo')}
                                />
                                <FormErrorMessage>{formik.errors.correo}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.condicion_iva && !!formik.errors.condicion_iva}>
                                <FormLabel htmlFor="condicion_iva">Condición de IVA:</FormLabel>
                                <Select
                                    id='condicion_iva'
                                    placeholder="Seleccione una condición"
                                    {...formik.getFieldProps('condicion_iva')}
                                >
                                    <option value='Monotributo'>Monotributo</option>
                                    <option value="Inscripto">Responsable Inscripto</option>
                                    <option value="NoInscripto">Responsable No Inscripto</option>
                                    <option value="Exento">Exento</option>
                                </Select>
                                <FormErrorMessage>{formik.errors.condicion_iva}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.nombre && !!formik.errors.nombre}>
                                <FormLabel htmlFor="nombre">Nombre</FormLabel>
                                <Input
                                    id='nombre'
                                    {...formik.getFieldProps('nombre')}
                                />
                                <FormErrorMessage>{formik.errors.nombre}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.razon_social && !!formik.errors.razon_social}>
                                <FormLabel htmlFor="razon_social">Razon Social:</FormLabel>
                                <Input
                                    id='razon_social'
                                    {...formik.getFieldProps('razon_social')}
                                />
                                <FormErrorMessage>{formik.errors.condicion_iva}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.cuit && !!formik.errors.cuit}>
                                <FormLabel htmlFor="tipo">CUIT:</FormLabel>
                                <Input
                                    id='cuit'
                                    {...formik.getFieldProps('cuit')}
                                />
                                <FormErrorMessage>{formik.errors.cuit}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.direccion && !!formik.errors.direccion}>
                                <FormLabel htmlFor="tipo">Dirección:</FormLabel>
                                <Input
                                    id='direccion'
                                    {...formik.getFieldProps('direccion')}
                                />
                                <FormErrorMessage>{formik.errors.direccion}</FormErrorMessage>
                            </FormControl>
                            <FormikProvider value={formik.getFieldProps('telefonos_clientes')}>
                                <form onSubmit={formik.handleSubmit} style={{
                                    width: '100%',
                                }}>
                                    <FieldArray name="telefonos_clientes">
                                    {({ push, remove }) => (
                                        <>
                                        {formik.values.telefonos_clientes.map((tel, index) => (
                                            <Box key={index} display="flex" gap={2} mb={3} width='100%'>
                                                <FormControl 
                                                    flex={1} 
                                                    isInvalid={
                                                        formik.touched.telefonos_clientes?.[index]?.numero && 
                                                        !!formik.errors.telefonos_clientes?.[index]?.numero
                                                    }
                                                >
                                                    <FormLabel>Número {index + 1}</FormLabel>
                                                    <Input 
                                                        placeholder="+541112345678"
                                                        {...formik.getFieldProps(`telefonos_clientes.${index}.numero`)}
                                                    />
                                                    <FormErrorMessage>
                                                        {formik.errors.telefonos_clientes?.[index]?.numero}
                                                    </FormErrorMessage>
                                                </FormControl>

                                                <IconButton shadow='lg' colorScheme='grey' mt={8} ms={1} icon={<FontAwesomeIcon icon={faXmark} color='black' fade/> 
                                                        } 
                                                        onClick={ () => {
                                                        const nuevosTelefonos = formik.values.telefonos_clientes.filter((_, i) => i !== index);
                                                        formik.setFieldValue('telefonos_clientes', nuevosTelefonos);
                                                    }
                                                        }
                                                        isDisabled= {
                                                            formik.values.telefonos_clientes.length === 1
                                                        }
                                                    />
                                            </Box>
                                        ))}

                                        <Button
                                            type="button"
                                            colorScheme="blue"
                                            onClick={() => {
                                                formik.setFieldValue('telefonos_clientes', [
                                                    ...formik.values.telefonos_clientes,
                                                    { numero: ''}
                                                ]);
                                            }}
                                            mb={4}
                                        >
                                            + Agregar Teléfono
                                        </Button>
                                        </>
                                    )}
                                    </FieldArray>
                                </form>
                            </FormikProvider>
                        </VStack>
                        <VStack alignItems='flex-end' mt={6}>
                            <Button mt={4} colorScheme="teal" type="submit" isLoading={loading} spinner={<BeatLoader size={8} color="white" />}>
                                Confirmar
                            </Button>
                        </VStack>

                    </form>
                </Box>
            </Stack>
        </main>
        </>
    )
};

export default ClientesPost;