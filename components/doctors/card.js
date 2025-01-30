import {Avatar} from 'native-base';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const Doctorcard = ({onPress, doc}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
       <Avatar bg="pink.600" alignSelf="center" marginRight={2} size="lg" source={{
        uri: doc.staffphoto || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      }}></Avatar>
      <View style={styles.titlescontainer}>
        <Text style={{color: '#000', fontWeight: 'bold', fontSize: 18}}>Dr {doc.name}</Text>
        <Text style={{color: '#000',  fontSize: 16}}>{doc.service.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    titlescontainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eeeeee',
    paddingVertical: 6,
    paddingHorizontal: 2,
    marginBottom: 20
  }
});

export default Doctorcard;
