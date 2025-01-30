import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Skeleton, Center, VStack} from 'native-base';
import {RFValue} from 'react-native-responsive-fontsize';
const {width} = Dimensions.get('window');

const Transactionloader = ({params}) => {
  return (
    <View style={styles.transactioncontainer}>
      <View style={styles.transactioniconandcontent}>
        <View style={styles.transactioncontent}>
          <View style={styles.transactioncontentheader}>
            <Center w="100%">
              <VStack
                w="100%"
                maxHeight={20}
                maxW="150"
                borderWidth="1"
                space={1}
                overflow="hidden"
                rounded="md"
                _dark={{
                  borderColor: 'coolGray.500',
                }}
                _light={{
                  borderColor: 'coolGray.200',
                }}>
                <Skeleton h="20" />
              </VStack>
            </Center>
          </View>
          <View style={styles.transactioncontentminiheader}>
            <Center w="100%">
              <VStack
                w="100%"
                maxW="100"
                borderWidth="1"
                space={1}
                overflow="hidden"
                rounded="md"
                _dark={{
                  borderColor: 'coolGray.500',
                }}
                _light={{
                  borderColor: 'coolGray.200',
                }}>
                <Skeleton h="20" />
              </VStack>
            </Center>
          </View>
        </View>
      </View>
      <View style={styles.transactionamount}>
        <Center w="100%">
          <VStack
            w="100%"
            maxW="100"
            borderWidth="1"
            space={1}
            overflow="hidden"
            rounded="md"
            _dark={{
              borderColor: 'coolGray.500',
            }}
            _light={{
              borderColor: 'coolGray.200',
            }}>
            <Skeleton h="20" />
          </VStack>
        </Center>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionamount: {
    width: RFValue(100),
    height: RFValue(10),
    overflow: 'hidden',
  },
  transactioncontentheader: {
    width: RFValue(150),
    height: RFValue(10),
    overflow: 'hidden',
  },
  transactioncontentminiheader: {
    width: RFValue(100),
    height: RFValue(10),
    overflow: 'hidden',
  },
  transactioncontent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    height: RFValue(40),
    width: width / 2,
    marginLeft: RFValue(0),
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactioncontainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: RFValue(20),
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
    backgroundColor: '#539D8B',
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
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: RFValue(40),
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

export default Transactionloader;
