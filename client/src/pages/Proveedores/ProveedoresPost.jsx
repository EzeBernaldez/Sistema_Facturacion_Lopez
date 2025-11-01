import React, { useState } from "react";
import Header from "../../components/Header";
import * as Yup from 'yup';
import { FieldArray, useFormik, FormikProvider } from 'formik';
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
    Heading,
    Stack,
    Grid,
    Select,
    IconButton,
    useToast
} from '@chakra-ui/react';
import api from "../../utils/api";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from 'react-toastify';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContexto } from "../../contexts/GlobalContext";



const ProveedoresPost = () => {

    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const toastC = useToast({
        position: 'top',
    })

    const {
        pagina
    } = useContexto();

    const formik = useFormik({
        initialValues: {
            codigo_proveedores: '',
            correo: '',
            nombre: '',
            nombre: '',
            telefonos_proveedores: [{numero:""}],
            direccion: '',
        },
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            try{

                const payload = {
                    ...values
                };
                await api.post('/api/proveedores', payload);
                
                setLoading(false);
                formik.resetForm();
                toast.success("Proveedor cargado correctamente");

                if (pagina === 'ProveedoresSeleccionar'){
                    navigate('/repuestos/nuevo/proveedores/seleccionar');
                }
                else{
                    navigate('/proveedores');
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
                        toastC({
                            status: 'error',
                            isClosable: true,
                            title: `Error al crear el proveedor en ${field}`,
                        })
                    })
                } else {
                    setError('Error al crear el proveedor. Intente nuevamente.');
                    toastC({
                            status: 'error',
                            isClosable: true,
                            title: error
                        })
                }
                console.error('Error:', err.response?.data);
            }
        },
        validationSchema: Yup.object({
            codigo_proveedores: Yup.string().trim().max(30, 'Debe ingresar un código menor a 30 dígitos').required('Debe ingresar un código de proveedor.'),
            correo: Yup.string().email('Debe ingresar un email válido').required('Debe ingresar un email'),
            nombre: Yup.string().trim().min(3,'Debe ingresar un nombre más extenso').max(100,'Ingrese un nombre más acotado. Recomendado: Utilice abreviaciones').required("El nombre es obligatorio"),
            direccion: Yup.string().min(5,'Debe ingresar una dirección más detallada').max(200,'Debe ingresar una dirección más acotada.').required('Debe ingresar una direccion'),
            telefonos_proveedores: Yup.array()
                .of(
                    Yup.object().shape({
                    numero: Yup.string().max(20,'Debe ingresar un número menor a 20 caracteres').required("Número obligatorio"),
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
                    <Heading as='h2' fontSize='2xl' mb={4}>Nuevo Proveedor</Heading>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack gap="4" alignItems='flex-start'>
                            <FormControl width='100%' isInvalid={formik.touched.codigo_proveedores && !!formik.errors.codigo_proveedores}>
                                <FormLabel htmlFor="codigo_proveedor">Código de proveedor:</FormLabel>
                                <Input
                                id="codigo_proveedor"
                                width='100%'
                                border='1px solid #A0BDE8'
                                {...formik.getFieldProps("codigo_proveedores")}
                                />
                                <FormErrorMessage>{formik.errors.codigo_proveedores}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.correo && !!formik.errors.correo}>
                                <FormLabel htmlFor="correo">Correo:</FormLabel>
                                <Input
                                    id='correo'
                                    type="email"
                                    placeholder="usuario@correo.com"
                                    {...formik.getFieldProps('correo')}
                                />
                                <FormErrorMessage>{formik.errors.correo}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.nombre && !!formik.errors.nombre}>
                                <FormLabel htmlFor="nombre">Nombre</FormLabel>
                                <Input
                                    id='nombre'
                                    {...formik.getFieldProps('nombre')}
                                />
                                <FormErrorMessage>{formik.errors.nombre}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.direccion && !!formik.errors.direccion}>
                                <FormLabel htmlFor="direccion">Dirección:</FormLabel>
                                <Input
                                    id='direccion'
                                    {...formik.getFieldProps('direccion')}
                                />
                                <FormErrorMessage>{formik.errors.direccion}</FormErrorMessage>
                            </FormControl>
                            <FormikProvider value={formik.getFieldProps('telefonos_proveedores')}>
                                <form onSubmit={formik.handleSubmit} style={{
                                    width: '100%',
                                }}>
                                    <FieldArray name="telefonos_proveedores">
                                    {({ push, remove }) => (
                                        <>
                                        {formik.values.telefonos_proveedores.map((tel, index) => (
                                            <Box key={index} display="flex" gap={2} mb={3} width='100%'>
                                                <FormControl 
                                                    flex={1} 
                                                    isInvalid={
                                                        formik.touched.telefonos_proveedores?.[index]?.numero && 
                                                        !!formik.errors.telefonos_proveedores?.[index]?.numero
                                                    }
                                                >
                                                    <FormLabel>Número {index + 1}</FormLabel>
                                                    <Input 
                                                        placeholder="+541112345678"
                                                        {...formik.getFieldProps(`telefonos_proveedores.${index}.numero`)}
                                                    />
                                                    <FormErrorMessage>
                                                        {formik.errors.telefonos_proveedores?.[index]?.numero}
                                                    </FormErrorMessage>
                                                </FormControl>

                                                <IconButton shadow='lg' colorScheme='grey' mt={8} ms={1} icon={<FontAwesomeIcon icon={faXmark} color='black' fade/> 
                                                        } 
                                                        onClick={ () => {
                                                        const nuevosTelefonos = formik.values.telefonos_proveedores.filter((_, i) => i !== index);
                                                        formik.setFieldValue('telefonos_proveedores', nuevosTelefonos);
                                                    }
                                                        }
                                                        isDisabled= {
                                                            formik.values.telefonos_proveedores.length === 1
                                                        }
                                                    />
                                            </Box>
                                        ))}

                                        <Button
                                            type="button"
                                            colorScheme="blue"
                                            onClick={() => {
                                                formik.setFieldValue('telefonos_proveedores', [
                                                    ...formik.values.telefonos_proveedores,
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

export default ProveedoresPost;