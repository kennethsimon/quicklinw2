import React from 'react';
import {Center, AlertDialog, Button, Text} from 'native-base';
import { useTranslation } from 'react-i18next';

const ErrorAlert = ({
  headerTitle,
  content,
  open,
  onClose,
  disabled = false,
  loading = false,
  action = '',
}) => {
  const cancelRef = React.useRef(null);
  const {t} = useTranslation()
  console.log(content)
  return (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={open}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header borderBottomWidth={0}>
            <Text fontSize={20}> {t(`${headerTitle}`)}</Text>
          </AlertDialog.Header>
          <AlertDialog.Body borderTopWidth={0}>
            {
              <Text marginY={-4} fontSize={16}>
                {t(content)}
              </Text>
            }
          </AlertDialog.Body>
          <AlertDialog.Footer borderTopWidth={0}>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                isDisabled={disabled}
                onPress={() => onClose(false)}
                ref={cancelRef}>
                <Text fontSize={16}> {t(`Close`)}</Text>
              </Button>
              {/* <Button
                isLoading={loading}
                isDisabled={disabled}
                colorScheme="danger"
                onPress={() => onClose(true)}>
                {action}
              </Button> */}
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};

export default ErrorAlert;
