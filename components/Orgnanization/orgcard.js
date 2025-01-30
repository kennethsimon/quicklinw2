import { Alert, Box, Center, HStack, Text, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { RFValue } from "react-native-responsive-fontsize";


const Orgcard = () => {
    const {t} = useTranslation();
    return <Center>
        <Alert marginTop={RFValue(50)} maxW="400" status="info" backgroundColor={"#25A18E"}>
          <VStack space={2} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
              <HStack flexShrink={1} space={2} alignItems="center">
                <Alert.Icon color='#fff'/>
                <Text fontSize="md" fontWeight="medium" color="#fff">
                  {t("Information")}!
                </Text>
              </HStack>
              {/* <IconButton variant="unstyled" _focus={{
              borderWidth: 0
            }} icon={<CloseIcon size="3" />} _icon={{
              color: "coolGray.600"
            }} /> */}
            </HStack>
            <Box pl="6" marginBottom={RFValue(20)} _text={{
            color: "#fff"
          }}>
              {t("If you want to reschedule your appointment please click the appointment button from the bottom right of the app")}
            </Box>
          </VStack>
        </Alert>
      </Center>;
  }

  export default Orgcard