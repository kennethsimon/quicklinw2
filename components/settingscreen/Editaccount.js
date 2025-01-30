import {ScrollView, Button} from 'native-base';
import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View, Pressable} from 'react-native';
import Regularinput from '../inputs/regularinput';
import {Context as AuthContext} from '../../context/AppContext';
import Materialicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
const {width} = Dimensions.get('window');

const Editaccount = ({navigation}) => {
  const {state, resetpassword} = useContext(AuthContext);
  const [showpassword, setShowpassword] = useState(false);
  const [shownewpassword, setShownewpassword] = useState(false);
  const [password, setPassword] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = () => {
    if (password && newpassword) {
      resetpassword({current_password: password, new_password: newpassword});
    } else if (!password) {
      setError({password: 'Fill in the required field'});
    } else if (!newpassword) {
      setError({newpassword: 'Fill in the required field'});
    }
  };

  useEffect(() => {
    if (state.success) {
      setPassword('');
      setNewpassword('');
    }
  }, [state.success]);
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.contentcontainer}>
          <View style={styles.form}>
            <Regularinput
              onChangeText={val => setPassword(val)}
              value={password}
              placeholder={'Current password'}
              secureTextEntry={!showpassword}
              password={true}
              isInvalid={error?.password}
              errorMessage={error?.password}
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
            <Regularinput
              onChangeText={val => setNewpassword(val)}
              value={newpassword}
              placeholder={'New password'}
              secureTextEntry={!shownewpassword}
              password={true}
              isInvalid={error?.newpassword}
              errorMessage={error?.newpassword}
              InputRightElement={
                <Pressable
                  onPress={() => {
                    setShownewpassword(!shownewpassword);
                  }}>
                  <Materialicons
                    name={shownewpassword ? 'eye-off-outline' : 'eye-outline'}
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
              isLoading={state.loading === 'resetpassword'}
              isDisabled={state.loading === 'resetpassword'}
              size={'lg'}
              bgColor={'#539D8B'}
              mt={'3'}>
              Submit
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
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  forgottext: {
    textAlign: 'right',
    color: '#000',
    fontFamily: 'Helvetica',
  },
  signup: {
    textAlign: 'center',
    color: '#000',
    fontFamily: 'Helvetica',
    paddingVertical: 30,
    fontSize: 18,
  },
  form: {
    paddingVertical: 20,
  },
  headertext: {
    fontSize: 32,
    color: '#000',
    fontFamily: 'Helvetica-Bold',
    // fontWeight: 600,
    paddingTop: 30,
  },
  headerminitext: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 400,
    fontFamily: 'Helvetica',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentcontainer: {
    width: width - 40,
  },
});

export default Editaccount;
