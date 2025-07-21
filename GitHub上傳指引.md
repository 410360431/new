# GitHub 上傳指引

## 步驟一：安裝 Git

### 下載安裝 Git
1. 前往 Git 官網：https://git-scm.com/download/win
2. 下載 Windows 版本的 Git
3. 執行安裝程式，使用預設設定即可

### 驗證安裝
安裝完成後，開啟新的 PowerShell 視窗，執行：
```powershell
git --version
```

## 步驟二：設定 Git 使用者資訊

```powershell
git config --global user.name "您的姓名"
git config --global user.email "您的信箱@example.com"
```

## 步驟三：初始化本地 Git 倉庫

在專案目錄中執行：
```powershell
cd c:\Users\kitty\Desktop\activity-registration
git init
git add .
git commit -m "初始提交：校園活動報名系統"
```

## 步驟四：建立 GitHub 倉庫

### 方法一：在 GitHub 網站上建立
1. 登入 GitHub：https://github.com
2. 點擊右上角的 "+" 號，選擇 "New repository"
3. 填寫倉庫資訊：
   - Repository name: `activity-registration`
   - Description: `校園活動報名系統 - 使用 Flask + MongoDB + Docker 構建的完整全端應用`
   - 選擇 Public 或 Private
   - **不要**勾選 "Add a README file"（因為我們已經有了）
4. 點擊 "Create repository"

### 方法二：使用 GitHub CLI（進階）
如果安裝了 GitHub CLI：
```powershell
gh repo create activity-registration --public --description "校園活動報名系統"
```

## 步驟五：連接遠端倉庫並上傳

替換下面的 `YOUR_USERNAME` 為您的 GitHub 使用者名稱：

```powershell
# 添加遠端倉庫
git remote add origin https://github.com/YOUR_USERNAME/activity-registration.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

## 完整操作流程

假設您的 GitHub 使用者名稱是 `your-username`：

```powershell
# 1. 進入專案目錄
cd c:\Users\kitty\Desktop\activity-registration

# 2. 初始化 Git
git init

# 3. 添加所有檔案
git add .

# 4. 第一次提交
git commit -m "初始提交：完整的校園活動報名系統"

# 5. 連接 GitHub 倉庫（記得替換使用者名稱）
git remote add origin https://github.com/your-username/activity-registration.git

# 6. 推送到 GitHub
git branch -M main
git push -u origin main
```

## 後續更新流程

日後如果要更新程式碼到 GitHub：

```powershell
# 添加修改的檔案
git add .

# 提交變更
git commit -m "描述您的修改內容"

# 推送到 GitHub
git push
```

## 疑難排解

### 如果遇到身份驗證問題
GitHub 現在需要使用 Personal Access Token 替代密碼：

1. 前往 GitHub → Settings → Developer settings → Personal access tokens
2. 生成新的 token，給予適當權限
3. 使用 token 作為密碼進行推送

### 如果遇到 SSL 證書問題
```powershell
git config --global http.sslverify false
```

## 專案亮點

您的專案包含以下特色，值得在 GitHub 上展示：

✅ **完整的全端應用**：前端 + 後端 + 資料庫  
✅ **現代化技術棧**：Docker, Flask, MongoDB, Bootstrap  
✅ **響應式設計**：適配各種裝置  
✅ **完善的文件**：README.md 包含詳細說明  
✅ **容器化部署**：Docker Compose 一鍵部署  
✅ **API 設計**：RESTful API 架構  

## 建議的倉庫標籤

在 GitHub 倉庫設定中，可以添加以下標籤：
- `flask`
- `mongodb`
- `docker`
- `bootstrap`
- `javascript`
- `web-application`
- `registration-system`
- `fullstack`

這樣可以讓其他開發者更容易找到您的專案！
