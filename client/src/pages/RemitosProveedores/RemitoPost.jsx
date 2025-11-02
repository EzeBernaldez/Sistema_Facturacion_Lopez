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
    AccordionPanel,
    Select,
    useToast,
} from '@chakra-ui/react';
import api from "../../utils/api";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from 'react-toastify';
import { useContexto } from "../../contexts/GlobalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import AutoComplete   from '../../components/AutoComplete';


const RemitoProveedoresPost = () => {

    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const toastC = useToast({
        position: 'top',
    })

    const {
        estadoRemitoProveedores,
        dispatchRemitoProveedores,
        actionRemitoProveedores,
        cargarPagina: setPagina
    } = useContexto();

    useEffect(() =>{
        setPagina('RemitoProveedores')
    }, []);

    const formik = useFormik({
        initialValues: {
            nro_remito: estadoRemitoProveedores.nro_remito || '',
            fecha: estadoRemitoProveedores.fecha || Date.now(),
            monto_total: estadoRemitoProveedores.monto_total || 0,
            pagado: estadoRemitoProveedores.pagado || 'Si',
            proveedor: estadoRemitoProveedores.proveedor || '',
            repuestos: estadoRemitoProveedores.repuestos || [{
                codigo_contiene: '',
                precio_stock: 0,
                cantidad: 0,
                subtotal: 0,
            }]
        },
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            try{

                let total = 0;

                const repuestosConSubtotal = values.repuestos.map(item => {
                    const subtotal = (parseFloat(item.precio_stock) || 0) * (parseInt(item.cantidad) || 0);
                    total += subtotal;
                    return {
                        ...item,
                        subtotal: subtotal.toFixed(2).toString(),
                    };
                });

                console.log(repuestosConSubtotal)

                const payload = {
                    nro_remito: values.nro_remito,
                    fecha: values.fecha,
                    monto_total: total.toFixed(2).toString(),
                    pagado: values.pagado,
                    proveedor_proviene_de: values.proveedor,
                    contiene_write: repuestosConSubtotal,
                };

                console.log(payload)
                await api.post('/api/remito_proveedores', payload);

                
                setLoading(false);
                formik.resetForm();
                await dispatchRemitoProveedores({
                    type: actionRemitoProveedores.REINICIARVALORES
                });
                toast.success("Remito de Proveedor cargado correctamente");
                navigate('/remito_proveedores');
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
                            title: `Error al actualizar el remito en ${field}`
                        })

                    })
                } else {
                    setError('Error al crear el remito. Intente nuevamente.');

                    toastC({
                        status: 'error',
                        isClosable: true,
                        title: error,
                    })
                }
                console.error('Error:', err.response?.data);
            }
        },
        validationSchema: Yup.object({
            nro_remito: Yup.string().trim().max(12, 'Debe ingresar un número de remito menor a 12 dígitos').required('Debe ingresar un número de remito.'),
            pagado: Yup.string().trim().max(3,'Debe ingresar "si" en caso afirmativo, "no" en caso contrario').required('Debe ingresar el estatus de pago.'),
            proveedor: Yup.string().max(30, 'Debe ingresar un proveedor con código más acotado.').required('Debe ingresar un proveedor.'),
            fecha: Yup.date().required('Debe ingresar una fecha.').typeError('Debe ingresar una fecha válida.'),
            repuestos: Yup.array()
            .of(
                Yup.object().shape({
                    codigo_contiene: Yup.string().trim().min(1,'Debe ingresar un código más preciso').max(30,'Debe ingresar un código más acotado').required('Debe ingresar el código de repuesto'),
                    cantidad: Yup.number().min(1,'Debe ser un valor mayor a 0').required('Debe ingresar una cantidad'),
                    precio_stock: Yup.string().matches(/^\d{1,10}(\.\d+)?$/, "Debe tener hasta 10 dígitos").min(1,'Debe ingresar un precio mayor a 0    ').required("El precio de stock es obligatorio."),
                })
            )
            .min(1, "Debe ingresar al menos un proveedor que lo suministre")
            .test('codigos-unicos', 'No pueden haber repuestos repetidos', function (value) {
                    if (!value) return true;
                    const codigos = value.map(item => item.codigo_contiene);
                    const codigosUnicos = [...new Set(codigos)];
                    return codigos.length === codigosUnicos.length;
                }),
        })
    });

    useEffect(() => {
        dispatchRemitoProveedores({
            payload: formik.values,
            type: actionRemitoProveedores.SETREMITOPROVEEDORES,
        })
    }, [formik.values, dispatchRemitoProveedores])


    useEffect(() => {
        if (location.state?.proveedorSeleccionado && !location.state?.index){

            const proveedorSeleccionado = location.state.proveedorSeleccionado;

            const proveedorSeleccionadoLimpio = String(proveedorSeleccionado).trim();

            dispatchRemitoProveedores({type: actionRemitoProveedores.SETPROVEEDOR, payload: proveedorSeleccionadoLimpio});
            
            formik.setFieldValue('proveedor', proveedorSeleccionadoLimpio);

            window.history.replaceState({}, document.title);
        }

        if (location.state?.repuestoSeleccionado && location.state?.index){
            const indice = Number(location.state.index);

            const repuestoSeleccionado = location.state.repuestoSeleccionado;

            const repuestoSeleccionadoLimpio = String(repuestoSeleccionado).trim();

            const nuevosRepuestos = formik.values.repuestos.map((item, i) => {
            if (i === indice) {
                return {
                ...item,
                codigo_contiene: repuestoSeleccionadoLimpio
                };
            }
            return item;
            });

            dispatchRemitoProveedores({type: actionRemitoProveedores.SETREPUESTOS, payload: nuevosRepuestos});
            
            formik.setFieldValue('repuestos', nuevosRepuestos);

            window.history.replaceState({}, document.title);
        }
    }, [location.state]);


    return(
        <>
        <header>
            <Header />
        </header>
        <main>
            <Stack alignItems='center' justifyContent='center' width='100%' bg="#E8F1FF" p={5}>
                <Box borderRadius='lg' boxShadow="md" p={8} width='80%' opacity='0.95' bg='#DAE8FD'>
                    <Heading as='h2' fontSize='2xl' mb={4}>Nuevo Remito de Proveedor</Heading>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack gap="4" alignItems='flex-start'>
                            <FormControl width='100%' isInvalid={formik.touched.nro_remito && !!formik.errors.nro_remito}>
                                <FormLabel htmlFor="nro_remito">Número de remito:</FormLabel>
                                <Input
                                id="nro_remito"
                                width='100%'
                                border='1px solid #A0BDE8'
                                {...formik.getFieldProps("nro_remito")}
                                />
                                <FormErrorMessage>{formik.errors.nro_remito}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.fecha && !!formik.errors.fecha}>
                                <FormLabel htmlFor="fecha">Fecha:</FormLabel>
                                <Input
                                    id='fecha'
                                    size='md'
                                    type="date"
                                    {...formik.getFieldProps('fecha')}
                                />
                                <FormErrorMessage>{formik.errors.fecha}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.pagado && !!formik.errors.pagado}>
                                <FormLabel htmlFor="pagado">Pagado:</FormLabel>
                                <Select
                                    id='pagado'
                                    {...formik.getFieldProps('pagado')}
                                >
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                </Select>
                                <FormErrorMessage>{formik.errors.pagado}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.proveedor && !!formik.errors.proveedor}>
                                <FormLabel htmlFor="proveedor">Proveedor:</FormLabel>
                                <Box display='flex' id="proveedor" gap={2}>
                                    <AutoComplete
                                    para='proveedores'
                                    value={formik.values.proveedor}
                                    onChange={(value) => {
                                        formik.setFieldValue(`proveedor`, value);
                                    }}
                                    onSelect={(value) => {
                                        formik.setFieldValue(`proveedor`, value)
                                    }}
                                    error={formik.errors.proveedor}
                                    touched={formik.touched.proveedor}
                                    ></AutoComplete>
                                    <Button 
                                        type="button"
                                        colorScheme="blue"
                                        boxShadow='md'
                                        onClick={() => {
                                            navigate(`proveedores/seleccionar/`);
                                        }}
                                    >
                                        Buscar
                                    </Button>
                                </Box>
                                <FormErrorMessage>{formik.errors.proveedor}</FormErrorMessage>
                            </FormControl>
                            <FormikProvider value={formik.getFieldProps('repuestos')}>
                                    <FieldArray name="repuestos">
                                    {({ push, remove }) => (
                                        <>
                                        <Box gap={2} mb={3} width='100%'>
                                            <Accordion allowMultiple defaultIndex={[0]}>
                                                {formik.values.repuestos.map((prov, index) => (
                                                    <>
                                                    <AccordionItem mb={3} borderRadius='lg'
                                                    boxShadow="md">
                                                        <h2>
                                                            <AccordionButton  _expanded={{ bg: 'teal', color: 'white' }} borderRadius='lg' >
                                                                <IconButton size='sm' boxShadow='sm' colorScheme="red" icon={<FontAwesomeIcon icon={faXmark} color='black' fade/> 
                                                                    } 
                                                                    onClick={ () => {
                                                                    const nuevoRepuesto = formik.values.repuestos.filter((_, i) => i !== index);
                                                                    formik.setFieldValue('repuestos', nuevoRepuesto);
                                                                }
                                                                    }
                                                                    isDisabled= {
                                                                        formik.values.repuestos.length === 1
                                                                    }
                                                                />
                                                                <Box as='span' flex='1' textAlign='center'>
                                                                    Repuesto {index + 1}
                                                                </Box>
                                                                <AccordionIcon />
                                                            </AccordionButton>
                                                        </h2>
                                                        
                                                        <AccordionPanel pb={4} >
                                                            <FormControl 
                                                                flex={1} 
                                                                isInvalid={
                                                                    formik.touched.repuestos?.[index]?.codigo_contiene && 
                                                                    !!formik.errors.repuestos?.[index]?.codigo_contiene
                                                                }
                                                                mb={3}
                                                            >
                                                                <FormLabel>Repuesto</FormLabel>
                                                                    <Box display='flex' gap={2}>
                                                                        <AutoComplete
                                                                        para='repuestos'
                                                                        value={formik.values.repuestos?.[index]?.codigo_contiene}
                                                                        onChange={(value) => {
                                                                            formik.setFieldValue(`repuestos.${index}.codigo_contiene`, value);
                                                                        }}
                                                                        onSelect={(value) => {
                                                                            formik.setFieldValue(`repuestos.${index}.codigo_contiene`, value)
                                                                        }}
                                                                        error={formik.errors.repuestos?.[index]?.codigo_contiene}
                                                                        touched={formik.touched.repuestos?.[index]?.codigo_contiene}
                                                                        proveedor={formik.values.proveedor}
                                                                        ></AutoComplete>
                                                                        <Button 
                                                                            type="button"
                                                                            colorScheme="blue"
                                                                            boxShadow='md'
                                                                            onClick={() => {
                                                                                navigate(`repuestos/seleccionar/${formik.values.proveedor}/${index}`);
                                                                            }}
                                                                        >
                                                                            Buscar
                                                                        </Button>
                                                                    </Box>
                                                                    <FormErrorMessage>
                                                                        {formik.errors.repuestos?.[index]?.codigo_contiene}
                                                                    </FormErrorMessage>
                                                            </FormControl>

                                                            <FormControl 
                                                                flex={1} 
                                                                isInvalid={
                                                                    formik.touched.repuestos?.[index]?.precio_stock && 
                                                                    !!formik.errors.repuestos?.[index]?.precio_stock
                                                                }
                                                                mb={3}
                                                            >
                                                                <FormLabel htmlFor="precio_stock">Precio de Stock:</FormLabel>
                                                                <NumberInput id="precio_stock" min={0} precision={2} step={1000} value={formik.values.repuestos?.[index].precio_stock}
                                                                onChange={(value) => formik.setFieldValue(`repuestos.${index}.precio_stock`, value)}>
                                                                    <NumberInputField />
                                                                    <NumberInputStepper>
                                                                        <NumberIncrementStepper />
                                                                        <NumberDecrementStepper />
                                                                    </NumberInputStepper>
                                                                </NumberInput>
                                                                <FormErrorMessage>
                                                                    {formik.errors.repuestos?.[index]?.precio_stock}
                                                                </FormErrorMessage>
                                                            </FormControl>

                                                            <FormControl 
                                                                flex={1} 
                                                                isInvalid={
                                                                    formik.touched.repuestos?.[index]?.cantidad && 
                                                                    !!formik.errors.repuestos?.[index]?.cantidad
                                                                }
                                                                mb={3}
                                                            >
                                                                <FormLabel htmlFor="cantidad">Cantidad</FormLabel>
                                                                <NumberInput id="cantidad" min={1} step={1} value={formik.values.repuestos?.[index]?.cantidad}
                                                                onChange={(value) => formik.setFieldValue(`repuestos.${index}.cantidad`, value)}>
                                                                    <NumberInputField />
                                                                    <NumberInputStepper>
                                                                        <NumberIncrementStepper />
                                                                        <NumberDecrementStepper />
                                                                    </NumberInputStepper>
                                                                </NumberInput>
                                                                <FormErrorMessage>
                                                                    {formik.errors.repuestos?.[index]?.cantidad}
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
                                                formik.setFieldValue('repuestos', [
                                                    ...formik.values.repuestos,
                                                    {
                                                        codigo_contiene: '',
                                                        cantidad: 0,
                                                        subtotal: 0,
                                                        precio_stock: 0,
                                                    }
                                                ]);
                                            }}
                                            mb={4}
                                        >
                                            Agregar Repuesto
                                        </Button>
                                    </>
                                    )}
                                    </FieldArray>
                                    {formik.errors.repuestos && typeof formik.errors.repuestos === 'string' && (
                                        <Alert status="error" mb={4}>
                                            <AlertIcon />
                                            {formik.errors.repuestos}
                                        </Alert>
                                    )}
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

export default RemitoProveedoresPost;