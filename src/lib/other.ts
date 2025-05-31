/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from "react-toastify";

const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T {
  let timer: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  } as T;
}
const copyText = async (id: string) => {
  await navigator.clipboard
    .writeText(id)
    .then(() => {
      toast.success("Id copied to clipboard");
    })
    .catch(() => {
      toast.error("Error copying text");
    });
};

function timeAgo(dateString: string): string {
  const now = new Date();
  const updated = new Date(dateString);
  const diff = Math.floor((now.getTime() - updated.getTime()) / 1000);

  const times = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  for (const t of times) {
    const value = Math.floor(diff / t.seconds);
    if (value >= 1) {
      return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
        -value,
        t.unit as Intl.RelativeTimeFormatUnit
      );
    }
  }

  return "just now";
}
const formatChatTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today  ${time}`;
  if (isYesterday) return "Yesterday:  " + time;

  const datePart = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;

  return `${datePart}, ${time}`;
};
const smolTimestamp = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], {
    minute: "2-digit",
    hour: "2-digit",
    hour12: true,
  });
};
const onError = (error: any) => {
  // only for react query errors
  const msg: string = error?.response?.data?.message as string;
  if (msg) {
    toast.error(msg);
  } else {
    toast.error("An unknown error occurred");
  }
};
export {
  debounce,
  wait,
  copyText,
  timeAgo,
  formatChatTimestamp,
  smolTimestamp,
  onError,
};
