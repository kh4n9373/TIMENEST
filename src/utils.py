import json 
import hashlib
import os
import smtplib
from database.mongodb import MongoManager, MongoJSONEncoder

mongo_client = MongoManager('Timenest')



def trigger_metadata(userID):
    directory = f"metadata/{userID}"
    file_path = directory+f"/{userID}.json"
    
    # Check if the directory exists, if not, create it
    if not os.path.exists(directory):
        os.makedirs(directory)

    # Remove any existing JSON files in the directory
    for filename in os.listdir(directory):
        file_path_to_delete = os.path.join(directory, filename)
        if filename.endswith(".json") and os.path.isfile(file_path_to_delete):
            os.remove(file_path_to_delete)

    # Fetch metadata and save to the new file
    metadata = mongo_client.find_info(userID)
    with open(file_path, 'w') as f:
        json.dump(metadata, f, indent=4, ensure_ascii=False, cls=MongoJSONEncoder)

    return f"Triggered metadata for {userID}"



def generate_uid(input_data: str) -> str:
    sha = hashlib.sha256()
    
    sha.update(input_data.encode('utf-8'))
    
    return sha.hexdigest()


def convert_to_js(response):
    return response.replace('\n','<br>').replace('###','-').replace('**','')

def send_messange(subject, message,user_email):
    email = "timenest.notif@gmail.com"
    receiver = user_email
    
    text = f"Subject: {subject}\n\n{message}"
    
    server = smtplib.SMTP("smtp.gmail.com",587)
    server.starttls()
    server.login(email, "xnlgyvyzzgyclnkh")
    server.sendmail(email,receiver,text)
    print("Email have sent to " + receiver)

# send_messange("Thank for using Timenest.",'Test','phmtrntuankhang@gmail.com')
# send_messange("Quen mat khau a thang ngu",'This is your OTP for recovery, dont share for any body : 142365','phmtrntuankhang@gmail.com')
    