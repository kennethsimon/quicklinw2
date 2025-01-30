import React, { useContext } from 'react';
import { Box, Center, CheckIcon, Select } from "native-base";
import {Context as AuthContext} from '../../context/AppContext';
import {useTranslation} from 'react-i18next';
import i18n from '../../utils/i18n';
import { RFValue } from 'react-native-responsive-fontsize';

const Languageselect = () => {
    const [service, setService] = React.useState("");
    const {state, language} = useContext(AuthContext);
    const {t} = useTranslation();

    const changeLanguage = (val) => {
        if(val === 'english'){
            i18n.changeLanguage('en');
        }else{
            i18n.changeLanguage('sw');
        }
        setService(val);
        language(val)
    }
    return <Center>
        <Box maxW="300">
          <Select selectedValue={state.language} minWidth="200" fontSize={RFValue(15)} fontWeight={'bold'} accessibilityLabel="Choose Language" placeholder={t('Choose Language')} _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />
        }} mt={1} onValueChange={itemValue => changeLanguage(itemValue)}>
            <Select.Item label="Kiswahili" value="kiswahili" />
            <Select.Item label="English" value="english" />
          </Select>
        </Box>
      </Center>;
  };

  export default Languageselect;