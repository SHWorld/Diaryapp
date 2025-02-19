import React from "react";

function DiaryList({ pages, setEditingPage, deletePage }) {
  const handleEdit = (page) => {
    setEditingPage(page);
  };
  return (
    <div>
      <h2>ページ一覧</h2>
      {pages.length === 0 ? (
        <p>日記はありません</p>
      ) : (
        <ul>
          {pages.map((page) => (
            <li key={page.id}>
              <p>タイトル：{page.title}</p>
              <p>本文: {page.body}</p>
              <p>日付: {page.page_date}</p>
              <button onClick={() => handleEdit(page)}>編集</button>
              <button
                onClick={() => {
                  if (window.confirm("本当に削除しますか？")) {
                    // ✅ 削除前の確認
                    deletePage(page.id);
                  }
                }}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DiaryList;
