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
import {faWrench, faFileInvoiceDollar, faCommentDollar, faFileInvoice, faParachuteBox } from '@fortawesome/free-solid-svg-icons';


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
                            hora_actual <= 12 && hora_actual >= 6 ? `Buenos Dias ${currentUser.username}`: `Buenas Tardes ${currentUser.username}`) : `Bienvenido a López Repuestos` }
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
                        
                        <Flex width='100%' justifyContent='space-evenly' >
                            <Button size='lg'  shadow='lg' borderRadius='lg' p={4} bgColor='#C4DAFA' _hover={{
                                bgColor:'#A0BDE8'
                            }}
                            display='flex' flexDirection='column' height='auto' alignItems='center' justifyContent='center' gap={2}>
                                <FontAwesomeIcon icon={faFileInvoiceDollar} fontSize='2rem
                                '/>
                                <Text>Facturas</Text>
                            </Button>

                            <Button size='lg'  shadow='lg' borderRadius='lg' p={4} bgColor='#C4DAFA' _hover={{
                                bgColor:'#A0BDE8'
                            }}
                            display='flex' flexDirection='column' height='auto' alignItems='center' justifyContent='center' gap={2}>
                                <FontAwesomeIcon icon={faCommentDollar} fontSize='2rem
                                '/>
                                <Text>Presupuesto</Text>
                            </Button>
                        
                            <Button size='lg'  shadow='lg' borderRadius='lg' p={4} bgColor='#C4DAFA' _hover={{
                                bgColor:'#A0BDE8'
                            }}
                            display='flex' flexDirection='column' height='auto' alignItems='center' justifyContent='center' gap={2}>
                                <FontAwesomeIcon icon={faFileInvoice} fontSize='2rem
                                '/>
                                <Text>Remito</Text>
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
                            display='flex' flexDirection='column' height='auto' alignItems='center' justifyContent='center' gap={2}>
                                <FontAwesomeIcon icon={faParachuteBox} fontSize='2rem
                                '/>
                                <Text>Proveedores</Text>
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