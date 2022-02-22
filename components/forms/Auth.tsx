import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { login } from "store/features/user/actions";
import { useAppDispatch } from "hooks/redux.hooks";
import { validateEmail } from "utils/validators/emailValidator";
import { LoginData } from "types/user";

interface ILoginInputs {
  loginToken: string;
  password: string;
}

const AuthForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ILoginInputs>();

  const dispatch = useAppDispatch();

  const onLogIn = (data: ILoginInputs) => {
    const isEmail = validateEmail(data.loginToken);
    let dataToSend = {} as LoginData;

    if (isEmail) {
      dataToSend = {
        email: data.loginToken,
        password: data.password,
      };
    } else {
      dataToSend = {
        username: data.loginToken,
        password: data.password,
      };
    }

    dispatch(login(dataToSend));
  };

  return (
    <form onSubmit={handleSubmit(onLogIn)} noValidate>
      <Stack>
        <FormControl isInvalid={"loginToken" in errors}>
          <FormLabel mb={0}>Имя пользователя или почта</FormLabel>
          <Input
            {...register("loginToken")}
            isInvalid={"loginToken" in errors}
            placeholder={"Привет ^o^/"}
          />
          <FormErrorMessage>{errors?.loginToken?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel mb={0}>Пароль</FormLabel>
          <Input {...register("password")} placeholder={"●".repeat(8)} />
        </FormControl>
        <Button
          my={6}
          colorScheme="blue"
          isLoading={isSubmitting}
          type="submit"
        >
          Войти
        </Button>
      </Stack>
    </form>
  );
};

export default AuthForm;
