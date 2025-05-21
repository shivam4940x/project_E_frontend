import { Avatar, Box, Card, IconButton, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
// import useUserStore from "@/store/user.store";
import { useUsers } from "@/hooks/useUsers";

const Settings = () => {
  // const { user } = useUserStore();
  const { data: user, error } = useUsers().useCurrentUser();
  return (
    <div className="h-full w-full backdrop-blur-sm ">
      <Card className="flex center p-1 bg-transparent">
        <Avatar
          src={user?.profile.avatar}
          alt={user?.username}
          className="mr-2"
        />
        <Typography variant="h6" className="capitalize">
          <span className="text-sm">
            {error ? error.message : user?.username}
          </span>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        <IconButton>
          <SettingsIcon className="text-gray-300 hover:rotate-90 duration-200 transition-transform " />
        </IconButton>
      </Card>
    </div>
  );
};
export { Settings };
