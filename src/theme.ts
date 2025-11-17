import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#00f0f0",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // :root相当の設定
        ":root": {
          fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
          color: "rgba(255, 255, 255, 0.87)",
          backgroundColor: "#242424",

          fontSynthesis: "none",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        // body要素の設定
        body: {
          margin: 0,
          minWidth: "320px",
          minHeight: "100vh",
          lineHeight: 1.5,
          fontWeight: 400,
        },
      },
    },
  },
});
