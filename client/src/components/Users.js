import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {
  Image,
  Text,
  Box,
  Button,
  SimpleGrid,
  Flex,
  Stack,
  Center,
  Input,
  Checkbox,
  VStack,
  useDisclosure,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';
import { AiFillPlusCircle } from 'react-icons/ai';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Alert, AlertIcon } from '@chakra-ui/react';

const Users = () => {
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const [formStatus, setFormStatus] = useState({
    error: false,
    success: false,
  });
  const [formStatusMsg, setFormStatusMsg] = useState('');
  const [userData, setUserData] = useState([]);
  const [healthIssueData, setHealthIssueData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/users');
      setUserData(result.data.users);
      setHealthIssueData(result.data.healthIssues);
    };
    fetchData();
  }, [_]);
  const { handleSubmit, errors, register, formState } = useForm();

  async function onSubmit(data, e) {
    let healthIssuesToSend = [];
    for (const [key, value] of Object.entries(data)) {
      if (key.includes('health-issue') && value !== false) {
        healthIssuesToSend.push(value);
      }
    }
    const res = await axios({
      method: 'post',
      url: '/user',
      data: { general: data, healthIssues: healthIssuesToSend },
    });
    if (res.data.status === 'success') {
      setFormStatus(() => ({ success: true, error: false }));
      forceUpdate();
      onClose();
    } else {
      if (res.data.content === 'CHECK') {
        setFormStatusMsg(() => 'Age must be between 2 and 110');
      } else {
        setFormStatusMsg(() => 'Oops, this username is already taken!');
      }
      setFormStatus(() => ({ success: false, error: true }));
    }
  }

  return (
    <>
      <SimpleGrid pt={4} columns={[2, null, null, 4]} spacing={[4, null, 6]}>
        {userData &&
          userData.map((user, idx) => (
            <User forceUpdate={forceUpdate} key={idx} user={user} />
          ))}
      </SimpleGrid>
      <Center>
        <Button
          onClick={onOpen}
          paddingX="24"
          mt="8"
          height="100px"
          width="20px"
          colorScheme="pink"
        >
          <VStack>
            <Text fontSize="3xl">
              <AiFillPlusCircle />
            </Text>

            <Text>Add new user</Text>
          </VStack>
        </Button>
      </Center>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new user</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {formStatus.success && (
              <Alert mb="4" borderRadius="lg" status="success">
                <AlertIcon />
                User added!
              </Alert>
            )}
            {formStatus.error && (
              <Alert mb="4" borderRadius="lg" status="error">
                <AlertIcon />
                {formStatusMsg}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={errors.name}>
                <FormLabel htmlFor="name">Full Name</FormLabel>
                <Input
                  name="name"
                  placeholder="name"
                  ref={register({ required: 'This field is required' })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt="4" isInvalid={errors.kitchinusername}>
                <FormLabel htmlFor="kitchinusername">Username</FormLabel>
                <Input
                  name="kitchinusername"
                  placeholder="kitchinusername"
                  ref={register({
                    required: 'This field is required',
                    minLength: 4,
                    maxLength: 12,
                    pattern: /^(?=.{4,12}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/i,
                  })}
                />
                <FormHelperText>
                  Between 4 - 12 characters, alphanumeric
                </FormHelperText>
                <FormErrorMessage>
                  {errors.kitchinusername && errors.kitchinusername.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt="4" isInvalid={errors.age}>
                <FormLabel htmlFor="age">Age</FormLabel>
                <Input
                  name="age"
                  placeholder="age"
                  ref={register({
                    required: 'This field is required',
                    validate: v => !isNaN(v),
                  })}
                />
                <FormErrorMessage>
                  {errors.age && errors.age.message}
                </FormErrorMessage>
              </FormControl>
              <Box mt="4">
                <FormLabel htmlFor="healthissues">Health Issues</FormLabel>
                {healthIssueData &&
                  healthIssueData.map((it, idx) => (
                    <Checkbox
                      ref={register()}
                      value={it.issueName}
                      name={`health-issue-${it.issueName}`}
                      key={idx}
                      p="2"
                    >
                      {it.issueName}
                    </Checkbox>
                  ))}
              </Box>
              <Button
                marginY={4}
                colorScheme="teal"
                isLoading={formState.isSubmitting}
                type="submit"
              >
                Add
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const User = ({ user: { fullName, username, age }, forceUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formStatus, setFormStatus] = useState({});
  const handleDeleteUser = async () => {
    const res = await axios({
      method: 'delete',
      url: '/user',
      data: { name: fullName, username: username },
    });
    if (res.data.status === 'success') {
      setFormStatus(() => ({ success: true, error: false }));
      forceUpdate();
    } else {
      setFormStatus(() => ({ success: false, error: true }));
    }
  };
  return (
    <>
      <Flex
        onClick={onOpen}
        p={[2, null, 4]}
        bg={'gray.700'}
        borderWidth="1px"
        borderRadius="xl"
        _hover={{
          bg: 'gray.600',
          cursor: 'pointer',
        }}
      >
        <Image
          mr={[2, null, 4]}
          flex={3}
          width="80px"
          borderRadius="50%"
          src={`https://i.pravatar.cc/150?u=${fullName}+${username}`}
        />
        <VStack align="left" flex={7} spacing={0}>
          <Text fontSize={['md', 'md', 'xl']}>{fullName}</Text>
          <Text color="gray.400">{username}</Text>
        </VStack>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{fullName}</ModalHeader>
          <ModalBody>
            {formStatus.error && (
              <Alert mb="4" borderRadius="lg" status="error">
                <AlertIcon />
                Something went wrong!
              </Alert>
            )}
            <Stack>
              <Text>Username: {username}</Text>
              <Text>Age: {age}</Text>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleDeleteUser} colorScheme="red" mr={3}>
              Delete user
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Users;
