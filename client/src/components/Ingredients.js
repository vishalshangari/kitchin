import React, { useEffect, useState, useReducer } from 'react';
import axios from 'axios';
import {
  Box,
  Text,
  Heading,
  Flex,
  Table,
  Select,
  HStack,
  Thead,
  Tbody,
  Tr,
  Stack,
  Button,
  Th,
  Alert,
  AlertIcon,
  Td,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  Input,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { AiFillPlusCircle } from 'react-icons/ai';

const Ingredients = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const [ingredientsData, setIngredientsData] = useState([]);
  const [formError, setFormError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/ingredients`);
      setIngredientsData(() => result.data.ingredients);
    };
    fetchData();
  }, [_]);

  const { handleSubmit, errors, register, formState } = useForm();
  async function onSubmit(data, e) {
    const res = await axios({
      method: 'post',
      url: '/ingredient',
      data: {
        ingredientName: data.ingrname,
        quantityType: data.qtytype,
        amount: data.ingramount,
        expirationDate: data.date,
      },
    });
    if (res.data.status === 'success') {
      setFormError(() => false);
      forceUpdate();
      onClose();
    } else {
      setFormError(true);
    }
  }
  return (
    <Box mt="4">
      <Button mb="8" onClick={onOpen} p={[4, null, 8]} colorScheme="green">
        <HStack>
          <Text fontSize="3xl">
            <AiFillPlusCircle />
          </Text>

          <Text>Add new ingredient</Text>
        </HStack>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Ingredient</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {formError && (
              <Alert mb="4" borderRadius="lg" status="error">
                <AlertIcon />
                Ouch! Something went wrong :( the ingredient may already exist
                in stock. Update the quantity instead!
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={errors.ingrname}>
                <FormLabel htmlFor="ingrname">Ingredient Name</FormLabel>
                <Input
                  name="ingrname"
                  placeholder="eggs, ketchup, chicken breast"
                  ref={register({ required: 'This field is required' })}
                />
                <FormErrorMessage>
                  {errors.ingrname && errors.ingrname.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt="4" isInvalid={errors.qtytype}>
                <FormLabel htmlFor="qtytype">Quantity type</FormLabel>

                <Select
                  placeholder={'Select type'}
                  name="qtytype"
                  ref={register({ required: 'This field is required' })}
                >
                  <option>millilitres</option>
                  <option>grams</option>
                  <option>unit</option>
                </Select>
                <FormHelperText>
                  Between 4 - 12 characters, alphanumeric
                </FormHelperText>
                <FormErrorMessage>
                  {errors.qtytype && errors.qtytype.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt="4" isInvalid={errors.ingramount}>
                <FormLabel htmlFor="age">Amount</FormLabel>
                <Input
                  name="ingramount"
                  placeholder="ingramount"
                  ref={register({
                    required: 'This field is required',
                    validate: v => !isNaN(v) && v > 0,
                  })}
                />
                <FormErrorMessage>
                  {errors.ingramount && errors.ingramount.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt="4" isInvalid={errors.date}>
                <FormLabel htmlFor="age">Expiration Date</FormLabel>
                <Input
                  type="date"
                  name="date"
                  placeholder="date"
                  ref={register({
                    required: 'This field is required',
                    validate: v =>
                      Date.parse(v) > Date.now()
                        ? true
                        : `Expiration must be later than today`,
                  })}
                />
                <FormErrorMessage>
                  {errors.date && errors.date.message}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              isLoading={formState.isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex mb="2" alignItems="center" justifyContent="space-between">
        <Heading size="lg" mb={4}>
          All Ingredients
        </Heading>
        <Text fontStyle="italic" color="gray.500">
          sorted by expiration date
        </Text>
      </Flex>
      <Box borderWidth="1px" borderRadius="md">
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th padding={[2, null, null, 4]} fontSize="md">
                Ingredient
              </Th>
              <Th padding={[2, null, null, 4]} fontSize="md">
                Exp. Date
              </Th>
              <Th padding={[2, null, null, 4]} fontSize="md" isNumeric>
                QTY
              </Th>
              <Th padding={[2, null, null, 4]} fontSize="md">
                QTY TYPE
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {ingredientsData &&
              ingredientsData.map((ingr, idx) => (
                <Ingredient
                  key={idx}
                  ingredient={ingr}
                  setIngredientsData={setIngredientsData}
                  forceUpdate={forceUpdate}
                />
              ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

const Ingredient = ({
  ingredient: { ingredientName, storedAmount, storedType, expiryDate },
  setIngredientsData,
  forceUpdate,
}) => {
  const handleUnstock = async ingrName => {
    const res = await axios({
      method: 'delete',
      url: '/ingredient',
      data: { ingredientName: ingrName },
    });
    if (res.data.status === 'error') {
      alert('Something went wrong :(');
    } else {
      alert('Ingredient unstocked!');
      setIngredientsData(d => d.filter(i => i.ingredientName !== ingrName));
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const { handleSubmit, errors, register } = useForm();
  const [formError, setFormError] = useState(false);
  async function onSubmit(data, e) {
    const res = await axios({
      method: 'put',
      url: '/ingredient',
      data: { ingredientName: ingredientName, newQty: data.quantity },
    });
    if (res.status !== 'success') {
      setFormError(() => true);
    }
    forceUpdate();
    onClose();
  }
  return (
    <>
      <Tr>
        <Td padding={[2, null, null, 4]}>{ingredientName}</Td>
        <Td padding={[2, null, null, 4]}>{expiryDate}</Td>
        <Td padding={[2, null, null, 4]} isNumeric>
          {storedAmount}
        </Td>
        <Td padding={[2, null, null, 4]}>{storedType}</Td>
        <Td padding={[2, null, null, 4]}>
          <Button onClick={onOpen} colorScheme="yellow" size={'md'}>
            Update
          </Button>
        </Td>
        <Td padding={[2, null, null, 4]}>
          <Button
            onClick={() => handleUnstock(ingredientName)}
            colorScheme="red"
            size={'md'}
          >
            Unstock
          </Button>
        </Td>
      </Tr>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>
            Update Quantity &mdash; {ingredientName}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            {formError && (
              <Alert mb="4" borderRadius="lg" status="error">
                <AlertIcon />
                Ouch! Something went wrong :(
              </Alert>
            )}
            <Stack>
              <Box>
                <Text fontWeight="700">Current Quantity</Text>
                <Text>{`${storedAmount} ${storedType}s`}</Text>
              </Box>
              <Box mt="8">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl isInvalid={errors.quantity}>
                    <FormLabel htmlFor="quantity">
                      Enter new quantity:
                    </FormLabel>
                    <Input
                      name="quantity"
                      placeholder="quantity"
                      ref={register({
                        required: 'This field is required',
                        validate: v => !isNaN(v),
                      })}
                    />
                    <FormHelperText>
                      in the same measurement as the original quantity
                    </FormHelperText>
                    <FormErrorMessage>
                      {errors.quantity && errors.quantity.message}
                    </FormErrorMessage>
                  </FormControl>
                </form>
              </Box>
            </Stack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} colorScheme="green" ml={3}>
              Update
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Ingredients;
