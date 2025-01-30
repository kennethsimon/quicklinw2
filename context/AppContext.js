import createDataContext from './createDataContext';
import Api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate} from './navigationRef';
import { usePostHog } from 'posthog-react-native'
import { Alert } from 'react-native';


const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'user':
      return {...state, user: action.payload};
    case 'registersuccess':
      return {...state, registersuccess: action.payload};
    case 'changepasssuccess':
      return {...state, changepasssuccess: action.payload};
    case 'loading':
      return {...state, loading: action.payload};
    case 'registersuccess':
      return {...state, registersuccess: action.payload};
    case 'authloading':
      return {...state, authloading: action.payload};
    case 'cards':
      return {...state, cards: action.payload};
    case 'notifications':
      return {...state, notifications: action.payload};
    case 'activities':
      return {...state, activities: action.payload};
    case 'visits':
      return {...state, visits: action.payload};
    case 'cardactivities':
      return {...state, cardactivities: action.payload};
    case 'error':
      return {...state, error: action.payload};
    case 'success':
      return {...state, success: action.payload};
    case 'fcmtoken':
      return {...state, fcmtoken: action.payload};
    case 'organizations':
      return {...state, organizations: action.payload};
    case 'categories':
      return {...state, categories: action.payload};
    case 'organization':
      return {...state, organization: action.payload};
    case 'doctors':
      return {...state, doctors: action.payload};
    case 'appointments':
        return {...state, appointments: action.payload};
    case 'appointment':
        return {...state, appointment: action.payload};
    case 'recentappointments':
        return {...state, recentappointments: action.payload};
    case 'clientid':
          return {...state, clientid: action.payload};
    case 'image':
      return {...state, image: action.payload};
    case 'doctor':
      return {...state, doctor: action.payload};
    case 'insurance':
      return {...state, insurance: action.payload};
    case 'language':
      return {...state, language: action.payload}
    case 'timeslots':
      return {...state, timeslots: action.payload}
    case 'from':
        return {...state, from: action.payload}
    default:
      return state;
  }
};

// Use regex to add commas
const formatCurrency = (currencyValueStr) => {
  const curr = currencyValueStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const currencyWithSymbol = curr + " TZS";
  return currencyWithSymbol;
};

