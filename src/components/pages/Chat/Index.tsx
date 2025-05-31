// /* eslint-disable @typescript-eslint/no-explicit-any */
import { Chatsocket } from "@/lib/plugins/socket";
import { Avatar } from "@mui/material";
import {
  useEffect,
  useMemo,
  type Dispatch,
  type Ref,
  type SetStateAction,
} from "react";

import type { UserObj } from "@/types/Response";
import type { Message } from "@/types/SharedProps";
import { formatChatTimestamp, smolTimestamp } from "@/lib/other";
import LongMenu from "./MsgOptions";

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
  message,
  setmessage,
  participants,
  loadMoreRef,
  convoId,
}: MainChatProps) => {
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
        i === 0 ||
        msg.senderId !== prevMsg?.senderId ||
        timeDiff > 5 * 60 * 1000;

      if (isNewGroup && user) {
        groups.push({
          id: msg.id,
          sender: user,
          content: [
            { id: msg.id, value: msg.content, createdAt: msg.createdAt },
          ],
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
            id: msg.id,
            value: msg.content,
            createdAt: msg.createdAt,
          });
        }
      }
    }

    return groups;
  }, [message, participants]);

  useEffect(() => {
    const handler = (data: Message) => {
      setmessage((prev) => [...prev, data]);
    };

    Chatsocket.on("receive", handler);
    return () => {
      Chatsocket.off("receive", handler);
    };
  }, [setmessage]);

  return (
    <ul
      id="chatWrapper"
      className="flex flex-col justify-end min-h-full max-w-full h-max py-2"
    >
      <li className="h-5 w-full">
        <div className="div" ref={loadMoreRef}></div>
      </li>
      {groupedMessages.map((msg, greatI) => {
        const user = msg.sender;
        return (
          <li key={`${msg.id}_${greatI}`} className={"max-w-full py-2"}>
            <div className="w-full">
              {msg.content.map((m, i) => {
                const key = `${m.id}_${i}`;

                if (i == 0) {
                  return (
                    <div
                      key={key}
                      className="hover:bg-white-l/10 flex gap-x-4 pl-4 relative group"
                    >
                      <div className="mt-1 h-11 center">
                        <Avatar
                          src={msg.sender.profile.avatar}
                          alt={msg.sender.username}
                          slotProps={{
                            img: {
                              onError: (e) => {
                                (e.target as HTMLImageElement).src =
                                  "/default-avatar.png";
                              },
                            },
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
                      <div className="absolute top-0 right-5 h-full hidden justify-center items-center group-hover:flex">
                        <LongMenu messageId={m.id} conversationId={convoId} />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={key}
                      className="hover:bg-white-l/10 py-px w-full flex group relative group"
                    >
                      <div className="w-18 text-xs group-hover:opacity-100 opacity-0 text-white-l/50 h-6 center">
                        {smolTimestamp(m.createdAt)}
                      </div>
                      <div>{m.value}</div>
                      <div className="absolute top-0 right-5 h-full hidden justify-center items-center group-hover:flex">
                        <LongMenu messageId={m.id} conversationId={convoId} />
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default MainChat;
