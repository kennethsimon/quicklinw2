import {Center, Skeleton, VStack} from 'native-base';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
const {width} = Dimensions.get('window');
const Cardloader = ({params}) => {
  return (
    <View style={styles.maincontainer}>
      <Center w="100%">
        <VStack
          w="100%"
          maxW="600"
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
          <Skeleton h="200" />
        </VStack>
      </Center>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    width: width - RFValue(60),
    height: RFValue(200),
    borderRadius: RFValue(10),
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: RFValue(20),
    paddingHorizontal: RFValue(20),
    marginTop: RFValue(20),
    marginRight: RFValue(10),
  },
});

export default Cardloader;
