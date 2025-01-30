import {ScrollView, Button} from 'native-base';
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Regularinput from '../inputs/regularinput';
import {Context as AuthContext} from '../../context/AppContext';
import Materialicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
const {width} = Dimensions.get('window');

const Passwordscreen = ({navigation, route}) => {
  const params = route.params;
  const {state, createCustomer} = useContext(AuthContext);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showpassword, setShowpassword] = useState(false);

  function validatePassword(password) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{8,}$/;
    return passwordRegex.test(password);
  }

  const onSubmit = () => {
    Keyboard.dismiss();
    setError('');
    if (validatePassword(password)) {
      createCustomer({...params, password});
    } else {
      setError(
        'Enter a valid password with 8 characters or more , with atleast one uppercase letter, one lowercase, number and special character',
      );
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentcontainer}>
          <Text style={styles.headertext}>Password</Text>
          <Text style={styles.headerminitext}>
            Password should be 8 characters long and contain a mix of uppercase
            and lowercase letters, numbers and symbols
          </Text>
          <View style={styles.form}>
            <Regularinput
              value={password}
              onChangeText={val => setPassword(val)}
              placeholder={'Password'}
              password={true}
              isInvalid={error}
              errorMessage={error}
              secureTextEntry={!showpassword}
              InputRightElement={
                <Pressable
                  onPress={() => {
                    setShowpassword(!showpassword);
                  }}>
                  <Materialicons
                    name={showpassword ? 'eye-off-outline' : 'eye-outline'}
                    size={30}
                    color="grey"
                    style={styles.icon}
                  />
                </Pressable>
              }
            />
            <Button
              onPress={() => {
                onSubmit();
              }}
              isLoading={state.loading === 'createcustomer'}
              isDisabled={state.loadin === 'createcustomer'}
              size={'lg'}
              bgColor={'#539D8B'}
              mt={'3'}>
              Create account
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: RFValue(10),
  },
  bold: {
    color: '#000',
    fontWeight: 600,
    fontSize: RFValue(18),
    textDecorationLine: 'underline',
  },
  forgottext: {
    textAlign: 'right',
    color: '#000',
    fontWeight: 600,
  },
  signup: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 400,
    paddingVertical: RFValue(30),
    fontSize: RFValue(18),
  },
  form: {
    paddingVertical: RFValue(20),
  },
  headertext: {
    fontSize: RFValue(30),
    color: '#000',
    fontWeight: 600,
    paddingTop: RFValue(30),
  },
  headerminitext: {
    fontSize: RFValue(16),
    color: 'grey',
    fontWeight: 400,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentcontainer: {
    width: width - RFValue(40),
  },
});

export default Passwordscreen;
