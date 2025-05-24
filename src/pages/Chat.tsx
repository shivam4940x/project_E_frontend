import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import { Avatar, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  message: string;
};

const Chat = () => {
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (data.message.trim() !== "") {
      setChatMessages([...chatMessages, data.message]);
      reset(); // Clear input field
    }
  };

  return (
    <div className="div">
      <div className="div">
        <main className="flex flex-col h-full py-8 w-full max-w-full overflow-hidden">
          {/* Actual chat */}
          <div className="grow overflow-hidden px-4 div">
            <div className="flex flex-col justify-end div">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className="text-white mb-2 py-2 px-4 rounded-full  flex"
                >
                  <div>
                    <Avatar src="'" alt="ola" />
                  </div>
                  <div className="bg-white/10 break-words">{msg}</div>
                </div>
              ))}
            </div>
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
