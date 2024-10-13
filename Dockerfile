FROM python:3.11-slim

# Set the working directory to /app
WORKDIR /app

# Copy the requirements.txt file to /app/
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files to /app/
COPY . .

# Set the working directory to /app/src, assuming the main.py is located there
WORKDIR /app/src

# Command to run the application
CMD ["python", "main.py"]
