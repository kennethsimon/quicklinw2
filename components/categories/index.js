import {ScrollView, Button} from 'native-base';
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Keyboard,
} from 'react-native';
import Regularinput from '../inputs/regularinput';
import {Context as AuthContext} from '../../context/AppContext';
import phone from 'phone';
import {RFValue} from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
const {width} = Dimensions.get('window');
import { usePostHog } from 'posthog-react-native';

const Categories = ({navigation, route}) => {
  const {state, login} = useContext(AuthContext);
  const [choosenservice, setChoosenservice] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const params = route.params;
  const {t} = useTranslation();
  const posthog = usePostHog();



  const submitForm = (par) => {
    navigation.navigate('Choice', {service: par})
  };
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentcontainer}>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: width}}>
             <Image
            source={require('../../assets/quick.png')}
            style={styles.logoimage}
          />
          {/* <Text style={styles.headertext}>Sign in</Text> */}
          <Text style={styles.headerminitext}>{t('Choose your Category')}</Text>
          </View>
         
          <View style={styles.form}>
            
         {state?.categories?.length > 0 && state?.categories?.map((ser) => {
            return (
                <Button key={ser._id} size="lg" onPress={() => {submitForm(ser._id);  posthog.capture('choose_category', {category: ser});} } variant="outline" marginBottom={5}>
                {state?.language === 'english' ? ser?.name : (ser?.nameswahili || ser?.name)}
              </Button>
            )
         })}
            {/* <Button
              onPress={() => {
               navigation.navigate('Choice')
              }}
              isLoading={state.loading === 'login'}
              disabled={state.loading === 'login'}
              size={'lg'}
              bgColor={'#25A18E'}
              mt={'3'}>
              Continue
            </Button> */}
            {/* <Pressable
              onPress={() => {
                navigation.navigate('Phoneauthscreen');
              }}
              style={styles.bottom}> */}
              {/* <Text style={styles.signup}>Don't have an account?</Text>
              <Text style={styles.bold}>Sign up</Text> */}
            {/* </Pressable> */}
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
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoimage: {
    width: RFValue(70),
    height: RFValue(100),
    objectFit: 'contain',
    alignSelf: 'center'
  },
  bold: {
    color: '#000',
    fontFamily: 'Helvetica-Bold',
    fontSize: RFValue(18),
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
    paddingVertical: RFValue(30),
    fontSize: RFValue(18),
  },
  form: {
    paddingVertical: RFValue(20),
  },
  headertext: {
    fontSize: RFValue(32),
    color: '#000',
    fontFamily: 'Helvetica-Bold',
    // fontWeight: 600,
    paddingTop: RFValue(20),
  },
  headerminitext: {
    fontSize: RFValue(18),
    color: 'grey',
    fontWeight: 400,
    fontFamily: 'Helvetica',
    alignSelf: 'center'
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

export default Categories;
