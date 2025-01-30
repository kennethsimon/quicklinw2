import { useNavigation } from '@react-navigation/native';
import {Button, Text} from 'native-base';
import React from 'react';

const Sliderbutton = ({width, title, nav}) => {
    const navigation = useNavigation();
    return (
        <Button
          style={{width: width, height: 60}}
          variant="outline"
          size="lg"
          bgColor={'#25A18E'}
          color={"#fff"}
          onPress={() => navigation.navigate(nav)}
        ><Text style={{color: '#fff'}}>{title}</Text></Button>
    )
}

export default Sliderbutton;
