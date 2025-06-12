// LongMenu.tsx (modified)
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { copyText } from "@/lib/other";
import { useChat } from "@/hooks/useChat";
import type { Message } from "@/types/SharedProps";

const options = [
  // { label: "Edit", icon: <EditIcon className="w-4 h-4" /> },
  { label: "Copy message", icon: <ContentCopyIcon className="w-5 h-4" /> },
  { label: "Delete", icon: <DeleteIcon className="w-4 h-4" /> },
];

const ITEM_HEIGHT = 48;

export default function LongMenu({
  anchorEl,
  onClose,
  messageId,
  conversationId,
  open,
  setmessage,
}: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  messageId: string;
  conversationId: string;
  open: boolean;
  setmessage: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const { deleteChat, editChat } = useChat();

  const handleAction = (action: string) => {
    switch (action) {
      case "Edit":
        editChat({ id: messageId, conversationId });
        break;
      case "Copy message":
        copyText(messageId);
        break;
      case "Delete":
        deleteChat({
          id: messageId,
          conversationId,
          onSuccess: () => {
            setmessage((prev) => prev.filter((m) => m.id !== messageId));
          },
        });
        break;
    }
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
          className: "bg-dull-black text-white-l/70 space-y-2 text-s4",
        },
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={option.label}
          onClick={() => handleAction(option.label)}
          className={`${
            option.label === "Delete"
              ? "py-2 mx-2 px-2 text-soft-red hover:bg-soft-red/10 rounded-sm"
              : ""
          }`}
        >
          <div className="flex justify-between items-center w-full">
            <div>{option.label}</div>
            <div>{option.icon}</div>
          </div>
        </MenuItem>
      ))}
    </Menu>
  );
}
