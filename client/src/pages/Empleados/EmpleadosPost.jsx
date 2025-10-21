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
import { useContexto } from "../../contexts/GlobalContext";


const EmpleadosPost = () => {

    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { pagina } = useContexto();

    const formik = useFormik({
        initialValues: {
            dni_empleado: '',
            nombre: '',
            apellido: '',
            telefonos_empleados: [{numero:""}],
        },
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            try{

                const payload = {
                    ...values
                };
                await api.post('/api/empleados', payload);
                
                setLoading(false);
                formik.resetForm();
                toast.success("Empleado cargado correctamente");

                if (pagina === 'EmpleadosSeleccionar'){
                    navigate('/facturas/nuevo/empleados/seleccionar');
                }
                else{
                    navigate('/empleados');
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
                    setError('Error al crear el empleado. Intente nuevamente.');
                }
                console.error('Error:', err.response?.data);
            }
        },
        validationSchema: Yup.object({
            dni_empleado: Yup.string().trim().max(11, "Debe ingresar un dni válido. No coloque .'s").required('Debe ingresar el dni del empleado.'),
            nombre: Yup.string().trim().max(20,'Debe ingresar un nombre más acotado').required('Debe ingresar el nombre del empleado.'),
            apellido: Yup.string().max(20,'Debe ingresar un apellido más acotado').required("Debe ingresar el apellido del empleado"),
            telefonos_empleados: Yup.array()
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
                    <Heading as='h2' fontSize='2xl' mb={4}>Nuevo Empleado</Heading>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack gap="4" alignItems='flex-start'>
                            <FormControl width='100%' isInvalid={formik.touched.dni_empleado && !!formik.errors.dni_empleado}>
                                <FormLabel htmlFor="dni">DNI del empleado: </FormLabel>
                                <Input
                                id="dni"
                                width='100%'
                                border='1px solid #A0BDE8'
                                {...formik.getFieldProps("dni_empleado")}
                                />
                                <FormErrorMessage>{formik.errors.dni_empleado}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.nombre && !!formik.errors.nombre}>
                                <FormLabel htmlFor="nombre">Nombre: </FormLabel>
                                <Input
                                    id='nombre'
                                    {...formik.getFieldProps('nombre')}
                                />
                                <FormErrorMessage>{formik.errors.nombre}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.apellido && !!formik.errors.apellido}>
                                <FormLabel htmlFor="apellido">Apellido: </FormLabel>
                                <Input
                                    id='apellido'
                                    {...formik.getFieldProps('apellido')}
                                />
                                <FormErrorMessage>{formik.errors.apellido}</FormErrorMessage>
                            </FormControl>
                            <FormikProvider value={formik.getFieldProps('telefonos_empleados')}>
                                <form onSubmit={formik.handleSubmit} style={{
                                    width: '100%',
                                }}>
                                    <FieldArray name="telefonos_empleados">
                                    {({ push, remove }) => (
                                        <>
                                        {formik.values.telefonos_empleados.map((tel, index) => (
                                            <Box key={index} display="flex" gap={2} mb={3} width='100%'>
                                                <FormControl 
                                                    flex={1} 
                                                    isInvalid={
                                                        formik.touched.telefonos_empleados?.[index]?.numero && 
                                                        !!formik.errors.telefonos_empleados?.[index]?.numero
                                                    }
                                                >
                                                    <FormLabel>Número {index + 1}</FormLabel>
                                                    <Input 
                                                        placeholder="+541112345678"
                                                        {...formik.getFieldProps(`telefonos_empleados.${index}.numero`)}
                                                    />
                                                    <FormErrorMessage>
                                                        {formik.errors.telefonos_empleados?.[index]?.numero}
                                                    </FormErrorMessage>
                                                </FormControl>

                                                <IconButton shadow='lg' colorScheme='grey' mt={8} ms={1} icon={<FontAwesomeIcon icon={faXmark} color='black' fade/> 
                                                        } 
                                                        onClick={ () => {
                                                        const nuevosTelefonos = formik.values.telefonos_empleados.filter((_, i) => i !== index);
                                                        formik.setFieldValue('telefonos_empleados', nuevosTelefonos);
                                                    }
                                                        }
                                                        isDisabled= {
                                                            formik.values.telefonos_empleados.length === 1
                                                        }
                                                    />
                                            </Box>
                                        ))}

                                        <Button
                                            type="button"
                                            colorScheme="blue"
                                            onClick={() => {
                                                formik.setFieldValue('telefonos_empleados', [
                                                    ...formik.values.telefonos_empleados,
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

export default EmpleadosPost;