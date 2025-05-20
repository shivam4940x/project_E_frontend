/* eslint-disable @typescript-eslint/no-explicit-any */
import LoginForm from "@/components/auth/Login";
import { Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SignupForm from "@/components/auth/Signup";
import { animate, createScope } from "animejs";

const Login = () => {
  const [currentScreen, setCurrentScreen] = useState<"login" | "signup">(
    "login"
  );
  const root = useRef(null);
  const scope = useRef<any>(null);

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      self.add("move_ball", (dir: "left" | "right") => {
        const move = dir === "left" ? "-100%" : "0%";
        animate(".wrapper", {
          x: move,
          duration: 800, // Animation duration (1 second)
          ease: "out(4)",
        });
      });
    });

    if (scope && scope.current) {
      return () => scope.current.revert();
    }
  }, []);


  const toggleScreen = () => {
    const move = currentScreen === "login" ? "left" : "right";
    setCurrentScreen((prevScreen) => {
      const newScreen = prevScreen === "login" ? "signup" : "login";
      scope.current.methods.move_ball(move);
      return newScreen;
    });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen h-screen bg-gray-100 dark:bg-[#06202B]"
      ref={root}
    >
      <Grid
        container
        className="w-full max-w-4xl mx-4 max-h-screen mb-20 mt-10 h-9/12 bg-deep-blue relative overflow-hidden"
      >
        <Grid
          size={6}
          sx={{
            height: "100%",
            overflowY: "scroll",
          }}
        >
          <div className="h-full">
            <div className="h-full">
              {currentScreen === "login" && <LoginForm />}
            </div>
          </div>
        </Grid>
        <Grid
          size={6}
          sx={{
            height: "100%",
            overflowY: "scroll",
          }}
        >
          <div className="h-full">
            {currentScreen === "signup" && <SignupForm />}
          </div>
        </Grid>
        <div className="right-0 top-0 h-full absolute bg-deep-blue z-40 w-1/2 wrapper p-4">
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
      </Grid>
    </div>
  );
};

export default Login;
