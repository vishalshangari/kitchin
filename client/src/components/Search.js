import React, { useState, useEffect } from 'react';
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
  Checkbox,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Search = () => {
  const [formCuisineTypes, setFormCuisineTypes] = useState([]);
  const [formHealthLabels, setFormHealthLabels] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/search-parameters`);
      setFormCuisineTypes(() => result.data.cuisineTypes);
      setFormHealthLabels(() => result.data.healthLabels);
    };
    fetchData();
  }, []);
  const { register, handleSubmit } = useForm();
  const history = useHistory();
  const onSubmit = data => {
    let query = '';
    if (data.keywords) {
      query += 'keywords=';
      query += data.keywords.split(' ').join(',');
    }
    if (data.recipeType) {
      query += '&recipeType=';
      query += data.recipeType.toLowerCase();
    }
    let cuisineTypesParams = '';
    for (const [key, value] of Object.entries(data)) {
      if (key.includes('cuisine-type') && value !== false) {
        cuisineTypesParams += value + ',';
      }
    }

    query +=
      cuisineTypesParams.length > 0
        ? '&cuisineType=' + cuisineTypesParams.slice(0, -1)
        : '';
    let healthLabelsParams = '';
    for (const [key, value] of Object.entries(data)) {
      if (key.includes('health-label') && value !== false) {
        healthLabelsParams += value + ',';
      }
    }
    query +=
      healthLabelsParams.length > 0
        ? '&healthLabels=' + healthLabelsParams.slice(0, -1)
        : '';
    history.push('/search?' + query);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={[1, null, 2]} spacing="8">
          <Box>
            <FormControl id="keywords" mb="4">
              <FormLabel>By keywords</FormLabel>
              <Input name="keywords" placeholder="keywords" ref={register()} />
              <FormHelperText>
                E.g. eggs, chicken, healthy, comfort, spicy
              </FormHelperText>
            </FormControl>
            <FormControl id="type" mb="4">
              <FormLabel>Recipe type</FormLabel>
              <Select
                placeholder={'Select type'}
                name="recipeType"
                ref={register()}
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
            <FormControl id="type" mb="4">
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
            <FormControl id="type" mb="4">
              <FormLabel>Maximum cooking time</FormLabel>
              <Slider min={1} max={3} defaultValue={2} step={1}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Flex>
                <Box flex="1">
                  <Text>15 min.</Text>
                </Box>
                <Center flex="1">
                  <Text>45 min.</Text>
                </Center>
                <Box flex="1" textAlign="right">
                  <Text>No max</Text>
                </Box>
              </Flex>
            </FormControl>
          </Box>
          <Box>
            <FormControl id="type" mb="4">
              <FormLabel>Health Labels</FormLabel>
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
        <Center mt={4}>
          <Button
            type="submit"
            mt="4"
            size="lg"
            width="80%"
            maxWidth="280px"
            colorScheme="blue"
            variant="solid"
          >
            Search
          </Button>
        </Center>
      </form>
    </>
  );
};

export default Search;
