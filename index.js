const express = require("express");
const http = require("http"); // 新增：HTTP 伺服器
const { Server } = require("socket.io"); // 新增：Socket.io
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// === 關鍵修改：建立 HTTP Server 並綁定 Socket.io ===
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // 允許任何來源連線 (方便開發)
    methods: ["GET", "POST"],
  },
});

// 設定檔案暫存
const upload = multer({ dest: "uploads/" });

// === Socket.io 事件監聽 ===
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // 當有人發送訊息
  socket.on("send_message", (data) => {
    // 廣播給所有人 (除了自己)
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// 測試連線用
app.get("/", (req, res) => {
  res.send("Hello! Travel Planner Backend with Socket.io is Working! 🚀");
});

// 上傳圖片 API
app.post("/api/upload-image", upload.single("image"), (req, res) => {
  const mockData = {
    dates: ["2024-05-20", "2024-05-24"],
    destinations: ["Osaka", "Kyoto"],
    flights: ["JL814", "JL815"],
    itinerary: [
      {
        day: 1,
        date: "2024-05-20",
        activities: [
          { time: "10:00", title: "抵達關西機場 (KIX)", type: "transport" },
          { time: "14:00", title: "Check-in 大阪萬豪酒店", type: "hotel" },
          { time: "18:00", title: "道頓堀吃拉麵", type: "food" },
        ],
      },
      {
        day: 2,
        date: "2024-05-21",
        activities: [
          { time: "09:00", title: "前往京都", type: "transport" },
          { time: "10:30", title: "清水寺參拜", type: "sightseeing" },
          { time: "15:00", title: "伏見稻荷大社", type: "sightseeing" },
        ],
      },
    ],
  };
  setTimeout(() => {
    res.json(mockData);
  }, 1500);
});

const PORT = process.env.PORT || 5000;
// 注意：這裡改成用 server.listen 而不是 app.listen
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
