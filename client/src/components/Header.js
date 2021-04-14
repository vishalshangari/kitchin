import React, { useState, useContext, useEffect } from 'react';
import { Heading, Box, Flex } from '@chakra-ui/react';
import { UserContext } from '../App';
import axios from 'axios';
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
  const { user, changeUser } = useContext(UserContext);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/users');
      setUserData(result.data.users);
    };
    fetchData();
  }, []);
  return (
    <Flex>
      <Box flex="1" p={4}>
        <Heading as="h1" size="2xl">
          Kitchin
        </Heading>
        <Text fontSize="2xl" color="#999">
          Welcome, {user.name}
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
            {userData &&
              userData.map((user, idx) => (
                <MenuItem
                  onClick={() => changeUser(user)}
                  key={idx}
                  minH="48px"
                >
                  <Image
                    boxSize="2rem"
                    borderRadius="full"
                    src={`https://i.pravatar.cc/150?u=${user.fullName}+${user.username}`}
                    alt={user.fullName}
                    mr="12px"
                  />
                  <span>{user.fullName}</span>
                </MenuItem>
              ))}
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default Header;
