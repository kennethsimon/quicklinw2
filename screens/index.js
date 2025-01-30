import React, {useContext} from 'react';
import {Context as AuthContext} from '../context/AppContext';
import HomeTabs from './homeTabs';
import AuthStack from './authstack';

const AuthCheck = () => {
  const {state} = useContext(AuthContext);

  return state.user ? <HomeTabs /> : <AuthStack />;

  // Use the user state and authentication functions
  // ...
};

export default AuthCheck;
