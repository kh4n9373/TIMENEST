import os
import json
from pathlib import Path
from openai import OpenAI
from langchain_community.document_loaders import PyPDFLoader, TextLoader, JSONLoader
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from langchain.embeddings.base import Embeddings
from database.mongodb import MongoManager, MongoJSONEncoder
from datetime import datetime
from pydantic import BaseModel
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage
from utils import convert_to_js,trigger_metadata
import re
import requests
from bson import ObjectId
from config.config_env import TOGETHER_API_KEY
mongo_client = MongoManager("Timenest")


memory = ConversationBufferMemory(
    return_messages=True,
    k=2
)

userID = ""

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)
    
class Prompt(BaseModel):
    input: str
client = OpenAI(api_key=TOGETHER_API_KEY, base_url='https://api.together.xyz/v1')

DEFAULT_MODEL = "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"
# DEFAULT_MODEL = "mistralai/Mixtral-8x22B-Instruct-v0.1"
# DEFAULT_MODEL = "Qwen/Qwen2.5-72B-Instruct-Turbo"

import random

def generate_random_color():
    # Generate a random integer between 0 and 16777215 (hexadecimal #000000 to #FFFFFF)
    random_number = random.randint(0, 0xFFFFFF)
    # Convert the number to a hexadecimal string and format it as a color code
    hex_color = f"#{random_number:06x}"
    return hex_color

# Example usage
# print(generate_random_color())

from datetime import datetime

def current_date():
    now = datetime.now()
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
              'August', 'September', 'October', 'November', 'December']
    
    current_day = days[now.weekday()]
    day = now.day
    month = months[now.month - 1]
    year = now.year
    hour = now.hour
    return (f"{current_day}, {month} {day}, {year}, {hour}")


def load_documents_from_json(file_path):

    with open(file_path, 'r') as file:
        data = json.load(file)
    
    if isinstance(data, dict):
        content = json.dumps(data, indent=2)
    elif isinstance(data, str):
        content = data
    else:
        content = str(data)
    
    metadata = {"source": file_path}
    
    return [Document(page_content=content, metadata=metadata)]
    
### FUNCTION CALLING 

### SAVE CONSTRAINT
def saving_constraint(query, userID):
    file_path = f'constraint/{userID}/datalake.json'
    print(file_path)
    timestamp = datetime.now().isoformat()
    new_entry = {timestamp: query}

    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            try:
                data = json.load(file)
            except json.JSONDecodeError:
                data = {}
    else:
        data = {}

    data.update(new_entry)

    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)

    print(f"Info saved to {file_path}")
    return json.dumps({"message":"user will not available at that time"})
    
# LOAD CONSTRAINT
def load_constraint(ID):
    documents_path = f"../constraint/{ID}/datalake.json"
    try:
        
        with open(documents_path, 'r') as f:
            data = json.load(f)
        return data
    except:
        return {}
# def reading_constraint(query):
#     global userID
#     documents_path = f"constraint/{userID}/"
#     try:
#         vectorstore = create_rag_system(documents_path)
#         response = query_rag_system(vectorstore, query, model=DEFAULT_MODEL)
#         return json.dumps({"response": response})
#     except Exception as e:
#         return json.dumps({"error": str(e)})
    
# DOMAIN 
def domain_asking(query):
    documents_path = "documents"
    try:
        vectorstore = create_rag_system(documents_path)
        response = query_rag_system(vectorstore, query, model=DEFAULT_MODEL)
        return json.dumps({"response": response})
    except Exception as e:
        return json.dumps({"error": str(e)})

# DATABASE QUERY
def database_asking(query):
    global userID
    documents_path = f"metadata/{userID}/"
    
    try:
        print(1)
        vectorstore = create_rag_system(documents_path)
        print(2)
        response = query_rag_system(vectorstore, query, model=DEFAULT_MODEL)
        print("="*8)
        print(response)
        print("="*8)

        return json.dumps({"response": response})
    except Exception as e:
        return json.dumps({"error": str(e)})

# DATABASE ADD TASK 
def database_add_task(
    userID,
    taskName="None",
    taskDescript="None",
    startTime="None",
    endTime="None",
    taskColor="#000000"
):
    url = 'http://127.0.0.1:5001/send_add_data'
    
    try:
        taskData = {
            'userID': userID,
            'taskName': taskName,
            'taskDescription': taskDescript if taskDescript else "",
            'startTime': startTime,
            'endTime': endTime,
            'taskcolor': taskColor if taskColor else ""
        }
        try:
            response = requests.post(url,json=taskData)
            if response.status_code == 200:
                print(f"data task sent to frontend")
            else:
                print(f'Failed to send data to frontend')
        except Exception as e:
            print(f"Error sending message: {e}")
        mongo_client.insert_one('tasks', taskData)
        print(taskData)
        trigger_metadata(userID)
        return {'message': 'add task successfully'}
    except Exception as e:
        return {'message':f"Error {e} happened, can not add task"}
    
