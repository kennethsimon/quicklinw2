import React from 'react';
import {Center, AlertDialog, Button, Text} from 'native-base';

const SuccessAlert = ({
  headerTitle,
  content,
  open,
  onClose,
  disabled = false,
  loading = false,
  action = '',
}) => {
  const cancelRef = React.useRef(null);
  return (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={open}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header borderBottomWidth={0}>
            <Text fontSize={20}>{headerTitle}</Text>
          </AlertDialog.Header>
          <AlertDialog.Body borderTopWidth={0}>
            {' '}
            <Text fontSize={16} marginY={-4}>
              {content}
            </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer borderTopWidth={0}>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                isDisabled={disabled}
                onPress={() => onClose(false)}
                ref={cancelRef}>
                <Text fontSize={16}>Close</Text>
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

export default SuccessAlert;
