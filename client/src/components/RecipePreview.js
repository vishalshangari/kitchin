import { Box, Image, HStack } from '@chakra-ui/react';
import React from 'react';

const RecipePreview = props => {
  console.log(props);
  return (
    <Box
      as="button"
      textAlign="left"
      // maxW="lg"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{
        boxShadow: 'lg',
        borderColor: 'gray.600',
      }}
    >
      <Box h="200px" overflow="hidden">
        <Image
          objectPosition="50% 50%"
          objectFit="cover"
          src={props.recipe.imageUrl}
        ></Image>
      </Box>
      <Box p="4">
        <Box
          fontWeight="semibold"
          as="h4"
          fontSize="2xl"
          lineHeight="tight"
          isTruncated
        >
          {props.recipe.recipeName}
        </Box>
        <Box fontWeight="semibold" as="p" lineHeight="tight" mt="2">
          {props.recipe.recipeDescription}
        </Box>
        <HStack spacing="6" mt="2" color="gray.400">
          <Box>
            <Box as="span">Prep time: </Box>
            <Box as="span">{props.recipe.prepDuration} minutes</Box>
          </Box>
          <Box>
            <Box as="span">Cooking time: </Box>
            <Box as="span">{props.recipe.cookDuration} minutes</Box>
          </Box>
        </HStack>
        <HStack spacing="4" mt="4">
          <Box borderRadius="md" p="2" bg="gray.700">
            <Box as="span">Calories: </Box>
            <Box as="span">{props.recipe.calories}</Box>
          </Box>
          <Box borderRadius="md" p="2" bg="gray.700">
            <Box as="span">Fat: </Box>
            <Box as="span">{props.recipe.fat}g</Box>
          </Box>
          <Box borderRadius="md" p="2" bg="gray.700">
            <Box as="span">Protein: </Box>
            <Box as="span">{props.recipe.protein}g</Box>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};

export default RecipePreview;
