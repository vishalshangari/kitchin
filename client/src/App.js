import React from 'react';
import { ChakraProvider, Heading, Box, Flex } from '@chakra-ui/react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ChevronDownIcon,
  Image,
  Button,
  theme,
} from '@chakra-ui/react';
import Test from './Test';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Flex>
        <Box flex="1" p={4}>
          <Heading as="h1" size="2xl" color="teal.800">
            Kitchen Management
          </Heading>
        </Box>
        <Box p={4}>
          <Menu>
            <MenuButton
              as={Button}
              bg="teal.600"
              _hover={{ bg: 'teal.400' }}
              color="white"
              rightIcon={ChevronDownIcon}
            >
              Switch User
            </MenuButton>
            <MenuList>
              <MenuItem minH="48px">
                <Image
                  boxSize="2rem"
                  borderRadius="full"
                  src="https://placekitten.com/100/100"
                  alt="Fluffybuns the destroyer"
                  mr="12px"
                />
                <span>Fluffybuns the Destroyer</span>
              </MenuItem>
              <MenuItem minH="40px">
                <Image
                  boxSize="2rem"
                  borderRadius="full"
                  src="https://placekitten.com/120/120"
                  alt="Simon the pensive"
                  mr="12px"
                />
                <span>Simon the pensive</span>
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      <Box p="4">
        <Test />
      </Box>
    </ChakraProvider>
  );
}

export default App;
