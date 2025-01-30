import { ScrollView, Button, Center, Box, Select, CheckIcon, Text, Fab, Checkbox } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Context as AuthContext } from '../../context/AppContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import Spinner from 'react-native-loading-spinner-overlay';
import { useTranslation } from 'react-i18next';
import Orgcard from './orgcard';
import Header from '../header';
import Helpdialog from './Helpdialog';
import { usePostHog } from 'posthog-react-native'
import Clienttype from '../chooseclienttype';
import { useRoute } from '@react-navigation/native';
const { width } = Dimensions.get('window');

const Organizationscreen = ({ navigation }) => {
  const route = useRoute();
  const { state, categories, insurance, doctors } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [service, setService] = useState(false);
  const [category, setCategory] = useState(null);
  const [isInsured, setIsInsured] = useState(false);
  const params = route.params;
  const [insurances, setInsurances] = React.useState(false);
  const [selectedinsurance, setSelectedInsurance] = React.useState("");
  const { t } = useTranslation();
  const posthog = usePostHog();


  const submitForm = () => {
   if(service && category && insurances){
   if(state.from === 'checkin'){
    navigation?.navigate("qrcode", {service: category, insurance: selectedinsurance, clienttype: insurances === 'yes' ? "insurance" : "cash"})
   }else{
    doctors({_id: service}, category)
    navigation?.navigate("Doctors", {service: category, insurance: selectedinsurance, clienttype: insurances === 'yes' ? "insurance" : "cash"})
   }
   }else if(!service){
    Alert.alert('Error', 'please choose organization', [
      {
        text: 'Ok',
      },
    ]);
   }else if(!category){
    Alert.alert('Error', 'please choose category', [
      {
        text: 'Ok',
      },
    ]);
   }else if(!insurances){
    Alert.alert('Error', 'please specify if you have insurance or not', [
      {
        text: 'Ok',
      },
    ]);
   }
  };

  useEffect(() => {
   if(service){
    const org = state.organizations.find((org) => org._id === service);
    posthog.capture('choose_organization', { organization: org, category, isInsured });
    categories(org);
   }
  }, [service])

  useEffect(() => {
    if(insurances === 'yes'){
      const org = state.organizations.find((org) => org._id === service);
    insurance({organization: org});
    }else{
      setSelectedInsurance(null)
    }
  }, [insurances])



  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center' }} onPress={() => { logout() }}>
        <Icon name='power' size={RFValue(20)} color='#000' /><Text>Log out</Text>
      </TouchableOpacity> */}
      <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
        <View style={styles.contentcontainer}>
          <Header title={"Choose your Organization"} />
          <View style={styles.form}>
            <Center>
              <Box width="100%">
                <Select width="100%" size="lg" selectedValue={service} minWidth="200" accessibilityLabel="Choose Organization" placeholder={t("Choose Organization")} _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }} mt={1} onValueChange={itemValue => setService(itemValue)}>
                  {state.organizations.map((org) => {
                    return (
                      <Select.Item key={org._id} label={org.name} value={org._id} />
                    )
                  })}
                </Select>
              </Box>
            </Center>

            {/* Select Category */}
            <Center mt={4}>
              <Box width="100%">
                <Select width="100%" size="lg" selectedValue={category} minWidth="200" accessibilityLabel="Choose Category" placeholder={t("Choose Category")} _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }} onValueChange={itemValue => setCategory(itemValue)}>
                  {state?.categories?.length > 0 && state?.categories.map((cat) => {
                    return (
                      <Select.Item key={cat._id} label={cat.name} value={cat._id} />
                    )
                  })}
                </Select>
              </Box>
            </Center>
            <Center mt={4}>
              <Box width="100%">
                <Select width="100%" size="lg" selectedValue={insurances} minWidth="200" accessibilityLabel="Do you have Insurance?" placeholder={t("Do you have Insurance?")} _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }} onValueChange={itemValue => setInsurances(itemValue)}>
                 
                      <Select.Item key={"yes"} label={t("yes")} value={"yes"} />
                      <Select.Item key={"no"} label={t("no")} value={"no"} />
                </Select>
              </Box>
            </Center>
            {insurances === 'yes' && <Center mt={4}>
              <Box width="100%">
                <Select width="100%" size="lg" selectedValue={selectedinsurance} minWidth="200" accessibilityLabel="Choose Insurance" placeholder={t("Choose Insurance")} _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }} onValueChange={itemValue => setSelectedInsurance(itemValue)}>
                  {state?.insurance?.length > 0 && state.insurance?.map((res) => {
                    return (
                      <Select.Item key={res?._id} label={res?.name} value={res?._id} />
                    )
                  })}
                    
                </Select>
              </Box>
            </Center>}
            {/* Is Insured Checkbox */}
            {/* <Center mt={4}>
              <Checkbox value="insured" isChecked={isInsured} onChange={setIsInsured} colorScheme="blue">
                {t("Is Insured")}
              </Checkbox>
            </Center> */}

            <Button
              onPress={() => {
                submitForm()
              }}
              isLoading={state.loading === 'login'}
              disabled={state.loading === 'login'}
              size={'lg'}
              bgColor={'#25A18E'}
              mt={'3'}>
              {t('Continue')}
            </Button>
            {/* <Orgcard /> */}
            {/* <Fab style={{ backgroundColor: '#25A18E' }} label={t("Support")} placement='top-right' onPress={() => setIsOpen(!isOpen)} renderInPortal={true} shadow={2} size="sm" icon={<Icon color="white" name="help-circle-outline" size={RFValue(20)} />} /> */}
            {/* <Helpdialog isOpen={isOpen} setIsOpen={setIsOpen} /> */}
            <Spinner
              visible={['categories', 'doctors'].includes(state.loading) ? true : false}
              textContent={state.loading === 'categories' ? `${t("Fetching categories")}...` : state.loading === 'doctors' ? `${t("Fetching doctors")}...` : null}
              textStyle={styles.spinnerTextStyle}
            />
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
    width: RFValue(220),
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

export default Organizationscreen;