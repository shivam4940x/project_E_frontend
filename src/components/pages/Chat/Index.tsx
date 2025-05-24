/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chatsocket } from "@/lib/plugins/socket";
import type { Message } from "@/types/SharedProps";
import { Avatar } from "@mui/material";
import { useEffect, type Dispatch, type SetStateAction } from "react";

interface MainChatProps {
  message: Message[];
  setmessage: Dispatch<SetStateAction<Message[]>>;
}
const MainChat = ({ message, setmessage }: MainChatProps) => {
  useEffect(() => {
    Chatsocket.on("receive", (data: any) => {
      console.log(data);
      const x: Message = {
        sendAt: "send at",
        sender: {
          id: "id",
          avatar: "av",
          name: "name",
        },
        content: data.data,
      };
      setmessage((prev) => [...prev, x]);
    });

    return () => {
      Chatsocket.off("receive");
    };
  }, [setmessage]);

  return (
    <div className="flex flex-col justify-end div max-w-full">
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
              <h6 className="">{msg.sender.name}</h6>
              <span className="font-light text-gray-200/50 text-xs">
                {msg.sendAt}
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
