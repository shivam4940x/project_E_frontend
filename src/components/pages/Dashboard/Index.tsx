import { Button, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Groups";
import type { DashboardContent } from "@/types/SharedProps";
import type { Dispatch, SetStateAction } from "react";
import { CustomTextField } from "@/components/util/FormInput";
import { useFriend } from "@/hooks/useFriend";
import { useForm } from "react-hook-form";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SendIcon from "@mui/icons-material/Send";

type NavProps = {
  setContent: Dispatch<SetStateAction<DashboardContent>>;
  currentContent: DashboardContent;
};

const Nav = ({ setContent, currentContent }: NavProps) => {
  const FriendsAction = [
    { title: "all", value: "all" },
    { title: "requests", value: "requests" },
    {
      title: "add friends",
      value: "add",
      icon: <PersonAddIcon className="text-base" />,
    },
  ];

  return (
    <div className="border-b border-light-blue/20 div px-4 ">
      <div className="flex items-center h-full gap-4">
        <div className="flex items-center gap-2 text-white">
          <GroupIcon className="text-white/50 text-xl " />
          <span className="hidden lg:inline">Friends</span>
        </div>
        <div className="h-1 w-1 rounded-full bg-white-l/30"></div>
        <ul>
          <li>
            <div className="flex gap-2 capitalize">
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
                    className={`text-sm lg:text-base ${baseClass.join(" ")}`}
                  >
                    {action.icon ? (
                      <div className="">{action.icon}</div>
                    ) : (
                      <div>{action.title}</div>
                    )}
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
    <div className="px-3 py-4">
      <div className="mb-5 space-y-1">
        <Typography variant="h4">add friend</Typography>
        <Typography variant="h6">
          <span className="normal-case text-gray-300">
            You can add a friend using their user ID or username
          </span>
        </Typography>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex bg-paper-black/50 gap-4 h-16 rounded-xl border border-soft-blue/20"
      >
        <CustomTextField
          placeholder="User Id or username"
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
          <span className="hidden lg:inline">Send Request</span>
          <span className="lg:hidden">
            <SendIcon />
          </span>
        </Button>
      </form>
    </div>
  );
};
export { Nav, AddFriend };
