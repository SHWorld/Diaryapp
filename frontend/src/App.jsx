import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DiaryList from "./components/DiaryList";
import CreateDiary from "./components/CreateDiary";
import EditingDiary from "./components/EditingDiary";

function App() {
  const [pages, setPages] = useState([]);
  // 編集用状態変数
  const [editingPage, setEditingPage] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []); // ✅ 無限ループ防止

  const fetchPages = () => {
    axios
      .get("http://localhost:8000/diary/")
      .then((response) => {
        setPages(response.data);
      })
      .catch((error) => {
        console.error("エラー発生", error);
      });
  };

  const postPutPage = (updatedData) => {
    // ✅ ID を明示的に受け取る
    if (updatedData.id) {
      axios
        .put(`http://localhost:8000/diary/${updatedData.id}/`, updatedData) // ✅ ID を使う
        .then((response) => {
          setPages((prevPages) =>
            prevPages.map((page) =>
              page.id === updatedData.id ? response.data : page
            )
          );
          setEditingPage(null);
        })
        .catch((error) => {
          console.error("編集エラー発生", error);
        });
    } else {
      axios
        .post("http://localhost:8000/diary/", updatedData)
        .then((response) => {
          setPages((prevPages) => [...prevPages, response.data]);
        })
        .catch((error) => {
          console.error("エラー発生", error);
        });
    }
  };

  const deletePage = (id) => {
    axios
      .delete(`http://localhost:8000/diary/${id}/`)
      .then(() => {
        setPages((prevPages) => prevPages.filter((page) => page.id !== id));
      })
      .catch((error) => {
        console.error("エラー発生", error);
      });
  };

  return (
    <div>
      <CreateDiary postPutPage={postPutPage} /> {/* ✅ 関数名を修正 */}
      <DiaryList
        pages={pages}
        setEditingPage={setEditingPage}
        deletePage={deletePage}
      />
      <EditingDiary
        editingPage={editingPage}
        setEditingPage={setEditingPage}
        postPutPage={postPutPage}
      />
    </div>
  );
}

export default App;
