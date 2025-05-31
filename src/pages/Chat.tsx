import MainChat from "@/components/pages/Chat/Index";
import Loading from "@/components/ui/Loading";
import { useChat } from "@/hooks/useChat";
import { useParticipants } from "@/hooks/useParticipants";
import useIntersectionObserver from "@/hooks/util/useIntersectionObserver";
import { Chatsocket } from "@/lib/plugins/socket";
import type { Message } from "@/types/SharedProps";

import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Button, TextField } from "@mui/material";
import { useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

type FormData = { content: string };

const Chat = () => {
  const { useInfinty } = useChat();
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { conversationId } = useParams<{ conversationId: string }>();
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
    if (!conversationId) return;

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

  const onSubmit = (data: FormData) => {
    if (data?.content?.trim()) {
      Chatsocket.emit("send", {
        content: data.content,
        conversationId,
      });
      reset();
    }
  };

  if (isLoading)
    return (
      <div className="div center">
        <div className="flex gap-3">
          <Loading /> loading...
        </div>
      </div>
    );
  if (isError) return <div>Error loading chat.</div>;

  return (
    <div className="div">
      <main className="flex flex-col h-full pb-8 w-full max-w-full">
        {/* Chat messages */}
        <div className="grow max-w-full max-h-full h-full overflow-y-scroll flex flex-col-reverse">
          {loadingParticipants ? (
            <div></div>
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

        {/* Input */}
        <div className="max-h-36 border mx-4 rounded-xl border-white/10 bg-dull-black/90 flex items-center">
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
    </div>
  );
};

export default Chat;
