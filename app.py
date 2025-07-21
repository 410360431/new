import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import logging
import json
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

# 初始化 Flask 應用
app = Flask(__name__)
CORS(app)

# 設定日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB 連接
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://admin:password123@localhost:27017/activity_registration?authSource=admin')
client = MongoClient(MONGODB_URI)
db = client.activity_registration

# 集合引用
activities_collection = db.activities
registrations_collection = db.registrations
users_collection = db.users

# 自定義 JSON 編碼器處理 ObjectId
def serialize_doc(doc):
    """序列化 MongoDB 文檔"""
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    elif isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            elif isinstance(value, (dict, list)):
                result[key] = serialize_doc(value)
            else:
                result[key] = value
        return result
    else:
        return doc

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康檢查端點"""
    try:
        # 測試資料庫連接
        db.command('ping')
        return jsonify({
            'status': 'healthy',
            'message': '後端服務運行正常',
            'database': 'connected'
        }), 200
    except Exception as e:
        logger.error(f"健康檢查失敗: {str(e)}")
        return jsonify({
            'status': 'unhealthy',
            'message': '服務異常',
            'error': str(e)
        }), 500

@app.route('/api/activities', methods=['GET'])
def get_activities():
    """取得所有活動列表"""
    try:
        activities = list(activities_collection.find())
        
        # 為每個活動計算報名人數
        for activity in activities:
            activity_id = activity['_id']
            registration_count = registrations_collection.count_documents({
                'activity_id': ObjectId(activity_id)
            })
            activity['current_registrations'] = registration_count
            activity['is_full'] = registration_count >= activity.get('max_participants', 0)
        
        return jsonify({
            'success': True,
            'data': serialize_doc(activities)
        }), 200
    except Exception as e:
        logger.error(f"取得活動列表失敗: {str(e)}")
        return jsonify({
            'success': False,
            'message': '無法取得活動資料',
            'error': str(e)
        }), 500

@app.route('/api/activities/<activity_id>', methods=['GET'])
def get_activity(activity_id):
    """取得單一活動詳情"""
    try:
        activity = activities_collection.find_one({'_id': ObjectId(activity_id)})
        if not activity:
            return jsonify({
                'success': False,
                'message': '找不到該活動'
            }), 404
        
        # 計算報名人數
        registration_count = registrations_collection.count_documents({
            'activity_id': ObjectId(activity_id)
        })
        activity['current_registrations'] = registration_count
        activity['is_full'] = registration_count >= activity.get('max_participants', 0)
        
        return jsonify({
            'success': True,
            'data': serialize_doc(activity)
        }), 200
    except Exception as e:
        logger.error(f"取得活動詳情失敗: {str(e)}")
        return jsonify({
            'success': False,
            'message': '無法取得活動詳情',
            'error': str(e)
        }), 500

@app.route('/api/activities/<activity_id>/register', methods=['POST'])
def register_activity(activity_id):
    """活動報名"""
    try:
        data = request.get_json()
        
        # 驗證必要欄位
        required_fields = ['name', 'email', 'phone', 'gender']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'缺少必要欄位: {field}'
                }), 400
        
        # 驗證活動是否存在
        activity = activities_collection.find_one({'_id': ObjectId(activity_id)})
        if not activity:
            return jsonify({
                'success': False,
                'message': '找不到該活動'
            }), 404
        
        # 檢查是否已經報名過 (同一 email)
        existing_registration = registrations_collection.find_one({
            'activity_id': ObjectId(activity_id),
            'email': data['email']
        })
        if existing_registration:
            return jsonify({
                'success': False,
                'message': '您已經報名過此活動了'
            }), 400
        
        # 檢查報名人數是否已滿
        current_count = registrations_collection.count_documents({
            'activity_id': ObjectId(activity_id)
        })
        max_participants = activity.get('max_participants', 0)
        if current_count >= max_participants:
            return jsonify({
                'success': False,
                'message': '報名人數已滿'
            }), 400
        
        # 建立報名記錄
        registration = {
            'activity_id': ObjectId(activity_id),
            'name': data['name'],
            'email': data['email'],
            'phone': data['phone'],
            'gender': data['gender'],
            'special_requirements': data.get('special_requirements', ''),
            'registration_time': datetime.now(),
            'status': 'confirmed'
        }
        
        result = registrations_collection.insert_one(registration)
        
        return jsonify({
            'success': True,
            'message': '報名成功！',
            'registration_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        logger.error(f"活動報名失敗: {str(e)}")
        return jsonify({
            'success': False,
            'message': '報名失敗，請稍後再試',
            'error': str(e)
        }), 500

@app.route('/api/registrations', methods=['GET'])
def get_registrations():
    """取得所有報名記錄（管理用）"""
    try:
        email = request.args.get('email')
        
        query = {}
        if email:
            query['email'] = email
        
        registrations = list(registrations_collection.find(query))
        
        # 補充活動資訊
        for registration in registrations:
            activity = activities_collection.find_one({
                '_id': registration['activity_id']
            })
            if activity:
                registration['activity_name'] = activity['name']
                registration['activity_date'] = activity['date']
        
        return jsonify({
            'success': True,
            'data': serialize_doc(registrations)
        }), 200
        
    except Exception as e:
        logger.error(f"取得報名記錄失敗: {str(e)}")
        return jsonify({
            'success': False,
            'message': '無法取得報名記錄',
            'error': str(e)
        }), 500

@app.route('/api/init-data', methods=['POST'])
def initialize_data():
    """初始化示範資料"""
    try:
        # 清空現有資料
        activities_collection.delete_many({})
        registrations_collection.delete_many({})
        
        # 插入示範活動
        sample_activities = [
            {
                'name': '程式設計競賽',
                'description': '展現你的程式設計能力，與同學一起挑戰有趣的程式題目！',
                'date': '2025-08-15',
                'time': '09:00-17:00',
                'location': '電腦教室 A',
                'max_participants': 30,
                'category': '競賽',
                'organizer': '資訊工程系學會',
                'contact_email': 'cs.club@example.com',
                'image_url': '/images/programming-contest.jpg',
                'status': 'active',
                'created_at': datetime.now()
            },
            {
                'name': '音樂會表演',
                'description': '學生音樂社團精彩演出，包含古典、流行、民謠等多種風格。',
                'date': '2025-09-10',
                'time': '19:00-21:00',
                'location': '學校禮堂',
                'max_participants': 200,
                'category': '表演',
                'organizer': '音樂社',
                'contact_email': 'music.club@example.com',
                'image_url': '/images/concert.jpg',
                'status': 'active',
                'created_at': datetime.now()
            },
            {
                'name': '環保淨灘活動',
                'description': '一起為地球盡一份心力，保護海洋環境，還有豐富的生態導覽！',
                'date': '2025-10-05',
                'time': '08:00-16:00',
                'location': '海邊（學校巴士接送）',
                'max_participants': 50,
                'category': '公益',
                'organizer': '環保社',
                'contact_email': 'eco.club@example.com',
                'image_url': '/images/beach-cleanup.jpg',
                'status': 'active',
                'created_at': datetime.now()
            }
        ]
        
        result = activities_collection.insert_many(sample_activities)
        
        return jsonify({
            'success': True,
            'message': f'成功初始化 {len(result.inserted_ids)} 筆活動資料',
            'activity_ids': [str(id) for id in result.inserted_ids]
        }), 201
        
    except Exception as e:
        logger.error(f"初始化資料失敗: {str(e)}")
        return jsonify({
            'success': False,
            'message': '初始化資料失敗',
            'error': str(e)
        }), 500

# 錯誤處理
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': '找不到請求的資源'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'message': '伺服器內部錯誤'
    }), 500

if __name__ == '__main__':
    logger.info("啟動校園活動報名系統後端服務...")
    app.run(host='0.0.0.0', port=5000, debug=True)
