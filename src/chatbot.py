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
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage
import uvicorn
from utils import convert_to_js,trigger_metadata
import re
from config.config_env import TOGETHER_API_KEY


mongo_client = MongoManager("Timenest")

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

memory = ConversationBufferMemory(
    return_messages=True,
    k=2
)

userID = ""


class Prompt(BaseModel):
    input: str
client = OpenAI(api_key=TOGETHER_API_KEY, base_url='https://api.together.xyz/v1')

DEFAULT_MODEL = "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"
# DEFAULT_MODEL = "mistralai/Mixtral-8x22B-Instruct-v0.1"
# DEFAULT_MODEL = "Qwen/Qwen2.5-72B-Instruct-Turbo"



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
    # print('herreeee')
    # print(file_path)
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
    

def saving_constraint(query, file_path=f'constraint/{userID}/datalake.json'):
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
    

def reading_constraint(query):
    global userID
    documents_path = f"constraint/{userID}/"
    try:
        vectorstore = create_rag_system(documents_path)
        response = query_rag_system(vectorstore, query, model=DEFAULT_MODEL)
        return json.dumps({"response": response})
    except Exception as e:
        return json.dumps({"error": str(e)})
    

def domain_asking(query):
    documents_path = "documents"
    try:
        vectorstore = create_rag_system(documents_path)
        response = query_rag_system(vectorstore, query, model=DEFAULT_MODEL)
        return json.dumps({"response": response})
    except Exception as e:
        return json.dumps({"error": str(e)})

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
    
    
def load_documents_from_local(path):
    """
    Load documents from a local path.
    Supports PDF and text files.3
    """
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
    """
    Create a FAISS index for efficient similarity search.
    """
    embeddings = TogetherEmbeddings() 
    vectorstore = FAISS.from_documents(documents, embeddings)
    return vectorstore

def infer_chat(chat, model=DEFAULT_MODEL):
    """
    Function to send a chat message to the Together API and get a response.
    """
    chat_response = client.chat.completions.create(
        model=model,
        messages=chat,
        top_p=0.4,
        stream=False
    )
    return chat_response.choices[0].message.content

def create_rag_system(documents_path):
    """
    Create the RAG system by loading documents and building a FAISS index.
    """
    documents_path = Path(documents_path).resolve()
    
    documents = load_documents_from_local(documents_path)
    print(documents)
    if not documents:
        raise ValueError("No documents found in the specified path.")
    # print('vec')
    vectorstore = create_faiss_index(documents)
    # print(vectorstore)
    return vectorstore

