/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { memo, useEffect, useState, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, CardContent, Divider, Typography } from "@mui/material";
import { wait } from "@/lib/other";
import { CustomTextField } from "@/components/util/FormInput";
import Loading from "@/components/ui/Loading";
import axiosInstance from "@/lib/plugins/axios";
import type { signupFormData } from "@/types/Form";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import GoogleIcon from "@mui/icons-material/Google";

const SignupForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signupFormData>();

  const [btnStatus, SetbtnStaus] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const onSubmit = async (data: signupFormData) => {
    if (isSubmitting) return;
    await wait(300);
    SetbtnStaus(false);
    try {
      const request = Object.fromEntries(
        Object.entries(data).filter(
          ([, value]) => value != null && value !== ""
        )
      );

      const response = await axiosInstance.post("/auth/signup", request);
      if (
        response?.data.message &&
        response?.data.message.toLowerCase() === "signup successful"
      ) {
        const {
          tokens: { accessToken, refreshToken },
          userId,
        } = response.data;

        localStorage.setItem("jwt", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("user_id", userId);

        toast.success("Login successful", {
          autoClose: 800,
          onClose: () => navigate("/"),
        });
      }
    } catch (e: any) {
      const status = e.response?.status;
      const messages: Record<number, string> = {
        409: "Invalid email or password",
      };
      toast.error(messages[status] || "An unexpected error occurred");
    } finally {
      SetbtnStaus(true);
    }
  };

  type FieldsProps = {
    label: string;
    name: keyof signupFormData;
    type: string;
    error: keyof signupFormData;
    fullWidth?: boolean;
    validation?: { required: string };
  };
  const fields: FieldsProps[] = [
    {
      label: "Username",
      name: "username",
      type: "text",
      error: "username",
      validation: { required: "username is required" },
    },
    {
      label: "First name",
      name: "firstName",
      type: "text",
      fullWidth: false,
      error: "firstName",
    },
    {
      label: "Last name",
      name: "lastName",
      type: "text",
      fullWidth: false,
      error: "lastName",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      error: "email",
      validation: { required: "Can't leave it empty" },
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      error: "password",
      validation: { required: "Password is required" },
    },
  ];
  

  const handleGoogleLogin = async () => {
    window.location.href = `${import.meta.env.VITE_BACKEND}/api/auth/google/signup`;
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
      toast.error(`signup failed: ${decodeURIComponent(error)}`);
      navigate("/login"); 
    }
  }, [location, navigate]);
  return (
    <Card className="bg-inherit shadow-none overflow-scroll max-h-screen border-0">
      <CardContent className="md:p-6 p-4">
        <Typography
          variant="h4"
          className="md:mb-8 mb-4 space-x-4 border-b border-light-blue p-2 text-left text-light-blue flex items-center"
        >
          <PersonAddAltIcon /> <span>Signup</span>
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {fields.map(
            (
              { label, name, type, error, validation, fullWidth = true },
              index
            ) => {
              // Side-by-side logic for firstname and lastname
              if (name === "firstName") {
                return (
                  <div key="name-fields" className="flex gap-4">
                    {[fields[index], fields[index + 1]].map(
                      ({ label, name, type, error, validation }) => (
                        <CustomTextField
                          key={name}
                          label={label}
                          type={type}
                          name={name}
                          fullWidth
                          variant="standard"
                          className="w-1/2"
                          register={register}
                          error={errors[error]}
                          disabled={isSubmitting}
                          helperText={errors[error]?.message}
                          validation={validation}
                        />
                      )
                    )}
                  </div>
                );
              }

              // Skip lastname because it's already rendered above
              if (name === "lastName") return null;

              return (
                <CustomTextField
                  key={name}
                  label={label}
                  type={type}
                  name={name}
                  fullWidth={fullWidth}
                  variant="standard"
                  className="inline-block"
                  register={register}
                  error={errors[error]}
                  disabled={isSubmitting}
                  helperText={errors[error]?.message}
                  validation={validation}
                />
              );
            }
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="py-2 px-4 center bg-light-blue/90 hover:bg-light-blue duration-100 shadow-none text-dark-blue mt-5"
            disabled={!btnStatus}
          >
            {isSubmitting ? <Loading /> : "Signup"}
          </Button>
        </form>
        <Divider className="text-light-blue before:border-light-blue after:border-light-blue my-2">
          or
        </Divider>
        <div>
          <Button
            variant="contained"
            fullWidth
            onClick={handleGoogleLogin}
            className="center gap-2 py-2 px-4 bg-dark-blue/90 hover:bg-dark-blue duration-100 shadow-none text-light-blue"
          >
            <GoogleIcon />
            <span className="text-sm">Signup with Google</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default memo(SignupForm);
