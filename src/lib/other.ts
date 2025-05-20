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
export { debounce, wait, copyText };