def query_rag_system(vectorstore, query, model=DEFAULT_MODEL):
    """
    Query the RAG system with a given question and generate an answer using the Together API.
    """
    print('aaaaaa')
    retriever = vectorstore.as_retriever()
    related_docs = retriever.invoke(query)

    context = "\n\n".join([doc.page_content for doc in related_docs])
    print("contextttttt:",context)
    # print(context)
    content = [
        {"role": "system", 
         "content": f"""
            ### INSTRUCTION ###
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
            Below are the 6 main tasks you will perform:
            - Answer questions about events in the schedule.
            - Suggest ways to accomplish tasks in the schedule effectively.
            - Provide advice on time management.
            - Assist in adding, modifying, or deleting events in the schedule.
            - Help break down tasks in the schedule into smaller tasks and arrange a timeline for execution.

            ### SPECIAL CASE ###
            When chatting with user, you will be likely to be in circumstance that you need to call function, there are 4 circumstance:
            - When user request advice, tip and tricks for better scheduling and time management or explaining why they failed finishing previous tasks (DOMAIN ASKING): You are provided with the documents with time management skills, you can infer it when instructing user how to manage time effectively.
            - When user ask information about him/her-self, him/her-username or their calendar (relate to their history,NOT THE FUTURE) (DATABASE ASKING): You are also embedded with user's database, call the function to read the database (json file) and response relevant information from the json file. When you get information of tasks, just tell them about task name, task description, start Time and endTime, and dedscript those information in natural language way.
            - When user tell you the bad condition that he/she will not have time (or not available at that time (SAVE CONSTRAINT): you are able to identify the message from user which make their schedule being limited, then you call saving constraint function to note that time-constraint event. So that,in the future suggestion for task management, you can look at constraint you noted and avoid that for future schedule suggest consideration.  
            - When user ask you to suggest planning their tasks or rescheduling effetcively (READ CONSTRAINT): You are connected to the constraint hub you saved before, when user ask for task scheduling or anything about scheduling, you need to load the constraint, then consider the constraints from this constraint-hub for better scheduling. You are not allow to schedule for user the event conflict with the constraints. 
            If you don't recognize any alignment with your special case, like some normal gosip chatting like 'hi','hello there', 'i am tired',... just behave as normal sentiment chatbot and take the gosip with user.

            ### Guidelines for Every Turn ###

            **Important Instructions**

            Always request more information: Ask questions to gather more information before providing a final answer.
            Tone: Friendly, cheerful.
            Answer Style: Accurate, sufficient, in markdown format, with important keywords highlighted.
            Limitations: Do not discuss sensitive or unrelated topics. Redirect unrelated questions back to the 6 main tasks.
            
            
          
         """},
        {"role": "user", "content": f"Context: {context}\n\nQuestion: {query}"}
    ]

    response = infer_chat(content, model=model)
    
    # sources = [doc.metadata['source'] for doc in related_docs]
    return response
    # , sources


