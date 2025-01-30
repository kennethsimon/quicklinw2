import React, {useContext} from 'react';
import {Context as AuthContext} from '../../context/AppContext';

const Loadingscreen = () => {
  const {trylocalSignin} = useContext(AuthContext);
  React.useEffect(() => {
    trylocalSignin();
  }, [trylocalSignin]);
  return null;
};

export default Loadingscreen;
