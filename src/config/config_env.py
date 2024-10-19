import os
from dotenv import load_dotenv
load_dotenv()

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
MONGODB_URL = os.getenv("MONGODB_URL")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
PLAY_HT_USER_ID=os.getenv("PLAY_HT_USER_ID")
PLAY_HT_API_KEY=os.getenv("PLAY_HT_API_KEY")