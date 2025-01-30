import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Box, Button, HStack, Heading, Stack, Text } from 'native-base';
import React, { useContext } from 'react';
import {Context as AuthContext} from '../../context/AppContext';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';


const Visitscard = ({item}) => {
  const {state, createVisitTicket} = useContext(AuthContext);
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();
  const language = i18n.language === 'sw' ? 'kiswahili' : i18n.language === 'en' ? 'english' : 'kiswahili';

  const submit = () => {
    if(item.status == 'active'){
      if(item?.insurance){
        createVisitTicket({service: item.service, officephonenumber: item.organization.officephonenumber, client_id: state.user?.user?._id, date: new Date(), name: state.user.user.full_name, mobile: state.user.user.telephone_number, organization: item?.organization?.id, clienttype: item?.clienttype, address: state.user.user.local_address, age: state.user.user.birthdate, language, insurancephoto: '', insurance: item?.insurance, days: item?.days, daysvisited: item?.daysvisited, visitid: item?._id}, state.user.auth_token, item?.organization)
      }else{
        createVisitTicket({service: item.service, officephonenumber: item.organization.officephonenumber, client_id: state.user?.user?._id, date: new Date(), name: state.user.user.full_name, mobile: state.user.user.telephone_number, organization: item?.organization?._id, clienttype: 'cash', address: state.user.user.local_address, age: state.user.user.birthdate, language, insurancephoto: '', insurance: '', days: item?.days, daysvisited: item?.daysvisited, visitid: item?._id}, state.user.auth_token,  item?.organization)
      }
    }else{
      Alert.alert('Error', `${t('Your visits have Expired or you have reached number of days')}`, [
        {text: 'OK'},
      ]);
    }
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
              Organization: {item?.organization?.name}
            </Heading>
            <Text fontSize="xs" _light={{
            color: "violet.500"
          }} _dark={{
            color: "violet.400"
          }} fontWeight="500" ml="-0.5" mt="-1">
            Created at {moment(item?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
            </Text>
          </Stack>
          {/* <Text fontWeight="400">
            Organization: {item?.organization?.name}
          </Text> */}
          <Text fontWeight="400">
            Number of days: {item?.days}
          </Text>
          <Text fontWeight="400">
            Visits used: {item?.daysvisited}
          </Text>
          <HStack alignItems="center" space={4} justifyContent="space-between">
            <HStack alignItems="center">
              <Text color="coolGray.600" _dark={{
              color: "warmGray.200"
            }} fontWeight="400">
                status: {item?.status}
              </Text>
            </HStack>
            <HStack alignItems="center" space={4} justifyContent="space-between">
            <Button isDisabled={item?.status !== 'active'} onPress={() => submit()} size="sm"  bgColor={'#25A18E'}>
            Create Ticket
          </Button>
            </HStack>
          </HStack>
        </Stack>
      </Box>
    </Box>
    </Box>
    )
}

export default Visitscard;