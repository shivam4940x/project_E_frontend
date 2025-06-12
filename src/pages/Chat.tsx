/* eslint-disable @typescript-eslint/no-explicit-any */
import ChatList from "@/components/pages/Chat/ChatList";
import MainChat from "@/components/pages/Chat/Index";
import Loading from "@/components/ui/Loading";
import { useChat } from "@/hooks/useChat";
import { useParticipants } from "@/hooks/useParticipants";
import useIntersectionObserver from "@/hooks/util/useIntersectionObserver";
import { Chatsocket } from "@/lib/plugins/socket";
import type { Message } from "@/types/SharedProps";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Button, TextField } from "@mui/material";
import { animate, createScope } from "animejs";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { encryptWithConvoKey } from "@/lib/enc";

type FormData = { content: string };

const ChatLogic = ({ conversationId }: { conversationId: string }) => {
  const { useInfinity } = useChat();
  const { data: participants = [], isFetching: loadingParticipants } =
    useParticipants(conversationId);

  const currentConversationRef = useRef<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);

  const {
    data: chat,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfinity(50, conversationId);

  // Flatten chat data into state
  useEffect(() => {
    if (!chat) return;

    const newHistory = chat.pages
      .flatMap((page) => page.messages)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    setChatHistory(newHistory);
  }, [chat]);

  // Infinite scroll
  useIntersectionObserver({
    targetRef: loadMoreRef as React.RefObject<HTMLDivElement>,
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: hasNextPage && !isFetchingNextPage,
  });

  // Socket handling
  useEffect(() => {
    if (!conversationId || conversationId === "0") return;

    if (
      currentConversationRef.current &&
      currentConversationRef.current !== conversationId
    ) {
      Chatsocket.emit("leave", {
        conversationId: currentConversationRef.current,
      });
    }

    Chatsocket.emit("join", { conversationId });
    currentConversationRef.current = conversationId;

    return () => {
      Chatsocket.emit("leave", { conversationId });
      setLiveMessages([]);
      setChatHistory([]); // optional: clear history on convo switch
    };
  }, [conversationId]);

  const allMessages = [...chatHistory, ...liveMessages];

  if (isError) return <div>Error loading chat.</div>;

  return (
    <div className="grow max-w-full max-h-full h-full overflow-y-scroll flex flex-col-reverse">
      {loadingParticipants || isLoading ? (
        <div className="div center">
          <Loading />
        </div>
      ) : (
        <MainChat
          message={allMessages}
          setmessage={setLiveMessages}
          participants={participants}
          loadMoreRef={loadMoreRef}
          convoId={conversationId}
        />
      )}
    </div>
  );
};

const Chat = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigator = useNavigate();
  const root = useRef(null);
  const scope = useRef<any>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!data?.content?.trim() || !conversationId) return;

    const { encrypted, iv } = await encryptWithConvoKey(
      data.content,
      conversationId
    );

    Chatsocket.emit("send", {
      content: encrypted,
      iv, // required for decrypting
      conversationId,
    });

    reset();
  };

  useEffect(() => {
    const side_side_ani = ({
      dir,
      target,
      duration = 800,
    }: {
      dir: "in" | "out";
      target: string;
      duration: number;
    }) => {
      const move = dir === "in" ? "-100%" : "100%";
      animate(target, {
        x: move,
        duration,
        ease: "outQuint",
      });
    };

    scope.current = createScope({ root }).add((self) => {
      self.add("chat_toggle", side_side_ani);
    });

    return () => {
      if (scope.current) scope.current.revert();
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      return;
    }

    const animation = {
      dir: chatOpen ? "in" : "out",
      target: ".chat_Wrapper",
      duration: 800,
    };
    scope.current?.methods.chat_toggle(animation);
  }, [chatOpen]);

  useEffect(() => {
    setChatOpen(conversationId !== "0" && Boolean(conversationId));
  }, [conversationId]);

  return (
    <div className="div flex max-h-full py-1" ref={root}>
      <div className="border-r border-white-l/10 px-2 w-full lg:w-max lg:min-w-80">
        <ChatList />
      </div>
      <div className="absolute lg:static div top-0 right-0 translate-x-full lg:translate-x-0 chat_Wrapper bg-paper-black">
        {conversationId == "0" ? (
          <div className="div center">Open a conversation</div>
        ) : (
          <main className="flex flex-col h-full pb-4 w-full max-w-full">
            {/* Chat messages */}
            <div
              onClick={() => {
                navigator("/c/0");
                setChatOpen(false);
              }}
              className="lg:hidden fixed top-5 right-2 rounded-full bg-dull-black border w-10 h-10 flex justify-center items-center border-white-l/20 z-10"
            >
              <ArrowBackIosNewIcon className="text-white/80 text-base" />
            </div>

            <ChatLogic conversationId={conversationId as string} />

            {/* Input */}
            <div className="max-h-40 my-3 lg:my-0 border mx-4 rounded-xl border-white/10 bg-dull-black/90 flex items-center">
              <div className="p-2 flex items-end h-full">
                <Button className="aspect-square h-10 min-w-0 rounded-full bg-paper-black/20 p-2">
                  <AddCircleRoundedIcon className="div" />
                </Button>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grow pr-4 flex justify-between items-center"
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
                  id="Chat_input"
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
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default Chat;
