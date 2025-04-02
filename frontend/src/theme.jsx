import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: "#3182CE", // メインカラー（青）
    secondary: "#2D3748", // サブカラー（グレー）
    background: "#F7FAFC", // 背景色
    text: "#1A202C", // 文字色（黒に近いグレー）
  },
  fonts: {
    body: "Arial, sans-serif",
    heading: "Georgia, serif",
  },
  styles: {
    global: {
      body: {
        bg: "background",
        color: "text",
      },
    },
  },
});

export default theme;
