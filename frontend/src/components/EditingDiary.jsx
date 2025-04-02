import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  Textarea,
  Image,
  Stack,
  Heading,
} from "@chakra-ui/react";
import apiClient from "../api/axiosClient";

function EditingDiary({ postPutPage }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    page_date: "",
    image: null,
    preview: "",
  });

  // ✅ データ取得（ページ読み込み時に API からデータを取得）
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("❌ トークンなし（認証エラー）");
      return;
    }

    apiClient
      .get(`http://localhost:8000/diary/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFormData({
          title: response.data.title || "",
          body: response.data.body || "",
          page_date: response.data.page_date || "",
          image: null, // 新しい画像をアップロードするまで null
          preview: response.data.image || "", // 既存の画像をプレビュー
        });
      })
      .catch((error) => {
        console.error("❌ データ取得エラー", error);
      });
  }, [id]);

  // ✅ 入力欄の変更を state に反映
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ 画像選択時の処理（プレビュー表示 & state 更新）
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ 更新ボタンを押したときの処理
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("id", id);
    data.append("title", formData.title);
    data.append("body", formData.body);
    data.append("page_date", formData.page_date);

    if (formData.image) {
      data.append("image", formData.image);
    }

    postPutPage(data)
      .then(() => {
        navigate("/diary");
      })
      .catch((error) => {
        console.error("❌ 更新エラー", error);
      });
  };

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt={8}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
    >
      {/* ✅ タイトル */}
      <Heading as="h2" size="lg" mb={4} textAlign="center">
        日記編集 (ID: {id})
      </Heading>

      {/* ✅ フォーム */}
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* タイトル */}
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="タイトル"
            size="lg"
          />

          {/* 本文 */}
          <Textarea
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            placeholder="本文"
            size="lg"
          />

          {/* 日付 */}
          <Input
            type="date"
            name="page_date"
            value={formData.page_date}
            onChange={handleInputChange}
            size="lg"
          />

          {/* 画像選択 */}
          <Input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            size="lg"
            p={2}
          />

          {/* ✅ 画像プレビュー */}
          {formData.preview && (
            <Box textAlign="center">
              <Image
                src={formData.preview}
                alt="プレビュー"
                boxSize="200px"
                objectFit="cover"
                borderRadius="md"
                mx="auto"
              />
            </Box>
          )}

          {/* ✅ ボタン */}
          <Stack direction="row" justify="center" spacing={4}>
            <Button type="submit" colorScheme="blue" size="lg">
              更新
            </Button>
            <Button
              onClick={() => navigate("/diary/")}
              colorScheme="gray"
              size="lg"
            >
              キャンセル
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}

export default EditingDiary;
