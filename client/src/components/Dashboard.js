import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Search from './Search';

const Dashboard = () => {
  return (
    <Tabs size="lg">
      <TabList>
        <Tab>Search</Tab>
        <Tab>Browse</Tab>
        <Tab>Users</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Search />
        </TabPanel>
        <TabPanel></TabPanel>
        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Dashboard;
