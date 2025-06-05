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
import { useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

type FormData = { content: string };

const ChatLogic = ({ conversationId }: { conversationId: string }) => {
  const { useInfinty } = useChat();

  const { data: participants = [], isFetching: loadingParticipants } =
    useParticipants(conversationId);

  const currentConversationRef = useRef<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [liveMessages, setLiveMessages] = useState<Message[]>([]);

  const {
    data: chat,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfinty(50, conversationId);

  const historicalMessages = useMemo(
    () => chat?.pages.flatMap((page) => page.messages).reverse() ?? [],
    [chat]
  );

  const allMessages = useMemo(() => {
    const merged = [...historicalMessages, ...liveMessages];

    const uniqueMap = new Map<string, Message>();
    for (const msg of merged) {
      const key = `${msg.id}-${msg.createdAt}`;
      uniqueMap.set(key, msg);
    }

    return Array.from(uniqueMap.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [historicalMessages, liveMessages]);

  useIntersectionObserver({
    targetRef: loadMoreRef as React.RefObject<HTMLDivElement>,
    onIntersect: () => {
      console.log("interacting");
      if (hasNextPage && !isFetchingNextPage) {
        console.log("fetching next page");
        fetchNextPage();
      }
    },
    enabled: hasNextPage && !isFetchingNextPage,
  });

  useEffect(() => {
    if (!conversationId || conversationId == "0") return;

    // Leave old room
    if (
      currentConversationRef.current &&
      currentConversationRef.current !== conversationId
    ) {
      Chatsocket.emit("leave", {
        conversationId: currentConversationRef.current,
      });
    }

    // Join new room
    Chatsocket.emit("join", { conversationId });
    currentConversationRef.current = conversationId;

    return () => {
      Chatsocket.emit("leave", { conversationId });
      setLiveMessages([]);
    };
  }, [conversationId]);

  if (isError) return <div>Error loading chat.</div>;
  return (
    <div className="grow max-w-full max-h-full h-full overflow-y-scroll flex flex-col-reverse">
      {loadingParticipants || isLoading ? (
        <div className="div center">
          <Loading />
        </div>
      ) : (
        <>
          <MainChat
            message={allMessages}
            setmessage={setLiveMessages}
            participants={participants}
            loadMoreRef={loadMoreRef}
            convoId={conversationId as string}
          />
        </>
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

  const onSubmit = (data: FormData) => {
    if (data?.content?.trim()) {
      Chatsocket.emit("send", {
        content: data.content,
        conversationId,
      });
      reset();
    }
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
      <div className="border-r border-white-l/10 px-2 w-full lg:w-max">
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