# def trigger_metadata(userID):
#     metadata = mongo_client.find_info(userID)
#     with open(f"metadata/{userID}.json", 'w') as f:
#         json.dump(metadata, f, indent=4, ensure_ascii=False, cls=MongoJSONEncoder)
#     return f"Triggered metadata for {userID}"

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
    {
        "type": "function",
        "function": {
            "name": "reading_constraint",
            "description": "Based on constraints, consider suggestion for scheduling",
            "parameters": {
                "type": "object",
                "properties": {
                    "asking": {
                        "type": "string",
                        "description": "Asking for task scheduling"
                    }
                },
                "required": ["asking"]
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
            
            Below are the 6 main tasks you will perform:
            - Answer questions about events in the schedule.
            - Suggest ways to accomplish tasks in the schedule effectively.
            - Provide advice on time management.
            - Assist in adding, modifying, or deleting events in the schedule.
            - Help break down tasks in the schedule into smaller tasks and arrange a timeline for execution.
            
            ### SPECIAL CASE ###
            When chatting with user, you will be likely to be in circumstance that you need to call function, there are 4 circumstance:
            - When user request advice, tip and tricks for better scheduling and time management or explaining why they failed finishing previous tasks (DOMAIN ASKING): You are provided with the documents with time management skills, you can infer it when instructing user how to manage time effectively.
            - When user ask information about him/her-self, him/her-username or their calendar (relate to their history,NOT THE FUTURE) (DATABASE ASKING): You are also embedded with user's database, call the function to read the database (json file) and response relevant information from the json file. When you get information of tasks, just tell them about task name, task description, start Time and endTime, and dedscript those information in natural language way.
            - When user tell you the bad condition that he/she will not have time (or not available at that time (SAVE CONSTRAINT): you are able to identify the message from user which make their schedule being limited, then you call saving constraint function to note that time-constraint event. So that,in the future suggestion for task management, you can look at constraint you noted and avoid that for future schedule suggest consideration.  
            - When user ask you to suggest planning their tasks or rescheduling effetcively (READ CONSTRAINT): You are connected to the constraint hub you saved before, when user ask for task scheduling or anything about scheduling, you need to load the constraint, then consider the constraints from this constraint-hub for better scheduling. You are not allow to schedule for user the event conflict with the constraints. 
            If you don't recognize any alignment with your special case, like some normal gosip chatting like 'hi','hello there', 'i am tired',... just behave as normal sentiment chatbot and take the gosip with user.
            
        """},
        {"role": "user", "content": user_input}
    ]

    # Get conversation history from Langchain memory
    history = memory.load_memory_variables({})['history']
    print(history)

    for message in history[-10:]:  # Include the last 10 messages
        # if isinstance(message, HumanMessage):
        messages.append({"role": "user", "content": message.content})
        # else:
        #     messages.append({"role": "assistant", "content": message.content})

    messages.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model=DEFAULT_MODEL,
        messages=messages,
        tools=tools,
        tool_choice="auto",
    )
    # print(response)
    # response_content = response.choices[0].message.content
    # print(response_content)
    
    print('='*10)
    print(response)
    print('='*10)
    tool_calls = response.choices[0].message.tool_calls
    response_message = response.choices[0].message.content
    
    if response_message and "<function=" in response_message:
        # Extract function name and arguments
        if re.search(r'<function=(\w+)>({.*?})<function>', response_message):
            function_match = re.search(r'<function=(\w+)>({.*?})<function>', response_message)
        else:
            function_match = re.search(r'<function=(\w+)>(.*?)</function>', response_message)
        
        print(function_match)
        if function_match:
            print(111111)
            function_name = function_match.group(1)
            function_args = json.loads(function_match.group(2))
            print(function_name)
            print(function_args)
            # Execute the function  
            if function_name == "domain_asking":
                function_response = domain_asking(query=function_args.get("query"))
                print(1)
            elif function_name == "database_asking":
                print(function_args.get("query"))
                function_response = database_asking(query=function_args.get("query"))
                print(2)
                print(function_response)
                print(2)
            elif function_name == "reading_constraint":
                function_response = reading_constraint(query=function_args.get("asking"))
                print(3)
            elif function_name == "saving_constraint":
                print(4)
                function_response = saving_constraint(query=function_args.get("noting"))

            # Append the function response to the messages
            messages.append(
                {
                    "role": "function",
                    "name": function_name,
                    "content": function_response,
                }
            )

            # Generate a new response incorporating the function result
            function_enriched_response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=messages,
            )

            response_content = function_enriched_response.choices[0].message.content
            memory.chat_memory.add_user_message(user_input)
            # memory.chat_memory.add_ai_message(response_content)
            return response_content

    elif tool_calls:
        for tool_call in tool_calls:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)

            if function_name == "domain_asking":
                function_response = domain_asking(query=function_args.get("query"))
                print(1)
            elif function_name == "database_asking":
                function_response = database_asking(query=function_args.get("query"))
                print(2)
            elif function_name == "reading_constraint":
                function_response = reading_constraint(query=function_args.get("asking"))
                print(3)
            elif function_name == "saving_constraint":
                print(4)
                function_response = saving_constraint(query=function_args.get("noting"))

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
        # memory.chat_memory.add_ai_message(response_content)
        return response_content

    else:

        response_content = response.choices[0].message.content
        memory.chat_memory.add_user_message(user_input)
        # memory.chat_memory.add_ai_message(response_content)
        return response_content


    # Add the user message and AI response to Langchain memory
    # memory.chat_memory.add_user_message(user_input)
    # memory.chat_memory.add_ai_message(response_content)

    # return response_content
    
    
    
def chat(prompt):
    if prompt.lower() in ['exit', 'quit', 'bye']:
        return  "Goodbye!"
    response = chatbot_response(prompt)
    return response
    
@app.get("/")
def check_health():
    return {'message': 'healthy'}

@app.post("/infer")
def get_inference(prompt: Prompt):
    global userID
    # print(prompt.input)
    userID = prompt.userID
    response = chatbot_response(prompt.input)
    print(response)
    return {"response": convert_to_js(response)}

# memory = ConversationBufferMemory(return_messages=True)
# @app.post("/infer")

# def get_inference(prompt: Prompt):
    
#     memory.chat_memory.add_user_message(prompt.input)
    
#     response = chatbot_response(prompt.input)
    
#     memory.chat_memory.add_ai_message(response)
    
    
#     return {
#         "response": convert_to_js(response)
#     }
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8034)