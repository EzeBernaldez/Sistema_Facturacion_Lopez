import React, { useState } from "react";
import Header from "../../components/Header";
import * as Yup from 'yup';
import { useFormik } from 'formik';
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
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Heading,
    Stack,
} from '@chakra-ui/react';
import api from "../../utils/api";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from 'react-toastify';

const RepuestosPatch = () => {
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const { codigo } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchRepuesto = async () => {
            try {
                const response = await api.get(`/api/repuestos/actualizar/${codigo}/`);
                formik.setValues(response.data);
                console.log(response.data)
            } catch (err) {
                console.error("Error actualizando repuesto:", err);
            }
        };
        fetchRepuesto();
    }, [codigo]);

    const formik = useFormik({
        initialValues: {
            codigo: '',
            descripcion: '',
            marca: '',
            precio_venta: '',
            stock: 0,
            tipo: '',
            porcentaje_recargo: 0,
        },
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            try{

                const payload = {
                    ...values,
                    precio_venta: parseFloat(values.precio_venta)
                        .toFixed(2)
                        .toString(),
                };
                await api.patch(`/api/repuestos/actualizar/${codigo}/`, payload);
                
                setLoading(false);
                formik.resetForm();
                toast.success("El repuesto se actualizo correactmente")
                navigate('/repuestos');
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
                    setError('Error al actualizar el repuesto. Intente nuevamente.');
                }
                console.error('Error:', err.response?.data);
            }
        },
        validationSchema: Yup.object({
            descripcion: Yup.string().trim().min(5, 'Debe ingresar una descripción más precisa del repuesto.').max(70,'Debe ingresar una descripción más acotada del repuesto.').required('Debe ingresar una descripción del repuesto.'),
            marca: Yup.string().trim().max(100,'Debe ingresar una nombre más acotado, pruebe con alguna abreviación del nombre original.').required('Debe ingresar la marca del repuesto.'),
            precio_venta: Yup.string().matches(/^\d{1,10}(\.\d+)?$/, "Debe tener hasta 10 dígitos").required("El precio de venta es obligatorio"),
            stock: Yup.number().min(0,"Debe ser un valor mayor o igual a 0").required("Debe ingresar un número de stock"),
            tipo: Yup.string().max(100, 'Debe ingresar un tipo con menos de 100 caracteres.').required('Debe ingresar un tipo'),
            porcentaje_recargo: Yup.number().min(0,'Debe ingresar un porcentaje de recargo mayor o igual a 0').required('Debe ingresar un porcentaje de recargo'),
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
                    <Heading as='h2' fontSize='2xl' mb={4}>Actualizar Repuesto</Heading>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack gap="4" alignItems='flex-start'>
                            <FormControl width='100%' isInvalid={formik.touched.codigo && !!formik.errors.codigo}>
                                <FormLabel htmlFor="codigo">Código:</FormLabel>
                                <Input
                                id="codigo"
                                width='100%'
                                border='1px solid #A0BDE8'
                                {...formik.getFieldProps("codigo")}
                                disabled
                                />
                                <FormErrorMessage>{formik.errors.codigo}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.descripcion && !!formik.errors.descripcion}>
                                <FormLabel htmlFor="descripcion">Descripción:</FormLabel>
                                <Textarea
                                    id='descripcion'
                                    placeholder="Ingrese la descripción de su producto"
                                    {...formik.getFieldProps('descripcion')}
                                />
                                <FormErrorMessage>{formik.errors.descripcion}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.marca && !!formik.errors.marca}>
                                <FormLabel htmlFor="marca">Marca:</FormLabel>
                                <Input
                                    id='marca'
                                    {...formik.getFieldProps('marca')}
                                />
                                <FormErrorMessage>{formik.errors.marca}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.precio_venta && !!formik.errors.precio_venta}>
                                <FormLabel htmlFor="precio">Precio de Venta:</FormLabel>
                                <NumberInput id="precio" min={0} precision={2} step={0.05} value={formik.values.precio_venta}
                                onChange={(value) => formik.setFieldValue('precio_venta', value)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>{formik.errors.precio_venta}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.stock && !!formik.errors.stock}>
                                <FormLabel htmlFor="stock">Stock:</FormLabel>
                                <NumberInput id="stock" min={0} step={1} value={formik.values.stock}
                                onChange={(value) => formik.setFieldValue('stock', value)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>{formik.errors.stock}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.tipo && !!formik.errors.tipo}>
                                <FormLabel htmlFor="tipo">Tipo:</FormLabel>
                                <Input
                                    id='tipo'
                                    {...formik.getFieldProps('tipo')}
                                />
                                <FormErrorMessage>{formik.errors.tipo}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.porcentaje_recargo && !!formik.errors.porcentaje_recargo}>
                                <FormLabel htmlFor="porcentaje">Porcentaje de Recargo:</FormLabel>
                                <NumberInput id="porcentaje" min={0} step={1} value={formik.values.porcentaje_recargo}
                                onChange={(value) => formik.setFieldValue('porcentaje_recargo', value)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>{formik.errors.porcentaje_recargo}</FormErrorMessage>
                            </FormControl>
                        </VStack>
                        <VStack alignItems='flex-end' mt={6}>
                            <Button mt={4} colorScheme="teal" type="submit" isLoading={loading} spinner={<BeatLoader size={8} color="white" />}>
                                Actualizar
                            </Button>
                        </VStack>

                    </form>
                </Box>
            </Stack>
        </main>
        </>
    )
}

export default RepuestosPatch;