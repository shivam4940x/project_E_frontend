import MainChat from "@/components/pages/Chat/Index";
import { Chatsocket } from "@/lib/plugins/socket";
import type { Message } from "@/types/SharedProps";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  message: string;
};

const Chat = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const conversationId = pathSegments[pathSegments.length - 1];
    Chatsocket.emit("join", { conversationId });
    Chatsocket.on("joined", (data) => {
      console.log("Joined conversation:", data.conversationId);
    });
  }, []);

  const sendMessage = (msg: string) => {
    Chatsocket.emit("send", {
      content: msg,
    });
  };

  const onSubmit = (data: FormData) => {
    if (data && data.message && data.message.trim() !== "") {
      sendMessage(data.message);
      reset(); // Clear input field
    }
  };

  return (
    <div className="div">
      <div className="div">
        <main className="flex flex-col h-full py-8 w-full max-w-full overflow-hidden">
          {/* Actual chat */}
          <div className="grow overflow-hidden px-4 div max-w-full">
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
                {...register("message")}
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