def database_add_multiple_tasks(userID, tasks):
    """
    Add multiple tasks to the database.
    
    Args:
        userID: User identifier
        tasks: List of dictionaries, each containing task data with keys:
               taskName, taskDescript, startTime, endTime, taskColor
    """
    url = 'http://127.0.0.1:5001/send_add_data'
    results = []
    
    try:
        for task in tasks['tasks']:
            taskData = {
                'userID': userID,
                'taskName': task.get('taskName', 'None'),
                'taskDescription': task.get('taskDescript', ''),
                'startTime': task.get('startTime', 'None'),
                'endTime': task.get('endTime', 'None'),
                'taskcolor': task.get('taskColor', '#000000')
            }
            
            try:
                response = requests.post(url, json=taskData)
                if response.status_code != 200:
                    results.append(f'Failed to send task {taskData["taskName"]} to frontend')
                    continue
                print('HEREEEEEEE', taskData)
                mongo_client.insert_one('tasks', taskData)
                results.append(f'Successfully added task {taskData["taskName"]}')
                
            except Exception as e:
                results.append(f'Error processing task {taskData["taskName"]}: {str(e)}')
                
        trigger_metadata(userID)
        return {'message': 'Batch task processing complete', 'details': results}
        
    except Exception as e:
        return {'message': f'Fatal error in batch processing: {str(e)}'}
    
def load_documents_from_local(path):
    docs = []
    for filename in os.listdir(path):
        file_path = os.path.join(path, filename)
        if filename.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
            docs.extend(loader.load())
        elif filename.endswith(".txt"):
            loader = TextLoader(file_path)
            docs.extend(loader.load())
        elif filename.endswith(".json"):
            docs.extend(load_documents_from_json(file_path)) 
    return docs

class TogetherEmbeddings(Embeddings):
    """
    Custom embeddings class using Together's retrieval model.
    """

    def __init__(self, model="togethercomputer/m2-bert-80M-8k-retrieval"):
        self.model = model

    def embed_documents(self, texts):
        """
        Embed a list of texts using the Together API.
        """
        embeddings = []
        for text in texts:
            response = client.embeddings.create(
                model=self.model,
                input=text
            )
            embeddings.append(response.data[0].embedding)
        return embeddings

    def embed_query(self, text):
        """
        Embed a single query using the Together API.
        """
        response = client.embeddings.create(
            model=self.model,
            input=text
        )
        return response.data[0].embedding

def create_faiss_index(documents):

    embeddings = TogetherEmbeddings() 
    vectorstore = FAISS.from_documents(documents, embeddings)
    return vectorstore

def infer_chat(chat, model=DEFAULT_MODEL):

    chat_response = client.chat.completions.create(
        model=model,
        messages=chat,
        top_p=0.4,
        stream=False
    )
    return chat_response.choices[0].message.content

def create_rag_system(documents_path):

    documents_path = Path(documents_path).resolve()
    
    documents = load_documents_from_local(documents_path)
    print(documents)
    if not documents:
        raise ValueError("No documents found in the specified path.")
    vectorstore = create_faiss_index(documents)
    return vectorstore

def query_rag_system(vectorstore, query, model=DEFAULT_MODEL):
    """
    Query the RAG system with a given question and generate an answer using the Together API.
    """

    retriever = vectorstore.as_retriever()
    related_docs = retriever.invoke(query)

    context = "\n\n".join([doc.page_content for doc in related_docs])
  
    return context




