import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {ScrollView, Button} from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import {Context as AuthContext} from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import Spinner from 'react-native-loading-spinner-overlay';
import Header from '../header';
import { useNavigation } from '@react-navigation/native';
import { usePostHog } from 'posthog-react-native';
const {width} = Dimensions.get('window');

const ImageUploadComponent = ({route}) => {
    const {state, saveimage} = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const {t} = useTranslation();
  const navigation = useNavigation();
  const posthog = usePostHog();


  const submitForm = (insurance) => {
    // saveimage(selectedImage)
   if(route.params.from === 'ticket'){
    saveimage('qrcode', {service: route.params.service, orgainzation: state.organization, clienttype: 'insurance', insurance}, navigation)
   }else {
    saveimage('Appointment', {service: route.params.service, orgainzation: state.organization, clienttype: 'insurance', insurance}, navigation)
   }
  //  doctors(state.organization, params.service);
  };

  // const openImagePicker = () => {
  //   const options = {
  //     title: 'Select an Image',
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //     quality: 0.5, // Set the compression quality
  //   };

  //   ImagePicker.launchImageLibrary(options, (response) => {
  //     if (response.didCancel) {
  //       console.log('Image picker was canceled');
  //     } else if (response.error) {
  //       console.log('Image picker error: ', response.error);
  //     } else {
  //       // You can display the selected image if needed
  //       // Convert the selected image to Base64
  //       RNFS.readFile(response.assets[0].uri, 'base64')
  //         .then((base64) => {
  //           setSelectedImage(base64);
  //           // You can now use the Base64 data for your upload.
  //         })
  //         .catch((error) => {
  //           console.log('Error converting to Base64: ', error);
  //         });
  //     }
  //   });
  // };

  // const openImagePicker2 = () => {
  //   const options =  {
  //       title: 'Take Image',
  //       type: 'capture',
  //       options: {
  //         saveToPhotos: true,
  //         mediaType: 'photo',
  //         includeBase64: true,
  //       },
  //       quality: 0.5, 
  //     }

  //   ImagePicker.launchCamera(options, (response) => {
  //     if (response.didCancel) {
  //       console.log('Image picker was canceled');
  //     } else if (response.error) {
  //       console.log('Image picker error: ', response.error);
  //     } else {
  //       // You can display the selected image if needed
  //       // Convert the selected image to Base64
  //       RNFS.readFile(response.assets[0].uri, 'base64')
  //         .then((base64) => {
  //           setSelectedImage(base64);
  //           // You can now use the Base64 data for your upload.
  //         })
  //         .catch((error) => {
  //           console.log('Error converting to Base64: ', error);
  //         });
  //     }
  //   });
  // };

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
        <Text style={styles.headerminitext}>{t('Choose your Insurance')}</Text>
        </View>
       
        <View style={styles.form}>
          
       {state.insurance?.map((ser) => {
          return (
              <Button key={ser._id} size="lg" onPress={() => {submitForm(ser._id); posthog.capture('insurance_choice', {insurance: ser})} } variant="outline" marginBottom={5}>
              {ser.name}
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

export default ImageUploadComponent;
