import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import apiClient from "./api/axiosClient";

import { Box, Button } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "./components/color-mode"; // ✅ Chakra UI の useColorMode を利用

import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import DiaryList from "./components/DiaryList";
import CreateDiaryDialog from "./components/CreateDiaryDialog";
import EditingDiary from "./components/EditingDiary";
import Header from "./components/Header";

function App() {
  const [pages, setPages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { colorMode, toggleColorMode } = useColorMode();

  // fetchPages を useCallback でメモ化
  const fetchPages = useCallback(() => {
    console.log("✅ データ取得開始");
    apiClient
      .get("http://localhost:8000/diary/", { headers: getAuthHeaders() })
      .then((response) => {
        console.log("📥 取得データ:", response.data);
        setPages(response.data);
      })
      .catch((error) => {
        console.error("エラー発生", error);
      });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchPages();
    }
  }, [isLoggedIn, fetchPages]);

  // API通信時に認証ヘッダーを設定
  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 投稿・編集
  const postPutPage = async (updatedData) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("❌ 認証エラー");
      return Promise.reject("認証エラー");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    if (updatedData.get("id")) {
      return apiClient
        .put(
          `http://localhost:8000/diary/${updatedData.get("id")}/`,
          updatedData,
          { headers }
        )
        .then((response) => {
          console.log("✅ 更新成功", response);
          return fetchPages();
        })
        .catch((error) => {
          console.error("❌ 更新エラー", error);
          return Promise.reject(error);
        });
    } else {
      return apiClient
        .post("http://localhost:8000/diary/", updatedData, { headers })
        .then((response) => {
          console.log("✅ 投稿成功", response);
          return fetchPages();
        })
        .catch((error) => {
          console.error("❌ 投稿エラー", error);
          return Promise.reject(error);
        });
    }
  };

  // 削除
  const deletePage = (id) => {
    if (!localStorage.getItem("access_token")) {
      console.error("❌認証エラー");
      return;
    }
    apiClient
      .delete(`http://localhost:8000/diary/${id}/`, {
        headers: getAuthHeaders(),
      })
      .then(() => {
        fetchPages();
      })
      .catch((error) => {
        console.error("エラー発生", error);
      });
  };

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
  };

  return (
    <Box>
      <Router>
        {/* ✅ ダークモード切り替えボタン */}
        <Button
          onClick={toggleColorMode}
          position="absolute"
          top="10px"
          right="10px"
          colorScheme="blue"
        >
          {colorMode === "light" ? "🌙 " : "☀️ "}
        </Button>
        {isLoggedIn && <Header onLogout={handleLogout} />}
        <Routes>
          {/* 認証していなければログインページへ */}
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/diary" /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={<LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />}
          />
          <Route path="/signup" element={<SignupForm />} />

          {/* =========================
              日記一覧画面（ここでモーダルも呼び出す）
          ==========================*/}
          <Route
            path="/diary"
            element={
              isLoggedIn ? (
                <>
                  {/* ★ 「日記追加」ボタン -> モーダルを開く */}
                  <Button
                    colorScheme="teal"
                    my={4}
                    onClick={() => setIsCreateOpen(true)}
                  >
                    日記を追加
                  </Button>

                  {/* ★ 作成用モーダル */}
                  <CreateDiaryDialog
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    postPutPage={postPutPage}
                  />

                  {/* ★ 一覧表示 */}
                  <DiaryList pages={pages} deletePage={deletePage} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/diary/edit/:id"
            element={
              isLoggedIn ? (
                <EditingDiary
                  postPutPage={postPutPage}
                  fetchPages={fetchPages}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
