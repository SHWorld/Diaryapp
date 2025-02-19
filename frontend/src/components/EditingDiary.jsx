import React, { useState, useEffect } from "react";

function EditingDiary({ editingPage, setEditingPage, postPutPage }) {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    page_date: "",
  });

  useEffect(() => {
    if (editingPage) {
      setFormData(editingPage); // ✅ そのまま編集データをセット
    }
  }, [editingPage]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // ✅ 入力フィールドの値を更新
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    postPutPage(formData); // ✅ そのまま送信
    setEditingPage(null);
  };

  return (
    editingPage && (
      <div>
        <h2>日記編集</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="タイトル"
          />
          <input
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            placeholder="本文"
          />
          <button type="submit">更新</button>
          <button type="button" onClick={() => setEditingPage(null)}>
            キャンセル
          </button>
        </form>
      </div>
    )
  );
}

export default EditingDiary;
