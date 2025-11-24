const express = require("express");
const cors = require("cors");
const multer = require("multer"); // 引入處理檔案的工具
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 設定檔案暫存
const upload = multer({ dest: "uploads/" });

// 測試連線用
app.get("/", (req, res) => {
  res.send("Hello! Travel Planner Backend is Working! 🚀");
});

// === 新增：上傳圖片並模擬 AI 分析的 API ===
app.post("/api/upload-image", upload.single("image"), (req, res) => {
  // 這裡我們假裝已經用 Python OCR 分析完了圖片
  // 直接回傳一份「模擬」的完美資料
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

  // 模擬運算需要一點時間 (1.5秒)
  setTimeout(() => {
    res.json(mockData);
  }, 1500);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
