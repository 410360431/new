# 測試腳本
Write-Host "=== 校園活動報名系統測試 ===" -ForegroundColor Green

# 測試健康檢查
Write-Host "`n1. 測試健康檢查..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET
    $healthData = $health.Content | ConvertFrom-Json
    Write-Host "✓ 健康檢查通過: $($healthData.message)" -ForegroundColor Green
}
catch {
    Write-Host "✗ 健康檢查失敗: $($_.Exception.Message)" -ForegroundColor Red
}

# 測試活動列表
Write-Host "`n2. 測試活動列表..." -ForegroundColor Yellow
try {
    $activities = Invoke-WebRequest -Uri "http://localhost:5000/api/activities" -Method GET
    $activitiesData = $activities.Content | ConvertFrom-Json
    Write-Host "✓ 成功取得 $($activitiesData.data.Count) 個活動" -ForegroundColor Green
    
    foreach ($activity in $activitiesData.data) {
        Write-Host "  - $($activity.name) (報名: $($activity.current_registrations)/$($activity.max_participants))" -ForegroundColor Cyan
    }
}
catch {
    Write-Host "✗ 取得活動列表失敗: $($_.Exception.Message)" -ForegroundColor Red
}

# 測試報名功能
Write-Host "`n3. 測試報名功能..." -ForegroundColor Yellow
if ($activitiesData -and $activitiesData.data.Count -gt 0) {
    $firstActivity = $activitiesData.data[0]
    $registrationData = @{
        name = "測試用戶"
        email = "test@example.com"
        phone = "0912345678"
        gender = "male"
        special_requirements = "無特殊需求"
    } | ConvertTo-Json
    
    try {
        $registration = Invoke-WebRequest -Uri "http://localhost:5000/api/activities/$($firstActivity._id)/register" -Method POST -Body $registrationData -ContentType "application/json"
        $regData = $registration.Content | ConvertFrom-Json
        Write-Host "✓ 報名成功: $($regData.message)" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ 報名失敗或已重複報名" -ForegroundColor Yellow
    }
}

Write-Host "`n=== 測試完成 ===" -ForegroundColor Green
Write-Host "前端頁面: file:///c:/Users/kitty/Desktop/activity-registration/frontend/index.html" -ForegroundColor Cyan
Write-Host "後端 API: http://localhost:5000" -ForegroundColor Cyan
