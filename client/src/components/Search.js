import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Input,
  FormControl,
  FormLabel,
  Select,
  Box,
  FormHelperText,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Center,
  Text,
  Flex,
  Radio,
  RadioGroup,
  HStack,
  Button,
  Divider,
  Fade,
  SimpleGrid,
} from '@chakra-ui/react';
// import Test from '../Test';
// import User from '../User';
import RecipePreview from './RecipePreview';

const Search = () => {
  const [displaySearchMenu, setDisplaySearchMenu] = useState(true);
  const [displaySearchResults, setDisplaySearchResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const { register, handleSubmit } = useForm();
  const onSubmit = data => {
    setIsLoading(true);
    console.log(data);

    fetch(`/search?recipetype=${data.recipeType.toLowerCase()}`)
      .then(res => res.json())
      .then(
        result => {
          handleSearchSucessDisplay();
          setResponseData(result.recipes);
          console.log(result.recipes);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          // handle error
        }
      );
    // handleSearchSubmitDisplayActions();
  };
  const [value, setValue] = React.useState('1');
  const handleSearchSucessDisplay = () => {
    setDisplaySearchMenu(false);
    setTimeout(() => setDisplaySearchResults(true), 250);
  };
  return (
    <>
      <Fade in={displaySearchMenu} unmountOnExit>
        <Box
          width={[
            '100%', // 0-30em
            '70%', // 30em-48em
            '40%', // 48em-62em
          ]}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl id="keywords" mb="4">
              <FormLabel>By keywords</FormLabel>
              <Input />
              <FormHelperText>
                E.g. eggs, chicken, healthy, comfort, spicy
              </FormHelperText>
            </FormControl>
            <FormControl id="type" mb="4">
              <FormLabel>Recipe type</FormLabel>
              <Select
                placeholder="Select type"
                name="recipeType"
                ref={register}
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snacks</option>
                <option>Beverages</option>
              </Select>
              <FormHelperText>
                Leave blank to include all types in results
              </FormHelperText>
            </FormControl>
            <FormControl id="type" mb="4" isDisabled>
              <FormLabel>Preparation time</FormLabel>
              <Slider
                aria-label="slider-ex-1"
                min={0}
                max={4}
                defaultValue={2}
                step={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Flex>
                <Box flex="1">
                  <Text>&lt; 20 min.</Text>
                </Box>
                <Center flex="1">
                  <Text>30 - 45 min.</Text>
                </Center>
                <Box flex="1" textAlign="right">
                  <Text>&gt; 60 min.</Text>
                </Box>
              </Flex>
            </FormControl>
            {/* <Text fontSize="xl" mt="4" mb="2">
          Nutrition preferences
        </Text> */}
            <Divider mt="6" mb="6" />
            <FormControl id="calories" mb="4" isDisabled>
              <FormLabel>Calories</FormLabel>
              <RadioGroup onChange={setValue} value={value} defaultValue="3">
                <HStack spacing="6">
                  <Radio value="1">Low</Radio>
                  <Radio value="2">High</Radio>
                  <Radio value="3">No preference</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
            <FormControl id="fat" mb="4" isDisabled>
              <FormLabel>Fat</FormLabel>
              <RadioGroup onChange={setValue} value={value} defaultValue="3">
                <HStack spacing="6">
                  <Radio value="1">Low</Radio>
                  <Radio value="2">High</Radio>
                  <Radio value="3">No preference</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
            <FormControl id="fiber" mb="4" isDisabled>
              <FormLabel>Fiber</FormLabel>
              <RadioGroup onChange={setValue} value={value} defaultValue="3">
                <HStack spacing="6">
                  <Radio value="1">Low</Radio>
                  <Radio value="2">High</Radio>
                  <Radio value="3">No preference</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
            {/* <Input name="lastName" ref={register({ pattern: /^[A-Za-z]+$/i })} />
        <Input name="age" type="number" ref={register({ min: 18, max: 99 })} /> */}
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Searching"
              mt="4"
              w="100%"
              colorScheme="blue"
              variant="solid"
            >
              Search
            </Button>
          </form>
        </Box>
      </Fade>
      <Box display={displaySearchResults ? 'visible' : 'none'}>
        <Fade in={displaySearchResults}>
          <SimpleGrid columns={2} spacingX="40px" spacingY="20px">
            {responseData &&
              responseData.map((recipe, idx) => (
                <RecipePreview key={idx} recipe={recipe} />
              ))}
          </SimpleGrid>
          {responseData &&
            (responseData.length === 0
              ? `Sorry, there were no results matching your query`
              : ``)}
        </Fade>
      </Box>
    </>
  );
};

export default Search;
