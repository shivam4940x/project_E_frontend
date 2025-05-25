import MainChat from "@/components/pages/Chat/Index";
import { Chatsocket } from "@/lib/plugins/socket";
import type { Message } from "@/types/SharedProps";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import { Button, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

type FormData = { content: string; conversationId: string };

const Chat = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const currentConversationRef = useRef<string | null>(null);

  const { conversationId } = useParams<{ conversationId: string }>();

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    // Leave previous room
    if (
      currentConversationRef.current &&
      currentConversationRef.current !== conversationId
    ) {
      Chatsocket.emit("leave", {
        conversationId: currentConversationRef.current,
      });
    }

    // Join new room
    if (currentConversationRef.current !== conversationId) {
      Chatsocket.emit("join", { conversationId });
      currentConversationRef.current = conversationId;
    }

    Chatsocket.on("joined", (data) => {
      console.log("Joined conversation:", data.conversationId);
    });

    return () => {
      setChatMessages([]);
      Chatsocket.off("joined");
    };
  }, [conversationId]);

  const sendMessage = (msg: string) => {
    Chatsocket.emit("send", {
      content: msg,
      conversationId,
    });
  };
  const onSubmit = (data: FormData) => {
    if (data && data.content && data.content.trim() !== "") {
      sendMessage(data.content);
      reset(); // Clear input field
    }
  };

  return (
    <div className="div">
      <div className="div ">
        <main className="flex flex-col h-full pb-8 w-full max-w-full">
          {/* Actual chat */}
          <div className="grow px-4 div max-w-full max-h-full h-full overflow-y-scroll">
            <MainChat message={chatMessages} setmessage={setChatMessages} />
          </div>
          {/* Input */}
          <div className="max-h-36 border mx-4 rounded-xl border-white/10 bg-dull-black/90 flex items-ecnter">
            <div className="p-2 flex items-end h-full">
              <Button className="aspect-square h-10 min-w-0 rounded-full bg-paper-black/20 p-2">
                <AddCircleRoundedIcon className="div" />
              </Button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grow pr-4 flex justify-between"
            >
              <TextField
                {...register("content")}
                placeholder="Type your message..."
                variant="standard"
                multiline
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                  }
                }}
                minRows={1}
                maxRows={6}
                slotProps={{
                  input: {
                    disableUnderline: true,
                    autoComplete: "off",
                    spellCheck: "false",
                    className: "text-amber-50 break-words resize-none h-full",
                  },
                }}
                className="text-amber-50 w-full break-words h-full"
              />
              <div className="p-2 h-full">
                <Button
                  className="aspect-square h-10 min-w-0 rounded-full bg-paper-black/20 p-2"
                  type="submit"
                >
                  <SendRoundedIcon className="div" />
                </Button>
              </div>
            </form>
            {/* <div className="other w-20"></div> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
