/* eslint-disable @typescript-eslint/no-explicit-any */
import LoginForm from "@/components/auth/Login";
import { useEffect, useRef, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SignupForm from "@/components/auth/Signup";
import { animate, createScope } from "animejs";
import { Button } from "@mui/material";
const Login = () => {
  const [currentScreen, setCurrentScreen] = useState<"login" | "signup">(
    "login"
  );
  const root = useRef(null);
  const scope = useRef<any>(null);

  useEffect(() => {
    const side_side_ani = ({
      dir,
      target,
      duration = 800,
    }: {
      dir: "left" | "right";
      target: string;
      duration: number;
    }) => {
      const move = dir === "left" ? "-100%" : "0%";
      animate(target, {
        x: move,
        duration,
        ease: "outQuint",
      });
    };

    scope.current = createScope({ root }).add((self) => {
      self.add("move_ball", side_side_ani);
      self.add("move_mode", side_side_ani);
    });

    if (scope && scope.current) {
      return () => scope.current.revert();
    }
  }, []);

  const toggleScreen = () => {
    const dir = currentScreen === "login" ? "left" : "right";
    const screen = currentScreen === "login" ? "signup" : "login";
    setCurrentScreen(screen);
    scope.current.methods.move_ball({
      dir,
      target: ".ball_wrapper",
    });
    scope.current.methods.move_mode({
      dir,
      target: ".mode_bg",
    });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen h-screen bg-gray-100 dark:bg-[#06202B] "
      ref={root}
    >
      <div className="w-full max-w-4xl h-max py-4 md:mb-20 mt-10 md:h-9/12 max-h-10/12 bg-deep-blue mx-5 flex flex-col rounded-xl overflow-hidden">
        <div className="grid-cols-2 w-full relative grow overflow-hidden hidden md:flex">
          <div className="div overflow-y-scroll">
            {currentScreen === "login" && <LoginForm />}
          </div>

          <div className="div overflow-y-scroll">
            {currentScreen === "signup" && <SignupForm />}
          </div>

          {/* Hide for smol screens */}
          <div className="right-0 top-0 h-full absolute bg-deep-blue z-40 w-1/2 ball_wrapper p-4 md:block hidden">
            <div className="relative center h-full text-light-blue">
              <div>
                <div className="center mb-2">
                  <h1>
                    {currentScreen === "login" ? "welcome back" : "Welcome"}
                  </h1>
                </div>
                <div>
                  {currentScreen === "login" ? (
                    <button
                      onClick={toggleScreen}
                      className="group duration-100 text-sm flex"
                    >
                      <div className="group-hover:-translate-x-1 duration-150 ">
                        New here? Go and get an account
                      </div>
                      <div className="group-hover:translate-x-1 duration-150 ml-1">
                        <ArrowForwardIcon className="text-sm" />
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={toggleScreen}
                      className="group duration-100 text-sm flex"
                    >
                      <div className="group-hover:-translate-x-1 duration-150 mr-1">
                        <ArrowForwardIcon className="text-sm rotate-180" />
                      </div>
                      <div className="group-hover:translate-x-1 duration-150 ">
                        Already have an account? Go login There
                      </div>
                    </button>
                  )}
                </div>
              </div>
              <div className="absolute w-full center_ab -z-10 ball rounded-full bg-soft-red aspect-square"></div>
            </div>
          </div>
        </div>
        <div className="w-full grow overflow-hidden md:hidden">
          <div className="div overflow-y-scroll">
            {currentScreen === "login" ? <LoginForm /> : <SignupForm />}
          </div>
        </div>
        <div className="px-4 pt-1 md:hidden h-14 mb-2">
          <div className="bg-light-blue div relative flex rounded-xl">
            <div className="absolute w-1/2 h-full right-0 p-1 mode_bg">
              <div className="bg-deep-blue z-10 div rounded-lg"></div>
            </div>
            {["signup", "login"].map((mode) => {
              return (
                <div key={mode} className="div z-20 relative">
                  <Button
                    onClick={toggleScreen}
                    className={`text-deep-blue tracking-wider center div font-bold font-Poppins text-base bg-transparent ${
                      mode === currentScreen ? "text-light-blue" : ""
                    }`}
                  >
                    {mode}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
