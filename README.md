![Slide 16_9 - 6](https://github.com/user-attachments/assets/c7b3ec4d-2d8e-41fc-98d3-6a2bac98887c)

# Overview of the project

## Contributor


Thanks to the following people who have contributed to this project:

- [Khang Pham](https://www.facebook.com/khang.trantuan.524/) - Data Engineering, LLM Engineering, DevOps
- [Anh Quach](https://www.facebook.com/qta1602) - AI Engineer, UI desinger, Frontend Dev, Project Manager
- [Hung Hoang](https://www.facebook.com/hunghoang312004) - Data Engineering, AI Engineering
- [Manh Hoang](https://www.facebook.com/hoang.manh.13731) - Algorithm Implementor, Frontend Dev
- [Hieu Nguyen](https://www.facebook.com/nguyen.van.hieu.962350) - Reseacher, Documentation


## Motivation

According to recent Vietnam university studies on student issues, most students often experience stress and tension. The primary cause is poor time management. Among the surveyed participants, 25% cited frequent unexpected tasks as the main reason, 40% mentioned not having a clear daily schedule, and 35% attributed their struggles to a lack of discipline in following their plans due to various external factors. These include poorly designed schedules leading to disruptions, forgetting important tasks, and feeling overwhelmed when work piles up. These issues have negatively impacted society, with 60% of students surveyed unable to achieve good academic results, 35% wasting time on unproductive activities such as gaming or excessive social engagements, and 45% failing to balance their work and personal lives.

From our observations, traditional tools for time management often fall short in addressing these challenges. These tools primarily focus on basic calendar functions and lack advanced features to help users tackle their complex problems effectively. As a result, users often spend significant time trying to create efficient schedules. While some companies have introduced solutions like AI-powered assistants to address these issues, the setup and synchronization processes can be overly complicated, sometimes reducing their effectiveness.

Our team has envisioned a new tool designed to overcome these challenges. It aims to be convenient, user-friendly, and capable of addressing the majority of time management problems users currently face.


## Key Benefits

### **1. Enhanced Work Efficiency**  
- Intelligent optimization features support users in completing tasks quickly and efficiently.  
- Ensures that important tasks are prioritized and executed on time.  

### **2. Promoting Work-Life Balance**  
- Encourages a balanced approach to learning, work, and life experiences.  
- Supports users in not only working effectively but also enjoying relaxation and personal activities.  

### **3. Optimized Time and Cost Management**  
- Automates and organizes tasks scientifically to save time and reduce management costs.  
- Helps users achieve their goals faster and more efficiently.  

## **Social Impact**  
- Improves the quality of life and daily experiences for users.  
- Contributes to socio-economic development by empowering users to utilize their time and resources more effectively.  



# Timenest Features

## 1. **Smart Task Scheduling**
### Short Description  
"Smart Task Scheduling" is a core feature that helps users plan, create, and manage tasks effectively.

### Objectives and Benefits  
- Optimize time and enhance productivity by organizing tasks logically and efficiently.  
- Provide a comprehensive view of daily, weekly, or monthly schedules, making it easy to prioritize and track tasks.  
- Streamlined task creation and editing with an improved user experience for saving time while maintaining performance.

### Detailed Features  
- Direct access to task management upon login.  
- Three interaction modes:  
  1. Traditional "Create New Task" button.  
  2. Drag-and-drop functionality to create/edit tasks directly in the calendar.  
  3. AI assistant integration for task management.  
- Automatic suggestions for task start and end times, using a machine learning model with inputs like task name, description, priority, and available user time.  
- All essential scheduling tool features are included to maximize user productivity.

### Technical Aspects  
- Technologies: Natural Language Processing (NLP), Large Language Models (LLM), Function Calling, API, and WebSocket.  
- Machine learning-based time prediction model optimizes planning using user inputs.

### Integration with Other Features  
- Personalized schedule data is used to drive other features such as:  
  - Smart reminders and recommendations by the AI assistant.  
  - Performance and time management reports.  
  - Group meeting scheduling that considers all members' availability.

---

## 2. **AI-powered Chatbot Assistance**
### Short Description  
The "AI-powered Chatbot" acts as a virtual assistant to support users in managing schedules and optimizing productivity through natural language interaction.

### Objectives and Benefits  
- Provide an intuitive and intelligent user experience.  
- Simplify schedule changes, information retrieval, and optimal task arrangement suggestions.  
- Act as a personal assistant for reminders, forecasting task timings, and enhancing time management.  

### Detailed Features and Technical Aspects  
- User-friendly interface for data input and interaction.  
- Continuous data updates synchronized with the user database.  
- Technologies: Natural Language Processing (NLP), Large Language Models (LLM), and Multimodal Models (supporting text, voice, and image inputs).

---

## 3. **Personalized Insights and Analytics**
### Short Description  
Provides users with detailed insights into their time usage and task distribution to improve efficiency and task management.

### Objectives and Benefits  
- Help users understand their time usage patterns and productivity.  
- Visual data (charts, statistics) allows users to identify trends, prioritize tasks, and adjust schedules for better efficiency.

### Detailed Features  
1. **Weekly/Monthly Progress**: Track task completion rates and identify trends or obstacles.  
2. **Task Types Distribution**: Visualize time allocation across various task categories (e.g., health, career, family).  
3. **Priority Focus**: Analyze task priorities to improve time management and reduce overload.  
4. **Active Time Tracker**: Monitor productive hours to optimize work schedules.

---

## 4. **Group Meeting Scheduling**
### Short Description  
Facilitates easy group meeting scheduling by finding convenient times for all members, enhancing collaboration and productivity.

### Objectives and Benefits  
- Simplify group coordination to find the most suitable meeting times.  
- Avoid schedule conflicts and save time.  
- Optimize team collaboration and streamline meeting organization.

### Detailed Features  
- Create or join groups to access members' schedules.  
- Visualize schedules using a heatmap for easier time selection.  
- Automatically suggest optimal meeting slots based on members’ availability.

# Installation
paste .env file in outermost (contact developers)

## Option 1: Fast, 1 line, prepare Docker
```
docker-compose up --build
```
check `http://127.0.0.1:5001`
## Option 2: Environment set up and run 

use python VM 
```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

or Conda
```
conda create --name timenest
conda activate timenest
pip install -r requirements.txt
```

run the app 
```
python src/app.py
```
check `http://127.0.0.1:5001`

# Website link : timenest.fly.dev
