import { Box, Button, HStack, Heading, ScrollView, Stack, Text } from 'native-base';
import React, { useContext } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {Context as AuthContext} from '../../context/AppContext';
import RecentAppointmentcard from './appointmentcard';






const RecentAppointment = () => {
  const {state} = useContext(AuthContext);
    return (
     <ScrollView>
       {Array.isArray(state.recentappointments) && state.recentappointments.map((item) => {
        return (
          <RecentAppointmentcard item={item} key={item?._id}/>
        )
       })}
    <Spinner
          visible={['recentappointments', 'cancelappointment'].includes(state.loading)  ? true : false}
          textContent={state.loading === 'recentappointments' ? 'Fetching appointments...' : state.loading === 'cancelappointment' ? 'cancelling appointment' : ''}
        />
     </ScrollView>
    )
}

export default RecentAppointment;