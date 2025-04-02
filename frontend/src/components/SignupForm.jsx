import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const SignupForm = () => {
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [error, setError] = useState(""); // ❌ successは削除
  const navigate = useNavigate(); // ✅ ページ遷移用

  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // ✅ エラーリセット

    console.log("送信データ:", signupData);

    axios
      .post("http://localhost:8000/diary/register/", signupData)
      .then(() => {
        console.log("✅ サインアップ成功");
        navigate("/login"); // ✅ 登録成功後に即ログインページへ
      })
      .catch((error) => {
        console.error("❌ サインアップ失敗", error);
        setError("サインアップに失敗しました。");
      });
  };

  return (
    <Box
      maxW={useBreakpointValue({ base: "90%", md: "400px" })}
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading>サインアップ</Heading>
      {error && (
        <Text color="red.500" mb={3}>
          {error}
        </Text>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Input
            type="text"
            name="username"
            value={signupData.username}
            placeholder="ユーザー名"
            onChange={handleChange}
            size="lg"
          />
          <Input
            type="password"
            name="password"
            value={signupData.password}
            placeholder="パスワード"
            onChange={handleChange}
            size="lg"
          />
          <Input
            type="email"
            name="email"
            value={signupData.email}
            placeholder="メールアドレス"
            onChange={handleChange}
            size="lg"
          />
          <Button size="lg" type="submit">
            登録
          </Button>
        </Stack>
      </form>
      <Text mt={4} textAlign="center">
        すでにアカウントをお持ちですか？{" "}
        <Button variant="link" onClick={() => navigate("/login")}>
          ログイン
        </Button>
      </Text>
    </Box>
  );
};

export default SignupForm;
