import { io } from "socket.io-client";

const socket = io("http://localhost:5500", { // 서버 URL과 포트에 맞게 설정
  transports: ["websocket", "polling"], // ✅ WebSocket & Polling 사용
  reconnectionAttempts: 3, // ✅ 재연결 시도 횟수
  reconnectionDelay: 2000, // ✅ 재연결 간격 (2초)
  withCredentials: true, // ✅ CORS 문제 해결
});

export default socket;