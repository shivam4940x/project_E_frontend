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
  },
});

export default theme;
