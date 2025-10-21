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

const AutoComplete = ({ para, value, onChange, onSelect, error, touched , proveedor}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const valueAnterior = value;
    const [searchTerm, setSearchTerm] = useState(value);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [seleccionado, setSeleccionado] = useState(false);
    const [objeto, setObjeto] = useState('');

    useEffect(() => {
        if (para === 'repuestos'){
            setObjeto('repuesto')
        }
        else{
            if (para === 'proveedores'){
                setObjeto('proveedor')
            }
            else{
                if (para === 'clientes'){
                    setObjeto('cliente')
                }
                else{
                    if (para === 'empleados'){
                        setObjeto('empleado')
                    }
                }
            }
        }
    }, [para])

    useEffect(() => {
        setSearchTerm(value);
    }, [value])

    const debouncedSearch = useCallback(
        debounce(async (term) => {

            if (term == valueAnterior){
                setSuggestions([]);
                onClose();
                return;
            };
            
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

                let url = `/api/${para}/autocomplete/?search=${encodeURIComponent(term)}`

                if (proveedor) {
                    url += `&proveedor=${encodeURIComponent(proveedor)}`
                    console.log(url)
                }

                const response = await api.get(url);
                setSuggestions(response.data);
                console.log(response.data)

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

    const handleSelectObjeto = (obj) => {
        let codigo;
        if (objeto === 'repuesto' || objeto === 'cliente'){
            codigo = obj.codigo;
        } 
        else{
            if (objeto === 'proveedor'){
                codigo = obj.codigo_proveedores;
            }
            else{
                if (objeto === 'empleado'){
                    codigo = obj.dni_empleado;
                }
            }
        }
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
                placeholder="Buscar..." 
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
                            {suggestions.map((item) => (
                                <ListItem
                                    key={item.id}
                                    p={2}
                                    cursor="pointer"
                                    _hover={{ bg: 'gray.100' }}
                                    onClick={() => handleSelectObjeto(item)}
                                >
                                    <Text fontWeight="bold">{objeto == 'proveedor' || objeto == 'empleado' || objeto == 'cliente' ? item.nombre : item.descripcion}</Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {objeto == 'proveedor' ? item.codigo_proveedores : objeto == 'repuesto' || objeto == 'cliente' ?item.codigo : item.dni_empleado} - {objeto == 'proveedor' ? item.direccion : objeto == 'repuesto' ? item.marca : objeto == 'cliente' ? item.condicion_iva : item.apellido} - {objeto == 'repuesto' ? `Origen: ${item.suministra_read.map((proveedores) => " " + proveedores.codigo_origen)}` : ''}
                                    </Text>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Text p={2}>No se encontraron {para}</Text>
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