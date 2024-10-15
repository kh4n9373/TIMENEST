from database.mongodb import MongoManager
from flask import Flask, request, jsonify, render_template,session,abort, redirect
from utils import trigger_metadata, generate_uid, send_messange
from object.calendar import *
from chatbot import *
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests
import pathlib
from google.auth.transport import requests
from config.config_env import GOOGLE_CLIENT_ID
from datetime import datetime, timedelta
from dateutil import parser


app = Flask(__name__)


mongo_client = MongoManager("Timenest")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create-account')
def create_account_page():
    return render_template('login.html')

@app.route('/calendar')
def render_calendar():
    username = request.args.get('username', 'Guest')
    userID = mongo_client.find_one(collection_name='users',filter={'UserName':username})['userID']
    return render_template('main.html', username=username,userID=userID)
    # return render_template('main.html')


@app.route("/login", methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if mongo_client.find_one('users', {'UserName': username}):
        if mongo_client.find('users', {'UserName': username, 'Password': password}):
            record = mongo_client.find_one('users',{'UserName': username})
            trigger_metadata(record['userID'])
            userID = record['userID']
            return jsonify({"message": "Login successful","userID":userID}), 200
        else:
            return jsonify({"message": "Wrong password"}), 200
    else:
        return jsonify({"message": 'User not found, would you like to create an account?'}), 401

@app.route('/create-account', methods=['POST'])
def create_account():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    confirm_password = data.get("confirm_password")
    
    if not username or not password or not confirm_password:
        return jsonify({"error": "All fields are required"}), 400
    
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    if mongo_client.find_one('users', {"UserName": username}):
        return jsonify({"error": "Username already exists"}), 400
    userID = generate_uid(username)
    mongo_client.insert_one('users', {"userID": userID,"UserName": username, "Password": password})
    return jsonify({"message": "Account created successfully"}), 201


# @app.route('/get-user-metadata', methods=['GET'])
# def get_user_metadata():
#     try:
#         userID = request.args.get("userID")
#         print(f'GETTING {userID} information')
#         metadata = mongo_client.find_info(userID)
#         print(metadata)
#         return jsonify(metadata),200
#     except Exception as e:
#         return jsonify({'message':f'Internal server error: {e}'}), 500

@app.route('/get-user-metadata', methods=['GET'])
def get_user_metadata():
    try:
        userID = request.args.get("userID")
        print(f'GETTING {userID} information')
        metadata = mongo_client.find_info(userID)
        
        # Convert times for each task
        if 'tasks' in metadata:
            for task in metadata['tasks']:
                if 'startTime' in task:
                    start_time_utc = parser.isoparse(task['startTime'])
                    start_time_ict = start_time_utc - timedelta(hours=7)
                    task['startTime'] = start_time_ict.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
                
                if 'endTime' in task:
                    end_time_utc = parser.isoparse(task['endTime'])
                    end_time_ict = end_time_utc - timedelta(hours=7)
                    task['endTime'] = end_time_ict.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
        
        print(metadata)
        return jsonify(metadata), 200
    except Exception as e:
        return jsonify({'message':f'Internal server error: {e}'}), 500

# @app.route('/add-task',methods=['POST'])
# def add_task():
#     data = request.json
#     print(data)
#     userID = data.get("userID")
#     taskName = data.get("taskName")
#     taskDescription = data.get("taskDescription")
#     startTime = data.get("startTime")
#     endTime = data.get("endTime")
#     color = data.get("taskColor")
#     if not all([taskName, startTime, endTime]):
#         return jsonify({'error': 'Missing required fields'}), 400
#     mongo_client.insert_one('tasks',{'userID':userID,'taskName':taskName,'taskDescription':taskDescription,'startTime':startTime,'endTime':endTime,'taskcolor':color})
#     trigger_metadata(userID)
#     return jsonify({'message':'add task successfully'})
from datetime import datetime, timedelta
from dateutil import parser

@app.route('/add-task', methods=['POST'])
def add_task():
    data = request.json
    print(data)
    userID = data.get("userID")
    taskName = data.get("taskName")
    taskDescription = data.get("taskDescription")
    startTime = data.get("startTime")
    endTime = data.get("endTime")
    color = data.get("taskColor")

    if not all([taskName, startTime, endTime]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Convert startTime and endTime from UTC to ICT
    try:
        startTime_utc = parser.isoparse(startTime)
        endTime_utc = parser.isoparse(endTime)

        startTime_ict = startTime_utc + timedelta(hours=7)
        endTime_ict = endTime_utc + timedelta(hours=7)

        # Format the ICT times as strings
        startTime_ict_str = startTime_ict.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
        endTime_ict_str = endTime_ict.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

    except ValueError:
        return jsonify({'error': 'Invalid time format'}), 400

    mongo_client.insert_one('tasks', {
        'userID': userID,
        'taskName': taskName,
        'taskDescription': taskDescription,
        'startTime': startTime_ict_str,
        'endTime': endTime_ict_str,
        'taskcolor': color
    })
    
    trigger_metadata(userID)
    return jsonify({'message': 'add task successfully'})

@app.route('/delete-task',methods=['DELETE'])
def delete_task():
    data = request.json
    print(data)
    userID = data.get("userID")
    taskName = data.get("taskName")
    taskDescription = data.get("taskDescription")
    # startTime = data.get("startTime")
    # endTime = data.get("endTime")
    # color = data.get("taskColor")
    if not all([userID, taskName, taskDescription]):
        return jsonify({'error': 'Missing required fields'}), 400
    mongo_client.delete_many('tasks',{'taskName':taskName,'taskDescription':taskDescription})
    trigger_metadata(userID)
    return jsonify({'message':'delete task successfully'})


@app.route("/infer", methods=['POST'])
def get_inference():
    data = request.json
    input = data.get("input")
    userID = data.get("ID")
    print(input)
    response = chatbot_response(input,userID)
    print(response)
    return {"response": convert_to_js(response)}


@app.route('/callback', methods=['POST'])
def authenticate():
    # print('HELLO')
    token = request.json['id_token']
    # print(token)
    try:
        # print('HHH')
        # Verify the token
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        # print(idinfo)
        # Get user info
        user_id = idinfo['sub']
        # print(user_id)
        user_email = idinfo['email']
        # print(user_email)
        user_name = idinfo['name']
        # print(user_name)

        if mongo_client.find_one('users', {'UserName': user_name}):
            record = mongo_client.find_one('users',{'UserName': user_name})
            trigger_metadata(record['userID'])
            userID = record['userID']
            tieu_de = "Thank you for using Timenest"
            content = """
Welcome to Timenest, your smart task manager. Enjoy your productive day with us.
If you want to receive notification or news about Timenest, please turn on the notification in the setting.

Best regards,
CLUTCH's Back Office Team.
            """
            send_messange(tieu_de,content,user_email)

            return jsonify({"status":"success","message": "User authenticated","userID":userID,"name":user_name}), 200
        else:
            mongo_client.insert_one('users', {"userID": user_id,"UserName": user_name, "Password": 'GG'})
            trigger_metadata(user_id)
            tieu_de = "Thank you for using Timenest"
            content = """
Welcome to Timenest, your smart task manager. Enjoy your productive day with us.
If you want to receive notification or news about Timenest, please turn on the notification in the setting.

Best regards,
CLUTCH's Back Office Team.
            """
            send_messange(tieu_de,content,user_email)
            return jsonify({
                "status": "success", 
                "message": "User authenticated",
                "user_id": user_id,
                "name": user_name
            }), 200
    
            
    except ValueError:
        return jsonify({"status": "error", "message": "Invalid token"}), 400
    
    
if __name__ == '__main__':
    app.run(debug=True,port='5001',host='0.0.0.0')