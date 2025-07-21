// 活動一覽頁面處理
document.addEventListener('DOMContentLoaded', function() {
    const activityList = document.getElementById('activityList');
    const loading = document.getElementById('loading');
    const emptyState = document.getElementById('emptyState');

    // 從後端 API 載入活動資料
    loadActivities();

    async function loadActivities() {
        try {
            loading.style.display = 'block';
            emptyState.classList.add('d-none');
            activityList.innerHTML = '';

            const response = await fetch('http://localhost:5000/api/activities');
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                displayActivities(result.data);
            } else {
                // 如果沒有活動資料，嘗試初始化示範資料
                await initializeSampleData();
                // 重新載入活動
                const retryResponse = await fetch('http://localhost:5000/api/activities');
                const retryResult = await retryResponse.json();
                if (retryResult.success) {
                    displayActivities(retryResult.data);
                } else {
                    showEmptyState();
                }
            }
        } catch (error) {
            console.error('載入活動資料失敗:', error);
            // 如果後端連線失敗，使用模擬資料
            loadFallbackData();
        } finally {
            loading.style.display = 'none';
        }
    }

    async function initializeSampleData() {
        try {
            await fetch('http://localhost:5000/api/init-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('初始化示範資料失敗:', error);
        }
    }

    function loadFallbackData() {
        // 模擬活動資料（當後端無法連線時使用）
        const activities = [
            {
                _id: "demo1",
                name: "暑期線上讀書會",
                description: "一起線上閱讀經典書籍，分享心得，提升自我！本活動將於暑假期間每週舉辦一次線上讀書會，邀請同學們共讀經典書籍。",
                date: "2025-08-15",
                time: "19:00-21:00",
                location: "線上會議室",
                organizer: "圖書館",
                max_participants: 50,
                current_registrations: 23,
                category: "學習",
                status: "active"
            },
            {
                _id: "demo2",
                name: "AI 程式設計體驗營",
                description: "零基礎入門，帶你認識人工智慧與程式設計的樂趣。由專業講師帶領，從零開始學習 AI 與程式設計。",
                date: "2025-09-10",
                time: "09:00-17:00",
                location: "電腦教室 A",
                organizer: "資工系",
                max_participants: 30,
                current_registrations: 28,
                category: "技術",
                status: "active"
            },
            {
                _id: "demo3",
                name: "職涯發展講座",
                description: "邀請業界講師，分享職涯規劃與面試技巧。包含模擬面試環節，助你職場順利起步。",
                date: "2025-10-05",
                time: "14:00-16:00",
                location: "國際會議廳",
                organizer: "學務處",
                max_participants: 100,
                current_registrations: 67,
                category: "職涯",
                status: "active"
            }
        ];
        displayActivities(activities);
    }

    function showEmptyState() {
        emptyState.classList.remove('d-none');
    }

    // 顯示活動列表
    function displayActivities(activities) {
        if (activities.length === 0) {
            showEmptyState();
            return;
        }

        activityList.innerHTML = activities.map(activity => {
            const progress = Math.round((activity.current_registrations / activity.max_participants) * 100);
            const isAlmostFull = progress >= 80;
            const isFull = progress >= 100;
            
            return `
                <div class="col-lg-6 mb-4">
                    <div class="card activity-card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">${activity.name}</h5>
                            <span class="activity-badge">${activity.organizer}</span>
                        </div>
                        <div class="card-body">
                            <p class="card-text">${activity.description}</p>
                            
                            <div class="activity-info mb-3">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="bi bi-calendar3 me-2"></i>
                                    <span>${activity.date} ${activity.time}</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <i class="bi bi-geo-alt me-2"></i>
                                    <span>${activity.location}</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-tag me-2"></i>
                                    <span>${activity.category || '一般活動'}</span>
                                </div>
                            </div>

                            <!-- 報名進度 -->
                            <div class="mb-3">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <small class="text-muted">報名進度</small>
                                    <small class="text-muted">${activity.current_registrations}/${activity.max_participants}</small>
                                </div>
                                <div class="progress" style="height: 8px;">
                                    <div class="progress-bar ${isFull ? 'bg-danger' : isAlmostFull ? 'bg-warning' : 'bg-success'}" 
                                         style="width: ${progress}%"></div>
                                </div>
                                ${isFull ? '<small class="text-danger">報名已滿</small>' : 
                                  isAlmostFull ? '<small class="text-warning">即將額滿</small>' : 
                                  '<small class="text-success">尚有名額</small>'}
                            </div>

                            <!-- 詳細資訊按鈕 -->
                            <button class="btn btn-outline-primary btn-sm mb-2" 
                                    onclick="toggleDetail('${activity._id}')">
                                <i class="bi bi-info-circle me-1"></i>詳細資訊
                            </button>
                            
                            <!-- 詳細資訊內容 -->
                            <div id="detail-${activity._id}" class="activity-detail" style="display: none;">
                                <hr>
                                <h6>活動詳情</h6>
                                <p class="small">${activity.description}</p>
                                <div class="row text-center">
                                    <div class="col">
                                        <strong>主辦單位</strong><br>
                                        <span class="text-muted">${activity.organizer}</span>
                                    </div>
                                    <div class="col">
                                        <strong>聯絡信箱</strong><br>
                                        <span class="text-muted">${activity.contact_email || 'contact@example.com'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <a href="register.html?activity=${activity._id}" 
                               class="btn btn-primary w-100 ${isFull ? 'disabled' : ''}">
                                ${isFull ? '已額滿' : '立即報名'}
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 切換詳細資訊顯示
    window.toggleDetail = function(activityId) {
        const detailElement = document.getElementById(`detail-${activityId}`);
        const isVisible = detailElement.style.display !== 'none';
        
        detailElement.style.display = isVisible ? 'none' : 'block';
        
        // 更新按鈕文字
        const button = document.querySelector(`button[onclick="toggleDetail('${activityId}')"]`);
        const icon = button.querySelector('i');
        const text = isVisible ? '詳細資訊' : '收起資訊';
        const iconClass = isVisible ? 'bi-info-circle' : 'bi-chevron-up';
        
        icon.className = `bi ${iconClass} me-1`;
        button.innerHTML = `<i class="${icon.className}"></i>${text}`;
    };
});
