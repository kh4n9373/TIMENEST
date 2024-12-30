from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from datetime import datetime, timedelta
import calendar
import os
from dotenv import load_dotenv
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
client = MongoClient(MONGODB_URL)
model = SentenceTransformer('all-MiniLM-L6-v2')

categories = {
    "Work Meetings": [
        "Attend weekly team standup",
        "Lead project kickoff meeting",
        "Present quarterly results to management",
        "Conduct performance review with direct report",
        "Join client conference call",
        "Facilitate brainstorming session",
        "Participate in department budget meeting",
        "Attend company-wide town hall"
    ],
    "Personal Appointments": [
        "Annual physical checkup with Dr. Smith",
        "Dental cleaning at 2 PM",
        "Haircut appointment at salon",
        "Meet with financial advisor",
        "Therapy session at 4 PM",
        "Car maintenance at local garage",
        "Home inspector visit for property purchase",
        "Consultation with interior designer"
    ],
    "Social Events": [
        "Dinner with friends at new restaurant",
        "Attend Sarah's birthday party",
        "Meet John for coffee at 3 PM",
        "Host monthly book club meeting",
        "Attend wedding reception for colleague",
        "Family reunion picnic at the park",
        "Catch up with old classmate visiting town",
        "Volunteer at local food bank"
    ],
    "Family Responsibilities": [
        "Pick up kids from school at 3:30 PM",
        "Attend parent-teacher conference",
        "Take dog to vet for annual shots",
        "Help daughter with science fair project",
        "Family game night at 7 PM",
        "Drive mom to her doctor's appointment",
        "Attend son's soccer match",
        "Plan and prepare family Sunday dinner"
    ],
    "Personal Development": [
        "Attend evening Spanish language class",
        "Yoga session at local studio",
        "Participate in online photography workshop",
        "Public speaking group meetup",
        "Attend lecture on climate change at university",
        "Personal goal setting and review session",
        "Meditation retreat weekend",
        "Career counseling appointment"
    ],
    "Home Management": [
        "Schedule HVAC maintenance",
        "Meet with landscaper to discuss garden plans",
        "Home cleaning service appointment",
        "Pest control treatment at 10 AM",
        "Furniture delivery and assembly",
        "Energy audit of the house",
        "Meet potential tenants for property showing",
        "Supervise home renovation project"
    ],
    "Health and Fitness": [
        "Gym session with personal trainer",
        "Meal prep for the week",
        "Attend spin class at 6 PM",
        "Nutritionist consultation",
        "Group hike with outdoor club",
        "Schedule annual health screenings",
        "Try new healthy recipe for dinner",
        "Track daily water intake and exercise"
    ],
    "Travel and Events": [
        "Flight to New York at 2 PM",
        "Check-in for hotel reservation",
        "Rent car for business trip",
        "Attend industry conference",
        "Book tickets for upcoming concert",
        "Plan itinerary for family vacation",
        "Renew passport at local office",
        "Attend travel vaccination clinic"
    ],
    "Financial Tasks": [
        "Review and pay monthly bills",
        "Quarterly tax planning meeting",
        "Set up automatic savings transfer",
        "Research and adjust investment portfolio",
        "Renew home insurance policy",
        "Submit expense report for recent business trip",
        "Meet with accountant for tax preparation",
        "Review and update family budget"
    ],
    "Learning and Education": [
        "Attend online course lecture at 7 PM",
        "Study for professional certification exam",
        "Meet with academic advisor",
        "Participate in industry webinar",
        "Work on thesis research and writing",
        "Attend STEM workshop for adults",
        "Practice musical instrument for 1 hour",
        "Read chapter of current non-fiction book"
    ]
}

def categorize_task(task):
    category_embeddings = {}
    for category, examples in categories.items():
        category_embeddings[category] = model.encode(category + ": " + ", ".join(examples))

    task_embedding = model.encode(task)
    similarities = {}
    for category, category_embedding in category_embeddings.items():
        similarity = cosine_similarity([task_embedding], [category_embedding])[0][0]
        similarities[category] = similarity
    
    best_category = max(similarities, key=similarities.get)
    return best_category

def get_user_information(client, mode: str = "week", user_id: str = ''):
    db = client.Timenest
    tasks_collection = db.tasks
    now = datetime.now()
    start_of_time = now 
    end_of_time = now

    if mode ==  'week': 
        start_of_time = now - timedelta(days=now.isoweekday() - 1)
        end_of_time = start_of_time + timedelta(days=6)
    if mode == 'month': 
        start_of_time = now.replace(day=1)
        last_day_of_month = calendar.monthrange(now.year, now.month)[1]
        end_of_time = now.replace(day=last_day_of_month)

    tasks = tasks_collection.find({
        "userID": user_id,
        "startTime": {
            "$gte": start_of_time.isoformat() + 'Z', 
            "$lte": end_of_time.isoformat() + 'Z'
        }
    })

    users_task_analysist = [{
        'user_id': 1,
        'hours': 0, #Tong so gio lam viec trong tuan/thang
        'tasks': [], # Before mapping, day is the earliest start day of the task.
        'categories': [] #After mapping, remove day.
    }]

    for task in tasks: 
        user_id = task['userID']
        task_name = task['taskName']
        start_time = task['startTime']
        end_time = task['endTime']
        start_time = datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%S.%fZ")
        end_time = datetime.strptime(end_time, "%Y-%m-%dT%H:%M:%S.%fZ")
        spend_time = end_time - start_time 
        task_hours = spend_time.total_seconds()/3600

        user_found = False
        for user_task in users_task_analysist:
            if user_task['user_id'] == user_id:
                user_task['hours'] += task_hours  
                exist = 0
                for subtask in user_task['tasks']:
                    if subtask[0] ==  task_name: 
                        subtask[1] += task_hours
                        exist = 1
                if exist == 0: 
                    user_task['tasks'].append([task_name, task_hours, str(start_time)])
                user_found = True
                break
        
        # If the user is not found in the list, create a new user entry
        if not user_found:
            users_task_analysist.append({
                'user_id': user_id,
                'hours': task_hours,
                'tasks': [([task_name, task_hours, str(start_time)])],
                'categories': []
            })

    users_task_analysist = users_task_analysist[1:]

    for user in users_task_analysist:
        for task in user['tasks']: 
            map_category = categorize_task(task[0])  
            existed = 0 
            for cate in user['categories']: 
                if map_category == cate[0]: 
                    cate[1] += task[1]
                    existed = 1 
            if existed == 0: 
                user['categories'].append([map_category, task[1]])
    print(users_task_analysist)
    return users_task_analysist
import matplotlib.pyplot as plt
import numpy as np

def draw_radar_chart(data):
    categories = [item[0] for item in data[0]['categories']]
    values = [item[1] for item in data[0]['categories']]

    num_vars = len(categories)

    angles = [n / float(num_vars) * 2 * np.pi for n in range(num_vars)]
    angles += angles[:1]

    values += values[:1]

    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(projection='polar'))

    ax.plot(angles, values)

    ax.fill(angles, values, alpha=0.25)

    plt.xticks(angles[:-1], categories)

    ax.set_rlabel_position(0)
    max_value = max(values)
    plt.yticks(np.arange(1, max_value + 1, 2), color="grey", size=7)
    plt.ylim(0, max_value)

    plt.title(f"User {data[0]['user_id']} Activity Radar Chart", size=20, y=1.1)

    plt.tight_layout()
    # plt.savefig('taxonomy.jpg')
    plt.show()
    return
if __name__ == '__main__':
    print(draw_radar_chart(get_user_information(client=client,user_id='109356546733291536481')))
    
    

