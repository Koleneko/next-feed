import * as Yup from "yup";

export const registerValidationScheme = Yup.object().shape({
  email: Yup.string()
    .required("Необходимо ввести почту")
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Введите корректную почту"
    ),
  fullName: Yup.string()
    .required("Необходимо ввести своё имя")
    .matches(
      /^(([a-zA-Z' -]{1,80})|([а-яА-ЯЁёІіЇїҐґЄє' -]{1,80}))$/u,
      "Имя должно состоять из букв одного алфавита"
    ),
  password: Yup.string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g,
      "Пароль должен содержать минимум одну цифру, заглавную и строчную буквы"
    )
    .min(8, "Длина пароля должна составлять не менее 8 символов"),
  username: Yup.string()
    .min(3, "Минимальная длина ника - 3 символа")
    .matches(
      /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim,
      "Пароль может содержать только латинские буквы, цифры и . _"
    ),
});