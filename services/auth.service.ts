import axios from "axios";
import { LoginData, RegisterData } from "types/user";

const register = (registrationData: RegisterData) => {
  return axios.post(
    process.env.NEXT_PUBLIC_API + "auth/register",
    registrationData
  );
};

const login = (loginData: LoginData) => {
  return axios
    .post(process.env.NEXT_PUBLIC_API + "auth/login", loginData)
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
