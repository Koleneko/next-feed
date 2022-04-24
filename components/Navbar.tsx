import { useDisclosure } from "@chakra-ui/hooks";
import Link from "next/link";
import LoginModal from "./LoginModal";
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Spacer,
  useColorMode,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "hooks/redux.hooks";
import React, { useEffect } from "react";
import { logout } from "store/features/user/actions";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { AppDispatch } from "store";
import useMounted from "hooks/useMounted";

// Top navbar
const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userInfo, loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const mounted = useMounted();

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
        {mounted && userInfo.username ? (
          <UserIsPresent username={userInfo.username} dispatch={dispatch} />
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

export const UserIsPresent: React.FC<{
  username: string;
  dispatch: AppDispatch;
}> = ({ username, dispatch }) => {
  const router = useRouter();
  const [isLargerThan560] = useMediaQuery("(min-width: 560px)");
  const goToProfile = () => router.push(`/users/${username}`);
  const goToCreate = () => router.push(`/create`);

  return (
    <>
      {isLargerThan560 ? (
        <HStack spacing={5}>
          <Button onClick={goToProfile}>Мой профиль</Button>
          <Button size="md" onClick={() => dispatch(logout())}>
            Выйти
          </Button>
          <Button colorScheme="blue" onClick={goToCreate}>
            Создать пост
          </Button>
          <ChangeThemeBtn />
        </HStack>
      ) : (
        <DrawerMobileMenu
          dispatch={dispatch}
          navigateToProfile={goToProfile}
          navigateToCreate={goToCreate}
        />
      )}
    </>
  );
};

const DrawerMobileMenu: React.FC<{
  dispatch: AppDispatch;
  navigateToProfile: () => void;
  navigateToCreate: () => void;
}> = ({ dispatch, navigateToProfile, navigateToCreate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
              <Button onClick={navigateToProfile}>Мой профиль</Button>
              <Button colorScheme="blue" onClick={navigateToCreate}>
                Создать пост
              </Button>
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
