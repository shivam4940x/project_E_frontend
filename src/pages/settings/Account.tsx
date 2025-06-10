import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Typography,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

import { useUsers } from "@/hooks/useUsers";
import Loading from "@/components/ui/Loading";
import { CustomTextField } from "@/components/util/FormInput";
import type { UserPayloadAccount } from "@/types/Form";

interface ProfileFormData {
  email: string;
  password: string;
  dob: string;
  gender: string;
  country: string;
  language: string;
}

const Account = () => {
  const { useCurrentUser, updateUser } = useUsers();
  const { data: CurrentUser, isLoading } = useCurrentUser({
    query: { account: true },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>();

  const isMutating = isSubmitting || updateUser.isPending;

  useEffect(() => {
    if (CurrentUser) {
      const {
        email,
        password,
        profile: { dob, language, gender, country },
      } = CurrentUser;
      reset({
        password: password ? "**************" : "",
        email,
        language,
        dob,
        gender,
        country,
      });
    }
  }, [CurrentUser, reset]);

  const onSubmit = (data: ProfileFormData) => {
    const payload: UserPayloadAccount = {
      email: data.email,
      password: data.password,
      profile: {
        dob: data.dob,
        gender: data.gender,
        country: data.country,
        language: data.language,
      },
    };
    updateUser.fn(payload);
  };

  if (isLoading) {
    return (
      <div className="div center gap-4">
        <Loading />
        Loading Account details...
      </div>
    );
  }

  return (
    <div className="w-max px-4 lg:px-0 lg:py-0 max-h-full max-w-full div overflow-y-scroll overflow-x-hidden pt-6">
      <Typography variant="h2">Account Management</Typography>
      <Typography variant="h6">Update your account information.</Typography>

      <form
        className="mt-10 w-full space-y-6 lg:w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <CustomTextField
          label="Email"
          name="email"
          type="email"
          variant="standard"
          fullWidth
          register={register}
          error={errors.email}
          disabled={isMutating}
        />
        <CustomTextField
          label="Password"
          name="password"
          type="password"
          variant="standard"
          fullWidth
          register={register}
          error={errors.password}
          disabled={isMutating}
        />
        <Typography variant="h6">Date of birth</Typography>
        <CustomTextField
          // label="Date of Birth"
          name="dob"
          type="date"
          variant="standard"
          fullWidth
          register={register}
          error={errors.dob}
          disabled={isMutating}
        />

        <FormControl component="fieldset" fullWidth disabled={isMutating}>
          <FormLabel component="legend" className="text-white-l">
            Gender
          </FormLabel>
          <RadioGroup
            row
            defaultValue={CurrentUser?.profile.gender}
            {...register("gender")}
          >
            <FormControlLabel
              value="male"
              control={<Radio className="text-white" />}
              label="Male"
            />
            <FormControlLabel
              value="female"
              control={<Radio className="text-white" />}
              label="Female"
            />
            <FormControlLabel
              value="other"
              control={<Radio className="text-white" />}
              label="Other"
            />
          </RadioGroup>
        </FormControl>

        <CustomTextField
          label="Country"
          name="country"
          type="text"
          variant="standard"
          fullWidth
          register={register}
          error={errors.country}
          disabled={isMutating}
        />

        <FormControl fullWidth variant="standard" disabled={isMutating}>
          <InputLabel id="language-label">Language</InputLabel>
          <Select
            labelId="language-label"
            defaultValue={CurrentUser?.profile.language}
            {...register("language", { valueAsNumber: true })}
          >
            <MenuItem value={"english"}>English</MenuItem>
            <MenuItem value={"hindi"}>Hindi</MenuItem>
          </Select>
        </FormControl>

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

export default Account;
