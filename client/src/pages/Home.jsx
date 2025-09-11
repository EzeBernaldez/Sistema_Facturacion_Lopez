import React from 'react';
import { useState,useEffect } from 'react';
import  Login  from './Login.jsx';
import { Header } from '../components/Header.jsx';
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
  Flex
} from '@chakra-ui/react';
import { useContexto } from '../contexts/GlobalContext.jsx';


const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const {
    cargarPagina: setPagina
  } = useContexto();

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
                height={currentUser ? "60vh" : "90vh"} 
                width="100vw" 
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
                        <Heading as="h1" size="2xl">
                            { currentUser ? `Hola ${currentUser.username}` : `Bienvenido a López Repuestos` }
                        </Heading>
                    </VStack>
                </Box>
            </Box>

            {
                (currentUser && 
                <Container maxW="container.xl" py={20}>
                    <VStack spacing={12}>
                        <Heading as="h2" size="xl" textAlign="center">
                        Qué desea hacer?
                        </Heading>
                        
                        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
                            <Box flex={1} textAlign="center">
                                <Heading as="h3" size="lg" mb={4}>
                                Hola
                                </Heading>
                                <Text>
                                Hola
                                </Text>
                            </Box>
                        
                            <Box flex={1} textAlign="center">
                                <Heading as="h3" size="lg" mb={4}>
                                Hola
                                </Heading>
                                <Text>
                                Hola
                                </Text>
                            </Box>
                        
                            <Box flex={1} textAlign="center">
                                <Heading as="h3" size="lg" mb={4}>
                                Hola
                                </Heading>
                                <Text>
                                Hola                                
                                </Text>
                            </Box>
                        </Flex>
                    </VStack>
                </Container>
                )
            }
            
        </main>
    </Box>
  );
};


export default Home;