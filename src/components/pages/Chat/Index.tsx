// /* eslint-disable @typescript-eslint/no-explicit-any */
import { useUsers } from "@/hooks/useUsers";
import { Chatsocket } from "@/lib/plugins/socket";
import { Avatar } from "@mui/material";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { UserObj } from "@/types/Response";
import type { Message } from "@/types/SharedProps";
import { formatChatTimestamp } from "@/lib/other";

interface MainChatProps {
  message: Message[];
  setmessage: Dispatch<SetStateAction<Message[]>>;
  participants: UserObj[];
}
const MainChat = ({ message, setmessage, participants }: MainChatProps) => {
  const [CurrentUser, setCurrentUser] = useState<UserObj | null>(null);

  const { data: user } = useUsers().useCurrentUser();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log(message);
  }, [message]);

  if (!CurrentUser && user) {
    setCurrentUser(user);
  }

  useEffect(() => {
    Chatsocket.on("receive", (data: Message) => {
      console.log(data);
      setmessage((prev) => [...prev, data]);
    });

    return () => {
      Chatsocket.off("receive");
    };
  }, [setmessage]);

  return (
    <div
      id="chatWrapper"
      className="flex flex-col justify-end min-h-full max-w-full h-max"
    >
      {message.map((msg, i) => {
        const user = participants.find((p) => p.id === msg.senderId);
        const isNewSender =
          i === 0 || msg.senderId !== message[i - 1]?.senderId;

        return (
          <div
            key={i}
            className={`flex max-w-full gap-x-4 ${
              isNewSender ? "mb-4" : "ml-14"
            }`}
          >
            {isNewSender && (
              <div>
                <Avatar src={user?.profile.avatar} alt={user?.username} />
              </div>
            )}
            <div className="break-words">
              {isNewSender && (
                <div className="flex space-x-3 items-center">
                  <h6>{user?.username}</h6>
                  <div className="font-light text-gray-200/50 text-xs">
                    {formatChatTimestamp(msg.createdAt)}
                  </div>
                </div>
              )}
              <div>{msg.content}</div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MainChat;
