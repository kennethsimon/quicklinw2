import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Box, Button, HStack, Heading, Stack, Text } from 'native-base';
import React, { useContext } from 'react';
import {Context as AuthContext} from '../../context/AppContext';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';


const RecentAppointmentcard = ({item}) => {
  const {state, setappointment, cancelappointment} = useContext(AuthContext);
  const navigation = useNavigation();
  const {t} = useTranslation();

  const submit = () => {
    if(item.paymentstatus == 'paid'){
      setappointment(item.organization);
    navigation.navigate('Recentappointmentcalender', {service: item.service, organization: item.organization._id, clienttype: item.clienttype, doctor: item.doctor, from: 'recent', appointment: item._id})
    }else{
      Alert.alert('Error', `${t('Please pay for your appointment to reschedule')}`, [
        {text: 'OK'},
      ]);
    }
  }


  const cancelapp = () => {
      cancelappointment({appointment: item._id, token: state.user.auth_token});
  }
    return (
         <Box alignItems="center" >
      <Box width="95%" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
      borderColor: "coolGray.600",
      backgroundColor: "gray.700"
    }} _web={{
      shadow: 2,
      borderWidth: 0
    }} _light={{
      backgroundColor: "gray.50"
    }}>
        <Box>
        <Stack maxW="100%"  p="4" space={3}>
          <Stack maxW="100%"  space={2}>
            <Heading size="md" ml="-1">
              Appointment Number: {item?.number}
            </Heading>
            <Text fontSize="xs" _light={{
            color: "violet.500"
          }} _dark={{
            color: "violet.400"
          }} fontWeight="500" ml="-0.5" mt="-1">
            booked at {moment(item?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
            </Text>
          </Stack>
          <Text fontWeight="400">
            Organization: {item?.organization?.name}
          </Text>
          <Text fontWeight="400">
            From: {moment(item?.start_time).format('HH:mm')} to {moment(item?.end_time).format('HH:mm')}
          </Text>
          <HStack alignItems="center" space={4} justifyContent="space-between">
            <HStack alignItems="center">
              <Text color="coolGray.600" _dark={{
              color: "warmGray.200"
            }} fontWeight="400">
                status: {item?.status === 'cancelled' ? 'cancelled' : item?.paymentstatus}
              </Text>
            </HStack>
            <HStack alignItems="center" space={4} justifyContent="space-between">
            <Button isDisabled={item?.paymentstatus === 'attended'} onPress={() => submit()} size="sm"  bgColor={'#25A18E'}>
            Reschedule
          </Button>
            {item?.paymentstatus !== 'paid' && ['not_attended'].includes(item?.status) && <Button onPress={() => cancelapp()} size="sm"  bgColor={'#25A18E'}>
            cancel
          </Button>}
            </HStack>
          </HStack>
        </Stack>
      </Box>
    </Box>
    </Box>
    )
}

export default RecentAppointmentcard;