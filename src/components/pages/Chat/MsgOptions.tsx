import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, type MouseEvent } from "react";
import { copyText } from "@/lib/other";
import { useChat } from "@/hooks/useChat";

const options = [
  { label: "Edit", icon: <EditIcon className="w-4 h-4" /> },
  { label: "Copy message", icon: <ContentCopyIcon className="w-5 h-4" /> },
  { label: "Delete", icon: <DeleteIcon className="w-4 h-4" /> },
];

const ITEM_HEIGHT = 48;

export default function LongMenu({
  messageId,
  conversationId,
}: {
  messageId: string;
  conversationId: string;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { deleteChat, editChat } = useChat();
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case "Edit":
        editChat({ id: messageId, conversationId });
        break;
      case "Copy message":
        copyText(messageId);
        break;
      case "Delete":
        deleteChat({ id: messageId, conversationId });
        break;
    }
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id={`long-button-${messageId}`}
        className="text-white rotate-90"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
            className: "bg-dull-black text-white-l/70 space-y-2 text-s4",
          },
          list: {
            "aria-labelledby": `long-button-${messageId}`,
          },
        }}
      >
        {options.map((option) => {
          if (option.label === "Delete") {
            return (
              <MenuItem
                key={option.label}
                className="w-full p-0"
                onClick={() => handleAction(option.label)}
              >
                <div className=" py-2 mx-2 px-2 text-soft-red hover:bg-soft-red/10 rounded-sm flex justify-between items-center w-full">
                  <div>{option.label}</div>
                  <div>{option.icon}</div>
                </div>
              </MenuItem>
            );
          } else {
            return (
              <MenuItem
                key={option.label}
                onClick={() => handleAction(option.label)}
              >
                <div className="flex justify-between items-center w-full">
                  <div>{option.label}</div>
                  <div>{option.icon}</div>
                </div>
              </MenuItem>
            );
          }
        })}
      </Menu>
    </div>
  );
}
