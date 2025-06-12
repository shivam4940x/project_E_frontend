// /* eslint-disable @typescript-eslint/no-explicit-any */
import { Chatsocket } from "@/lib/plugins/socket";
import { Avatar, IconButton, Typography } from "@mui/material";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type Ref,
  type SetStateAction,
} from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { UserObj } from "@/types/Response";
import type { Message } from "@/types/SharedProps";
import { formatChatTimestamp, smolTimestamp } from "@/lib/other";
import LongMenu from "./MsgOptions";
import { useUsers } from "@/hooks/useUsers";
import { decryptWithConvoKey } from "@/lib/enc";

interface MainChatProps {
  message: Message[];
  setmessage: Dispatch<SetStateAction<Message[]>>;
  participants: UserObj[];
  loadMoreRef: Ref<HTMLDivElement>;
  convoId: string;
}
interface GroupedMessage {
  id: string;
  sender: UserObj;
  content: {
    id: string;
    value: string;
    createdAt: string;
  }[];
  createdAt: string;
}

const MainChat = ({
  message, // allMessages: Message[]
  setmessage,
  participants,
  loadMoreRef,
  convoId,
}: MainChatProps) => {
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessage[]>([]);
  const lastMessageRef = useRef<string>(""); // to track last processed message
  const { data: currentUser } = useUsers().useCurrentUser();

  // Cache to avoid redundant decryptions
  const decryptedCache = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    let isCancelled = false;

    const groupAndDecryptMessages = async () => {
      const groups: GroupedMessage[] = [];

      for (let i = 0; i < message.length; i++) {
        const msg = message[i];
        const prevMsg = message[i - 1];
        const sender = participants.find((p) => p.id === msg.senderId);

        const timeDiff = prevMsg
          ? new Date(msg.createdAt).getTime() -
            new Date(prevMsg.createdAt).getTime()
          : Infinity;

        const isNewGroup =
          i === 0 ||
          msg.senderId !== prevMsg?.senderId ||
          timeDiff > 5 * 60 * 1000;

        // Decryption caching key
        const decryptKey = `${msg.id}:${msg.iv}`;
        let decryptedContent = decryptedCache.current.get(decryptKey);

        if (!decryptedContent) {
          try {
            decryptedContent = await decryptWithConvoKey(
              msg.content,
              msg.iv,
              convoId
            );
            decryptedCache.current.set(decryptKey, decryptedContent);
          } catch (error) {
            console.error("Decryption failed:", error);
            continue;
          }
        }

        if (isCancelled) return;

        if (isNewGroup && sender) {
          groups.push({
            id: msg.id,
            sender,
            content: [
              {
                id: msg.id,
                value: decryptedContent,
                createdAt: msg.createdAt,
              },
            ],
            createdAt: msg.createdAt,
          });
        } else if (groups.length > 0) {
          const lastGroup = groups[groups.length - 1];
          const alreadyExists = lastGroup.content.some(
            (m) => m.createdAt === msg.createdAt && m.value === decryptedContent
          );

          if (!alreadyExists) {
            lastGroup.content.push({
              id: msg.id,
              value: decryptedContent,
              createdAt: msg.createdAt,
            });
          }
        }
      }

      if (!isCancelled) {
        setGroupedMessages(groups);
        if (message.length > 0) {
          lastMessageRef.current = message[message.length - 1].id;
        }
      }
    };

    // Only regroup if last message is new
    if (
      message.length === 0 ||
      message[message.length - 1]?.id !== lastMessageRef.current
    ) {
      groupAndDecryptMessages();
    }

    return () => {
      isCancelled = true;
    };
  }, [message, participants, convoId]);

  // Live update listener
  useEffect(() => {
    const handler = (data: Message) => {
      setmessage((prev) => [...prev, data]);
    };

    Chatsocket.on("receive", handler);
    return () => {
      Chatsocket.off("receive", handler);
    };
  }, [setmessage, convoId]);
  if (groupedMessages.length == 0) {
    return <div className="center div">Start your new journey</div>;
  }
  return (
    <ul
      id="chatWrapper"
      className="flex flex-col justify-end min-h-full max-w-full h-max py-2"
    >
      <li className="h-5 w-full">
        <div className="div" ref={loadMoreRef}></div>
      </li>
      {groupedMessages.map((msgGroup) => (
        <li key={msgGroup.id} className="max-w-full py-2">
          <div className="w-full">
            {msgGroup.content.map((m, i) => (
              <Message
                key={`${m.id}_${i}`}
                message={msgGroup}
                content={m}
                index={i}
                currentUser={currentUser as UserObj}
                convoId={convoId}
                setmessage={setmessage}
              />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
};

const LONG_PRESS_DURATION = 500;

const Message = ({
  currentUser,
  setmessage,
  message,
  convoId,
  content,
  index,
}: {
  setmessage: React.Dispatch<React.SetStateAction<Message[]>>;
  content: GroupedMessage["content"][number];
  message: GroupedMessage;
  currentUser: UserObj;
  convoId: string;
  index: number;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCurrentUser = message.sender.id === currentUser?.id;

  const handleClose = () => setAnchorEl(null);

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePressStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isCurrentUser) return;
    const target = e.currentTarget as HTMLElement;
    timeoutRef.current = setTimeout(() => {
      setAnchorEl(target);
    }, LONG_PRESS_DURATION);
  };

  const handlePressEnd = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <div
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      className="hover:bg-white-l/10 flex gap-x-1 relative group pl-1"
    >
      {index === 0 ? (
        <div className="mt-1 h-11 center mx-4">
          <Avatar
            src={message.sender.profile.avatar}
            alt={message.sender.username}
            slotProps={{
              img: {
                onError: (e) => {
                  (e.target as HTMLImageElement).src = "/default-avatar.png";
                },
              },
            }}
          />
        </div>
      ) : (
        <div className="w-18 text-xs group-hover:opacity-100 opacity-0 text-white-l/50 h-6 center">
          {smolTimestamp(message.createdAt)}
        </div>
      )}

      <div className="pr-3">
        {index === 0 && (
          <div className="flex space-x-3 items-center mb-1">
            <Typography variant="h6" className="text-base">
              {message.sender.username}
            </Typography>
            <div className="font-light text-gray-200/50 text-xs font-Poppins">
              {formatChatTimestamp(message.createdAt)}
            </div>
          </div>
        )}
        <div className="py-px w-full font-light text-white">
          {content.value}
        </div>
      </div>

      {/* Hover icon (desktop) */}
      {isCurrentUser && (
        <div className="absolute top-0 right-5 h-full hidden justify-center items-center group-hover:flex">
          <IconButton
            aria-label="more"
            className="text-white rotate-90"
            onClick={handleIconClick}
          >
            <MoreVertIcon />
          </IconButton>
        </div>
      )}

      {/* Shared LongMenu component for both triggers */}
      {isCurrentUser && (
        <LongMenu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={handleClose}
          messageId={content.id}
          conversationId={convoId}
          setmessage={setmessage} // 🔁 pass it here
        />
      )}
    </div>
  );
};
export default MainChat;
