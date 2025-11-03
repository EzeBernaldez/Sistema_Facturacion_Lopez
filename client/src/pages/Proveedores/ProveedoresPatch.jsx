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
    useToast,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import api from "../../utils/api";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from 'react-toastify';


const ProveedoresPatch = () => {
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const { codigo } = useParams();
    const navigate = useNavigate();
    const toastC = useToast({
        position: 'top',
    })


    useEffect(() => {
        const fetchRepuesto = async () => {
            try {
                const response = await api.get(`/api/proveedores/proveedor/${codigo}`);
                const { telefonos, ...datos } = response.data;
                const proveedor = {
                    ...datos,
                    telefonos_proveedores: telefonos,
                };
                formik.setValues(proveedor);
            } catch (err) {
                console.error("Error actualizando proveedor:", err);
            }
        };
        fetchRepuesto();
    }, [codigo]);

    const formik = useFormik({
        initialValues: {
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
                await api.patch(`/api/proveedores/proveedor/${codigo}`, payload);
                
                setLoading(false);
                formik.resetForm();
                toast.success("El proveedor se actualizó correctamente")
                navigate('/proveedores');
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
                            title: `404 - Error al actualizar el proveedor en ${field}`,
                        })
                    })
                } else {
                    setError('Error al actualizar el proveedor. Intente nuevamente.');
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
            correo: Yup.string().email('Debe ingresar un email válido').required('Debe ingresar un email'),
            nombre: Yup.string().trim().min(3,'Debe ingresar un nombre más extenso').max(100,'Ingrese un nombre más acotado. Recomendado: Utilice abreviaciones').required("El nombre es obligatorio"),
            direccion: Yup.string().min(5,'Debe ingresar una dirección más detallada').max(200,'Debe ingresar una dirección más acotada.').required('Debe ingresar una direccion'),
            telefonos_proveedores: Yup.array()
                .of(
                    Yup.object().shape({
                    numero: Yup.string().max(20,'Debe ingresar un número menor a 20 caracteres').required("Número obligatorio"),
                    })
                )
                .min(1, "Debe ingresar al menos un teléfono")
                .test('telefonos-unicos', 'No pueden haber teléfonos repetidos', function (value) {
                    if (!value) return true;
                    const telefonos = value.map(item => item.numero);
                    const telefonosUnicos = [...new Set(telefonos)];
                    return telefonos.length === telefonosUnicos.length;
                }),
                    
        })
    });
    
    return(
        <>
        <header>
            <Header />
        </header>
        <main>
            <Stack alignItems='center' justifyContent='center' width='100%' bg="#E8F1FF" p={5}>
                <Box borderRadius='lg' boxShadow="md" p={8} width='80%' opacity='0.95' bg='#DAE8FD'>
                    <Heading as='h2' fontSize='2xl' mb={4}>Actualizar Proveedor</Heading>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack gap="4" alignItems='flex-start'>
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
                                                    <FormLabel>Teléfono {index + 1}</FormLabel>
                                                    <Input 
                                                        placeholder="+541112345678"
                                                        type="number"
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
                                    {formik.errors.telefonos_proveedores && typeof formik.errors.telefonos_proveedores === 'string' && (
                                        <Alert status="error" mb={4}>
                                            <AlertIcon />
                                            {formik.errors.telefonos_proveedores}
                                        </Alert>
                                    )}
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
}

export default ProveedoresPatch;