import { useEffect, useState } from 'react';
import {
  SimpleGrid,
  Box,
  Text,
  Heading,
  VStack,
  Flex,
  Square,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Center,
  Button,
  Th,
  Td,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { UserContext } from '../App';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AiOutlineDown, AiOutlineRight, AiOutlineUp } from 'react-icons/ai';

const Dash = () => {
  const { user } = useContext(UserContext);
  const [dashboardStats, setDashboardStats] = useState({});
  const [recipeListFilter, setRecipeListFilter] = useState(true);
  const [userFavRecipes, setUserFavRecipes] = useState([]);
  const [userAddedRecipes, setUserAddedRecipes] = useState([]);
  const [expiringIngredients, setExpiringIngredients] = useState([]);
  const [cuisineTypesCount, setCuisineTypesCount] = useState([]);
  const [healthLabelsCount, setHealthLabelsCount] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/dashboard?username=${user.username}`);
      setUserFavRecipes(() => result.data.userFavRecipes);
      setUserAddedRecipes(() => result.data.userAddedRecipes);
      setExpiringIngredients(() => result.data.expiringIngredients);
      setCuisineTypesCount(() => result.data.cuisineTypesCount);
      setHealthLabelsCount(() => result.data.healthLabelsCount);
      setDashboardStats(() => ({
        totalRecipes: result.data.totalRecipes.count,
        totalIngredients: result.data.totalIngredients.count,
        totalIngredientsInStock: result.data.totalIngredientsInStock.count,
      }));
    };
    fetchData();
  }, [user]);
  const history = useHistory();
  const handleUseExpiringIngredients = () => {
    let expiringQuery = '';
    expiringIngredients.forEach(element => {
      expiringQuery += element.ingredientName + ',';
    });
    history.push(`/search?keywords=${expiringQuery.slice(0, -1)}`);
  };
  return (
    <div>
      <Heading mb={4}>Overview</Heading>
      <SimpleGrid mb={[8, null, 12]} columns={[1, null, 3]} spacing="4">
        {dashboardStats.totalRecipes && (
          <DisplayItem num={dashboardStats.totalRecipes} text="Total recipes" />
        )}
        {dashboardStats.totalIngredients && (
          <DisplayItem
            num={dashboardStats.totalIngredients}
            text="Total ingredients"
          />
        )}
        {dashboardStats.totalIngredientsInStock && (
          <DisplayItem
            num={dashboardStats.totalIngredientsInStock}
            text="Ingredients in stock"
          />
        )}
      </SimpleGrid>
      <SimpleGrid mb={[8, null, 12]} columns={[1, null, 2]} spacing="4">
        <Box>
          <Heading size="lg" mb={4}>
            Top Cuisines
          </Heading>
          <Box borderWidth="1px" borderRadius="md">
            <Table>
              <Thead>
                <Tr>
                  <Th>Cuisine</Th>
                  <Th isNumeric>Recipes</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cuisineTypesCount &&
                  cuisineTypesCount
                    .slice(0, 5)
                    .map(({ cuisineType, ct }, idx) => (
                      <Tr bg={idx % 2 === 0 ? 'blue.800' : 'inherit'} key={idx}>
                        <Td textTransform="capitalize">{cuisineType}</Td>
                        <Td isNumeric>{ct}</Td>
                      </Tr>
                    ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
        <Box>
          <Heading size="lg" mb={4}>
            Top Health Categories
          </Heading>
          <Box borderWidth="1px" borderRadius="md">
            <Table>
              <Thead>
                <Tr>
                  <Th>Health Label</Th>
                  <Th isNumeric>Recipes</Th>
                </Tr>
              </Thead>
              <Tbody>
                {healthLabelsCount &&
                  healthLabelsCount.slice(0, 5).map(({ label, ct }, idx) => (
                    <Tr bg={idx % 2 === 0 ? 'blue.800' : 'inherit'} key={idx}>
                      <Td>{label}</Td>
                      <Td isNumeric>{ct}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </SimpleGrid>
      <SimpleGrid columns={[1, null, 2]} spacing="4">
        <VStack align="left" spacing={4}>
          <Heading size="lg" mb={4}>
            Your Favorite Recipes
          </Heading>
          {userFavRecipes &&
            userFavRecipes
              .slice(0, recipeListFilter ? 5 : undefined)
              .map((rec, idx) => <SmallRecipePreview key={idx} recipe={rec} />)}
          {userFavRecipes.length === 0 && (
            <Text color="gray.500">No recipes favorited yet.</Text>
          )}
        </VStack>
        <VStack align="left" spacing={4}>
          <Heading size="lg" mb={4}>
            Your Added Recipes
          </Heading>
          {userAddedRecipes &&
            userAddedRecipes
              .slice(0, recipeListFilter ? 5 : undefined)
              .map((rec, idx) => <SmallRecipePreview key={idx} recipe={rec} />)}
          {userAddedRecipes.length === 0 && (
            <Text color="gray.500">No recipes added yet.</Text>
          )}
        </VStack>
      </SimpleGrid>
      <Center>
        {((userFavRecipes && userFavRecipes.length > 5) ||
          (userAddedRecipes && userAddedRecipes.length > 5)) && (
          <Button
            mt={4}
            leftIcon={recipeListFilter ? <AiOutlineDown /> : <AiOutlineUp />}
            variant="outline"
            onClick={() => setRecipeListFilter(val => !val)}
          >
            {recipeListFilter ? `Show all` : `Show fewer`}
          </Button>
        )}
      </Center>
      <Flex mt={[8, null, 12]} justifyContent="space-between">
        <Heading size="lg" mb={4}>
          Ingredients Expiring Soon
        </Heading>
        <Button colorScheme="pink">Manage ingredients</Button>
      </Flex>
      <Box borderWidth="1px" borderRadius="md">
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th fontSize="md">Ingredient</Th>
              <Th fontSize="md">Expiration Date</Th>
              <Th fontSize="md" isNumeric>
                Quantity
              </Th>
              <Th fontSize="md">Measurement</Th>
            </Tr>
          </Thead>
          <Tbody>
            {expiringIngredients &&
              expiringIngredients.map(
                (
                  { ingredientName, storedAmount, storedType, expiryDate },
                  idx
                ) => (
                  <Tr key={idx}>
                    <Td>{ingredientName}</Td>
                    <Td>{expiryDate}</Td>
                    <Td isNumeric>{storedAmount}</Td>
                    <Td>{storedType}</Td>
                  </Tr>
                )
              )}
          </Tbody>
        </Table>
      </Box>
      <Button
        mt="4"
        colorScheme="orange"
        rightIcon={<AiOutlineRight />}
        onClick={() => handleUseExpiringIngredients()}
      >
        See recipes using expiring ingredients
      </Button>
    </div>
  );
};

const SmallRecipePreview = ({ recipe }) => {
  return (
    <Flex
      p={4}
      as="button"
      textAlign="left"
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      bg="gray.700"
      _hover={{
        boxShadow: 'lg',
        borderColor: 'gray.300',
      }}
    >
      <Square mr={4} size="80px" borderRadius="md" overflow="hidden">
        <Image src={recipe.imageURL} />
      </Square>
      <VStack spacing={0} align="left">
        <Box overflow="hidden">
          <Heading size="md" fontWeight="bold">
            {recipe.recipeName}
          </Heading>
        </Box>
        <Text>{`Calories: ${Math.round(
          recipe.calories / recipe.servings
        )}, Fat: ${Math.round(
          recipe.fat / recipe.servings
        )}g, Protein: ${Math.round(recipe.protein / recipe.servings)}g`}</Text>
        <Text fontStyle="italic" color="gray.500">
          per serving, makes {Math.round(recipe.servings)} servings
        </Text>
      </VStack>
    </Flex>
  );
};

const DisplayItem = ({ num, text }) => {
  return (
    <Box
      textAlign={['center', null, 'left']}
      bg={'gray.700'}
      borderWidth="1px"
      borderRadius="lg"
      p={4}
    >
      <Text fontWeight="900" fontSize={['xl', null, '4xl']}>
        {num}
      </Text>
      <Text fontSize={['md', null, 'xl']}>{text}</Text>
    </Box>
  );
};

export default Dash;
