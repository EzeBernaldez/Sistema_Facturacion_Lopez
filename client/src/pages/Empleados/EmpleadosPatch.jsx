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


const EmpleadosPatch = () => {
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const { dni } = useParams();
    const navigate = useNavigate();
    const toastC = useToast({
        position: 'top',
    })


    useEffect(() => {
        const fetchRepuesto = async () => {
            try {
                const response = await api.get(`/api/empleados/empleado/${dni}`);
                const { telefonos, ...datos } = response.data;
                const empleado = {
                    ...datos,
                    telefonos_empleados: telefonos,
                };
                formik.setValues(empleado);
            } catch (err) {
                console.error("Error actualizando empleado:", err);
            }
        };
        fetchRepuesto();
    }, [dni]);

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
                await api.patch(`/api/empleados/empleado/${dni}`, payload);
                
                setLoading(false);
                formik.resetForm();
                toast.success("El empleado se actualizó correctamente")
                navigate('/empleados');
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
                            title: `404 - Error al actualizar el empleado en ${field}`,
                        })
                    })
                } else {
                    setError('Error al actualizar el empleado. Intente nuevamente.');
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
            nombre: Yup.string().trim().max(20,'Debe ingresar un nombre más acotado').required('Debe ingresar el nombre del empleado.'),
            apellido: Yup.string().max(20,'Debe ingresar un apellido más acotado').required("Debe ingresar el apellido del empleado"),
            telefonos_empleados: Yup.array()
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
                    <Heading as='h2' fontSize='2xl' mb={4}>Actualizar Empleado</Heading>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack gap="4" alignItems='flex-start'>
                            <FormControl width='100%' isInvalid={formik.touched.dni_empleado && !!formik.errors.dni_empleado}>
                                <FormLabel htmlFor="dni">DNI del empleado:</FormLabel>
                                <Input
                                id="dni"
                                width='100%'
                                border='1px solid #A0BDE8'
                                {...formik.getFieldProps("dni_empleado")}
                                disabled
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
                                                    <FormLabel>Teléfono {index + 1}</FormLabel>
                                                    <Input 
                                                        placeholder="+541112345678"
                                                        type="number"
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
                                    {formik.errors.telefonos_empleados && typeof formik.errors.telefonos_empleados === 'string' && (
                                        <Alert status="error" mb={4}>
                                            <AlertIcon />
                                            {formik.errors.telefonos_empleados}
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

export default EmpleadosPatch;