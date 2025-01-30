import React, {useState} from 'react';
import {View, Modal, ActivityIndicator} from 'react-native';

const OverlayLoader = ({visible}) => {
  return (
    <Modal transparent visible={visible}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="white" />
      </View>
    </Modal>
  );
};

const styles = {
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

export default OverlayLoader;
