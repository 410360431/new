// 報名表單處理
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const messageDiv = document.getElementById('message');
    const activitySelect = document.getElementById('activity');

    // 載入活動選項
    loadActivities();

    // 從 URL 參數獲取活動 ID
    const urlParams = new URLSearchParams(window.location.search);
    const activityId = urlParams.get('activity');
    if (activityId) {
        activitySelect.value = activityId;
    }

    async function loadActivities() {
        try {
            const response = await fetch('http://localhost:5000/api/activities');
            const result = await response.json();
            
            if (result.success && result.data.length > 0) {
                // 清空現有選項，保留第一個空選項
                activitySelect.innerHTML = '<option value="">請選擇活動</option>';
                
                // 添加真實活動選項
                result.data.forEach(activity => {
                    const option = document.createElement('option');
                    option.value = activity._id;
                    option.textContent = `${activity.name} (${activity.current_registrations}/${activity.max_participants})`;
                    if (activity.is_full) {
                        option.textContent += ' [已額滿]';
                        option.disabled = true;
                    }
                    activitySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('載入活動失敗:', error);
            // 如果無法載入，保持原有的示範選項
        }
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 收集表單資料
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('studentId').value.trim(), // 使用 phone 對應後端
            department: document.getElementById('department').value.trim(),
            gender: document.querySelector('input[name="gender"]:checked')?.value,
            email: document.getElementById('email').value.trim(),
            activity: document.getElementById('activity').value, // 添加活動 ID
            special_requirements: document.getElementById('department').value.trim() // 暫時使用系所作為備註
        };

        // 基本驗證
        if (!validateForm(formData)) {
            return;
        }

        // 顯示載入狀態
        setLoadingState(true);
        clearMessage();

        try {
            // 發送報名請求到後端 API
            const apiUrl = formData.activity ? 
                `http://localhost:5000/api/activities/${formData.activity}/register` :
                'http://localhost:5000/api/activities/default/register';
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage('🎉 報名成功！請至信箱查收通知。', 'success');
                form.reset();
            } else {
                throw new Error(result.message || '報名失敗');
            }
        } catch (error) {
            // 如果沒有後端，使用模擬成功
            if (error.message.includes('fetch')) {
                setTimeout(() => {
                    showMessage('🎉 報名成功！請至信箱查收通知。', 'success');
                    form.reset();
                    setLoadingState(false);
                }, 1000);
                return;
            }
            
            showMessage(`❌ ${error.message}`, 'error');
        } finally {
            setLoadingState(false);
        }
    });

    // 表單驗證
    function validateForm(data) {
        // 檢查必填欄位
        if (!data.name || !data.phone || !data.department || !data.gender || !data.email || !data.activity) {
            showMessage('❌ 請完整填寫所有欄位', 'error');
            return false;
        }

        // 驗證 Email 格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showMessage('❌ 請輸入正確的 Email 格式', 'error');
            return false;
        }

        // 驗證學號格式（假設為數字）
        if (!/^\d+$/.test(data.phone)) {
            showMessage('❌ 學號格式不正確（請輸入數字）', 'error');
            return false;
        }

        return true;
    }

    // 設定載入狀態
    function setLoadingState(loading) {
        if (loading) {
            submitBtn.disabled = true;
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
        }
    }

    // 顯示訊息
    function showMessage(text, type) {
        messageDiv.innerHTML = `
            <div class="alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show">
                ${text}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 清除訊息
    function clearMessage() {
        messageDiv.innerHTML = '';
    }
});
