import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ ページ遷移用
import axios from "axios";
import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const navigate = useNavigate(); // ✅ ページ遷移用

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const expired = params.get("expired");

  const [error, setError] = useState(
    expired ? "ログイン切れです。再度ログインしてください。" : ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/token/", {
        username,
        password,
      });

      // ✅ ローカルストレージにトークンを保存
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // ✅ ログイン成功後、onLoginSuccessを実行
      onLoginSuccess();
      navigate("/diary"); // ✅ ログイン成功したら日記ページへ移動
    } catch (err) {
      setError("ログインに失敗しました。");
    }
  };

  return (
    <Box
      maxW={useBreakpointValue({ base: "90%", md: "400px" })}
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      baxShadow="md"
    >
      <Heading as="h2" size="lg" textAlign="center" mb={4}>
        ログイン
      </Heading>
      {error && (
        <Text color="red.500" mb={3}>
          {error}
        </Text>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Input
            type="text"
            placeholder="ユーザー名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="lg"
          />
          <Input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
          />
          <Button type="submit" size="lg" colorScheme="blue">
            ログイン
          </Button>
        </Stack>
      </form>

      {/* ✅ サインアップページへのリンク */}
      <Text mt={4} textAlign="center">
        アカウントをお持ちでないですか？{" "}
        <Button variant="link" onClick={() => navigate("/signup")}>
          サインアップ
        </Button>
      </Text>
    </Box>
  );
};

export default LoginForm;
