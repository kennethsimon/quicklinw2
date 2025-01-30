import React, {useContext} from 'react';
import {FlatList, Box, HStack, VStack, Text, Spacer, View} from 'native-base';
import {Context as AppContext} from '../../context/AppContext';

const Notifications = () => {
  const {state} = useContext(AppContext);
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Box paddingX={4} bgColor={'#fff'} pt={4}>
        <FlatList
          data={state.notifications}
          renderItem={({item}) => (
            <Box
              borderBottomWidth="1"
              _dark={{
                borderColor: 'muted.50',
              }}
              borderColor="#eeeeee"
              pl={['0', '4']}
              pr={['0', '5']}
              py="2">
              <HStack space={[2, 3]} justifyContent="space-between">
                {/* <Avatar
                size="48px"
                source={{
                  uri: item.avatarUrl,
                }}
              /> */}
                <VStack>
                  <Text
                    _dark={{
                      color: 'warmGray.50',
                    }}
                    color="coolGray.800"
                    bold>
                    {item?.title}
                  </Text>
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: 'warmGray.200',
                    }}>
                    {item?.message}
                  </Text>
                </VStack>
                <Spacer />
                <Text
                  fontSize="xs"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  color="coolGray.800"
                  alignSelf="flex-start">
                  {item?.created_at}
                </Text>
              </HStack>
            </Box>
          )}
          keyExtractor={item => item.id}
        />
      </Box>
    </View>
  );
};

export default Notifications;
