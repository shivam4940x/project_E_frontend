import React, { useState, useEffect } from "react";

const Error404: React.FC = () => {
  const [theme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.style.setProperty("--bg-color", "#050505");
      root.style.setProperty("--text-color", "#fff");
    } else {
      root.style.setProperty("--bg-color", "#fff");
      root.style.setProperty("--text-color", "#000");
    }
  }, [theme]);



  return (
    <main
      className="min-h-screen flex items-center justify-center text-center font-[Fira_Sans,sans-serif]"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      <style>
        {`
          @keyframes movePupil {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-10px, -10px); }
            50% { transform: translate(10px, 10px); }
            75% { transform: translate(-10px, 10px); }
          }
        `}
      </style>

 

      <div className="flex flex-col gap-8 items-center">
        {/* Eyes */}
        <div className="flex gap-1 justify-center">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="w-20 h-20 bg-yellow-400 rounded-full grid place-items-center"
            >
              <div
                className="w-[30px] h-[30px] bg-black rounded-full"
                style={{
                  animation: "movePupil 2s ease-in-out infinite",
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-[36px] sm:text-[30px] font-medium text-yellow-400 capitalize">
            Looks like you're lost
          </h1>
          <p className="mt-2 text-[26px] sm:text-[22px] font-extralight">
            404 error
          </p>
        </div>

        {/* Button */}
        <a
          href="/dashboard"
          className="text-inherit no-underline border border-yellow-400 text-[18px] sm:text-[16px] font-extralight px-6 py-3 sm:px-5 sm:py-3 rounded-xl shadow-[0px_7px_0px_-2px_#faca2e] transition-all duration-300 hover:bg-yellow-400 hover:text-white hover:shadow-none capitalize"
        >
          back to home
        </a>
      </div>
    </main>
  );
};

export default Error404;
