import React, { createContext, useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { theme } from '@chakra-ui/react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Test from './components/Test';
import SearchResults from './components/SearchResults';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ username: 'june.s', name: 'June Parker' });
  const changeUser = ({ fullName, username }) => {
    setUser(user => ({
      username: username,
      name: fullName,
    }));
  };
  return (
    <UserContext.Provider value={{ user, changeUser }}>
      {children}
    </UserContext.Provider>
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <Router>
          <Box maxW="1200px" margin="0 auto">
            <Header />
            <Switch>
              <Route path="/test">
                <Test />
              </Route>
              <Route path="/search">
                <SearchResults />
              </Route>
              <Route path="/">
                <Dashboard />
              </Route>
            </Switch>
          </Box>
        </Router>
      </UserProvider>
    </ChakraProvider>
  );
}

export default App;
