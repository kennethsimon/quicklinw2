import {Divider, ScrollView} from 'native-base';
import React, {useContext, useState} from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import Carddetailscomponent from './carddetailscomponent';
import Icon from 'react-native-vector-icons/Feather';
import {Context as AppContext} from '../../context/AppContext';
import {useNavigation} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import SpendingLimit from '../Actionsheets/spendinglimit';
import Alertpopup from '../Alert';
import OverlayLoader from '../loaders/overlay';
import AlarmThreshold from '../Actionsheets/alarmthreshold';
import Moreoptions from '../Actionsheets/moreoptions';
import Transactionloader from '../loaders/transactionloader';
import Topupcomponent from '../Actionsheets/Topup';
const {width} = Dimensions.get('window');

const Carddetails = ({route}) => {
  const navigation = useNavigation();
  const {carddata} = route.params;
  const {
    state,
    blockcard,
    unblockcard,
    checkbalance,
    Spendinglimit,
    Alarmthreshold,
    Topup,
  } = useContext(AppContext);
  const [choosecard, setChoosecard] = useState(false);
  const [openalert, setOpenalert] = useState(false);
  const [openalerttwo, setOpenalerttwo] = useState(false);
  const [chosencard, setChosencard] = useState({});
  const [amount, setAmount] = useState('');
  const [addamount, setAddamount] = useState(false);
  const [pressaction, setPressaction] = useState('');
  const [addthresholdamount, setAddthresholdamount] = useState(false);
  const [openmore, setOpenmore] = useState(false);
  const [addpayment, setAddpayment] = useState(false);
  const transactions = [
    {
      title: 'Shopping',
      id: 1,
      icon: 'shopping',
      amount: 100000,
      status: 'pending',
      type: 'credit',
    },
    {
      title: 'Canteen',
      id: 2,
      icon: 'food',
      amount: 100000,
      status: 'Complete',
      type: 'credit',
    },
    {
      title: 'Swimming',
      id: 3,
      icon: 'swim',
      amount: 100000,
      status: 'pending',
      type: 'debit',
    },
    {
      title: 'Trip',
      id: 4,
      icon: 'car',
      amount: 100000,
      status: 'pending',
      type: 'credit',
    },
    {
      title: 'Stationary',
      id: 5,
      icon: 'pen',
      amount: 100000,
      status: 'pending',
      type: 'debit',
    },
  ];

  console.log(carddata);

  // const onClose = () => {
  //   setChoosecard(false);
  // };

  const onAddthresholdlimit = () => {
    setAddthresholdamount(false);
    Alarmthreshold({
      card_id: carddata.id,
      amount,
      card_number: carddata.card_number,
    });
  };

  // const onPressItem = cardid => {
  //   setChosencard(cardid);
  //   setChoosecard(false);
  //   if (pressaction === 'block') {
  //     setOpenalert(true);
  //   } else if (pressaction === 'spendinglimit') {
  //     setAddamount(true);
  //   }
  // };

  const onCheckBalance = card => {
    checkbalance({card_number: card.card_number, card_id: card.id});
  };

  const onBlockcard = params => {
    if (params) {
      blockcard({card_id: carddata.id, card_number: carddata.card_number});
      setChosencard({});
      setChoosecard(false);
      setOpenalert(false);
    } else {
      setChosencard({});
      setChoosecard(false);
      setOpenalert(false);
    }
  };

  const onUnblockcard = params => {
    if (params) {
      unblockcard({card_id: carddata.id, card_number: carddata.card_number});
      setChosencard({});
      setChoosecard(false);
      setOpenalerttwo(false);
    } else {
      setChosencard({});
      setChoosecard(false);
      setOpenalerttwo(false);
    }
  };

  const onPressIcon = action => {
    setPressaction(action);
    if (action === 'block') {
      setOpenalert(true);
    } else if (action === 'unblock') {
      setOpenalerttwo(true);
    } else if (action === 'spendinglimit') {
      setAddamount(true);
    } else if (action === 'topup') {
      setAddpayment(true);
    }
  };

  const onSetSpendinglimit = () => {
    Spendinglimit({
      card_id: carddata.id,
      card_number: carddata.card_number,
      amount: amount,
    });
    setAddamount(false);
    setChosencard('');
    setAmount('');
  };

  const blockcarddata = () => {
    setOpenmore(false);
    onPressIcon('block');
  };

  const unblockcarddata = () => {
    setOpenmore(false);
    onPressIcon('unblock');
  };

  const setthreshold = () => {
    setOpenmore(false);
    setAddthresholdamount(true);
  };

  function formatCurrency(number) {
    // Format the number to currency format
    const formattedNumber = number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'TZS',
    });

    return formattedNumber;
  }

  function addSpacesToNumber(number) {
    // Convert the number to a string
    const numberString = String(number);

    // Split the number string into groups of 4 digits
    const groups = numberString.match(/.{1,4}/g);

    // Join the groups with a space in between
    const result = groups.join('  ');

    return result;
  }

  const onTopup = params => {
    setAddpayment(false);
    Topup({...params, card_id: carddata.id});
  };
  return (
    <View style={styles.maincontainer}>
      <ScrollView>
        <View style={styles.contentcontainer}>
          <View style={styles.quickactioncontainer}>
            <Pressable onPress={() => onPressIcon('topup')}>
              <View style={styles.quickactionbutton}>
                <View style={styles.quickactionicon}>
                  <Icon name="layers" size={30} color="#fff" />
                </View>
                <Text style={styles.quicktext}>Top up</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => onPressIcon('spendinglimit')}>
              <View style={styles.quickactionbutton}>
                <View style={styles.quickactionicon}>
                  <Icon name="minimize-2" size={30} color="#fff" />
                </View>
                <Text style={styles.quicktext}>Limit spending</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setOpenmore(true)}>
              <View style={styles.quickactionbutton}>
                <View style={styles.quickactionicon}>
                  <Icon name="menu" size={30} color="#fff" />
                </View>
                <Text style={styles.quicktext}>More</Text>
              </View>
            </Pressable>
            {/* <Pressable onPress={() => onPressIcon('block')}>
              <View style={styles.quickactionbutton}>
                <View style={styles.quickactionicon}>
                  <Icon name="minus-circle" size={30} color="#fff" />
                </View>
                <Text style={styles.quicktext}>Block card</Text>
              </View>
            </Pressable> */}
            {/* <Pressable
              onPress={() => {
                setAddthresholdamount(true);
              }}>
              <View style={styles.quickactionbutton}>
                <View style={styles.quickactionicon}>
                  <Icon name="bell" size={30} color="#fff" />
                </View>
                <Text style={styles.quicktext}>Alarm</Text>
              </View>
            </Pressable> */}
          </View>
          <View style={styles.cardcontainer}>
            <Carddetailscomponent
              data={carddata}
              onCheckBalance={onCheckBalance}
            />
          </View>
          <View style={styles.recenttransactions}>
            <Text style={styles.transactionheader}>Activity</Text>
            {state.loading === 'listactivities' ? (
              <>
                <Transactionloader />
                <Transactionloader />
                <Transactionloader />
                <Transactionloader />
                <Transactionloader />
              </>
            ) : Array.isArray(state.cardactivities) &&
              state.cardactivities.length > 0 ? (
              state.cardactivities.map(t => {
                return (
                  <>
                    <View key={t.id} style={styles.transactioncontainer}>
                      <View style={styles.transactioniconandcontent}>
                        <Text
                          style={styles.transactioncontentheader}
                          numberOfLines={1}>
                          {t.remarks}
                        </Text>
                        <View style={styles.transactioncontent}>
                          <Text
                            style={styles.transactioncontentminiheader}
                            numberOfLines={1}>
                            {t.created_at} | {t.status}
                          </Text>
                          <Text
                            style={{
                              ...styles.transactionamount,
                              color: t.type === 'Credit' ? 'green' : '#FF0000',
                            }}
                            numberOfLines={1}>
                            {t.type === 'Credit' ? '+' : '-'}{' '}
                            {formatCurrency(t.amount)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Divider
                      my="2"
                      _light={{
                        bg: '#eeeeee',
                      }}
                      _dark={{
                        bg: '#eeeeee',
                      }}
                    />
                  </>
                  // <View key={t.id} style={styles.transactioncontainer}>
                  //   <View style={styles.transactioniconandcontent}>
                  //     <View style={styles.transactioncontent}>
                  //       <Text
                  //         style={styles.transactioncontentheader}
                  //         numberOfLines={1}>
                  //         {t.remarks}
                  //       </Text>
                  //       <Text
                  //         style={styles.transactioncontentminiheader}
                  //         numberOfLines={1}>
                  //         {t.created_at} | {t.status}
                  //       </Text>
                  //     </View>
                  //   </View>
                  //   <Text
                  //     style={{
                  //       ...styles.transactionamount,
                  //       color: t.type === 'Credit' ? 'green' : '#FF0000',
                  //     }}
                  //     numberOfLines={1}>
                  //     {t.type === 'Credit' ? '+' : '-'}{' '}
                  //     {formatCurrency(t.amount)}
                  //   </Text>
                  // </View>
                );
              })
            ) : Array.isArray(state.cardactivities) &&
              state.cardactivities.length === 0 ? (
              <View style={styles.noactivities}>
                <Text style={styles.noactivitiestext}>No Activities found</Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <SpendingLimit
        value={amount}
        onChangeText={val => setAmount(val)}
        isOpen={addamount}
        onClose={() => setAddamount(false)}
        state={state}
        onSubmit={onSetSpendinglimit}
        chosencard={carddata}
      />

      <AlarmThreshold
        value={amount}
        onChangeText={val => setAmount(val)}
        isOpen={addthresholdamount}
        onClose={() => setAddthresholdamount(false)}
        state={state}
        onSubmit={onAddthresholdlimit}
        cardnumber={carddata}
      />
      <Alertpopup
        headerTitle={'Warning'}
        open={openalert}
        onClose={onBlockcard}
        content={'Are you sure you want to block this card?'}
        loading={state.loading === 'blockcard'}
        disabled={state.loading === 'blockcard'}
        action={'Delete'}
      />
      <Alertpopup
        headerTitle={'Information'}
        open={openalerttwo}
        onClose={onUnblockcard}
        content={'Are you sure you want to unblock this card'}
        loading={state.loading === 'unblockcard'}
        disabled={state.loading === 'unblockcard'}
        action={'unblock'}
      />
      <OverlayLoader
        visible={[
          'blockcard',
          'checkbalance',
          'spendinglimit',
          'alarm',
          'topup',
        ].includes(state.loading)}
      />
      <Moreoptions
        isOpen={openmore}
        onClose={() => setOpenmore(false)}
        blockcard={blockcarddata}
        unblockcard={unblockcarddata}
        setthreshold={setthreshold}
        carddata={carddata}
      />
      <Topupcomponent
        isOpen={addpayment}
        state={state}
        onClose={() => setAddpayment(false)}
        onSubmit={onTopup}
        chosencard={carddata}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  transactionamount: {
    fontSize: RFValue(14),
    fontFamily: 'Helvetica-Bold',
    color: '#FF0000',
  },
  transactioncontentheader: {
    fontSize: RFValue(14),
    fontFamily: 'Helvetica-Bold',
    color: '#000',
    maxWidth: width - RFValue(40),
  },
  transactioncontentminiheader: {
    fontSize: RFValue(13),
    fontFamily: 'Helvetica',
    color: 'grey',
  },
  transactioncontent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: RFValue(20),
    marginLeft: RFValue(0),
    width: width - RFValue(40),
  },
  transactionicon: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(5),
    backgroundColor: '#eeeeee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactioniconandcontent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  transactioncontainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: RFValue(0),
  },
  transactionheader: {
    fontSize: RFValue(21),
    fontFamily: 'Helvetica-Bold',
    color: '#000',
    marginBottom: RFValue(10),
  },
  recenttransactions: {
    width: width - RFValue(40),
    display: 'flex',
    flexDirection: 'column',
    marginTop: RFValue(20),
  },
  addaccountheadertext: {
    fontSize: RFValue(16),
    color: '#000',
    paddingTop: 0,
    paddingBottom: RFValue(3),
    fontWeight: 600,
  },
  addaccountminiheadertext: {
    fontSize: RFValue(14),
    color: '#000',
    paddingTop: 0,
    paddingBottom: 0,
    fontWeight: 400,
    maxWidth: RFValue(150),
  },
  addaccounttextcontainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  addaccounticoncontainer: {
    width: RFValue(60),
    height: RFValue(60),
    borderRadius: RFValue(30),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3e353c',
  },
  addaccountcontainer: {
    width: width - RFValue(40),
    height: RFValue(80),
    borderWidth: 1,
    borderRadius: RFValue(10),
    borderColor: '#000',
    marginTop: RFValue(20),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  heading: {
    fontSize: RFValue(24),
    color: '#000',
    paddingTop: 0,
    paddingBottom: RFValue(5),
    fontWeight: 600,
  },
  miniheading: {
    fontSize: RFValue(16),
    color: '#000',
    paddingBottom: RFValue(40),
    paddingTop: RFValue(5),
    fontWeight: 400,
  },
  quicktext: {
    fontSize: RFValue(16),
    color: '#000',
  },
  quickactioncontainer: {
    width: width - RFValue(40),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginLeft: 0,
  },
  quickactionbutton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  quickactionicon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: RFValue(60),
    height: RFValue(60),
    borderRadius: RFValue(30),
    backgroundColor: '#539D8B',
  },
  cardcontainer: {
    width: width,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: RFValue(60),
  },
  maincontainer: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentcontainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: width,
    marginTop: RFValue(20),
  },
  cardheader: {
    color: '#000',
    fontSize: RFValue(20),
    fontWeight: 600,
    marginTop: RFValue(30),
  },
});

export default Carddetails;
