"use client";

import {
  ClientOnly,
  IconButton,
  Skeleton,
  createSystem,
  defaultConfig,
  defineConfig,
  ChakraProvider,
} from "@chakra-ui/react";
import { ThemeProvider, useTheme } from "next-themes";
import * as React from "react";
import { LuMoon, LuSun } from "react-icons/lu";

// ✅ Chakra UI v3 用のテーマ設定
const customConfig = defineConfig({
  theme: {
    // 1. カスタムカラー（ブランドカラーなど）の定義
    tokens: {
      colors: {
        brand: {
          50: { value: "#ffe5f0" },
          100: { value: "#ffb3c8" },
          200: { value: "#ff80a1" },
          300: { value: "#ff4d79" },
          400: { value: "#ff1a52" },
          500: { value: "#e6003e" }, // メインのブランド色（暗めの赤系）
          600: { value: "#b40030" },
          700: { value: "#820023" },
          800: { value: "#500015" },
          900: { value: "#210008" },
        },
      },
    },
    // customConfig内での例
    semanticTokens: {
      colors: {
        bg: {
          value: { _light: "{colors.white}", _dark: "#141414" }, // ダーク時はやや明るめの黒
        },
        bgSubtle: {
          value: { _light: "{colors.gray.50}", _dark: "#1a1a1a" }, // ダーク時のサブ背景も調整
        },
        bgMuted: {
          value: { _light: "{colors.gray.100}", _dark: "#262626" }, // ダーク時のさらに暗い背景
        },
        fg: {
          value: { _light: "{colors.black}", _dark: "#999999" }, // ダーク時は明るめの灰色文字
        },
        fgMuted: {
          value: { _light: "{colors.gray.600}", _dark: "#a3a3a3" }, // ダーク時の淡い文字色調整
        },
        // 他にもborderやaccentなど必要に応じて定義
      },
    },
  },
});

// ✅ `createSystem` を適用
const system = createSystem(defaultConfig, customConfig);
console.log("✅ Chakra UI カスタムテーマ適用:", system);

export function ColorModeProvider({ children }) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </ThemeProvider>
  );
}

// ✅ ダーク/ライトモードの切り替え
export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return {
    colorMode: resolvedTheme,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

// ✅ `useColorModeValue` を修正
export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

// ✅ アイコン切り替え
export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? <LuMoon /> : <LuSun />;
}

// ✅ ダークモード切り替えボタン
export const ColorModeButton = React.forwardRef(function ColorModeButton(
  props,
  ref
) {
  const { toggleColorMode } = useColorMode();
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: "6",
            height: "6",
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  );
});
