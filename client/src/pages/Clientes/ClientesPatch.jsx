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


const ClientesPatch = () => {
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
                        toastC({
                            status: 'error',
                            isClosable: true,
                            title: `404 - Error al actualizar el cliente en ${field}`,
                        })
                    })
                } else {
                    setError('Error al actualizar el cliente. Intente nuevamente.');
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
                    <Heading as='h2' fontSize='2xl' mb={4}>Actualizar Cliente</Heading>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack gap="4" alignItems='flex-start'>
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
                                <FormErrorMessage>{formik.errors.razon_social}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.cuit && !!formik.errors.cuit}>
                                <FormLabel htmlFor="tipo">CUIT:</FormLabel>
                                <Input
                                    id='cuit'
                                    {...formik.getFieldProps('cuit')}
                                />
                                <FormErrorMessage>{formik.errors.cuit}</FormErrorMessage>
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
                            <FormControl width='100%' isInvalid={formik.touched.correo && !!formik.errors.correo}>
                                <FormLabel htmlFor="correo">Correo:</FormLabel>
                                <Textarea
                                    id='correo'
                                    placeholder="Ingrese la descripción de su producto"
                                    {...formik.getFieldProps('correo')}
                                />
                                <FormErrorMessage>{formik.errors.correo}</FormErrorMessage>
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
                                                        type="number"
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
                                    {formik.errors.telefonos_clientes && typeof formik.errors.telefonos_clientes === 'string' && (
                                        <Alert status="error" mb={4}>
                                            <AlertIcon />
                                            {formik.errors.telefonos_clientes}
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

export default ClientesPatch;