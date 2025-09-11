// src/pages/Login.js
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Box, Heading, VStack, Input, Button, FormControl, FormLabel, FormErrorMessage, Collapse, Alert, AlertIcon} from "@chakra-ui/react";
import { PasswordInput } from '../components/ui/password-input';
import {useFormik} from "formik";
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import imageLogin from '../assets/images/login/login.png';

const Login = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();


    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: async (values) => {
            setLoading(true);
            setError("");
            try {
                const result = await login(values.username, values.password);
                if (!result.success) {
                    setError(result.message);
                    formik.setFieldValue('password','');
                    return;
                }
                formik.resetForm();
                navigate("/");
            } catch (err) {
                setError("Error en el login");
            } finally {
                setLoading(false);
            }
        },
        validationSchema: Yup.object({
            password: Yup.string().trim().min(2, "La contraseña debe tener al menos 2 caracteres").required("Debes ingresar una contraseña"),
            username: Yup.string().required('Debe ingresar su usuario'),
        })
    });

    return (
        <>
            <Box  display="flex"  justifyContent='center'  alignItems='center'  height='100dvh'  width='100%' bgColor='#C4DAFA' position="relative" _before={{
                content: '""',
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70dvw", 
                height: "70dvh",
                backgroundImage: `url(${imageLogin})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                zIndex: 0,
                opacity: 0.6,
            }}
            bgBlendMode='overlay'
            bgGradient='radial-gradient(circle at center, #000 0%, #A3C6F0 40%, #0008 100%)'
            >
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
                <Box boxShadow="md" borderRadius='lg' bg="#E8F1FF" p={8} width='50dvw' opacity='0.95'>
                    <Heading as='h2' fontSize='2xl' mb={4}>Iniciar Sesión</Heading>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack gap="4" alignItems='flex-start'>
                            <FormControl width='100%' isInvalid={formik.touched.username && !!formik.errors.username}>
                                <FormLabel htmlFor="username">Usuario:</FormLabel>
                                <Input
                                id="username"
                                type="text"
                                width='100%'
                                border='1px solid #A0BDE8'
                                {...formik.getFieldProps("username")}
                                />
                                <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
                            </FormControl>
                            <FormControl width='100%' isInvalid={formik.touched.password && !!formik.errors.password}>
                                <FormLabel htmlFor="password">Contraseña:</FormLabel>
                                <PasswordInput
                                    id='password'
                                    placeholder='Ingresa tu contraseña'
                                    border='1px solid #A0BDE8'
                                    {...formik.getFieldProps('password')}
                                />
                                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                            </FormControl>
                        </VStack>
                        <VStack alignItems='flex-end' mt={6}>
                            <Button mt={4} colorScheme="teal" type="submit" isLoading={loading} loadingText="Iniciando sesión...">
                                Iniciar Sesión
                            </Button>
                        </VStack>

                    </form>
                </Box>
            </Box>
            
        </>
    );
};

export default Login;
