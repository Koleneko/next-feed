import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/modal";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import RegistrationForm from "components/forms/Register";
import AuthForm from "components/forms/Auth";

const LoginModal: React.FC<Omit<ModalProps, "children">> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Tabs isFitted variant={"enclosed"}>
          <TabList>
            <Tab _focus={{ boxShadow: "none" }}>Вход</Tab>
            <Tab _focus={{ boxShadow: "none" }}>Регистрация</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <AuthForm />
            </TabPanel>
            <TabPanel>
              <RegistrationForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
