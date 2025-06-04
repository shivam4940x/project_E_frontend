/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { memo, useEffect, useState, type FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, CardContent, Divider, Typography } from "@mui/material";
import { wait } from "@/lib/other";
import { CustomTextField } from "@/components/util/FormInput";
import Loading from "@/components/ui/Loading";
import axiosInstance from "@/lib/plugins/axios";
import type { LoginFormData } from "@/types/Form";
import GoogleIcon from "@mui/icons-material/Google";
import PersonIcon from "@mui/icons-material/Person";

type RequestProp = {
  username?: null | string;
  email?: null | string;
  password: null | string;
};
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
const LoginForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const [btnStatus, SetbtnStaus] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return;
    await wait(300);
    SetbtnStaus(false);
    try {
      const request: RequestProp = {
        username: null,
        email: null,
        password: data.password,
      };
      if (isValidEmail(data.email)) {
        request.email = data.email;
        delete request.username;
      } else {
        request.username = data.email;
        delete request.email;
      }
      const response = await axiosInstance
        .post("/auth/login", request)
        .catch((e) => {
          console.log(e);
          return e;
        });
      if (
        response?.data.message &&
        response?.data.message.toLowerCase() === "login successful"
      ) {
        const {
          tokens: { accessToken, refreshToken },
        } = response.data;

        localStorage.setItem("jwt", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

        toast.success("Login successful", {
          autoClose: 800,
          onClose: () => navigate("/"),
        });
      }
    } catch (e: any) {
      const status = e.response?.status;
      const messages: Record<number, string> = {
        404: "Email or username not found",
        403: "Invalid email or password",
      };
      toast.error(messages[status] || "An unexpected error occurred");
    } finally {
      SetbtnStaus(true);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND}/api/auth/google/login`;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");
    if (token) {
      localStorage.removeItem("jwt");
      localStorage.setItem("refresh_token", token);
      navigate("/");
    } else if (error) {
      toast.error(`login failed: ${decodeURIComponent(error)}`);
      navigate("/login");
    }
  }, [location, navigate]);
  useEffect(() => {});
  return (
    <Card className="bg-inherit shadow-none div md:flex justify-center items-center">
      <CardContent className="md:p-6 p-4">
        <Typography
          variant="h4"
          className="md:mb-8 mb-4 space-x-4 border-b border-light-blue p-2 text-left text-light-blue flex items-center"
        >
          <PersonIcon /> <span>Login</span>
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <CustomTextField
            label="Username or Email"
            type="text"
            fullWidth
            variant="standard"
            name="email"
            register={register}
            error={errors.email}
            disabled={isSubmitting}
            helperText={errors.email?.message}
            validation={{ required: "Can't leave it empty" }}
          />
          <CustomTextField
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            name="password"
            InpclassName="text-light-blue"
            register={register}
            error={errors.password}
            disabled={isSubmitting}
            helperText={errors.password?.message}
            validation={{ required: "Password is required" }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="py-2 px-4 center bg-light-blue/90 hover:bg-light-blue duration-100 shadow-none text-dark-blue"
            disabled={!btnStatus}
          >
            {isSubmitting ? <Loading /> : "Login"}
          </Button>
        </form>
        <Divider className="text-light-blue before:border-light-blue after:border-light-blue my-4">
          or
        </Divider>
        <div>
          <Button
            variant="contained"
            fullWidth
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="center gap-2 py-2 px-4 bg-dark-blue/90 hover:bg-dark-blue duration-100 shadow-none text-light-blue"
          >
            <GoogleIcon />
            <span className="text-sm">Login with Google</span>
          </Button>
        </div>
        <div className="mt-6">
          <Link to="#">
            <span className="text-xs">Forgot password?</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(LoginForm);