const login = dispatch => async (userData, posthog) => {
  try {
    dispatch({type: 'loading', payload: 'login'});
    const response = await Api.post('/signin/authenticate', userData);
    await AsyncStorage.setItem(
      'token',
      JSON.stringify(response.data.auth_token),
    );
    await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
    dispatch({type: 'user', payload: response.data});
    const nameParts = response?.data?.user?.full_name?.split(" ");
    posthog.identify(response?.data?.user?._id.toString(), {
      firstname:  nameParts[0],
      lastName:  nameParts[0],
      username: response?.data?.user?.full_name,
    });
    dispatch({type: 'loading', payload: false});
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};



const organizations = dispatch => async (username, phonenumber, address, age) => {
  try {
    dispatch({type: 'loading', payload: 'organizations'});
    const response = await Api.get('/organizations/list');
    dispatch({type: 'organizations', payload: response.data.organizations});
    dispatch({type: 'loading', payload: null});
    navigate('Organization', {
      phonenumber: phonenumber,
      username: username,
      address,
      age
    });
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const categories = dispatch => async (service) => {
  try {
    dispatch({type: 'loading', payload: 'categories'});
    const response = await Api.get(`/categories/list?organization=${service._id}`);
    dispatch({type: 'organization', payload: service});
    dispatch({type: 'categories', payload: response.data.organizations});
    dispatch({type: 'loading', payload: null});
    // navigate('Categories');
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const insurance = dispatch => async (service) => {
  const token = await AsyncStorage.getItem('token');
  const headers = {
    'auth-token': JSON.parse(token),
    'Content-Type': 'application/json'
  };
  try {
    dispatch({type: 'loading', payload: 'insurance'});
    console.log('ken', service)
    const response = await Api.get(`/insurance/list?organization=${service?.organization?._id}`, {headers});
    dispatch({type: 'insurance', payload: response.data.insurance});
    dispatch({type: 'loading', payload: null});
    // navigate('Imageupload', service);
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const visits = dispatch => async () => {
  const token = await AsyncStorage.getItem('token');
  const headers = {
    'auth-token': JSON.parse(token),
    'Content-Type': 'application/json'
  };
  try {
    dispatch({type: 'loading', payload: 'visits'});
    const response = await Api.get(`/organization/uservisits`, {headers});
    console.log('visits', response?.data);
    dispatch({type: 'visits', payload: response.data.visits});
    dispatch({type: 'loading', payload: null});
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const setappointment = dispatch => async (service) => {
    dispatch({type: 'organization', payload: service});
};

const doctors = dispatch => async (organization, service) => {
  try {
    dispatch({type: 'loading', payload: 'doctors'});
    const response = await Api.get(`/doctors/list?organization=${organization._id}&service=${service}`);
    dispatch({type: 'doctors', payload: response.data.members});
    dispatch({type: 'loading', payload: null});
    // navigate('Doctors', {service, from});
  } catch (err) {
    dispatch({type: 'loading', payload: null});
    const error = {message: err?.response?.data}
    handleErrorResponse(dispatch, error  );
    dispatch({
      type: 'add_error',
      payload: err?.message,
    });
  }
};

const appointments = dispatch => async (date, service, organization, clienttype, doctor, from, appointment, insurance, navigation) => {
  // console.log({service, date, clienttype, doctor, from, appointment, insurance, organization})
  dispatch({type: 'loading', payload: 'lazyloading'});
  navigation.navigate('HomeStack', { screen: 'timeslots', params: {service, date, clienttype, doctor, from, appointment, insurance, organization} });
  dispatch({type: 'loading', payload: false});
      // navigation.navigate('timeslots', {service, date, clienttype, doctor, from, appointment, insurance, organization});
};

const appointments2 = dispatch => async (date, service, organization) => {
  try {
    dispatch({type: 'loading', payload: 'appointments'});
    await Api.get(`/appointments/list?date=${date}&service=${service}&organization=${organization}`).then((data) => {
      dispatch({type: 'loading', payload: null});
      dispatch({type: 'appointments', payload: data.data.appointments});
      // navigate('timeslots', {service, date, clienttype, doctor, from, appointment, insurance});
    }).catch((err) => {
      dispatch({type: 'loading', payload: null});
      handleErrorResponse(dispatch, err);
      dispatch({
        type: 'add_error',
        payload: err.response.data.messages
          ? err.response.data.messages
          : err.response.data,
      });
    });
  
  } catch (err) {
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const recentappointments = dispatch => async () => {
  const token = await AsyncStorage.getItem('token');
  const headers = {
    'auth-token': JSON.parse(token),
    'Content-Type': 'application/json'
  };
  try {
    dispatch({type: 'loading', payload: 'recentappointments'});
    const response = await Api.get(`/appointments/client`, {headers});
    dispatch({type: 'loading', payload: null});
    dispatch({type: 'recentappointments', payload: response.data.appointments});
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const saveimage = dispatch => async (goto, params, navigation) => {
  // const cloudName = 'dedfrilse';
  // const apiKey = '926476138849714';
  // const apiSecret = 'RIf1N_n1ugblKCT3UTjSOG0LVm8';

  // const credentials = encode(`${apiKey}:${apiSecret}`);
  // const formData = new FormData();
  // formData.append('file', `data:image/jpeg;base64,${image}`);
  // formData.append('upload_preset', 'rx9avpb9');
  try {
    // dispatch({type: 'loading', payload: 'uploadphoto'});
    //   const imgresponse = await Api.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Authorization': `Basic ${credentials}`,
    //     },
    //   });
    //   if(imgresponse.data){
    //   dispatch({type: 'image', payload: imgresponse?.data?.secure_url});
    navigation.navigate('HomeStack', { screen: goto, params });
    //  navigation?.navigate(goto, params);
      // }
    // dispatch({type: 'loading', payload: null});
    // navigate('successscreen', {appointment: response.data.appointment});
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};
const bookAppointment = dispatch => async (service, officephonenumber, time, slot_id, client_phone, client_name, organization, client_id, clienttype, image, doctor, token, language, insurance) => {
  // console.log()
  const headers = {
    'auth-token': token,
    'Content-Type': 'application/json'
  };
 
  try {
    dispatch({type: 'loading', payload: 'appointment'});
    const response = await Api.post(`/appointments/create`, {service, officephonenumber, client_id:  client_id, end_time: time.to,start_time: time.from, slot_id, client_phone, name: client_name, organization, clienttype, insurancephoto: image, doctor, language, insurance},  {headers});
    dispatch({type: 'appointment', payload: response.data.appointment});
    navigate('successscreen', {appointment: response.data.appointment});
    dispatch({type: 'loading', payload: null});
    // navigate('successscreen', {appointment: response.data.appointment});
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const cancelappointment = dispatch => async ({appointment, token}) => {
   console.log(token)
  const headers = {
    'auth-token': token,
    'Content-Type': 'application/json'
  };
 
  try {
    dispatch({type: 'loading', payload: 'cancelappointment'});
    const response = await Api.post(`/appointments/cancel`, {appointment},  {headers});
    dispatch({type: 'loading', payload: null});
    Alert.alert('Success', 'Appointment cancelled successfully', [
      {text: 'OK'},
    ]);
    // navigate('successscreen', {appointment: response.data.appointment});
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const updateAppointment = dispatch => async ( time, slot_id, appointment, token, language) => {
  const headers = {
    'auth-token': token,
    'Content-Type': 'application/json'
  };
  
  try {
    dispatch({type: 'loading', payload: 'appointment'});
    const response = await Api.post(`/appointments/updatedate`, {end_time: time.to,start_time: time.from, slot_id, ticket: appointment, language},  {headers});
    dispatch({type: 'appointment', payload: response.data.appointment});
    navigate('successscreen', {appointment: response.data.appointment});
    dispatch({type: 'loading', payload: null});
    // navigate('successscreen', {appointment: response.data.appointment});
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const createTicket = dispatch => async (data, token) => {
  const headers = {
    'auth-token': token,
    'Content-Type': 'application/json'
  };
  try {
    dispatch({type: 'loading', payload: 'ticket'});
      const payload = data;
      const response = await Api.post(`/tickets/create`, payload, {headers});
    navigate('Ticketscreen', {link: response.data});
    dispatch({type: 'loading', payload: null});
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, {response: {data: 'Invalid Qr-code, please scan a valid qr code to book your ticket'}});
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const createVisitTicket = dispatch => async (data, token, org) => {
  const headers = {
    'auth-token': token,
    'Content-Type': 'application/json'
  };
  try {
    dispatch({type: 'loading', payload: 'ticket'});
    dispatch({type: 'organization', payload: org});
      const payload = data;
      const response = await Api.post(`/tickets/visitcreate`, payload, {headers});
    navigate('Ticketscreen', {link: response.data});
    dispatch({type: 'loading', payload: null});
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, {response: {data: 'Faied to create a visit ticket, please try again'}});
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const language = dispatch => async (data) => {
  await AsyncStorage.setItem(
    'language',
    JSON.stringify(data),
  );
  dispatch({type: 'language', payload: data});
};

const savedoctor = dispatch => async (data) => {
  dispatch({type: 'doctor', payload: data});
};

const savefrom = dispatch => async (data) => {
  dispatch({type: 'from', payload: data});
};


function getErrorDetailsByCode(errorCode) {
  if (typeof errorCode === 'string') {
    return {
      title: 'Error',
      message: errorCode
    };
  } else {
    return {
      title: "We have a little problem",
      message: "We could not process your request at the moment, please try again later. However, if this problem persists, please contact support for further assistance."
    };
  }
}

async function handleErrorResponse(dispatch, err) {
  const userData = await AsyncStorage.getItem('token');
  if (err?.response?.status === 401 && userData) {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user_data');
    dispatch({type: 'user', payload: null});
    dispatch({type: 'loading', payload: false});
    dispatch({
      type: 'error',
      payload: {
        title: "Unauthorized Message",
        message: 'Your session has expired, please login to proceed.',
      }
    });
    // Alert.alert('Error', 'Session Expired, please login again to continue', [
    //   {text: 'OK'},
    // ]);
  } else if (err?.message) {
    let errorMessage = err?.message;
    console.log(`ken ${err?.message}`)
    if(err?.response?.data?.message === 'appointment.appointment_slot_already_booked'){
      dispatch({
        type: 'error',
        payload: 'Timeslot already booked please choose another one',
      });
    }if(err?.response?.data?.message === 'appointment.appointment_time_has_passed'){
      dispatch({
        type: 'error',
        payload: 'The chosen time has already passed, please select another time.',
      });
    }else{
       dispatch({
      type: 'error',
      payload: errorMessage,
    });
    }
   
  } else {
    console.log(err)
    dispatch({
      type: 'error',
      payload: {
        title: "We have a little problem",
        message: "We could not process your request at the moment, please try again later. However, if this problem persists, please contact support for further assistance."
      }
    });
  }
}

const verifyphone = dispatch => async data => {
  try {
    dispatch({type: 'loading', payload: 'verifyphone'});
    const response = await Api.post('/signup/create', data);
    dispatch({type: 'loading', payload: null});
    navigate('Confirmcode', {
      phonenumber: response.data.telephone_number,
    });
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const verifyotp = dispatch => async data => {
  try {
    dispatch({type: 'loading', payload: 'verifyotp'});
    const response = await Api.post('/signup/verify', data);
    dispatch({type: 'loading', payload: null});
    navigate('Register', {
      data,
      ...response.data
    });
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const createCustomer = dispatch => async data => {
  try {
    dispatch({type: 'loading', payload: 'createcustomer'});
    await Api.post('/api/customer/add', data);
    dispatch({type: 'loading', payload: null});
    dispatch({type: 'registersuccess', payload: true});
    dispatch({
      type: 'success',
      payload: {
        navigate: 'Loginscreen',
        content: 'We have created your account, please login to proceed.',
        title: ' Success'
      },
    });
    // Alert.alert(
    //   'Success',
    //   'Registration completed successfully, login to continue',
    //   [{text: 'OK', onPress: () => navigate('Loginscreen')}],
    // );
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: null});
    dispatch({type: 'registersuccess', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const logout = dispatch => async () => {
  try {
    dispatch({type: 'loading', payload: 'logout'});
    await AsyncStorage.removeItem('token');
    dispatch({type: 'user', payload: null});
    dispatch({type: 'loading', payload: false});
  } catch (err) {
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const signup = dispatch => async userData => {
  try {
    dispatch({type: 'loading', payload: 'register'});
    const response = await Api.post('/signup/complete_profile', userData);
    await AsyncStorage.setItem(
      'token',
      JSON.stringify(response.data.auth_token),
    );
    await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
    dispatch({type: 'user', payload: response.data});
    dispatch({type: 'loading', payload: false});
  } catch (err) {
    console.log(err?.response?.data || err?.message || err)
    dispatch({type: 'loading', payload: false});
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const resetpassword = dispatch => async resetData => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      ContentType: 'application/json',
    },
  };
  try {
    dispatch({type: 'loading', payload: 'resetpassword'});
    await Api.post('/api/auth/password/change', resetData, config);
    dispatch({type: 'loading', payload: false});
    dispatch({
      type: 'success',
      payload: {
        navigate: 'Profile',
        content: 'Changes saved',
      },
    });
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const newpassword = dispatch => async resetData => {
  try {
    dispatch({type: 'loading', payload: 'newpassword'});
    await Api.post('api/customer/password/change', resetData);
    dispatch({type: 'loading', payload: false});
    dispatch({
      type: 'success',
      payload: {
        navigate: 'Loginscreen',
        content: 'Reset password completed successfully',
      },
    });
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const changepasswordrequest = dispatch => async resetData => {
  const config = {
    headers: {
      ContentType: 'application/json',
    },
  };
  try {
    dispatch({type: 'loading', payload: 'changepasswordrequest'});
    await Api.post('api/customer/password/reset', resetData, config);
    dispatch({type: 'loading', payload: false});
    navigate('Verificationscreen', resetData);
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const trylocalSignin = dispatch => async () => {
  const token = await AsyncStorage.getItem('token');
  const language = await AsyncStorage.getItem('language');
  const userdata = await AsyncStorage.getItem('user_data');
  if (token && userdata !== null) {
    dispatch({type: 'user', payload: JSON.parse(userdata)});
  } else {
    dispatch({type: 'user', payload: null});
  }
  dispatch({type: 'language', payload: JSON.parse(language)});
  dispatch({type: 'authloading', payload: false});
};

const addcard = dispatch => async cardDetails => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      ContentType: 'application/json',
    },
  };
  try {
    dispatch({type: 'loading', payload: 'addcard'});
    await Api.post('/api/customer/assign/card', cardDetails, config);
    dispatch({type: 'loading', payload: null});
    dispatch({
      type: 'success',
      payload: {
        navigate: 'Homescreen',
        content: 'he card has been linked to your account.',
        title: 'Card Linked Message'
      },
    });
    // Alert.alert('Success', 'You have successfully Added a card', [
    //   {text: 'OK', onPress: () => navigate('Homescreen')},
    // ]);
  } catch (err) {
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const listcards = dispatch => async params => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      ContentType: 'application/json',
    },
  };
  try {
    dispatch({type: 'loading', payload: 'listcards'});
    const response = await Api.get(
      `/api/customer/cards?limit=${params.limit}&offset=${params.offset}`,
      config,
    );
    dispatch({type: 'loading', payload: null});
    dispatch({type: 'cards', payload: response.data});
  } catch (err) {
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const notifications = dispatch => async params => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      ContentType: 'application/json',
    },
  };
  try {
    dispatch({type: 'loading', payload: 'notifications'});
    const response = await Api.get(
      `/api/customer/notifications/list?limit=${params.limit}&offset=${params.offset}`,
      config,
    );
    dispatch({type: 'loading', payload: null});
    dispatch({type: 'notifications', payload: response.data});
  } catch (err) {
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const blockcard = dispatch => async cardDetails => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      ContentType: 'application/json',
    },
  };
  try {
    dispatch({type: 'loading', payload: 'blockcard'});
    await Api.post(
      '/api/customer/card/block',
      {card_id: cardDetails.card_id},
      config,
    );
    dispatch({type: 'loading', payload: null});
    dispatch({
      type: 'success',
      payload: {
        navigate: 'Homescreen',
        content: `You have successfully Blocked card number ${cardDetails?.card_number}`,
      },
    });
    // Alert.alert(
    //   'Success',
    //   `You have successfully Blocked card number ${cardDetails?.card_number}`,
    //   [{text: 'OK', onPress: () => navigate('Homescreen')}],
    // );
  } catch (err) {
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const unblockcard = dispatch => async cardDetails => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      ContentType: 'application/json',
    },
  };
  try {
    dispatch({type: 'loading', payload: 'blockcard'});
    await Api.post(
      '/api/customer/card/unblock',
      {card_id: cardDetails.card_id},
      config,
    );
    dispatch({type: 'loading', payload: null});
    dispatch({
      type: 'success',
      payload: {
        navigate: 'Homescreen',
        content: `You have successfully unblocked card number ${cardDetails?.card_number}`,
      },
    });
    // Alert.alert(
    //   'Success',
    //   `You have successfully Blocked card number ${cardDetails?.card_number}`,
    //   [{text: 'OK', onPress: () => navigate('Homescreen')}],
    // );
  } catch (err) {
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const checkbalance = dispatch => async cardDetails => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      ContentType: 'application/json',
    },
  };
  function addSpacesToNumber(number) {
    // Convert the number to a string
    const numberString = String(number);
  
    // Use a regular expression to add a space every 4 digits
    const formattedNumber = numberString.replace(/(\d{4})(?=\d)/g, '$1 ');
  
    return formattedNumber;
  }
  try {
    dispatch({type: 'loading', payload: 'checkbalance'});
    const response = await Api.post(
      '/api/customer/card/balance',
      {card_id: cardDetails?.card_id},
      config,
    );
    dispatch({type: 'loading', payload: null});
    dispatch({
      type: 'success',
      payload: {
        content: `Card number: ${addSpacesToNumber(cardDetails?.card_number)} \n Balance: ${formatCurrency(response?.data?.balance)}`,
        title: 'Balance Query',
      },
    });
    // Alert.alert(
    //   'Success',
    //   `Card balance for card number ${cardDetails?.card_number} is TZS ${response?.data?.balance}`,
    //   [{text: 'OK'}],
    // );
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const Spendinglimit = dispatch => async cardDetails => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      ContentType: 'application/json',
    },
  };
  try {
    dispatch({type: 'loading', payload: 'spendinglimit'});
    await Api.post(
      '/api/customer/card/spend-limit/set',
      {card_id: cardDetails?.card_id, amount: cardDetails?.amount},
      config,
    );
    dispatch({type: 'loading', payload: null});
    dispatch({
      type: 'success',
      payload: {
        content: `Daily spend limit has been set to ${formatCurrency(cardDetails?.amount)} `,
        title: 'Success'
      },
    });
    // Alert.alert(
    //   'Success',
    //   `Spending limit for card number ${cardDetails?.card_number} is set to TZS ${cardDetails?.amount}`,
    //   [{text: 'OK'}],
    // );
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const Topup = dispatch => async cardDetails => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      ContentType: 'application/json',
    },
  };
  try {
    dispatch({type: 'loading', payload: 'topup'});
    await Api.post(
      '/api/customer/card/topup',
      {
        card_id: cardDetails?.card_id,
        amount: cardDetails?.amount,
        phone_number: cardDetails?.phone_number,
      },
      config,
    );
    dispatch({type: 'loading', payload: null});
    dispatch({
      type: 'success',
      payload: {
        content: `To complete this action, please enter your mobile money PIN to the confirmation dialog shown on your phone.`,
        title: 'Top up'
      },
    });
    // Alert.alert(
    //   'Success',
    //   `Spending limit for card number ${cardDetails?.card_number} is set to TZS ${cardDetails?.amount}`,
    //   [{text: 'OK'}],
    // );
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const fcmtoken = dispatch => async fcm_token => {
    const token = await AsyncStorage.getItem('token');
  const headers = {
    'auth-token': JSON.parse(token),
    'Content-Type': 'application/json'
  };
  try {
    const t = await Api.post(
      '/profile/token/update',
      {
        fcmToken: fcm_token,
      },
      {headers},
    );
  } catch (err) {
    console.log(err?.response?.data || err);
  }
};

const savetoken = dispatch => async fcm_token => {
  dispatch({type: 'fcmtoken', payload: fcm_token});
};

const Alarmthreshold = dispatch => async cardDetails => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      ContentType: 'application/json',
    },
  };
  try {
    dispatch({type: 'loading', payload: 'alarm'});
    await Api.post(
      '/api/customer/card/alarm-threshold/set',
      {card_id: cardDetails?.card_id, amount: cardDetails?.amount},
      config,
    );
    dispatch({type: 'loading', payload: null});
    dispatch({
      type: 'success',
      payload: {
        content: `Alarm limit has been set to ${formatCurrency(cardDetails?.amount)}`,
      },
    });
    // Alert.alert(
    //   'Success',
    //   `Alarm threshold for card number ${cardDetails?.card_number} is set to TZS ${cardDetails?.amount}`,
    //   [{text: 'OK'}],
    // );
  } catch (err) {
    console.log(err?.response?.data || err);
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const clearError = dispatch => () => {
  dispatch({type: 'error', payload: null});
};

const clearSuccessData = dispatch => navigation => {
  dispatch({type: 'success', payload: null});
  if (navigation) {
    navigate(navigation);
  }
};

const listactivities = dispatch => async params => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      ContentType: 'application/json',
    },
  };
  try {
    dispatch({type: 'loading', payload: 'listactivities'});
    const response = await Api.get(
      `/api/customer/card/transactions?limit=${params.limit}&offset=${params.offset}`,
      config,
    );
    dispatch({type: 'loading', payload: null});
    dispatch({type: 'activities', payload: response.data});
  } catch (err) {
    dispatch({type: 'loading', payload: false});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

const listacardctivities = dispatch => async params => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      ContentType: 'application/json',
    },
  };
  try {
    dispatch({type: 'loading', payload: 'listactivities'});
    const response = await Api.get(
      `/api/customer/card/${params.card_id}/transactions?limit=${params.limit}&offset=${params.offset}`,
      config,
    );
    dispatch({type: 'loading', payload: null});
    dispatch({type: 'cardactivities', payload: response.data});
  } catch (err) {
    dispatch({type: 'loading', payload: false});
    dispatch({type: 'cardactivities', payload: []});
    handleErrorResponse(dispatch, err);
    dispatch({
      type: 'add_error',
      payload: err.response.data.messages
        ? err.response.data.messages
        : err.response.data,
    });
  }
};

export const {Provider, Context} = createDataContext(
  AuthReducer,
  {
    login,
    visits,
    signup,
    verifyphone,
    verifyotp,
    createCustomer,
    logout,
    resetpassword,
    newpassword,
    changepasswordrequest,
    trylocalSignin,
    addcard,
    listcards,
    blockcard,
    unblockcard,
    checkbalance,
    Spendinglimit,
    Alarmthreshold,
    clearError,
    clearSuccessData,
    Topup,
    fcmtoken,
    createVisitTicket,
    listactivities,
    listacardctivities,
    notifications,
    savetoken,
    organizations,
    categories,
    doctors,
    bookAppointment,
    createTicket,
    appointments,
    saveimage,
    savedoctor,
    language,
    recentappointments,
    updateAppointment,
    setappointment,
    insurance,
    appointments2,
    cancelappointment,
    savefrom
  },
  {
    organization: null,
    user: null,
    registersuccess: false,
    changepasssuccess: false,
    loading: null,
    authloading: true,
    cards: null,
    error: null,
    activities: null,
    cardactivities: null,
    notifications: null,
    fcmtoken: null,
    organizations: [],
    categories: [],
    doctors: [],
    visits: [],
    from: null,
    appointments: [],
    appointment: {},
    recentappointments: [],
    clientid: '',
    image: '',
    doctor: '',
    language: 'english',
    insurance: [],
    timeslots: [{from: "07:00 am", slot_id: 1, to: "07:15 am"}, {from: "07:15 am", slot_id: 2, to: "07:30 am"}, {from: "07:30 am", slot_id: 3, to: "07:45 am"}, {from: "07:45 am", slot_id: 4, to: "08:00 am"}, {from: "08:00 am", slot_id: 5, to: "08:15 am"}, {from: "08:15 am", slot_id: 6, to: "08:30 am"}, {from: "08:30 am", slot_id: 7, to: "08:45 am"}, {from: "08:45 am", slot_id: 8, to: "09:00 am"}, {from: "09:00 am", slot_id: 9, to: "09:15 am"}, {from: "09:15 am", slot_id: 10, to: "09:30 am"}, {from: "09:30 am", slot_id: 11, to: "09:45 am"}, {from: "09:45 am", slot_id: 12, to: "10:00 am"}, {from: "10:00 am", slot_id: 13, to: "10:15 am"}, {from: "10:15 am", slot_id: 14, to: "10:30 am"}, {from: "10:30 am", slot_id: 15, to: "10:45 am"}, {from: "10:45 am", slot_id: 16, to: "11:00 am"}, {from: "11:00 am", slot_id: 17, to: "11:15 am"}, {from: "11:15 am", slot_id: 18, to: "11:30 am"}, {from: "11:30 am", slot_id: 19, to: "11:45 am"}, {from: "11:45 am", slot_id: 20, to: "12:00 pm"}, {from: "12:00 pm", slot_id: 21, to: "12:15 pm"}, {from: "12:15 pm", slot_id: 22, to: "12:30 pm"}, {from: "12:30 pm", slot_id: 23, to: "12:45 pm"}, {from: "12:45 pm", slot_id: 24, to: "13:00 pm"}, {from: "13:00 pm", slot_id: 25, to: "13:15 pm"}, {from: "13:15 pm", slot_id: 26, to: "13:30 pm"}, {from: "13:30 pm", slot_id: 27, to: "13:45 pm"}, {from: "13:45 pm", slot_id: 28, to: "14:00 pm"}, {from: "14:00 pm", slot_id: 29, to: "14:15 pm"}, {from: "14:15 pm", slot_id: 30, to: "14:30 pm"}, {from: "14:30 pm", slot_id: 31, to: "14:45 pm"}, {from: "14:45 pm", slot_id: 32, to: "15:00 pm"}, {from: "15:00 pm", slot_id: 33, to: "15:15 pm"}, {from: "15:15 pm", slot_id: 34, to: "15:30 pm"}, {from: "15:30 pm", slot_id: 35, to: "15:45 pm"}, {from: "15:45 pm", slot_id: 36, to: "16:00 pm"}, {from: "16:00 pm", slot_id: 37, to: "16:15 pm"}, {from: "16:15 pm", slot_id: 38, to: "16:30 pm"}, {from: "16:30 pm", slot_id: 39, to: "16:45 pm"}, {from: "16:45 pm", slot_id: 40, to: "17:00 pm"}, {from: "17:00 pm", slot_id: 41, to: "17:15 pm"}, {from: "17:15 pm", slot_id: 42, to: "17:30 pm"}, {from: "17:30 pm", slot_id: 43, to: "17:45 pm"}, {from: "17:45 pm", slot_id: 44, to: "18:00 pm"}, {from: "18:00 pm", slot_id: 45, to: "18:15 pm"}, {from: "18:15 pm", slot_id: 46, to: "18:30 pm"}, {from: "18:30 pm", slot_id: 47, to: "18:45 pm"}, {from: "18:45 pm", slot_id: 48, to: "19:00 pm"}, {from: "19:00 pm", slot_id: 49, to: "19:15 pm"}, {from: "19:15 pm", slot_id: 50, to: "19:30 pm"}, {from: "19:30 pm", slot_id: 51, to: "19:45 pm"}, {from: "19:45 pm", slot_id: 52, to: "20:00 pm"}, {from: "20:00 pm", slot_id: 53, to: "20:15 pm"}, {from: "20:15 pm", slot_id: 54, to: "20:30 pm"}, {from: "20:30 pm", slot_id: 55, to: "20:45 pm"}, {from: "20:45 pm", slot_id: 56, to: "21:00 pm"}, {from: "21:00 pm", slot_id: 57, to: "21:15 pm"}, {from: "21:15 pm", slot_id: 58, to: "21:30 pm"}, {from: "21:30 pm", slot_id: 59, to: "21:45 pm"}, {from: "21:45 pm", slot_id: 60, to: "22:00 pm"}]
  },
);
