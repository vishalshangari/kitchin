import React from 'react';
import { Heading, Box, Flex } from '@chakra-ui/react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ChevronDownIcon,
  Image,
  Text,
  Button,
} from '@chakra-ui/react';

const Header = () => {
  return (
    <Flex>
      <Box flex="1" p={4}>
        <Heading as="h1" size="2xl">
          Kitchin
        </Heading>
        <Text fontSize="2xl" color="#999">
          Kitchen Management Software
        </Text>
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
  );
};

export default Header;
