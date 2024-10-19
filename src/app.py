from database.mongodb import MongoManager
from flask import Flask, request, jsonify, render_template,session,abort, redirect
from flask_socketio import SocketIO
# from flask_sse import sse
# from flask_cors import CORS
from utils import trigger_metadata, generate_uid, send_messange,convert_to_js
from object.calendar import *
from chatbot import *
from google.oauth2 import id_token
from google.auth.transport import requests
from config.config_env import GOOGLE_CLIENT_ID
from datetime import timedelta
from dateutil import parser
import os
from pydantic import BaseModel
from langchain.memory import ConversationBufferMemory
from utils import convert_to_js,trigger_metadata
import re
from config.config_env import TOGETHER_API_KEY,PLAY_HT_USER_ID,PLAY_HT_API_KEY
from datetime import timedelta
from dateutil import parser
import speech_recognition as sr
from pyht import Client
from pyht.client import TTSOptions
from dotenv import load_dotenv
import io
mongo_client = MongoManager("Timenest")


# memory = ConversationBufferMemory(
#     return_messages=True,
#     k=2
# )

# userID = ""


class Prompt(BaseModel):
    input: str
# client = OpenAI(api_key=TOGETHER_API_KEY, base_url='https://api.together.xyz/v1')

speech_client = Client(
    user_id=PLAY_HT_USER_ID,
    api_key=PLAY_HT_API_KEY,
)

def recognize_speech_from_microphone():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Say something!")
        audio = recognizer.listen(source)
        try:
            text = recognizer.recognize_google(audio)
            print(f"{text}")
            return text
        except sr.UnknownValueError:
            return "Google Speech Recognition could not understand audio"
        except sr.RequestError:
            return "Could not request results from Google Speech Recognition service"

# def chatbot_response(input_text):
#     # This is a placeholder for your chatbot function
#     # Replace this with your actual chatbot logic
#     response = f"You said: {input_text}"
#     return response

def text_to_speech(text):
    options = TTSOptions(voice="s3://voice-cloning-zero-shot/775ae416-49bb-4fb6-bd45-740f205d20a1/jennifersaad/manifest.json")
    audio_chunks = speech_client.tts(text, options, voice_engine="PlayHT2.0-turbo")
    
    # Combine all audio chunks into a single byte stream
    audio_stream = io.BytesIO()
    for chunk in audio_chunks:
        audio_stream.write(chunk)
    
    audio_stream.seek(0)
    return audio_stream
# DEFAULT_MODEL = "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"
# DEFAULT_MODEL = "mistralai/Mixtral-8x22B-Instruct-v0.1"
# DEFAULT_MODEL = "Qwen/Qwen2.5-72B-Instruct-Turbo"



from datetime import datetime

app = Flask(__name__)
# app.config["REDIS_URL"] = "redis://127.0.0.1:6379"
# app.register_blueprint(sse, url_prefix='/stream')

socketio = SocketIO(app)

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

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    
@app.route('/send_add_data',methods=['POST'])
def send_message():
    taskData = request.json
    if taskData:
        send_data_to_frontend(taskData)
        return jsonify({"status":"success"}), 200
    else:
        return jsonify({"status": "error", "message": "No message provided"}), 400
def send_data_to_frontend(taskData):
    socketio.emit('new_data',taskData)
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
    if not all([userID, taskName]):
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


@app.route('/recognize_speech', methods=['POST'])
def recognize_speech():
    text = recognize_speech_from_microphone()
    return jsonify({'text': text})

@app.route('/get_response', methods=['POST'])
def get_response():
    user_text = request.json['text']
    userID = request.json['userID']
    response = chatbot_response(user_text,userID)
    return jsonify({'response': response})

@app.route('/text_to_speech', methods=['POST'])
def get_speech():
    text = request.json['text']
    audio = text_to_speech(text)
    return audio, 200, {'Content-Type': 'audio/mpeg'}

if __name__ == '__main__':
    app.run(debug=True,port='5001',host='0.0.0.0')
    # socketio.run(app, host='0.0.0.0', port=5001, debug=True)
    
    # asking = "hi"
    # print(chatbot_response(asking,"109356546733291536481"))
