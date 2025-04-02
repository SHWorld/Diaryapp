// components/Header.jsx
import { Flex, Spacer, Button, Heading } from "@chakra-ui/react";
import { ColorModeButton } from "./color-mode"; // ✅ あなたのColorModeボタン

const Header = ({ onLogout }) => {
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={6}
      py={4}
      bg="bgSubtle"
      color="fg"
      position="sticky"
      top={0}
      zIndex={100}
      boxShadow="sm"
    >
      <Heading size="md">📘 My Diary</Heading>
      <Flex gap={3} align="center">
        <Button onClick={onLogout} size="sm" colorScheme="red">
          ログアウト
        </Button>
        <ColorModeButton />
      </Flex>
    </Flex>
  );
};

export default Header;
