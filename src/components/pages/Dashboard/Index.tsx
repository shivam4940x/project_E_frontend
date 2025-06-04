import { Button, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Groups";
import type { DashboardContent } from "@/types/SharedProps";
import type { Dispatch, SetStateAction } from "react";
import { CustomTextField } from "@/components/util/FormInput";
import { useFriend } from "@/hooks/useFriend";
import { useForm } from "react-hook-form";

type NavProps = {
  setContent: Dispatch<SetStateAction<DashboardContent>>;
  currentContent: DashboardContent;
};

const Nav = ({ setContent, currentContent }: NavProps) => {
  const FriendsAction = [
    { title: "all", value: "all" },
    { title: "requests", value: "requests" },
    { title: "add friends", value: "add" },
  ];

  return (
    <div className="border-b border-light-blue/20 div px-4 ">
      <div className="flex items-center h-full gap-4">
        <div className="flex items-center gap-2 text-white">
          <GroupIcon className="text-white/50 text-base" />
          Friends
        </div>
        <div className="h-1 w-1 rounded-full bg-white-l/30"></div>
        <ul>
          <li>
            <div className="flex gap-5 capitalize">
              {FriendsAction.map((action, index) => {
                const isActive = currentContent === action.value;
                const variant: "text" | "outlined" | "contained" =
                  action.value === "add" ? "contained" : "text";

                const baseClass = [];

                if (isActive) {
                  baseClass.push("bg-[var(--color-btn-text-hovored)]");
                }

                if (variant === "contained" && isActive) {
                  baseClass.push("text-dark-blue");
                }

                return (
                  <Button
                    key={index}
                    onClick={() => setContent(action.value as DashboardContent)}
                    variant={variant}
                    className={baseClass.join(" ")}
                  >
                    {action.title}
                  </Button>
                );
              })}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
const AddFriend = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ id: string }>();
  const {
    addFriend,
    addFriendStatus: { isPending },
  } = useFriend();
  const userId = watch("id");
  const isDisabled = !userId || userId.trim() === "";
  const onSubmit = async (data: { id: string }) => {
    if (isPending) return;
    addFriend({
      id: data.id,
    });
    reset();
  };

  return (
    <div className="">
      <div className="mb-5">
        <Typography variant="h4">add friend</Typography>
        <Typography variant="h5">
          <span className="normal-case text-sm text-gray-300">
            You can add a friend using their user ID
          </span>
        </Typography>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex bg-paper-black/50 gap-4 h-16 rounded-xl border border-soft-blue/20"
      >
        <CustomTextField
          placeholder="User Id"
          type="text"
          variant="outlined"
          className="grow "
          InpclassName="h-8 px-4 "
          register={register}
          name="id"
          validation={{ required: "User ID is required" }}
          error={errors.id}
          helperText={errors.id?.message}
        />

        <Button
          type="submit"
          variant="contained"
          className={`normal-case my-3 mx-4  ${
            isDisabled ? "!cursor-not-allowed pointer-events-auto" : ""
          }`}
          disabled={isSubmitting || isDisabled}
          sx={{ textTransform: "none" }}
        >
          Send Friend Request
        </Button>
      </form>
    </div>
  );
};
export { Nav, AddFriend };
