import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { theme } from '@chakra-ui/react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box maxW="1200px" margin="0 auto">
        <Header />
        <Dashboard />
      </Box>
    </ChakraProvider>
  );
}

export default App;
