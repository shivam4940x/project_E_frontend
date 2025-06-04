import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Avatar, Typography, Button, IconButton, Input } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useUsers } from "@/hooks/useUsers";
import Loading from "@/components/ui/Loading";
import { CustomTextField } from "@/components/util/FormInput";
import type { UserPayload } from "@/types/Form";
import CircularProgress, {
  type CircularProgressProps,
} from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import axios from "axios";
import axiosInstance from "@/lib/plugins/axios";

interface ProfileFormData {
  avatar: string;
  firstName: string;
  lastName: string;
  username: string;
  aboutMe: string;
  phone: number;
}

const Profile = () => {
  const { useCurrentUser, updateUser } = useUsers();
  const { data: CurrentUser, isLoading } = useCurrentUser({
    query: { profile: true },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>();

  const [avatar, setAvatar] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const isMutating = isSubmitting || updateUser.isPending;

  useEffect(() => {
    if (CurrentUser) {
      reset({
        avatar: CurrentUser.profile?.avatar || "",
        firstName: CurrentUser.profile?.firstName || "",
        lastName: CurrentUser.profile?.lastName || "",
        username: CurrentUser.username || "",
        aboutMe: CurrentUser.profile?.about || "",
        phone: CurrentUser.profile?.phone || undefined,
      });
      setAvatar(CurrentUser.profile?.avatar || "");
    }
  }, [CurrentUser, reset]);

  const uploadImageWithProgress = async (file: File): Promise<string> => {
    const { data } = await axiosInstance.get("/auth/cloudinary/signature");

    if (!data) throw new Error("Failed to get Cloudinary signature");

    const { timestamp, signature, apiKey, cloudName } = data;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", apiKey);
    formData.append("signature", signature);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        onUploadProgress: (event) => {
          if (event.total) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.secure_url;
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(1);
      const url = await uploadImageWithProgress(file);
      setAvatar(url);
      setValue("avatar", url, { shouldValidate: true });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadProgress(0);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    const payload: UserPayload = {
      username: data.username,
      profile: {
        avatar: data.avatar,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        about: data.aboutMe,
      },
    };
    updateUser.fn(payload);
  };

  if (isLoading) {
    return (
      <div className="div center gap-4">
        <Loading />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-max">
      <Typography variant="h2">Edit Profile</Typography>
      <form className="mt-10 w-max" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-6">
          <div className="relative group rounded-full overflow-hidden">
            <Avatar className="w-16 h-16" src={avatar} />
            <Input
              type="file"
              inputProps={{ accept: "image/*" }}
              className="absolute top-0 right-0 div opacity-0 cursor-pointer z-20"
              slotProps={{
                input: {
                  className: "div cursor-pointer",
                },
              }}
              onChange={handleAvatarChange}
            />
            <IconButton
              className="absolute bg-white/10 opacity-0 top-0 right-0 div group-hover:opacity-100 z-10 duration-100"
              component="div"
            >
              <EditIcon className="text-white text-base" />
            </IconButton>
            {!!uploadProgress && (
              <div className="absolute bg-dull-black/50 top-0 right-0 div center z-50">
                <CircularProgressWithLabel value={uploadProgress} />
              </div>
            )}
          </div>

          <div className="flex gap-4 items-end">
            <CustomTextField
              label="First name"
              type="text"
              variant="standard"
              name="firstName"
              register={register}
              error={errors.firstName}
              disabled={isMutating}
            />
            <CustomTextField
              label="Last name"
              type="text"
              variant="standard"
              name="lastName"
              register={register}
              error={errors.lastName}
              disabled={isMutating}
            />
          </div>
        </div>

        <div className="my-10 space-y-3">
          <CustomTextField
            variant="standard"
            label="Username"
            name="username"
            type="text"
            fullWidth
            register={register}
            error={errors.username}
            disabled={isMutating}
          />
        </div>

        <div className="my-10 space-y-3">
          <CustomTextField
            variant="standard"
            label="About me"
            name="aboutMe"
            type="text"
            fullWidth
            register={register}
            error={errors.aboutMe}
            disabled={isMutating}
          />
        </div>

        <div className="my-10 space-y-3">
          <CustomTextField
            variant="standard"
            label="Phone number"
            name="phone"
            type="tel"
            fullWidth
            register={register}
            validation={{
              pattern: {
                value: /^\d{10}$/,
                message: "Phone number must be exactly 10 digits",
              },
            }}
            error={errors.phone}
            disabled={isMutating}
          />
        </div>

        <div className="flex gap-5 ml-auto w-max">
          <Button onClick={() => reset()} variant="text" disabled={isMutating}>
            Reset
          </Button>
          <Button type="submit" variant="outlined" disabled={isMutating}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          className="text-white"
          sx={{ color: "text.secondary" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default Profile;