tools = [
    {
        "type": "function",
        "function": {
            "name": "domain_asking",
            "description": "Get information about effective time management",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The user's question about time management"
                    }
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "database_asking",
            "description": "Get information about user's info, tasks or schedule",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The user's question about their information, their tasks or schedule"
                    }
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "saving_constraint",
            "description": "Noting the time that user unavailable",
            "parameters": {
                "type": "object",
                "properties": {
                    "noting": {
                        "type": "string",
                        "description": "The user's message for time constraint"
                    }
                },
                "required": ["noting"]
            }
        }
    },
    # {
    #     "type": "function",
    #     "function": {
    #         "name": "reading_constraint",
    #         "description": "Based on constraints, consider suggestion for scheduling",
    #         "parameters": {
    #             "type": "object",
    #             "properties": {
    #                 "asking": {
    #                     "type": "string",
    #                     "description": "Asking for task scheduling"
    #                 }
    #             },
    #             "required": ["asking"]
    #         }
    #     }
    # },
    {
        "type":"function",
        "function": {
            "name": "database_add_task",
            "description": "Pass by parameters equivalent with information user gave you to ask their task",
            "parameters": {
                "type":"object",
                "properties": {
                    "taskName":{
                        "type":"string",
                        "description":"Name of the task"
                    },
                    "taskDescript": {
                        "type":"string", 
                        "description":"Details description of the task."
                    },
                    "startTime":{
                        "type":"string",
                        "description":"Start time of the task, formatted in ISO 8601 : %Y-%m-%dT%H:%M:%S.%fZ"
                    },
                    "endTime":{
                        "type":"string",
                        "description":"End time of the task, formatted in ISO 8601 : %Y-%m-%dT%H:%M:%S.%fZ"
                    },
                    "taskColor":{
                        "type":"string",
                        "description":"color when display the task",
                        "default": generate_random_color()

                    }    
                },
                "required":["taskName","startTime","endTime"]
            }
        }
    },
    {
        "type":"function",
        "function":{
            "name":"database_add_multiple_tasks",
            "description": " For each tasks, pass by parameters equivalent with information of that tasks user gave to you",
            "parameters":{
                "type":"object",
                "properties": {
                    "tasks": {
                        "type":"array",
                        "properties": {
                            "taskName": {
                                "type":"string",
                                "description":"Name of the task"
                            },
                            "taskDescription": {
                                "type":"string",
                                "description":"Task description"
                            },
                            "startTime":{
                                "type":"string",
                                "description":"Start time (ISO 8601: YYYY-MM-DDThh:mm:ss.sssZ)"
                            },
                            "endTime": {
                                "type": "string",
                                "description": "End time (ISO 8601: YYYY-MM-DDThh:mm:ss.sssZ)"
                            },
                            "taskColor": {
                                "type": "string",
                                "description": "Display color (hex code)",
                                "default": generate_random_color()
                            },
                            "required": ["taskName", "startTime", "endTime"]
                        }
                    }
                }
            }
        }
    }
    
]


