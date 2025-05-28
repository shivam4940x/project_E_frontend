// /* eslint-disable @typescript-eslint/no-explicit-any */
import { Chatsocket } from "@/lib/plugins/socket";
import { Avatar } from "@mui/material";
import { useEffect, useMemo, type Dispatch, type SetStateAction } from "react";

import type { UserObj } from "@/types/Response";
import type { Message } from "@/types/SharedProps";
import { formatChatTimestamp } from "@/lib/other";

interface MainChatProps {
  message: Message[];
  setmessage: Dispatch<SetStateAction<Message[]>>;
  participants: UserObj[];
}
interface GroupedMessage {
  id: string;
  sender: UserObj;
  content: {
    value: string;
    createdAt: string;
  }[];
  createdAt: string;
}
const MainChat = ({ message, setmessage, participants }: MainChatProps) => {
  useEffect(() => {
    const handler = (data: Message) => {
      setmessage((prev) => [...prev, data]);
    };

    Chatsocket.on("receive", handler);
    return () => {
      Chatsocket.off("receive", handler);
    };
  }, [setmessage]);

  const groupedMessages = useMemo(() => {
    const groups: GroupedMessage[] = [];

    for (let i = 0; i < message.length; i++) {
      const msg = message[i];
      const prevMsg = message[i - 1];
      const user = participants.find((p) => p.id === msg.senderId);
      const timeDiff = prevMsg
        ? new Date(msg.createdAt).getTime() -
          new Date(prevMsg.createdAt).getTime()
        : Infinity;

      const isNewGroup =
        i === 0 || msg.senderId !== prevMsg?.senderId || timeDiff > 60000;

      if (isNewGroup && user) {
        groups.push({
          id: msg.id,
          sender: user,
          content: [{ value: msg.content, createdAt: msg.createdAt }],
          createdAt: msg.createdAt,
        });
      } else if (groups.length > 0) {
        const lastGroup = groups[groups.length - 1];

        // 🧠 De-dupe safeguard
        const alreadyExists = lastGroup.content.some(
          (m) => m.createdAt === msg.createdAt && m.value === msg.content
        );

        if (!alreadyExists) {
          lastGroup.content.push({
            value: msg.content,
            createdAt: msg.createdAt,
          });
        }
      }
    }

    return groups;
  }, [message, participants]);

  return (
    <div
      id="chatWrapper"
      className="flex flex-col justify-end min-h-full max-w-full h-max py-2"
    >
      {groupedMessages.map((msg) => {
        const user = msg.sender;

        return (
          <div key={msg.id} className={"max-w-full py-2"}>
            <div className="w-full">
              {msg.content.map((m, i) => {
                const key = `${msg.id}-${m.createdAt}-${i}`;
                if (i == 0) {
                  return (
                    <div
                      key={key}
                      className="hover:bg-white-l/10 flex gap-x-4 pl-4"
                    >
                      <div className="mt-1 h-11 center">
                        <Avatar
                          src={msg.sender.profile.avatar}
                          alt={msg.sender.username}
                          sizes="40px"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/default-avatar.png";
                          }}
                        />
                      </div>

                      <div>
                        <div className="flex space-x-3 items-center">
                          <h6>{user?.username}</h6>
                          <div className="font-light text-gray-200/50 text-xs">
                            {formatChatTimestamp(msg.createdAt)}
                          </div>
                        </div>
                        <div>
                          <div className="py-px w-full ">{m.value}</div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={key}
                      className="hover:bg-white-l/10 py-px w-full flex group"
                    >
                      <div className="w-18 text-xs group-hover:opacity-100 opacity-0 text-white-l/50 h-6 center">
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          minute: "2-digit",
                          hour: "2-digit",
                          hour12: true,
                        })}
                      </div>
                      <div>{m.value}</div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MainChat;
