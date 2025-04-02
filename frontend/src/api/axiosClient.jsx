// axiosClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
});

// レスポンスインターセプター（401を検知してログインに戻す）
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "token_not_valid"
    ) {
      // トークン削除
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // リダイレクト（URLにクエリパラメータで理由を渡す）
      window.location.href = "/login?expired=true";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
