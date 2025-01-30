import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTranslation} from 'react-i18next';
const {width} = Dimensions.get('window');

const Header = ({title}) => {
  const {t} = useTranslation();
  return (

          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: width - RFValue(20), flexWrap: 'wrap'}}>
              <Image
            source={require('../../assets/quick.png')}
            style={styles.logoimage}
          />
          {/* <Text style={styles.headertext}>Sign in</Text> */}
          <Text style={styles.headerminitext}>{t(title)}</Text>
          </View>
  );
};

const styles = StyleSheet.create({
  logoimage: {
    width: RFValue(70),
    height: RFValue(100),
    objectFit: 'contain',
    alignSelf: 'center'
  },
  headerminitext: {
    fontSize: RFValue(18),
    color: 'grey',
    fontWeight: 400,
    fontFamily: 'Helvetica',
    alignSelf: 'center',
    maxWidth: width - RFValue(110),
  },
});

export default Header;
