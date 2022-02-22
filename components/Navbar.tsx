import { useDisclosure } from "@chakra-ui/hooks";
import Link from "next/link";
import LoginModal from "./LoginModal";
import {
  Drawer,
  Button,
  Divider,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useColorMode,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "hooks/redux.hooks";
import React, { useEffect } from "react";
import { logout } from "store/features/user/actions";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";

// Top navbar
const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userInfo, loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (loading === "success") {
      onClose();
    }
  }, [loading]);

  return (
    <>
      <Flex p={6} borderBottom={1}>
        <Link href="/" passHref>
          <Button
            p={6}
            borderRadius={5}
            color={"white"}
            backgroundColor={"black"}
            fontSize={"30px"}
            _hover={{ bg: "black", color: "lightgray" }}
            _active={{ bg: "blue.300", color: "white" }}
          >
            FEED
          </Button>
        </Link>

        <Spacer />
        {userInfo.username ? (
          <UserIsPresent />
        ) : (
          <HStack>
            <ChangeThemeBtn size="lg" />
            <Button onClick={onOpen} colorScheme={"messenger"} size="lg">
              Войти
            </Button>
          </HStack>
        )}
        <LoginModal isOpen={isOpen} onClose={onClose} />
      </Flex>
      <Divider />
    </>
  );
};

const UserIsPresent: React.FC = () => {
  const [isLargerThan560] = useMediaQuery("(min-width: 560px)");
  const dispatch = useAppDispatch();
  return (
    <>
      {isLargerThan560 ? (
        <HStack spacing={5}>
          <Button>Мой профиль</Button>
          <Button size="md" onClick={() => dispatch(logout())}>
            Выйти
          </Button>
        </HStack>
      ) : (
        <MobileMenu />
      )}
    </>
  );
};

const MobileMenu: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <MenuList>
        <MenuItem>Мой профиль</MenuItem>
        <MenuItem onClick={() => dispatch(logout())}>Выйти</MenuItem>
        <MenuItem>
          <ChangeThemeBtn />
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const DrawerMobileMenu: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();

  return (
    <>
      <Button
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
        onClick={onOpen}
      />
      <Drawer placement={"top"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <VStack spacing={2} alignItems={"stretch"}>
              <Button>Мой профиль</Button>
              <Button size="md" onClick={() => dispatch(logout())}>
                Выйти
              </Button>
              <ChangeThemeBtn />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

interface ThemeBtnProps {
  size?: "lg" | "md";
}

const ChangeThemeBtn: React.FC<ThemeBtnProps> = ({ size }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button
      as={IconButton}
      onClick={() => toggleColorMode()}
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      size={size ?? "md"}
    />
  );
};

export default Navbar;
