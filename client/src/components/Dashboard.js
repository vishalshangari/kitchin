import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Search from './Search';
import Dash from './Dash';
import Recipes from './Recipes';
import Users from './Users';
import Ingredients from './Ingredients';

const Dashboard = () => {
  return (
    <Tabs size="lg" defaultIndex={1}>
      <TabList>
        <Tab>Dashboard</Tab>
        <Tab>Search</Tab>
        <Tab>Recipes</Tab>
        <Tab>Ingredients</Tab>
        <Tab>Users</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Dash />
        </TabPanel>
        <TabPanel>
          <Search />
        </TabPanel>
        <TabPanel>
          <Recipes />
        </TabPanel>
        <TabPanel>
          <Ingredients />
        </TabPanel>
        <TabPanel>
          <Users />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Dashboard;
