// /* eslint-disable @typescript-eslint/no-explicit-any */
import { useUsers } from "@/hooks/useUsers";
import { Chatsocket } from "@/lib/plugins/socket";
import { Avatar } from "@mui/material";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

import type { UserObj } from "@/types/Response";
import type { Message } from "@/types/SharedProps";

interface MainChatProps {
  message: Message[];
  setmessage: Dispatch<SetStateAction<Message[]>>;
}
const MainChat = ({ message, setmessage }: MainChatProps) => {
  const [CurrentUser, setCurrentUser] = useState<UserObj | null>(null);

  const { data: user } = useUsers().useCurrentUser();

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
      {message.map((msg, i) => (
        <div
          key={i}
          className="text-white mb-2 py-2 pr-2 rounded-full flex max-w-full gap-4"
        >
          <div>
            <Avatar src="'" alt="ola" />
          </div>
          <div className="break-words">
            <div className="flex space-x-3 items-center">
              <h6 className="">{"oal"}</h6>
              <span className="font-light text-gray-200/50 text-xs">
                {msg.createdAt}
              </span>
            </div>
            <div className="">{msg.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainChat;
