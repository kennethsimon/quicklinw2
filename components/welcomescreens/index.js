import {Button} from 'native-base';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {RFValue} from 'react-native-responsive-fontsize';
import Sliderbutton from './button';
const {width} = Dimensions.get('window');

const slides = [
  {
    key: 'one',
    title: 'Queue Management System',
    text: 'Control the Queues, Know the real-time metrics, Data-based business decisions, and Increase revenue.',
    backgroundColor: '#59b2ab',
    image: 'https://res.cloudinary.com/dedfrilse/image/upload/v1712225696/quickline/hnupput6ntis5ssmmbbf.png',
    height: 250,
    margin: 150,
    left: 0,
    resizeMode: 'cover'
  },
  {
    key: 'two',
    title: 'Appointment Booking System',
    text: 'Reduce on-site waiting time, improve customer flow, lobby management, prevent no-shows, and wow your customers.',
    backgroundColor: '#59b2ab',
    image: 'https://res.cloudinary.com/dedfrilse/image/upload/v1708942681/quickline/axc2ovekhty16qepcpqs.png',
    height: 250,
    margin: 100,
    left: 0,
    resizeMode: 'cover'
  },
  {
    key: 'three',
    title: 'Insurance solutions',
    text: 'Integrate with our innovative insurance solution, streamlining the process for clients to access and benefit from our insurance solution',
    backgroundColor: '#59b2ab',
    image: 'https://res.cloudinary.com/dedfrilse/image/upload/v1710741207/quickline/pnprxu36ltkfiwre7m4w.png',
    height: 250,
    margin: 100,
    left: 0,
    resizeMode: 'contain'
  },
  {
    key: 'four',
    title: 'Payment solutions',
    text: 'Our system offers a versatile payment solution that accommodates various channels, ensuring a secure means for customers to settle transactions effortlessly.',
    backgroundColor: '#59b2ab',
    image: 'https://res.cloudinary.com/dedfrilse/image/upload/v1708942684/quickline/icqkk7hm2cfms1uibwi1.png',
    height: 250,
    margin: 100,
    left: 0,
    resizeMode: 'contain'
  },
];

class Welcomescreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      currentIndex: 0,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const { currentIndex } = this.state;
      if (currentIndex < slides.length - 1) {
        this.slider.goToSlide(currentIndex + 1);
        this.setState({ currentIndex: currentIndex + 1 });
      } else {
        this.slider.goToSlide(0);
        this.setState({ currentIndex: 0 });
      }
    }, 5000); // Change slide every 5 seconds
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  _renderItem = ({item}) => {
    return (
      <View style={styles.slide}>
        <View style={styles.slidetwo}>
          <View style={styles.image4}>
          <Image
            style={styles.image3}
            source={require('../../assets/quick.png')}
          />
          </View>
          <View style={styles.logoimage}>
           <Image style={{...styles.image, resizeMode: item?.resizeMode, height: RFValue(item?.height), right: RFValue(item?.left) , marginTop: RFValue(item?.margin)}} source={{uri: item?.image}} /> 
          </View>
          
          <View style={styles.fontss}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.titletwo}>{item.text}</Text>
          </View>
        </View>
      </View>
    );
  };
  _renderNextButton = () => {
    return (
      <View
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
       <Sliderbutton width={'49%'} nav={"Loginscreen"} title={"Login"}/>
       <Sliderbutton width={'49%'} nav={"Verificationscreen"} title={"Register"}/>
      </View>
    );
  };
  _renderSkipButton = () => {
    return null;
  };

  // _renderDoneButton = () => {
  //   return null;
  // };
  _renderDoneButton = () => {
    return (
      <View
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
       <Sliderbutton width={'49%'} nav={"Loginscreen"} title={"Login"}/>
       <Sliderbutton width={'49%'} nav={"Verificationscreen"} title={"Register"}/>
      </View>
    );
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, width: '100%', backgroundColor: '#fff'}}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
        />
        <AppIntroSlider
         ref={(ref) => (this.slider = ref)}
          renderItem={this._renderItem}
          data={slides}
          renderDoneButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
          renderSkipButton={this._renderSkipButton}
          bottomButton
          alwaysBounceHorizontal={true}
          showSkipButton
          activeDotStyle={{
            width: RFValue(15),
            height: 5,
            backgroundColor: '#25A18E',
          }}
          dotStyle={{
            width: RFValue(5),
            height: RFValue(5),
            backgroundColor: 'rgba(49, 91, 169, 0.25)',
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  slidetwo: {
    width: '100%',
    height: '70%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  fontss: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: RFValue(50)
  },
  title: {
    fontSize: RFValue(24),
    lineHeight: RFValue(24),
    width: '90%',
    textAlign: 'center',
    color: '#25A18E',
    fontFamily: 'Gilroy-Bold',
  },
  titletwo: {
    fontSize: RFValue(16),
    lineHeight: RFValue(19),
    fontFamily: 'Gilroy-Regular',
    maxWidth: '70%',
    textAlign: 'center',
    color: '#888888',
    marginTop: RFValue(20),
  },
  image: {
    width: '100%'
  },
  image3: {
    height: RFValue(100),
    resizeMode: 'contain',
  },
  image4: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgrounColor: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: RFValue(100),
    height: RFValue(100),
    overflow: 'hidden'
  },
  logoimage: {
    height: RFValue(width - 70),
    width: RFValue(width - 150),
    borderRadius: RFValue((width - 150) / 2),
    // backgroundColor: '#eeeeee',
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  buttonCircle: {
    width: '90%',
    height: RFValue(50),
    backgroundColor: '#fff',
    borderColor: 'darkblue',
    borderWidth: 1,
    borderRadius: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCircletransparent: {
    width: '90%',
    height: RFValue(50),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCircletransparenttwo: {
    width: '100%',
    height: RFValue(50),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCirclefilled: {
    width: '90%',
    height: RFValue(50),
    borderRadius: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#315BA9',
  },

  buttontext: {
    fontSize: RFValue(18),
    color: '#315BA9',
    fontFamily: 'Gilroy-Medium',
  },
  transparenttext: {
    fontSize: RFValue(14),
    color: '#A5A5A5',
    fontFamily: 'Gilroy-Regular',
    textAlign: 'center',
  },
  filledtext: {
    fontSize: RFValue(18),
    color: '#fff',
    fontFamily: 'Gilroy-Medium',
  },
});

export default Welcomescreen;
