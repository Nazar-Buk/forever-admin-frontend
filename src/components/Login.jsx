import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

import { backendUrl } from "../App";

const loginSchema = yup.object({
  email: yup
    .string()
    .required("This field is required!")
    .matches(
      /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
      "Email format is incorrect!"
    ),
  password: yup
    .string()
    .min(8, "Use 8 or more characters!")
    .required("This field is required!"),
});

const Login = ({ setToken }) => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginSchema),
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log(data, "data from login");
    try {
      const response = await axios.post(backendUrl + "/api/user/admin", data); //  в середині має бути лінка,
      // другим параметром відправляєш дані котрі хочеш відправити на бек {emai: 'lalal', password: 'lalal'}

      console.log(response, "response");

      const { success, message, token } = response.data;
      if (success) {
        setToken(token);
        toast.success("Authorized successfully");
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error, "error from catch!");
      toast.error(error.message);
    }
  };

  return (
    <section className="login">
      <form
        className="login__form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>Admin Panel</h1>
        <div className="input-box">
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            id="email"
            placeholder="SamAltman@gmail.com"
            {...register("email")}
          />
          <p className="error">{errors.email?.message}</p>
        </div>
        <div className="input-box">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            {...register("password")}
          />
          <p className="error">{errors.password?.message}</p>
        </div>
        <button type="submit">Login</button>
      </form>
    </section>
  );
};

export default Login;
