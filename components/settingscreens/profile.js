import React, {useContext, useState} from 'react';
import {Dimensions, StyleSheet, Text, View, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {Context as AuthContext} from '../../context/AppContext';
import Alertpopup from '../Alert';
const {width} = Dimensions.get('window');

const Profile = ({navigation, params}) => {
  const {state, logout} = useContext(AuthContext);
  const [openlogout, setOpenlogout] = useState(false);
  const [opendeleteaccount, setOpendeleteaccount] = useState(false);

  const onPressLogout = () => {
    setOpenlogout(true);
  };

  const onClose = status => {
    if (status) {
      setOpenlogout(false);
      logout();
    } else {
      setOpenlogout(false);
    }
  };

  const onPressDeleteaccount = () => {
    setOpendeleteaccount(true);
  };

  const onDelete = status => {
    setOpendeleteaccount(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.listcontainer}>
        <View style={styles.headercontainer}>
          <Icon name="user" size={23} color="#000" />
          <Text style={styles.Headertext}>Account</Text>
        </View>
        <Pressable
          onPress={() => {
            navigation.navigate('Editaccount');
          }}
          style={styles.listitemscontainer}>
          <Text style={styles.listitemtext}>Change password</Text>
          <Icon name="chevron-right" size={20} color="#000" />
        </Pressable>
        {/* <Pressable
          onPress={() => {
            onPressDeleteaccount();
          }}
          style={styles.listitemscontainer}>
          <Text style={styles.listitemtext}>Delete Account</Text>
          <Icon name="chevron-right" size={20} color="#000" />
        </Pressable> */}
        {/* <Pressable style={styles.listitemscontainer}>
          <Text style={styles.listitemtext}>Reset Password</Text>
          <Icon name="chevron-right" size={20} color="#000" />
        </Pressable> */}
        <Pressable style={styles.headercontainer}>
          <Icon name="bell" size={23} color="#000" />
          <Text style={styles.Headertext}>Notifications</Text>
        </Pressable>
        <Pressable
          style={styles.listitemscontainer}
          onPress={() => {
            navigation.navigate('Notifications');
          }}>
          <Text style={styles.listitemtext}>View notifications</Text>
          <Icon name="chevron-right" size={20} color="#000" />
        </Pressable>
        {/* <Pressable style={styles.listitemscontainer}>
          <Text style={styles.listitemtext}>App Notifications</Text>
          <Icon name="chevron-right" size={20} color="#000" />
        </Pressable> */}
        <View style={styles.headercontainer}>
          <Entypo name="log-out" size={23} color="#000" />
          <Text style={styles.Headertext}>Other</Text>
        </View>
        {/* <Pressable style={styles.listitemscontainer}>
          <Text style={styles.listitemtext}>Language</Text>
          <Icon name="chevron-right" size={20} color="#000" />
        </Pressable> */}
        <Pressable
          onPress={() => {
            onPressLogout();
          }}
          style={styles.listitemscontainer}>
          <Text style={styles.listitemtext}>Log out</Text>
          <Icon name="chevron-right" size={20} color="#000" />
        </Pressable>
      </View>
      <Alertpopup
        headerTitle={'Warning'}
        content={'Are you sure you want to logout?'}
        open={openlogout}
        loading={state.loading === 'logout'}
        onClose={onClose}
        action="Log out"
      />
      <Alertpopup
        headerTitle={'Warning'}
        content={'Are you sure you want to delete account?'}
        open={opendeleteaccount}
        loading={state.loading === 'logout'}
        onClose={onDelete}
        action="Delete"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listitemtext: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    color: 'grey',
    marginLeft: 10,
  },
  listitemscontainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  Headertext: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#000',
    marginLeft: 10,
  },
  headercontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  listcontainer: {
    display: 'flex',
    flexDirection: 'column',
    width: width - 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default Profile;
