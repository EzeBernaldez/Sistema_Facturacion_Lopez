import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import * as Yup from 'yup';
import { useFormik, FormikProvider, FieldArray } from 'formik';
import { useNavigate , useLocation } from "react-router-dom";
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
    IconButton,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel
} from '@chakra-ui/react';
import api from "../../utils/api";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from 'react-toastify';
import { useContexto } from "../../contexts/GlobalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import AutoComplete   from '../../components/AutoComplete';


const RepuestosPost = () => {

    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const {
        estadoRepuestos,
        dispatchRepuestos,
        actionRepuestos,
    } = useContexto();

    const formik = useFormik({
        initialValues: {
            codigo: estadoRepuestos.codigo || '',
            descripcion: estadoRepuestos.descripcion || '',
            marca: estadoRepuestos.marca || '',
            precio_venta: estadoRepuestos.precio_venta || '',
            stock: estadoRepuestos.stock || 0,
            tipo: estadoRepuestos.tipo || '',
            porcentaje_recargo: estadoRepuestos.porcentaje_recargo || 0,
            suministra: estadoRepuestos.suministra || [{
                proveedor_suministra: '',
                codigo_origen: '',
                cantidad: 0,
            }]
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
                await api.post('/api/repuestos', payload);

                
                setLoading(false);
                formik.resetForm();
                await dispatchRepuestos({
                    type: actionRepuestos.REINICIARVALORES
                });
                toast.success("Repuesto cargado correctamente");
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
                    setError('Error al crear el repuesto. Intente nuevamente.');
                }
                console.error('Error:', err.response?.data);
            }
        },
        validationSchema: Yup.object({
            codigo: Yup.string().trim().max(30, 'Debe ingresar un código menor a 30 dígitos').required('Debe ingresar un código de repuesto.'),
            descripcion: Yup.string().trim().min(5, 'Debe ingresar una descripción más precisa del repuesto.').max(70,'Debe ingresar una descripción más acotada del repuesto.').required('Debe ingresar una descripción del repuesto.'),
            marca: Yup.string().trim().max(100,'Debe ingresar una nombre más acotado, pruebe con alguna abreviación del nombre original.').required('Debe ingresar la marca del repuesto.'),
            precio_venta: Yup.string().matches(/^\d{1,10}(\.\d+)?$/, "Debe tener hasta 10 dígitos").required("El precio de venta es obligatorio"),
            stock: Yup.number().min(0,"Debe ser un valor mayor o igual a 0").required("Debe ingresar un número de stock"),
            tipo: Yup.string().max(100, 'Debe ingresar un tipo con menos de 100 caracteres.').required('Debe ingresar un tipo'),
            porcentaje_recargo: Yup.number().min(0,'Debe ingresar un porcentaje de recargo mayor o igual a 0').required('Debe ingresar un porcentaje de recargo'),
            suministra: Yup.array()
                .of(
                Yup.object().shape({
                    proveedor_suministra: Yup.string().required('Debe seleccionar un proveedor'),
                    codigo_origen: Yup.string().trim().min(1,'Debe ingresar un código más preciso').max(20,'Debe ingresar un código más acotado').required('Debe ingresar un código'),
                    cantidad: Yup.number().min(0,'Debe ser un valor mayor a 0').required('Debe ingresar una cantidad'),
                })
            )
            .min(1, "Debe ingresar al menos un proveedor que lo suministre"),
        })
    });

    useEffect(() => {
        dispatchRepuestos({
            payload: formik.values,
            type: actionRepuestos.SETREPUESTO,
        })
    }, [formik.values, dispatchRepuestos])

    // hay que validar que el proveedor está bien puesto, solo cuando sale del foco del input

    useEffect(() => {

    if (location.state?.proveedorSeleccionado){
        const indice = Number(location.state.index);

        const proveedorSeleccionado = location.state.proveedorSeleccionado;

        const proveedorSeleccionadoLimpio = String(proveedorSeleccionado).trim();

        const nuevosSuministra = formik.values.suministra.map((item, i) => {
        if (i === indice) {
            return {
            ...item,
            proveedor_suministra: proveedorSeleccionadoLimpio
            };
        }
        return item;
        });

        dispatchRepuestos({type: actionRepuestos.SETSUMINISTRA, payload: nuevosSuministra});
        
        formik.setFieldValue('suministra', nuevosSuministra);

        window.history.replaceState({}, document.title);
    }
    }, [location.state]);


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
                    <Heading as='h2' fontSize='2xl' mb={4}>Nuevo Repuesto</Heading>
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
                        <FormikProvider value={formik.getFieldProps('suministra')}>
                                <FieldArray name="suministra">
                                {({ push, remove }) => (
                                    <>
                                    <Box gap={2} mb={3} width='100%'>
                                        <Accordion allowMultiple defaultIndex={[0]}>
                                            {formik.values.suministra.map((prov, index) => (
                                                <>
                                                <AccordionItem mb={3} borderRadius='lg'
                                                boxShadow="md">
                                                    <h2>
                                                        <AccordionButton  _expanded={{ bg: 'teal', color: 'white' }} borderRadius='lg' >
                                                            <IconButton size='sm' boxShadow='sm' colorScheme="red" icon={<FontAwesomeIcon icon={faXmark} color='black' fade/> 
                                                                } 
                                                                onClick={ () => {
                                                                const nuevoSuministra = formik.values.suministra.filter((_, i) => i !== index);
                                                                formik.setFieldValue('suministra', nuevoSuministra);
                                                            }
                                                                }
                                                                isDisabled= {
                                                                    formik.values.suministra.length === 1
                                                                }
                                                            />
                                                            <Box as='span' flex='1' textAlign='center'>
                                                                Proveedor {index + 1}
                                                            </Box>
                                                            <AccordionIcon />
                                                        </AccordionButton>
                                                    </h2>
                                                    
                                                    <AccordionPanel pb={4} >
                                                        <FormControl 
                                                            flex={1} 
                                                            isInvalid={
                                                                formik.touched.suministra?.[index]?.proveedor_suministra && 
                                                                !!formik.errors.suministra?.[index]?.proveedor_suministra
                                                            }
                                                            mb={3}
                                                        >
                                                            <FormLabel>Proveedor</FormLabel>
                                                                <Box display='flex' gap={2}>
                                                                    <AutoComplete
                                                                    para='proveedores'
                                                                    value={formik.values.suministra?.[index]?.proveedor_suministra}
                                                                    onChange={(value) => {
                                                                        formik.setFieldValue(`suministra.${index}.proveedor_suministra`, value);
                                                                    }}
                                                                    onSelect={(value) => {
                                                                        formik.setFieldValue(`suministra.${index}.proveedor_suministra`, value)
                                                                    }}
                                                                    error={formik.errors.suministra?.[index]?.proveedor_suministra}
                                                                    touched={formik.touched.suministra?.[index]?.proveedor_suministra}
                                                                    ></AutoComplete>
                                                                    <Button 
                                                                        type="button"
                                                                        colorScheme="blue"
                                                                        boxShadow='md'
                                                                        onClick={() => {
                                                                            navigate(`proveedores/seleccionar/${index}`);
                                                                        }}
                                                                    >
                                                                        Buscar
                                                                    </Button>
                                                                </Box>
                                                                <FormErrorMessage>
                                                                    {formik.errors.suministra?.[index]?.proveedor_suministra}
                                                                </FormErrorMessage>
                                                        </FormControl>

                                                        <FormControl 
                                                            flex={1} 
                                                            isInvalid={
                                                                formik.touched.suministra?.[index]?.codigo_origen && 
                                                                !!formik.errors.suministra?.[index]?.codigo_origen
                                                            }
                                                            mb={3}
                                                        >
                                                            <FormLabel>Código origen del proveedor {formik.values.suministra?.[index]?.proveedor_suministra}</FormLabel>
                                                            <Input 
                                                                placeholder="0123456789"
                                                                {...formik.getFieldProps(`suministra.${index}.codigo_origen`)}
                                                            />
                                                            <FormErrorMessage>
                                                                {formik.errors.suministra?.[index]?.codigo_origen}
                                                            </FormErrorMessage>
                                                        </FormControl>

                                                        <FormControl 
                                                            flex={1} 
                                                            isInvalid={
                                                                formik.touched.suministra?.[index]?.cantidad && 
                                                                !!formik.errors.suministra?.[index]?.cantidad
                                                            }
                                                            mb={3}
                                                        >
                                                            <FormLabel htmlFor="cantidad">Cantidad</FormLabel>
                                                            <NumberInput id="cantidad" min={1} step={1} value={formik.values.suministra?.[index]?.cantidad}
                                                            onChange={(value) => formik.setFieldValue(`suministra.${index}.cantidad`, value)}>
                                                                <NumberInputField />
                                                                <NumberInputStepper>
                                                                    <NumberIncrementStepper />
                                                                    <NumberDecrementStepper />
                                                                </NumberInputStepper>
                                                            </NumberInput>
                                                            <FormErrorMessage>
                                                                {formik.errors.suministra?.[index]?.cantidad}
                                                            </FormErrorMessage>
                                                        </FormControl>

                                                    </AccordionPanel>
                                                    
                                            </AccordionItem>
                                            </>
                                            ))}
                                        </Accordion>
                                    </Box>


                                    <Button
                                        type="button"
                                        colorScheme="blue"
                                        width='100%'
                                        onClick={() => {
                                            formik.setFieldValue('suministra', [
                                                ...formik.values.suministra,
                                                {
                                                    proveedor_suministra: '',
                                                    codigo_origen: '',
                                                    cantidad: 0,
                                                }
                                            ]);
                                        }}
                                        mb={4}
                                    >
                                        Agregar Proveedor
                                    </Button>
                                </>
                                )}
                                </FieldArray>
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

export default RepuestosPost;