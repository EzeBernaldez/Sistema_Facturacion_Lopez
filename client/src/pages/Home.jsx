import React from 'react';
import { useState,useEffect } from 'react';
import  Login  from './Login.jsx';
import  Header  from '../components/Header.jsx';
import fotoFrente from '../assets/images/home/foto_frente_1.jpeg';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Image, 
  Container, 
  Heading, 
  Text, 
  Button, 
  VStack,
  Flex,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { useContexto } from '../contexts/GlobalContext.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWrench, faFileInvoiceDollar, faCommentDollar, faFileInvoice, faParachuteBox, faUsers, faUserTie, faTruck} from '@fortawesome/free-solid-svg-icons';
import { generarPDF } from '../components/generarPDF.js';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const {
    cargarPagina: setPagina
  } = useContexto();
  const hora_actual = parseInt(new Date().getHours());
  useEffect( 
    () => setPagina('Home')
    , []
)


  return (
    <Box>
        <header>
            <Header></Header>
        </header>

        <main>
            <Box 
                position="relative" 
                height={currentUser ? "60vh" : "93.6dvh"} 
                width="100%" 
                overflow="hidden"
            >
                <Image 
                    src={fotoFrente} 
                    alt="Foto frente López Repuestos" 
                    objectFit="cover" 
                    width="100%" 
                    height="100%"
                />
                <Box 
                    position="absolute" 
                    top="0" 
                    left="0" 
                    width="100%" 
                    height="100%" 
                    bg="linear-gradient(to bottom, #0058 40%, rgba(0, 0, 0, 0))"
                    display="flex"
                    alignItems="center" 
                    justifyContent="center"
                >
                    <VStack 
                    spacing={6} color="white" textAlign="center">
                        <Heading as="h1" size="2xl" filter='drop-shadow(0 0 5px #E8F1FF)'>
                            { currentUser ? (
                            hora_actual <= 12 && hora_actual >= 6 ? 
                            <Text textTransform='capitalize'>Buenos Dias {currentUser.username}</Text>
                            : <Text textTransform='capitalize'>Buenas Tardes {currentUser.username}</Text>
                            ) 
                            : `Bienvenido a López Repuestos` }
                        </Heading>
                        { !currentUser && (
                            <Text filter='drop-shadow(0 0 5px #E8F1FF)' fontSize='1.5rem'>
                                Tu aliado en el camino
                            </Text>
                        )
                        }
                    </VStack>
                </Box>
            </Box>

            {
                (currentUser && 
                    <VStack spacing={12} mt={10} p={2}>
                        <Heading as="h2" size="xl" textAlign="center">
                        Qué desea hacer?
                        </Heading>
                        
                        <Flex maxWidth='100%' justifyContent='space-evenly' flexDirection={{base : 'column', md:'row'}} flexWrap='wrap' gap={3}>
                            <Button size='lg'  shadow='lg' borderRadius='lg' p={4} bgColor='#C4DAFA' _hover={{
                                bgColor:'#A0BDE8'
                            }}
                            display='flex' flexDirection='column' height='auto' alignItems='center' justifyContent='center' gap={2}
                            onClick={ () => navigate("/facturas") }>
                                <FontAwesomeIcon icon={faFileInvoiceDollar} fontSize='2rem
                                '/>
                                <Text>Facturas</Text>
                            </Button>

                            <Button size='lg'  shadow='lg' borderRadius='lg' p={4} bgColor='#C4DAFA' _hover={{
                                bgColor:'#A0BDE8'
                            }}
                            display='flex' flexDirection='column' height='auto' alignItems='center' justifyContent='center' gap={2}
                            onClick={ () => navigate("/remito_proveedores")}>
                                <FontAwesomeIcon icon={faFileInvoice} fontSize='2rem
                                '/>
                                <Text>Remito Proveedores</Text>
                            </Button>

                            <Button size='lg'  shadow='lg' borderRadius='lg' p={4} bgColor='#C4DAFA' _hover={{
                                bgColor:'#A0BDE8'
                            }}
                            display='flex' flexDirection='column' height='auto' alignItems='center' justifyContent='center' gap={2}
                            onClick={ () => navigate("/clientes") }>
                                <FontAwesomeIcon icon={faUsers} fontSize='2rem
                                '/>
                                <Text>Clientes</Text>
                            </Button>
                        
                            

                            <Button size='lg'  shadow='lg' borderRadius='lg' p={4} bgColor='#C4DAFA' _hover={{
                                bgColor:'#A0BDE8'
                            }}
                            display='flex' flexDirection='column' height='auto' alignItems='center' justifyContent='center' gap={2}
                            onClick={ () => navigate("/repuestos") }>
                                <FontAwesomeIcon icon={faWrench} fontSize='2rem
                                '/>
                                <Text>Repuestos</Text>
                            </Button>

                            <Button size='lg'  shadow='lg' borderRadius='lg' p={4} bgColor='#C4DAFA' _hover={{
                                bgColor:'#A0BDE8'
                            }}
                            display='flex' flexDirection='column' height='auto' alignItems='center' justifyContent='center' gap={2}
                            onClick={ () => navigate("/vehiculos") }>
                                <FontAwesomeIcon icon={faTruck} fontSize='2rem
                                '/>
                                <Text>Vehiculos</Text>
                            </Button>

                            <Button size='lg'  shadow='lg' borderRadius='lg' p={4} bgColor='#C4DAFA' 
                            _hover={{
                                bgColor:'#A0BDE8'
                            }}
                            display='flex' flexDirection='column' height='auto' alignItems='center' justifyContent='center' gap={2}
                            onClick={() => navigate('/proveedores')}>
                                <FontAwesomeIcon icon={faParachuteBox} fontSize='2rem
                                '/>
                                <Text>Proveedores</Text>
                            </Button>

                            <Button size='lg'  shadow='lg' borderRadius='lg' p={4} bgColor='#C4DAFA' 
                            _hover={{
                                bgColor:'#A0BDE8'
                            }}
                            display='flex' flexDirection='column' height='auto' alignItems='center' justifyContent='center' gap={2}
                            onClick={() => navigate('/empleados')}>
                                <FontAwesomeIcon icon={faUserTie} fontSize='2rem
                                '/>
                                <Text>Empleados</Text>
                            </Button>
                            
                        </Flex>
                    </VStack>
                )
            }
            
        </main>
    </Box>
  );
};


export default Home;