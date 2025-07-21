import React, { useState, useEffect } from 'react'
import { activityService, Activity } from '../services/api'

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      const data = await activityService.getAllActivities()
      setActivities(data)
    } catch (error) {
      console.error('載入活動失敗:', error)
    }
  }

  const toggleDetail = (activityId: string) => {
    setSelectedActivity(selectedActivity === activityId ? null : activityId)
  }

  const navigateToRegister = (activityId: string) => {
    window.location.href = `/register?activity=${activityId}`
  }

  return (
    <div className="container">
      <h1>活動一覽</h1>
      <div className="activity-list">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className={`activity-item ${selectedActivity === activity.id ? 'active' : ''}`}
          >
            <div className="activity-item-title">{activity.title}</div>
            <div className="activity-item-desc">{activity.desc}</div>
            <button 
              className="activity-item-btn" 
              onClick={() => toggleDetail(activity.id)}
            >
              查看介紹
            </button>
            <button 
              className="activity-item-btn" 
              style={{background: '#64748b'}}
              onClick={() => navigateToRegister(activity.id)}
            >
              立即報名
            </button>
            
            {selectedActivity === activity.id && (
              <div className="activity-detail-inline">
                <button 
                  className="close-detail-inline" 
                  onClick={() => setSelectedActivity(null)}
                >
                  ×
                </button>
                <div><strong>{activity.title}</strong></div>
                <div style={{marginTop: '0.5rem'}}>{activity.detail}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Activities
