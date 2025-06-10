// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        text: {
          color: "var(--color-white)",
          fontWeight: 400,
          textTransform: "capitalize",
          "&:hover": {
            backgroundColor: "rgba(100, 105, 123, 0.21)",
          },
        },
        contained: {
          textTransform: "capitalize",
          boxShadow: "none",
          ":hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
          // Still no border on hover
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent", // Your custom focus color
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "#fff",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#BBFBFF", // Tailwind blue-500
          },
          "&:before": {
            borderBottomColor: "rgba(187, 251, 255, 0.5)",
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#a29f99",
          "&.Mui-focused": {
            color: "#BBFBFF",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: "var(--color-white)", // text color of selected value
        },
        icon: {
          color: "#a29f99", // dropdown arrow color
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "var(--color-white)", // ensures input text is white too
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.05)", // semi-transparent white
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)", // optional border
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)", // subtle depth

          color: "var(--color-white)", // selected value color
        },
      },
    },
  },
});

export default theme;
