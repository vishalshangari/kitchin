import { Box, Center, Text, SimpleGrid, Flex } from '@chakra-ui/layout';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import RecipePreview from './RecipePreview';
import { Button } from '@chakra-ui/button';
import { AiOutlineArrowLeft } from 'react-icons/ai';
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  let query = useQuery();
  const queryVal = query.toString();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [recipeResults, setRecipeResults] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/search?${queryVal}`);
      if (result.data.status === 'success') {
        setRecipeResults(() => result.data.recipes);
        setIsLoading(false);
      } else {
        setIsError(true);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [queryVal]);

  if (isLoading) {
    return <IsLoadingSearch />;
  }

  if (isError) {
    return <SearchError />;
  }

  return recipeResults && recipeResults.length > 0 ? (
    <Box p="4">
      <Flex
        mb={[4, null, 8]}
        alignItems="center"
        justifyContent="space-between"
      >
        <Button to="/" as={Link} leftIcon={<AiOutlineArrowLeft />}>
          Search again
        </Button>
        <Text>Showing {recipeResults.length} search results</Text>
      </Flex>
      <SimpleGrid pb="8" columns={[1, null, 3]} spacing={[4, null, 8]}>
        {recipeResults &&
          recipeResults.map((recipe, idx) => (
            <RecipePreview key={idx} recipe={recipe} />
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
      <Text fontSize="xl">
        Whoops! There were no results matching that search. Please try again.
      </Text>
    </Center>
  );
};

const IsLoadingSearch = () => {
  return (
    <Center mt={[24, null, 48]}>
      <Text color="gray.400" fontSize="3xl">
        Loading...
      </Text>
    </Center>
  );
};

const SearchError = () => {
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

export default SearchResults;
