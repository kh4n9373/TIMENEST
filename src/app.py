from database.mongodb import MongoManager
from flask import Flask, request, jsonify, render_template,session,abort, redirect
from utils import trigger_metadata, generate_uid
from object.calendar import *
from chatbot import *
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests
import pathlib
from google.auth.transport import requests
from config.config_env import GOOGLE_CLIENT_ID



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


@app.route('/get-user-metadata', methods=['GET'])
def get_user_metadata():
    try:
        userID = request.args.get("userID")
        print(f'GETTING {userID} information')
        metadata = mongo_client.find_info(userID)
        # print(metadata)
        return jsonify(metadata),200
    except Exception as e:
        return jsonify({'message':f'Internal server error: {e}'}), 500

@app.route('/add-task',methods=['POST'])
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
    mongo_client.insert_one('tasks',{'userID':userID,'taskName':taskName,'taskDescription':taskDescription,'startTime':startTime,'endTime':endTime,'taskcolor':color})
    trigger_metadata(userID)
    return jsonify({'message':'add task successfully'})


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
            return jsonify({"status":"success","message": "User authenticated","userID":userID,"name":user_name}), 200
        else:
            mongo_client.insert_one('users', {"userID": user_id,"UserName": user_name, "Password": 'GG'})
            trigger_metadata(user_id)
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