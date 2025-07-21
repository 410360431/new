# 校園活動報名系統

一個完整的校園活動報名系統，使用現代 Web 技術構建，支援活動管理、線上報名和即時狀態更新。

## 🌟 專案特色

- **前後端分離架構**：前端使用 HTML5 + Bootstrap 5，後端使用 Python Flask
- **容器化部署**：使用 Docker Compose 一鍵部署
- **響應式設計**：完美適配桌面和行動裝置
- **即時資料更新**：動態顯示報名狀況和活動資訊
- **完整的 API 設計**：RESTful API 支援所有功能

## 🏗️ 技術架構

### 前端技術
- **HTML5 + CSS3**: 現代化網頁結構
- **Bootstrap 5**: 響應式 UI 框架
- **Vanilla JavaScript**: 原生 JS，無複雜依賴
- **Bootstrap Icons**: 豐富的圖示庫

### 後端技術
- **Python Flask**: 輕量級 Web 框架
- **MongoDB**: NoSQL 文件型資料庫
- **PyMongo**: MongoDB Python 驅動程式
- **Flask-CORS**: 跨域資源共享支援

### 部署與維運
- **Docker**: 容器化應用程式
- **Docker Compose**: 多服務編排
- **MongoDB**: 資料持久化儲存

## 📁 專案結構

```
activity-registration/
├── frontend/                 # 前端文件
│   ├── index.html            # 首頁
│   ├── activities.html       # 活動一覽
│   ├── register.html         # 報名表單
│   ├── images/               # 圖片資源
│   ├── js/                   # JavaScript 文件
│   └── styles/               # CSS 樣式
├── backend/                  # 後端 API
│   ├── app.py               # Flask 主應用
│   ├── requirements.txt     # Python 依賴
│   ├── Dockerfile           # 後端容器配置
│   └── .env                 # 環境變數
├── mongodb/                  # 資料庫
│   └── init/                # 初始化腳本
└── docker-compose.yml       # Docker Compose 配置
```

## 🚀 快速開始

### 1. 前置需求
- Docker Desktop
- Git (可選)

### 2. 啟動系統

在專案根目錄執行以下命令：

```bash
# 啟動所有服務（資料庫 + 後端 API）
docker-compose up -d

# 查看服務狀態
docker-compose ps

# 查看日誌
docker-compose logs -f
```

### 3. 訪問系統

- **前端頁面**: 直接用瀏覽器打開 `frontend/index.html`
- **後端 API**: http://localhost:5000
- **MongoDB**: localhost:27017

### 4. 初始化示範資料

後端啟動後，會自動初始化示範活動資料。您也可以手動觸發：

```bash
curl -X POST http://localhost:5000/api/init-data
```

## 📖 API 文件

### 健康檢查
- `GET /api/health` - 檢查服務狀態

### 活動管理
- `GET /api/activities` - 取得所有活動
- `GET /api/activities/{id}` - 取得單一活動詳情

### 報名功能
- `POST /api/activities/{id}/register` - 報名活動
- `GET /api/registrations` - 查詢報名記錄

### 報名 API 範例

```json
POST /api/activities/{activity_id}/register
Content-Type: application/json

{
  "name": "張小明",
  "email": "xiaoming@example.com",
  "phone": "0912345678",
  "gender": "male",
  "special_requirements": "無特殊需求"
}
```

## 🛠️ 開發模式

### 後端開發
如果要修改後端代碼，可以在本地運行：

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 資料庫管理
連接到 MongoDB：

```bash
# 使用 MongoDB Compass 或命令行
mongo mongodb://admin:password123@localhost:27017/activity_registration?authSource=admin
```

## 🧪 測試功能

### 1. 瀏覽活動
1. 打開 `frontend/index.html`
2. 點擊「瀏覽活動」
3. 查看活動列表和詳情

### 2. 報名活動
1. 在活動列表頁面點擊「立即報名」
2. 填寫報名表單
3. 提交並查看結果

### 3. API 測試
```bash
# 檢查健康狀態
curl http://localhost:5000/api/health

# 取得活動列表
curl http://localhost:5000/api/activities

# 報名活動 (替換 {activity_id})
curl -X POST http://localhost:5000/api/activities/{activity_id}/register \
  -H "Content-Type: application/json" \
  -d '{"name":"測試用戶","email":"test@example.com","phone":"0912345678","gender":"male"}'
```

## 🗄️ 資料庫設計

### Activities 集合
```javascript
{
  _id: ObjectId,
  name: String,           // 活動名稱
  description: String,    // 活動描述
  date: String,          // 活動日期
  time: String,          // 活動時間
  location: String,      // 活動地點
  max_participants: Number, // 最大參與人數
  organizer: String,     // 主辦單位
  category: String,      // 活動類別
  status: String,        // 活動狀態
  created_at: Date
}
```

### Registrations 集合
```javascript
{
  _id: ObjectId,
  activity_id: ObjectId,  // 活動 ID
  name: String,          // 報名者姓名
  email: String,         // 電子郵件
  phone: String,         // 電話號碼
  gender: String,        // 性別
  special_requirements: String, // 特殊需求
  registration_time: Date,     // 報名時間
  status: String              // 報名狀態
}
```

## 🔧 故障排除

### 常見問題

1. **Docker 服務無法啟動**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

2. **無法連接資料庫**
   - 檢查 MongoDB 容器是否正常運行
   - 確認端口 27017 沒有被佔用

3. **前端無法連接後端**
   - 確認後端服務在 http://localhost:5000 運行
   - 檢查瀏覽器 CORS 設定

4. **清理環境**
   ```bash
   docker-compose down -v  # 刪除數據卷
   docker system prune     # 清理無用容器
   ```

## 📞 聯絡資訊

如有問題或建議，請聯絡開發團隊。

---

**版本**: 1.0.0  
**更新日期**: 2025年7月21日
