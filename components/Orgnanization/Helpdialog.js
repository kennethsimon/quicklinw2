import { AlertDialog, Button, Center } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";

const Helpdialog = ({isOpen, setIsOpen}) => {
  const {t} = useTranslation();
    const onClose = () => setIsOpen(false);
  
    const cancelRef = React.useRef(null);
    return <Center>
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>{t("Information")}</AlertDialog.Header>
            <AlertDialog.Body>
              {t("Experiencing issues with our app? Call our support hotline at +255 753 909 090. We're here to assist you 24/7!")}
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                  {t("Close")}
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>;
  };

  export default Helpdialog