def chatbot_response(user_input,ID):
    global userID
    userID = ID
    
    messages = [
        {"role": "system", "content": f"""
           ### INSTRUCT ###
            Today is : {current_date()}.
            If user ask you about datetime of some event. Take your current date to induce. Let us think step by step.
            Your name is "TimeNest," and you are a virtual assistant specializing in schedule management.

            Below are the main characteristics of TimeNest:

            You will assist users in answering questions related to scheduling, time management, and advising on effective task organization.
            You will communicate with users in a professional, friendly, and respectful manner. Aim to be the most reliable virtual assistant for schedule management!
            TimeNest will refer to itself as "I" and address the user as "you."
            You - TimeNest, also enjoy analyzing behavior and process efficiency; provide statistics and analysis where appropriate.
            Answers should be formatted in Markdown, with **important** words highlighted.
            Provide accurate and sufficient answers, avoiding overly long or too brief responses.
            You will help users by guiding them to ask questions, answering inquiries, and providing accurate information about schedule management from the provided database's document you connected to.
            Avoid sensitive or unrelated questions. Do not answer questions related to politics or religion.
            You should not schedule any task from 11 pm to 5 am unless user tells you to do that.
            
            Below are the 6 main tasks you will perform:
            - Answer questions about events in the schedule.
            - Suggest ways to accomplish tasks in the schedule effectively.
            - Provide advice on time management.
            - Assist in adding, modifying, or deleting events in the schedule.
            - Help break down tasks in the schedule into smaller tasks and arrange a timeline for execution.
            
            ### FUNCTION CALLING INSTRUCTION ###
            When chatting with user, you will be likely to be in circumstance that you need to call function, there are 4 circumstance:
            - When user request advice, tip and tricks for better scheduling and time management or explaining why they failed finishing previous tasks (DOMAIN ASKING): You are provided with the documents with time management skills, you can infer it when instructing user how to manage time effectively.
            - When user ask information about him/her-self, him/her-username or their calendar (relate to their history,NOT THE FUTURE) (DATABASE ASKING): You are also embedded with user's database, call the function to read the database (json file) and response relevant information from the json file. When you get information of tasks, just tell them about task name, task description, start Time and endTime, and dedscript those information in natural language way.
            - When user tell you the bad condition that he/she will not have time (or not available at that time (SAVE CONSTRAINT): you are able to identify the message from user which make their schedule being limited, then you call saving constraint function to note that time-constraint event. So that,in the future suggestion for task management, you can look at constraint you noted and avoid that for future schedule suggest consideration.  
            - When user ask you to suggest planning their tasks or rescheduling effetcively : You are connected to the constraint you saved before, , consider the constraints from this constraint-hub for better scheduling. You are not allow to schedule for user the event conflict with the constraints. Constraint will be descript below.
            - When user ask you to add a tasks, if they didn't your provide you these information, ask them: taskName (required), startTime (required), endTime (required), taskDescript (optional), taskColor (optional). startTime/endTime user provided to you can be natural language form please convert them to ISO 8601 : %Y-%m-%dT%H:%M:%S.%fZ" before passing into the database_addtask function. 
            If function calling return None, you have to response that question using your knowledge and try to think step by step to infer the answer. 
            
            ### IMPORTANT ###
            Never return None response.        
            
            ### CONSTRAINT HERE ###
            {load_constraint(userID)}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        """},
        {"role": "user", "content": user_input}
    ]

    history = memory.load_memory_variables({})['history']
    print(history)

    for message in history[-10:]:  # Include the last 10 messages
        if isinstance(message, HumanMessage):
            messages.append({"role": "user", "content": message.content})
        else:
            messages.append({"role": "assistant", "content": message.content})

    messages.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model=DEFAULT_MODEL,
        messages=messages,
        tools=tools,
        tool_choice="auto",
    )


    tool_calls = response.choices[0].message.tool_calls
    response_message = response.choices[0].message.content
    
    if response_message and "<function=" in response_message:
        print(response_message)
        if re.search(r'<function=(\w+)>({.*?})<function>', response_message):
            function_match = re.search(r'<function=(\w+)>({.*?})<function>', response_message)
        else:
            function_match = re.search(r'<function=(\w+)>(.*?)</function>', response_message)
        
        if function_match:
            print(function_match)
            function_name = function_match.group(1)
            function_args = json.loads(function_match.group(2))

            if function_name == "domain_asking":
                print('DOMAIN ASKING')
                function_response = domain_asking(query=function_args.get("query"))
                
            elif function_name == "database_asking":
                print('DATABASE_ASKING')
                function_response = database_asking(query=function_args.get("query"))

            # elif function_name == "reading_constraint":
            #     print('READING_CONSTRAINT')
            #     function_response = reading_constraint(query=function_args.get("asking"))

            elif function_name == "saving_constraint":
                print('SAVING_CONSTRAINT')
                function_response = saving_constraint(query=function_args.get("noting"))
                
            elif function_name == "database_add_task":
                print("DB ADD TASK")
                function_response = database_add_task(userID=ID,taskName=function_args.get("taskName"),taskDescript=function_args.get("taskDescript"),startTime=function_args.get("startTime"),endTime=function_args.get("endTime"),taskColor=function_args.get("taskColor"))
            
            elif function_name == "database_add_multiple_tasks":
                function_response = database_add_multiple_tasks(userID=ID,tasks=function_args)

            messages.append(
                {
                    "role": "function",
                    "name": function_name,
                    "content": function_response,
                }
            )

            function_enriched_response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=messages,
            )

            response_content = function_enriched_response.choices[0].message.content
            memory.chat_memory.add_user_message(user_input)
            memory.chat_memory.add_ai_message(response_content)
            return response_content
        else:
            response_content = response.choices[0].message.content
            memory.chat_memory.add_user_message(user_input)
            memory.chat_memory.add_ai_message(response_content)
            return response_content
    

    elif tool_calls:
        for tool_call in tool_calls:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)
            print(function_args)
            if function_name == "domain_asking":
                function_response = domain_asking(query=function_args.get("query"))
            elif function_name == "database_asking":
                function_response = database_asking(query=function_args.get("query"))
            elif function_name == "database_add_multiple_tasks":
                function_response = database_add_multiple_tasks(userID=ID,tasks=function_args)
            elif function_name == "saving_constraint":
                function_response = saving_constraint(query=function_args.get("noting"))
            elif function_name == "database_add_task":
                function_response = database_add_task(userID=ID,taskName=function_args.get("taskName"),taskDescript=function_args.get("taskDescript"),startTime=function_args.get("startTime"),endTime=function_args.get("endTime"),taskColor=function_args.get("taskColor"))
                
            messages.append(
                {
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": function_name,
                    "content": function_response,
                }
            )

        function_enriched_response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=messages,
        )

        response_content = function_enriched_response.choices[0].message.content
        memory.chat_memory.add_user_message(user_input)
        memory.chat_memory.add_ai_message(response_content)
        return response_content

    else:

        response_content = response.choices[0].message.content
        memory.chat_memory.add_user_message(user_input)
        memory.chat_memory.add_ai_message(response_content)
        return response_content
    
def chat(prompt):
    if prompt.lower() in ['exit', 'quit', 'bye']:
        return  "Goodbye!"
    response = chatbot_response(prompt)
    return response

if __name__ == "__main__":
    asking = "add the new tasks for me: hang out, from 2h to 4h today"
    print(chatbot_response(asking,"109356546733291536481"))