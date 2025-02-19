import React, { useState, useEffect } from "react";

function CreateDiary({ postPutPage }) {
  const [newPage, setNewPage] = useState({
    title: "",
    body: "",
  });

  const handleInputChange = (e) => {
    setNewPage({ ...newPage, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    postPutPage({
      ...newPage,
      page_date: new Date().toISOString().split("T")[0],
    });
    setNewPage({
      title: "",
      body: "",
    });
  };

  return (
    <div>
      <h2>日記追加</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={newPage.title}
          onChange={handleInputChange}
          placeholder="タイトル"
        />
        <input
          name="body"
          value={newPage.body}
          onChange={handleInputChange}
          placeholder="本文"
        />

        <button type="submit">追加</button>
      </form>
    </div>
  );
}

export default CreateDiary;
