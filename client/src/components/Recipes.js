import {
  Center,
  Text,
  SimpleGrid,
  Flex,
  Heading,
  Box,
  Divider,
  VStack,
} from '@chakra-ui/layout';
import {
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
  HStack,
  useDisclosure,
  Modal,
  Checkbox,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  ModalCloseButton,
  Alert,
  AlertIcon,
  FormErrorMessage,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';
import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import RecipePreview from './RecipePreview';
import { Button } from '@chakra-ui/button';
import { useForm } from 'react-hook-form';
import { AiFillPlusCircle } from 'react-icons/ai';

const sortingText = [
  'Sort by',
  'Calories low-high',
  'Calories high-low',
  'Cooking time low-high',
  'Cooking high-low',
];

const Recipes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formError, setFormError] = useState(false);
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const [recipeResults, setRecipeResults] = useState([]);
  const [unsortedResults, setUnsortedResults] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formCuisineTypes, setFormCuisineTypes] = useState([]);
  const [formHealthLabels, setFormHealthLabels] = useState([]);
  const [sorting, setSorting] = useState(undefined);
  useEffect(() => {
    const fetchData = async () => {
      let result = await axios.get(`/all-recipes`);
      if (result.data.status === 'success') {
        setUnsortedResults(() => result.data.recipes);
        setSorting(0);
      } else {
        setIsError(true);
      }
      result = await axios.get(`/search-parameters`);
      setFormCuisineTypes(() => result.data.cuisineTypes);
      setFormHealthLabels(() => result.data.healthLabels);
      setIsLoading(false);
    };
    fetchData();
  }, [_]);
  useEffect(() => {
    const sortRecipes = () => {
      if (sorting === 0 || sorting === undefined) {
        setRecipeResults(recipeResults => {
          let newList = [...unsortedResults];
          return newList;
        });
      } else if (sorting === 1) {
        setRecipeResults(recipeResults =>
          recipeResults.sort(
            (r1, r2) => r2.calories / r2.servings - r1.calories / r1.servings
          )
        );
      } else if (sorting === 2) {
        setRecipeResults(recipeResults =>
          recipeResults.sort(
            (r1, r2) => r1.calories / r1.servings - r2.calories / r2.servings
          )
        );
      } else if (sorting === 3) {
        setRecipeResults(recipeResults =>
          recipeResults.sort(
            (r1, r2) => r2.cookDurationMins - r1.cookDurationMins
          )
        );
      } else if (sorting === 4) {
        setRecipeResults(recipeResults =>
          recipeResults.sort(
            (r1, r2) => r1.cookDurationMins - r2.cookDurationMins
          )
        );
      }
    };
    sortRecipes();
  }, [sorting, unsortedResults]);

  const { handleSubmit, errors, register, formState } = useForm();
  async function onSubmit(data, e) {
    let r = {};
    r['breakfast'] = data.breakfast;
    r['lunch'] = data.lunch;
    r['dinner'] = data.dinner;
    r['snack'] = data.snack;
    r['beverage'] = data.beverage;

    const res = await axios({
      method: 'post',
      url: '/recipe',
      data: data,
    });
    if (res.data.status === 'success') {
      setFormError(() => false);
      forceUpdate();
      onClose();
    } else {
      setFormError(true);
    }
  }
  if (isLoading) {
    return <IsLoadingRecipes />;
  }

  if (isError) {
    return <RecipesError />;
  }

  return recipeResults && recipeResults.length > 0 ? (
    <Box mt="4">
      <Button onClick={onOpen} mb="8" p={[4, null, 8]} colorScheme="green">
        <HStack>
          <Text fontSize="3xl">
            <AiFillPlusCircle />
          </Text>

          <Text>Add new recipe</Text>
        </HStack>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Recipe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {formError && (
              <Alert mb="4" borderRadius="lg" status="error">
                <AlertIcon />
                Ouch! Something went wrong :(
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <SimpleGrid columns={[1, null, null, 2]} spacing="8">
                <VStack spacing="4">
                  <FormControl isInvalid={errors.recipeName}>
                    <FormLabel htmlFor="recipeName">Recipe Name</FormLabel>
                    <Input
                      name="recipeName"
                      placeholder="chicken parm"
                      ref={register({ required: 'This field is required' })}
                    />
                    <FormErrorMessage>
                      {errors.recipeName && errors.recipeName.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.recipeDescription}>
                    <FormLabel htmlFor="recipeDescription">
                      Description
                    </FormLabel>
                    <Textarea
                      name="recipeDescription"
                      placeholder="quick, easy-to-make, and delicious"
                      ref={register}
                    />
                    <FormErrorMessage>
                      {errors.recipeDescription &&
                        errors.recipeDescription.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.imageURL}>
                    <FormLabel htmlFor="imageURL">Image URL</FormLabel>
                    <Input
                      name="imageURL"
                      placeholder="enter URL"
                      ref={register}
                    />
                    <FormErrorMessage>
                      {errors.imageURL && errors.imageURL.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.webURL}>
                    <FormLabel htmlFor="webURL">Website URL</FormLabel>
                    <Input
                      name="webURL"
                      placeholder="enter URL"
                      ref={register}
                    />
                    <FormErrorMessage>
                      {errors.webURL && errors.webURL.message}
                    </FormErrorMessage>
                  </FormControl>
                  <Divider />
                  <FormControl isInvalid={errors.cookDurationMins}>
                    <FormLabel htmlFor="cookDurationMins">
                      Cooking time
                    </FormLabel>
                    <Input
                      name="cookDurationMins"
                      placeholder="in minutes"
                      ref={register({
                        required: 'This field is required',
                        validate: v => !isNaN(v) && v > 0,
                      })}
                    />
                    <FormErrorMessage>
                      {errors.cookDurationMins &&
                        errors.cookDurationMins.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.servings}>
                    <FormLabel htmlFor="servings">Servings</FormLabel>
                    <Input
                      name="servings"
                      placeholder="1, 2, 4, etc."
                      ref={register({
                        required: 'This field is required',
                        validate: v => !isNaN(v) && v > 0,
                      })}
                    />
                    <FormErrorMessage>
                      {errors.servings && errors.servings.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.instructions}>
                    <FormLabel htmlFor="instructions">Instructions</FormLabel>
                    <Textarea
                      name="instructions"
                      placeholder="1. make the recipe 2. ??? 3. profit"
                      ref={register}
                    />
                    <FormErrorMessage>
                      {errors.instructions && errors.instructions.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl mb="4" isInvalid={errors.ingredients}>
                    <FormLabel htmlFor="ingredients">Ingredients</FormLabel>
                    <Textarea
                      name="ingredients"
                      placeholder="ingredients, separated by commas, like this"
                      ref={register}
                    />
                    <FormErrorMessage>
                      {errors.ingredients && errors.ingredients.message}
                    </FormErrorMessage>
                  </FormControl>
                </VStack>
                <Box>
                  <SimpleGrid columns="2" spacing="4">
                    <FormControl isInvalid={errors.calories}>
                      <FormLabel htmlFor="calories">Calories</FormLabel>
                      <Input
                        name="calories"
                        placeholder="total in kCal"
                        ref={register({
                          required: 'This field is required',
                          validate: v => !isNaN(v) && v > 0,
                        })}
                      />
                      <FormErrorMessage>
                        {errors.calories && errors.calories.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.fat}>
                      <FormLabel htmlFor="fat">Fat</FormLabel>
                      <Input
                        name="fat"
                        placeholder="total in grams"
                        ref={register({
                          required: 'This field is required',
                          validate: v => !isNaN(v) && v > 0,
                        })}
                      />
                      <FormErrorMessage>
                        {errors.fat && errors.fat.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.protein}>
                      <FormLabel htmlFor="protein">Protein</FormLabel>
                      <Input
                        name="protein"
                        placeholder="total in grams"
                        ref={register({
                          required: 'This field is required',
                          validate: v => !isNaN(v) && v > 0,
                        })}
                      />
                      <FormErrorMessage>
                        {errors.protein && errors.protein.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.sodium}>
                      <FormLabel htmlFor="sodium">Sodium</FormLabel>
                      <Input
                        name="sodium"
                        placeholder="total in grams"
                        ref={register({
                          required: 'This field is required',
                          validate: v => !isNaN(v) && v > 0,
                        })}
                      />
                      <FormErrorMessage>
                        {errors.sodium && errors.sodium.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.sugar}>
                      <FormLabel htmlFor="sugar">Sugar</FormLabel>
                      <Input
                        name="sugar"
                        placeholder="total in grams"
                        ref={register({
                          required: 'This field is required',
                          validate: v => !isNaN(v) && v > 0,
                        })}
                      />
                      <FormErrorMessage>
                        {errors.sugar && errors.sugar.message}
                      </FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                  <FormControl
                    p="4"
                    borderWidth="1px"
                    borderRadius="md"
                    id="recipeType"
                    mt="4"
                  >
                    <FormLabel>Recipe Type</FormLabel>
                    <Checkbox
                      ref={register()}
                      name="breakfast"
                      p="2"
                      textTransform="capitalize"
                    >
                      breakfast
                    </Checkbox>
                    <Checkbox
                      ref={register()}
                      name="lunch"
                      p="2"
                      textTransform="capitalize"
                    >
                      Lunch
                    </Checkbox>
                    <Checkbox
                      ref={register()}
                      name="dinner"
                      p="2"
                      textTransform="capitalize"
                    >
                      dinner
                    </Checkbox>
                    <Checkbox
                      ref={register()}
                      name="snack"
                      p="2"
                      textTransform="capitalize"
                    >
                      snack
                    </Checkbox>
                    <Checkbox
                      ref={register()}
                      name="beverage"
                      p="2"
                      textTransform="capitalize"
                    >
                      beverage
                    </Checkbox>
                  </FormControl>

                  <FormControl
                    p="4"
                    borderWidth="1px"
                    borderRadius="md"
                    id="type"
                    my="4"
                  >
                    <FormLabel>Cuisine</FormLabel>
                    {formCuisineTypes &&
                      formCuisineTypes.map((it, idx) => (
                        <Checkbox
                          ref={register()}
                          value={it}
                          name={`cuisine-type-${it}`}
                          key={idx}
                          p="2"
                          textTransform="capitalize"
                        >
                          {it}
                        </Checkbox>
                      ))}
                  </FormControl>
                  <FormControl
                    p="4"
                    borderWidth="1px"
                    borderRadius="md"
                    id="recipeType"
                    mt="4"
                  >
                    <FormLabel>Health Label</FormLabel>
                    {formHealthLabels &&
                      formHealthLabels.map((it, idx) => (
                        <Checkbox
                          ref={register()}
                          value={it}
                          name={`health-label-${it}`}
                          key={idx}
                          p="2"
                          textTransform="capitalize"
                        >
                          {it}
                        </Checkbox>
                      ))}
                  </FormControl>
                </Box>
              </SimpleGrid>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button mr="4" onClick={onClose} type="Cancel">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              colorScheme="teal"
              isLoading={formState.isSubmitting}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex mb="2" justifyContent="space-between">
        <Heading size="lg" mb={4}>
          Showing {recipeResults.length} Recipes
        </Heading>
        <Menu m="0">
          <MenuButton as={Button} colorScheme="blue">
            {sortingText[sorting]}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setSorting(() => 0)}>Clear</MenuItem>
            <MenuItem onClick={() => setSorting(() => 1)}>
              Calories low-high
            </MenuItem>
            <MenuItem onClick={() => setSorting(() => 2)}>
              Calories high-low
            </MenuItem>
            <MenuItem onClick={() => setSorting(() => 3)}>
              Cooking time low-high
            </MenuItem>
            <MenuItem onClick={() => setSorting(() => 4)}>
              Cooking high-low
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <SimpleGrid pb="8" columns={[1, null, 3]} spacing={[4, null, 8]}>
        {recipeResults &&
          recipeResults.map((recipe, idx) => (
            <RecipePreview
              forceUpdate={forceUpdate}
              key={idx}
              recipe={recipe}
            />
          ))}
      </SimpleGrid>
    </Box>
  ) : (
    <NoResults />
  );
};

const NoResults = () => {
  return (
    <Center mt={[24, null, 48]}>
      <Text fontSize="xl">There are no recipes in your database yet.</Text>
    </Center>
  );
};

const IsLoadingRecipes = () => {
  return (
    <Center mt={[24, null, 48]}>
      <Text color="gray.400" fontSize="3xl">
        Loading...
      </Text>
    </Center>
  );
};

const RecipesError = () => {
  return (
    <>
      <Center mt={[24, null, 48]}>
        <Text display="block" color="red.400" fontSize="3xl">
          Uh oh, something went wrong :(
        </Text>
      </Center>
      <Center>
        <Text display="block" mt={8} fontSize="xl">
          Please try again
        </Text>
      </Center>
    </>
  );
};

export default Recipes;
