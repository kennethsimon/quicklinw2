import React, {useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,

  TouchableOpacity,
} from 'react-native';
import {Context as AuthContext} from '../../context/AppContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useTranslation } from 'react-i18next';
import { usePostHog } from 'posthog-react-native';

const Qrcode = ({route}) => {
  const {state, createTicket} = useContext(AuthContext);
  const params = route.params;
  const {t, i18n} = useTranslation();
  const posthog = usePostHog();
  const language = i18n.language === 'sw' ? 'kiswahili' : i18n.language === 'en' ? 'english' : 'kiswahili';

  const onSuccess = e => {
    if(route?.params?.clienttype === 'insurance'){
      posthog.capture('create_ticket', {ticket: {service: params.service, officephonenumber: state.organization.officephonenumber, client_id: state.user?.user?._id, date: new Date(), name: state.user.user.full_name, mobile: state.user.user.telephone_number, organization: e.data, clienttype: 'insurance', address: state.user.user.local_address, age: state.user.user.birthdate, language, insurancephoto: '', insurance: params.insurance}})
      createTicket({service: params.service, officephonenumber: state.organization.officephonenumber, client_id: state.user?.user?._id, date: new Date(), name: state.user.user.full_name, mobile: state.user.user.telephone_number, organization: e.data, clienttype: 'insurance', address: state.user.user.local_address, age: state.user.user.birthdate, language, insurancephoto: '', insurance: params.insurance}, state.user.auth_token);
    }else{
      posthog.capture('create_ticket', {ticket: {service: params.service, officephonenumber: state.organization.officephonenumber, client_id: state.user?.user?._id, date: new Date(), name: state.user.user.full_name, mobile: state.user.user.telephone_number, organization: e.data, clienttype: 'cash', address: state.user.user.local_address, age: state.user.user.birthdate, language, insurancephoto: '', insurance: ''}})
      createTicket({service: params.service, officephonenumber: state.organization.officephonenumber, client_id: state.user?.user?._id, date: new Date(), name: state.user.user.full_name, mobile: state.user.user.telephone_number, organization: e.data, clienttype: 'cash', address: state.user.user.local_address, age: state.user.user.birthdate, language, insurancephoto: '', insurance: ''}, state.user.auth_token);
    }
  };

  return ( 
        <>
        <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.off}
        topContent={
          <Text style={styles.centerText}>
            {t("Go to")}{' '}
            <Text style={styles.textBold}>{t("Quickline qrcode")}</Text> {t("and scan the QR code")}.
          </Text>
        }
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>{t("OK. Got it!")}</Text>
          </TouchableOpacity>
        }
      />
      <Spinner
      visible={state.loading === 'ticket' ? true : false}
      textContent={`${t("Sumbitting request")}...`}
      textStyle={styles.spinnerTextStyle}
    />
    </>   
  );
};

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
      },
      textBold: {
        fontWeight: '500',
        color: '#000'
      },
      buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
      },
      buttonTouchable: {
        padding: 16
      }
});

export default Qrcode;
