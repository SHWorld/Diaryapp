"use client"; // Next.js等でuseClient環境下の場合に付与（不要なら外してください）
import React, { useState } from "react";
import {
  Dialog,
  Portal,
  Button,
  CloseButton,
  Input,
  Textarea,
  Image,
  Box,
  Stack,
} from "@chakra-ui/react";
import { useColorModeValue } from "./color-mode";

function CreateDiaryDialog({ isOpen, onClose, postPutPage }) {
  // フォームの状態
  const [newPage, setNewPage] = useState({
    title: "",
    body: "",
    page_date: "",
    image: null,
    preview: null, // プレビュー用のBase64
  });
  // ★ ダーク/ライトで背景色を分ける　モーダル
  const modalBg = useColorModeValue("white", "gray.800");
  const modalColor = useColorModeValue("black", "white");

  // テキストや日付入力
  const handleInputChange = (e) => {
    setNewPage({
      ...newPage,
      [e.target.name]: e.target.value,
    });
  };

  // 画像ファイル選択時にプレビューを生成
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPage({
          ...newPage,
          image: file,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // フォーム送信
  const handleSubmit = (e) => {
    e.preventDefault();

    // FormDataに詰める
    const formData = new FormData();
    formData.append("title", newPage.title);
    formData.append("body", newPage.body);
    formData.append(
      "page_date",
      newPage.page_date || new Date().toISOString().split("T")[0]
    );
    if (newPage.image) {
      formData.append("image", newPage.image);
    }

    // 親の postPutPage 関数を呼ぶ
    postPutPage(formData)
      .then(() => {
        // 成功時：フォームをリセット & 閉じる
        setNewPage({
          title: "",
          body: "",
          page_date: "",
          image: null,
          preview: null,
        });
        onClose();
      })
      .catch((error) => {
        // 401なら無視（インターセプターでログイン画面へ飛ぶ）
        if (error.response?.status === 401) return;

        // それ以外のエラーは表示（必要なら setError などでUI表示もOK）
        console.error("❌ 投稿失敗:", error);
      });
  };

  return (
    // ★ Dialog.Root を「制御モード（controlled）」で使う
    <Dialog.Root
      // 親からもらった isOpen を open に設定
      open={isOpen}
      // open状態が変化したときに呼ばれるコールバック
      onOpenChange={(details) => {
        // details.open が false ＝ ダイアログが閉じられるとき
        if (!details.open) {
          onClose();
        }
      }}
    >
      {/* 
        通常は <Dialog.Trigger asChild> でトリガーボタンを置きますが、
        親コンポーネントがボタン操作で isOpen を切り替えているなら、
        ここでは Trigger を置かずに、Dialog コンポーネントだけを描画してOK
      */}

      <Portal>
        <Dialog.Backdrop
          bg="rgba(0,0,0,0.6)"
          style={{ backdropFilter: "blur(3px)" }}
        />
        <Dialog.Positioner>
          <Dialog.Content
            bg={modalBg}
            color={modalColor}
            opacity={1}
            borderRadius="md"
            boxShadow="lg"
          >
            <Dialog.CloseTrigger asChild>
              <CloseButton
                position="absolute"
                top="8px"
                right="8px"
                size="sm"
              />
            </Dialog.CloseTrigger>

            {/* Header */}
            <Dialog.Header>
              <Dialog.Title>日記を追加</Dialog.Title>
            </Dialog.Header>

            {/* Body */}
            <Dialog.Body>
              <Stack spacing={4} as="form" onSubmit={handleSubmit}>
                <Input
                  name="title"
                  value={newPage.title}
                  onChange={handleInputChange}
                  placeholder="タイトル"
                  size="lg"
                />
                <Textarea
                  name="body"
                  value={newPage.body}
                  onChange={handleInputChange}
                  placeholder="本文"
                  size="lg"
                />
                <Input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  size="lg"
                />

                {/* プレビュー画像表示 */}
                {newPage.preview && (
                  <Box textAlign="center">
                    <Image
                      src={newPage.preview}
                      alt="プレビュー"
                      boxSize="200px"
                      objectFit="cover"
                      borderRadius="md"
                      mx="auto"
                    />
                  </Box>
                )}
              </Stack>
            </Dialog.Body>

            {/* Footer */}
            <Dialog.Footer>
              {/* キャンセル (Dialog.ActionTrigger asChild で閉じる動作) */}
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">キャンセル</Button>
              </Dialog.ActionTrigger>
              {/* 送信ボタン */}
              <Button colorScheme="blue" ml={3} onClick={handleSubmit}>
                追加
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default CreateDiaryDialog;
