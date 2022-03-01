import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CheckIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { debounce } from "debounce";
import { registerValidationScheme } from "./validationSchemes";
import { checkTokenUniqueness } from "services/unique.service";
import { useAppDispatch, useAppSelector } from "hooks/redux.hooks";
import { registerUser } from "store/features/user/actions";

interface IRegisterInputs {
  email: string;
  fullName: string;
  password: string;
  username: string;
}

enum Availability {
  Available,
  Unavailable,
  Processing,
  Unknown,
}

const RegistrationForm: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const [emailIcon, setEmailIcon] = useState<Availability>(
    Availability.Unknown
  );
  const [usernameIcon, setUsernameIcon] = useState<Availability>(
    Availability.Unknown
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    trigger,
    watch,
  } = useForm<IRegisterInputs>({
    mode: "onBlur",
    resolver: yupResolver(registerValidationScheme),
  });

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);
  const handleShowClick = () => setShow(!show);
  const onSubmit = (data: IRegisterInputs) => {
    dispatch(registerUser(data));
  };

  const emailWatcher = watch("email");
  const usernameWatcher = watch("username");

  useEffect(() => {
    emailWatcher && debouncedEmailHandler(emailWatcher);
  }, [emailWatcher]);

  useEffect(() => {
    usernameWatcher && debouncedUsernameHandler(usernameWatcher);
  }, [usernameWatcher]);

  const debouncedEmailHandler = useCallback(
    debounce(async (emailWatcher: string) => {
      const emailIsValid = await trigger("email");
      setEmailIcon(Availability.Processing);
      if (!emailIsValid) {
        setEmailIcon(Availability.Unavailable);
        return;
      }
      const isUnique = await checkTokenUniqueness({ email: emailWatcher });
      if (!isUnique) {
        setError("email", {
          message: "Пользователь с таким e-mail уже существует",
        });
        setEmailIcon(Availability.Unavailable);
        return;
      }
      setEmailIcon(Availability.Available);
    }, 500),
    []
  );

  const debouncedUsernameHandler = useCallback(
    debounce(async (usernameWatcher: string) => {
      const usernameIsValid = await trigger("username");
      setUsernameIcon(Availability.Processing);
      if (!usernameIsValid) {
        setUsernameIcon(Availability.Unavailable);
        return;
      }
      const isUnique = await checkTokenUniqueness({
        username: usernameWatcher,
      });
      if (!isUnique) {
        setError("username", {
          message: "Пользователь с таким ником уже существует",
        });
        setUsernameIcon(Availability.Unavailable);
        return;
      }
      setUsernameIcon(Availability.Available);
    }, 500),
    []
  );

  const iconToShow = (iconState: Availability): JSX.Element | null => {
    switch (iconState) {
      case Availability.Available:
        return <CheckIcon color="green.500" />;
      case Availability.Unavailable:
        return <NotAllowedIcon color="red.500" />;
      case Availability.Processing:
        return <Spinner size={"xs"} />;
      default:
        return null;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack>
          <FormControl isRequired isInvalid={"email" in errors}>
            {/* TODO fix autocomplete */}
            <FormLabel htmlFor="email" mb={0}>
              Почта
            </FormLabel>
            <InputGroup size="md" flexDir={"column"}>
              <Input
                {...register("email")}
                id="email"
                type="email"
                autoComplete={"email"}
                isInvalid={"email" in errors}
              />
              <InputRightElement>{iconToShow(emailIcon)}</InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={"fullName" in errors}>
            <InputGroup flexDir={"column"}>
              <FormLabel htmlFor="FullName">Полное имя</FormLabel>
              <Input
                {...register("fullName")}
                id="fullName"
                type="name"
                autoComplete={"name"}
                autoCapitalize={"words"}
              />
            </InputGroup>
            <FormErrorMessage>{errors?.fullName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={"username" in errors} isRequired>
            <FormLabel htmlFor="username">Имя пользователя</FormLabel>
            <InputGroup flexDir={"column"}>
              <Input
                {...register("username")}
                id="username"
                type="username"
                autoComplete={"nickname"}
              />
              <InputRightElement>{iconToShow(usernameIcon)}</InputRightElement>
              {!("username" in errors) ? (
                <FormHelperText>
                  Имя будет отображаться у вас в профиле
                </FormHelperText>
              ) : (
                <FormErrorMessage>{errors?.username?.message}</FormErrorMessage>
              )}
            </InputGroup>
          </FormControl>
          <FormControl isRequired isInvalid={"password" in errors}>
            <FormLabel htmlFor="password">Пароль</FormLabel>
            <InputGroup size="md" flexDir={"column"} mt={0}>
              <Input
                {...register("password")}
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
                autoComplete={"new-password"}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
              {!("password" in errors) ? (
                <FormHelperText>Не менее 8 символов</FormHelperText>
              ) : (
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              )}
            </InputGroup>
          </FormControl>
          <Button
            my={6}
            colorScheme="blue"
            isLoading={isSubmitting}
            type="submit"
          >
            Зарегистрироваться
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default RegistrationForm;
