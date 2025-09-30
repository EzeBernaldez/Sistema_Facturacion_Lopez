import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, 
    Input, 
    List, 
    ListItem, 
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import api from '../utils/api';

const AutoComplete = ({ para, value, onChange, onSelect, error, touched }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [seleccionado, setSeleccionado] = useState(false);

    const debouncedSearch = useCallback(
        debounce(async (term) => {

            if (seleccionado) {
                setSuggestions([]);
                onClose();
                return;
            }

            if (term.length < 2) {
                setSuggestions([]);
                onClose();
                return;
            }

            setIsLoading(true);
            try {
                const response = await api.get(`/api/${para}/autocomplete?search=${encodeURIComponent(term)}`);
                setSuggestions(response.data);

                if (!seleccionado){
                    onOpen();
                }
            } catch (error) {
                console.error(`Error buscando ${para}: ${error}`);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        [seleccionado]
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onChange(value);

        if (value.length > 0){
            setSeleccionado(false);
        }
    };

    const handleSelectProveedor = (proveedor) => {
        const codigo = proveedor.codigo_proveedores;
        setSearchTerm(codigo); 
        onSelect(codigo); 
        setSeleccionado(true);
        setSuggestions([]);
        onClose();
    };

    const handleInputFocus = () => {
        if (suggestions.length > 0 && !seleccionado){
            onOpen();
        }
    }

    return (
        <Box position="relative" width="100%">
            <Input
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder="Buscar proveedor..."
                isInvalid={touched && error}
                autoComplete='off'
            />

            {isOpen && !seleccionado && (
                <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    bg="white"
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    boxShadow="md"
                    zIndex={10}
                    maxHeight="200px"
                    overflowY="auto"
                >
                    {isLoading ? (
                        <Text p={2}>Buscando...</Text>
                    ) : suggestions.length > 0 ? (
                        <List>
                            {suggestions.map((proveedor) => (
                                <ListItem
                                    key={proveedor.id}
                                    p={2}
                                    cursor="pointer"
                                    _hover={{ bg: 'gray.100' }}
                                    onClick={() => handleSelectProveedor(proveedor)}
                                >
                                    <Text fontWeight="bold">{proveedor.nombre}</Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {proveedor.codigo_proveedores} - {proveedor.direccion}
                                    </Text>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Text p={2}>No se encontraron proveedores</Text>
                    )}
                    
                </Box>
            )}
        </Box>
    );
};

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default AutoComplete;