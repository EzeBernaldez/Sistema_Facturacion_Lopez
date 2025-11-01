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
    useToast,
} from '@chakra-ui/react';
import api from "../../utils/api";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useContexto } from "../../contexts/GlobalContext";


const SemirremolquePost = () => {

    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const toastC = useToast({
        position: 'top',
    })

    const { pagina } = useContexto();

    const formik = useFormik({
        initialValues: {
            modelo: '',
            ano_fabricacion: '',
            marca: '',
            motor: '-',
            tipo_vehiculo:'Semirremolque',
            tipo_semirremolque:'',
        },
        onSubmit: async (values) => {
            console.log(values)
            setLoading(true);
            setError('');
            try{

                const payload = {
                    ...values
                };
                await api.post('/api/vehiculos', payload);
                
                setLoading(false);
                formik.resetForm();
                toast.success("Semirremolque cargado correctamente");
                navigate('/vehiculos');
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
                            title: errorMessage
                        })
                    })
                } else {
                    setError('Error al crear el semirremolque. Intente nuevamente.');
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
            codigo_vehiculos: Yup.string().trim().max(30, 'Debe ingresar un código menor a 30 dígitos').required('Debe ingresar un código de semirremolque.'),
            modelo: Yup.string().trim().max(30,'Debe ingresar modelo mas acotado').required('Debe ingresar un modelo.'),
            ano_fabricacion: Yup.date().required('Debe ingresar una fecha.').typeError('Debe ingresar una fecha válida.'),
            marca: Yup.string().trim().max(30,'Debe ingresar una marca mas acotado').required('Debe ingresar una marca.'),
            tipo_semirremolque: Yup.string().max(30,'Debe ingresar un tipo de semirremolque mas corto').required("Debe ingresar un tipo de semirremolque"),
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
                    <Heading as='h2' fontSize='2xl' mb={4}>Nuevo Semirremolque</Heading>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack gap="4" alignItems='flex-start'>
                            <FormControl width='100%' isInvalid={formik.touched.codigo_vehiculos && !!formik.errors.codigo_vehiculos}>
                                <FormLabel htmlFor="codigo_vehiculos">Código:</FormLabel>
                                <Input
                                id="codigo_vehiculos"
                                width='100%'
                                border='1px solid #A0BDE8'
                                {...formik.getFieldProps("codigo_vehiculos")}
                                />
                                <FormErrorMessage>{formik.errors.codigo_vehiculos}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.modelo && !!formik.errors.modelo}>
                                <FormLabel htmlFor="modelo">Modelo:</FormLabel>
                                <Textarea
                                    id='modelo'
                                    placeholder="Ingrese el modelo del semirremolque"
                                    {...formik.getFieldProps('modelo')}
                                />
                                <FormErrorMessage>{formik.errors.modelo}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.ano_fabricacion && !!formik.errors.ano_fabricacion}>
                                <FormLabel htmlFor="fecha">Año de Fabricacion:</FormLabel>
                                <Input
                                    id='ano_fabricacion'
                                    size='md'
                                    type="date"
                                    {...formik.getFieldProps('ano_fabricacion')}
                                />
                                <FormErrorMessage>{formik.errors.ano_fabricacion}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.marca && !!formik.errors.marca}>
                                <FormLabel htmlFor="marca">Marca:</FormLabel>
                                <Input
                                    id='marca'
                                    {...formik.getFieldProps('marca')}
                                />
                                <FormErrorMessage>{formik.errors.marca}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.tipo_semirremolque && !!formik.errors.tipo_semirremolque}>
                                <FormLabel htmlFor="tipo_semirremolque">Tipo de Semirremolque:</FormLabel>
                                <Input
                                    id='tipo_semirremolque'
                                    {...formik.getFieldProps('tipo_semirremolque')}
                                />
                                <FormErrorMessage>{formik.errors.tipo_semirremolque}</FormErrorMessage>
                            </FormControl>
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

export default SemirremolquePost;