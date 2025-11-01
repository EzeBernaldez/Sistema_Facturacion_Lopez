import React, { useState, useEffect } from "react";

import Header from "../../components/Header";
import * as Yup from 'yup';
import { Field, FieldArray, useFormik, FormikProvider } from 'formik';
import { useNavigate, useParams } from "react-router-dom";
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


const CamionPatch = () => {

    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { codigo } = useParams();
    const toastC = useToast({
        position: 'top',
    })

    useEffect(() => {
        const fetchVehiculos = async () => {
            try {
                const response = await api.get(`/api/vehiculos/vehiculo/${codigo}`);
                const { ...datos } = response.data;
                const vehiculo = {
                    ...datos
                };
                formik.setValues(vehiculo);
            } catch (err) {
                console.error("Error actualizando camion:", err);
            }
        };
        fetchVehiculos();
    }, [codigo]);


    const formik = useFormik({
        initialValues: {
            modelo: '',
            ano_fabricacion: '',
            marca: '',
            motor: '',
            tipo_vehiculo:'',
            tipo_semirremolque:'',
        },
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            try{
                const payload = {
                    ...values
                };
                await api.patch(`/api/vehiculos/vehiculo/${codigo}`, payload);
                
                setLoading(false);
                formik.resetForm();
                toast.success("El camion se actualizó correctamente")
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
                    setError('Error al actualizar el camion. Intente nuevamente.');
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
            modelo: Yup.string().trim().max(30,'Debe ingresar modelo mas acotado').required('Debe ingresar un modelo.'),
            ano_fabricacion: Yup.string().length(4,"'El año debe tener exactamente 4 dígitos").required('Debe ingresar el año de fabricacion.').typeError('Debe ingresar un año valido.'),
            marca: Yup.string().trim().max(30,'Debe ingresar una marca mas acotado').required('Debe ingresar una marca.'),
            motor: Yup.string().max(10,'Debe ingresar un motor mas corto').required("Debe ingresar un motor"),
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
                    <Heading as='h2' fontSize='2xl' mb={4}>Actualizar Camion</Heading>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack gap="4" alignItems='flex-start'>
                            <FormControl width='100%' isInvalid={formik.touched.modelo && !!formik.errors.modelo}>
                                <FormLabel htmlFor="modelo">Modelo:</FormLabel>
                                <Textarea
                                    id='modelo'
                                    placeholder="Ingrese el modelo del camion"
                                    {...formik.getFieldProps('modelo')}
                                />
                                <FormErrorMessage>{formik.errors.modelo}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.ano_fabricacion && !!formik.errors.ano_fabricacion}>
                                <FormLabel htmlFor="fecha">Año de Fabricacion:</FormLabel>
                                <Input
                                    id='ano_fabricacion'
                                    size='md'
                                    type="number"
                                    {...formik.getFieldProps('ano_fabricacion')}
                                />
                                <FormErrorMessage>{formik.errors.ano_fabricacion}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.marca && !!formik.errors.marca}>
                                <FormLabel htmlFor="marca">Marca:</FormLabel>
                                <Input
                                    id='marca'
                                    placeholder="Ingrese la marca del camion"
                                    {...formik.getFieldProps('marca')}
                                />
                                <FormErrorMessage>{formik.errors.marca}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.motor && !!formik.errors.motor}>
                                <FormLabel htmlFor="motor">Motor:</FormLabel>
                                <Input
                                    id='motor'
                                    placeholder="Ingrese el motor del camion"
                                    {...formik.getFieldProps('motor')}
                                />
                                <FormErrorMessage>{formik.errors.motor}</FormErrorMessage>
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

export default CamionPatch;