import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(130, 215, 190)",
      light: "rgb(140, 225, 200)",
      dark: "rgb(100, 185, 160)",
    },
    secondary: {
      light: "rgb(240, 220, 180)",
      main: "rgb(225, 206, 167)",
      dark: "rgb(210, 186, 147)",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // :root相当の設定
        ":root": {
          fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
          color: "rgb(33, 33, 33)",
          backgroundColor: "rgb(250, 250, 250)",

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
          backgroundColor: "rgb(250, 250, 250)",
        },
      },
    },
  },
});
