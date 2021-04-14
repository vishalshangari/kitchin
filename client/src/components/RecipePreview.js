import {
  Box,
  Image,
  HStack,
  Modal,
  ModalOverlay,
  Heading,
  Text,
  ModalContent,
  Link,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
} from '@chakra-ui/react';
import { UserContext } from '../App';
import React, { useContext } from 'react';
import axios from 'axios';

const RecipePreview = ({ recipe, forceUpdate }) => {
  const { user } = useContext(UserContext);
  const favoriteRecipe = async () => {
    const res = await axios({
      method: 'post',
      url: '/favorite-recipe',
      data: { username: user.username, recipeID: recipe.recipeID },
    });
    if (res.data.status === 'error') {
      if (res.data.content === 'UNIQUE') {
        alert('This recipe is already in your favorites!');
      } else {
        alert('Something went wrong :( please try again later');
      }
    } else {
      alert('Recipe added to favorites!');
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteRecipe = async () => {
    const res = await axios({
      method: 'delete',
      url: '/recipe',
      data: { recipeID: recipe.recipeID },
    });
    if (res.data.status === 'success') {
      alert('Recipe was deleted');
      onClose();
      forceUpdate();
    } else {
      alert('Something went wrong :( please try again later');
    }
  };
  return (
    <>
      <Box
        as="button"
        onClick={onOpen}
        textAlign="left"
        bg="gray.700"
        // maxW="lg"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        _hover={{
          boxShadow: 'xl',
          borderColor: 'gray.500',
        }}
      >
        <Box h="200px" overflow="hidden">
          <Image
            width="100%"
            height="100%"
            objectPosition="50% 50%"
            objectFit="cover"
            src={recipe.imageURL}
          ></Image>
        </Box>
        <Box p={4}>
          <Box
            fontWeight="semibold"
            as="h4"
            fontSize="2xl"
            lineHeight="tight"
            isTruncated
          >
            {recipe.recipeName}
          </Box>
          <Box color="gray.400">
            <Box as="span">Ready in </Box>
            <Box as="span">{recipe.cookDurationMins} minutes</Box>
          </Box>
          <HStack fontSize="sm" spacing={[2, null, 4]} mt={[2, null, 4]}>
            <Box borderRadius="md" p="2" bg="gray.800">
              <Box as="span">Cal: </Box>
              <Box as="span">
                {Math.round(recipe.calories / recipe.servings)}
              </Box>
            </Box>
            <Box borderRadius="md" p="2" bg="gray.800">
              <Box as="span">Fat: </Box>
              <Box as="span">{Math.round(recipe.fat / recipe.servings)}g</Box>
            </Box>
            <Box borderRadius="md" p="2" bg="gray.800">
              <Box as="span">Protein: </Box>
              <Box as="span">
                {Math.round(recipe.protein / recipe.servings)}g
              </Box>
            </Box>
          </HStack>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <Image
            width="100%"
            maxH="220px"
            objectFit="cover"
            borderRadius="lg"
            src={recipe.imageURL}
          ></Image>
          <ModalHeader>{recipe.recipeName}</ModalHeader>
          <ModalCloseButton bg="red.400" />
          <ModalBody>
            <VStack align="left" spacing="6">
              {recipe.recipeDescription && (
                <Text>{recipe.recipeDescription}</Text>
              )}
              {recipe.instructions ? (
                <>
                  <Text size="lg">Instructions</Text>
                  <Text>{recipe.instructions}</Text>
                </>
              ) : (
                <Box>
                  <Heading size="md">See website for instructions:</Heading>
                  <Link href={recipe.websiteURL}>{recipe.websiteURL}</Link>
                </Box>
              )}
            </VStack>
            <HStack mt="8" spacing="8">
              <VStack align="left">
                <Text
                  size="lg"
                  fontWeight="700"
                  textTransform="uppercase"
                  color="gray.400"
                >
                  Cooking time
                </Text>
                <Text>{recipe.cookDurationMins} mins.</Text>
              </VStack>
              <VStack align="left">
                <Text
                  size="lg"
                  fontWeight="700"
                  textTransform="uppercase"
                  color="gray.400"
                >
                  Servings
                </Text>
                <Text>{recipe.servings}</Text>
              </VStack>
            </HStack>
            {recipe.ingredients && (
              <>
                <Heading mt="8" size="md">
                  Ingredients
                </Heading>
                {recipe.ingredients.split(/,/g).map((line, idx) => (
                  <Text key={idx}>{line}</Text>
                ))}
              </>
            )}

            <Heading mt="8" size="md">
              Nutritional information
            </Heading>
            <Box
              mt="4"
              border="1px"
              maxW="480px"
              borderRadius="lg"
              borderColor="gray.500"
            >
              <Table variant="striped" colorScheme="facebook">
                <Thead>
                  <Tr>
                    <Th fontSize="md">Item</Th>
                    <Th fontSize="md" isNumeric>
                      total
                    </Th>
                    <Th fontSize="md" isNumeric>
                      per serving
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Calories</Td>
                    <Td isNumeric>{Math.round(recipe.calories)}</Td>
                    <Td isNumeric>
                      {Math.round(recipe.calories / recipe.servings)}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Fat</Td>
                    <Td isNumeric>{Math.round(recipe.fat)}</Td>
                    <Td isNumeric>
                      {Math.round(recipe.fat / recipe.servings)}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Protein</Td>
                    <Td isNumeric>{Math.round(recipe.protein)}</Td>
                    <Td isNumeric>
                      {Math.round(recipe.protein / recipe.servings)}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Sugar</Td>
                    <Td isNumeric>{Math.round(recipe.sugar)}</Td>
                    <Td isNumeric>
                      {Math.round(recipe.sugar / recipe.servings)}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Sodium</Td>
                    <Td isNumeric>{Math.round(recipe.sodium)}</Td>
                    <Td isNumeric>
                      {Math.round(recipe.sodium / recipe.servings)}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={deleteRecipe} colorScheme="red" mr="4">
              Delete
            </Button>
            <Button onClick={favoriteRecipe} colorScheme="yellow">
              Favorite
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RecipePreview;
