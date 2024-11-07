
document.addEventListener('DOMContentLoaded', function () {
    const chatbox = document.querySelector('.chatbox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
  
    function sendMessage() {
      const message = userInput.value.trim();
      if (message !== '') {
        // Create and append the user's message
        const userMessageLi = document.createElement('li');
        userMessageLi.className = 'chat outgoing';
        userMessageLi.innerHTML = `<p>${message}</p>`;
        chatbox.appendChild(userMessageLi);
  
        // Clear the input field
        userInput.value = '';
  
        // Scroll to the bottom of the chatbox
        chatbox.scrollTop = chatbox.scrollHeight;
  
        // Here you would typically send the message to your backend
        // and wait for a response. For now, we'll just add a placeholder response.
        setTimeout(() => {
          const botMessageLi = document.createElement('li');
          botMessageLi.className = 'chat incoming';
          botMessageLi.innerHTML =
            '<p>I received your message. How can I assist you further?</p>';
          chatbox.appendChild(botMessageLi);
          chatbox.scrollTop = chatbox.scrollHeight;
        }, 1000);
      }
    }
  
    // Event listener for the send button
    sendButton.addEventListener('click', sendMessage);
  
    // Event listener for the Enter key in the input field
    userInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  });
  
  // Modal functionality
  const modal = document.getElementById('createTaskModal');
  const btn = document.getElementById('createBtn');
  const span = document.getElementsByClassName('close-button')[0];
  
  btn.onclick = function () {
    modal.classList.add('show');
  };
  
  function closeModal() {
    modal.classList.remove('show');
    document.getElementById('createTaskForm').reset();
  }
  
  span.onclick = closeModal;
  
  window.onclick = function (event) {
    if (event.target == modal) {
      closeModal();
    }
  };
  
  // Form submission
  document.getElementById('createTaskForm').onsubmit = function (e) {
    e.preventDefault();
    console.log('Task Name:', document.getElementById('taskName').value);
    console.log('Description:', document.getElementById('taskDescription').value);
    console.log('Start Time:', document.getElementById('startTime').value);
    console.log('End Time:', document.getElementById('endTime').value);
  
    // Close the modal after submission
    closeModal();
  
    // Reset the form
    this.reset();
  };
  
  // Function to get the start of the centered week for a given date
  function getStartOfCenteredWeek(date) {
    const start = new Date(date);
    start.setDate(start.getDate() - 3); // Move back 3 days to start from Tuesday
    return start;
  }
  
  // Function to format date as "DD"
  function formatDate(date) {
    return date.getDate().toString().padStart(2, '0');
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    // Get the current date (in this case, 27.09.2024)
    const currentDate = new Date();
  
    // Function to format date as "DD"
    function formatDate(date) {
      return date.getDate().toString().padStart(2, '0');
    }
  
    function getDayOfWeek(date) {
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return daysOfWeek[date.getDay()];
    }
  
    // Get the start of the centered week
    const weekStart = getStartOfCenteredWeek(currentDate);
  
    // Function to get the start of the centered week
    function getStartOfCenteredWeek(date) {
      const start = new Date(date);
      start.setDate(start.getDate() - 3); // Move back 3 days to start from Tuesday
      return start;
    }
  
    // Update the calendar
    const dayElements = document.querySelectorAll('.calendar-day');
    const dayOfWeekElements = document.querySelectorAll('.day_of_week');
  
    dayElements.forEach((element, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
  
      // Store the full date (DD/MM/YYYY) in the data attribute
      element.setAttribute('data-full-date', date.toISOString());
  
      // Display only the day (DD)
      element.textContent = formatDate(date);
  
      // Highlight the current day
      if (date.toDateString() === currentDate.toDateString()) {
        element.style.color = '#4361ee';
        element.style.fontWeight = 'bold';
      }
  
      // Update the day names (Mon, Tue, etc.) based on the correct date
      const dayOfWeek = getDayOfWeek(date);
      dayOfWeekElements[index].textContent = dayOfWeek;
    });
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    const timeSlots = document.querySelector('.time-slots');
    const timeInterval = document.querySelector('.time_interval .time');
    const modal = document.getElementById('createTaskModal');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const dayElements = document.querySelectorAll('.calendar-day');
  
    // Initialize drag functionality
    let isDragging = false;
    let startSlot = null;
    let endSlot = null;
    let newStart = null;
    let newEnd = null;
    // Create time intervals and time slots
    createTimeIntervalsAndSlots();
  
    // Event Listeners
    timeSlots.addEventListener('mousedown', onMouseDown);
    timeSlots.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.getElementsByClassName('close-button')[0].onclick = closeModal;
    window.onclick = function (event) {
      if (event.target == modal) {
        closeModal();
      }
    };
  
    // Functions for handling time slots
    function createTimeIntervalsAndSlots() {
      // Tạo khoảng trống đầu tiên
      const timeblank1 = document.createElement('div');
      timeblank1.classList.add('blank_time');
      timeInterval.appendChild(timeblank1);
  
      for (let j = 0; j < 7; j++) {
        const timeSlot = document.createElement('div');
        //Thêm border-right cho các timeSlot thứ 2 và 4
        timeSlot.style.height = '30px';
        timeSlot.style.borderRight = '1px solid #ddd'; // Bỏ border bottom
        timeSlots.appendChild(timeSlot);
      }
  
      for (let i = 0; i < 96; i++) {
        const hours = Math.floor(i / 4); // Lấy giờ từ chỉ số
        const minutes = (i % 4) * 15; // Lấy phút từ chỉ số
        const timeElement = document.createElement('p');
  
        // Hiển thị giờ mỗi khi số phút là 0 (bắt đầu mỗi giờ)
        if (i % 4 === 0) {
          timeElement.textContent = formatTimeForDisplay(hours, minutes);
        }
        timeInterval.appendChild(timeElement);
  
        // Tạo các timeSlot cho mỗi ngày trong tuần (7 ngày)
        dayElements.forEach((dayElement, j) => {
          const timeSlot = document.createElement('div');
          timeSlot.classList.add('time-slot');
  
          // Lấy thông tin ngày từ phần tử dayElement
          const day = dayElement.textContent; // Lấy giá trị ngày (DD)
          const month = new Date().getMonth() + 1; // Lấy tháng hiện tại
          const year = new Date().getFullYear(); // Lấy năm hiện tại
  
          // Gán ngày tháng và giờ phút vào dataset
          timeSlot.dataset.date = `${day}-${month
            .toString()
            .padStart(2, '0')}-${year}`; // Ngày tháng năm
          timeSlot.dataset.time = formatTimeForInput(hours, minutes); // Giờ phút
          timeSlot.dataset.day = j; // Gán chỉ số ngày (0-6)
  
          // Thêm border-right cho các timeSlot thứ 2 và 4
          if (i % 4 === 1 || i % 4 === 3) {
            timeSlot.style.borderTop = '0px solid'; // Bỏ border bottom
          }
  
          timeSlots.appendChild(timeSlot);
        });
      }
  
      // Tạo khoảng trống cuối cùng
      const timeblank2 = document.createElement('div');
      timeblank2.classList.add('blank_time');
      timeInterval.appendChild(timeblank2);
    }
  
    function formatTimeForInput(hours, minutes) {
      return `${hours
        .toString()
        .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  
    function formatTimeForDisplay(hours, minutes) {
      return `${hours
        .toString()
        .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  
    function getTimeFromSlot(slot) {
      const slotIndex = Array.from(timeSlots.children).indexOf(slot);
      const hours = Math.floor(slotIndex / 4);
      const minutes = (slotIndex % 4) * 15;
      return { hours, minutes };
    }
  
    function highlightSlot(slot) {
      slot.classList.add('highlighted');
    }
  
    function highlightRange(start, end) {
      clearHighlight();
      const slots = Array.from(timeSlots.children);
      const startIndex = slots.indexOf(start);
      const endIndex = slots.indexOf(end);
  
      const [row1, row2] = [
        Math.floor(startIndex / 7) - 1,
        Math.floor(endIndex / 7),
      ].sort((a, b) => a - b);
      const [col1, col2] = [startIndex % 7, endIndex % 7].sort((a, b) => a - b);
  
      for (let i = row1 + 1; i <= row2; i++) {
        for (let j = col1; j <= col2; j++) {
          slots[i * 7 + j].classList.add('highlighted');
        }
      }
      newStart = row1 * 7 + col1;
      newEnd = row2 * 7 + col2;
    }
  
    function clearHighlight() {
      timeSlots
        .querySelectorAll('.highlighted')
        .forEach((slot) => slot.classList.remove('highlighted'));
    }
  
    // Event handling functions
    function onMouseDown(e) {
      if (e.target.classList.contains('time-slot')) {
        isDragging = true;
        startSlot = e.target;
        highlightSlot(startSlot);
      }
    }
  
    function onMouseMove(e) {
      if (isDragging && e.target.classList.contains('time-slot')) {
        endSlot = e.target;
        highlightRange(startSlot, endSlot);
      }
    }
  
    function onMouseUp() {
      if (isDragging) {
        isDragging = false;
        if (startSlot && endSlot) {
          const startTime = getTimeFromSlot(startSlot);
          const endTime = getTimeFromSlot(endSlot);
  
          // Pre-fill the modal with the captured time
          startTimeInput.value = formatTimeForInput(
            startTime.hours,
            startTime.minutes
          );
          endTimeInput.value = formatTimeForInput(endTime.hours, endTime.minutes);
          console.log('fasfasfsdf');
          createTask();
        }
        clearHighlight();
      }
    }
  
    // Modal functions
    function closeModal() {
      modal.classList.remove('show');
      document.getElementById('createTaskForm').reset();
      clearHighlight();
    }
  
    function createTask() {
      console.log(`hahah ${newStart} - ${newEnd}`);
      if (newStart != null && newEnd != null) {
        const timeSlot = document.querySelectorAll('.time-slot');
  
        const startSlotElement = timeSlot[newStart];
        const endSlotElement = timeSlot[newEnd];
  
        // Lấy ngày và thời gian từ các phần tử time-slot
        const startDateValue = startSlotElement
          ? startSlotElement.dataset.date
          : null;
        const startTimeValue = startSlotElement
          ? startSlotElement.dataset.time
          : null;
  
        const endDateValue = endSlotElement ? endSlotElement.dataset.date : null;
        const endTimeValue = endSlotElement ? endSlotElement.dataset.time : null;
  
        if (startDateValue && startTimeValue && endDateValue && endTimeValue) {
          // Chuyển đổi date từ định dạng DD-MM-YYYY sang YYYY-MM-DD
          const [startDay, startMonth, startYear] = startDateValue.split('-');
          const [endDay, endMonth, endYear] = endDateValue.split('-');
  
          const formattedStartDate = `${startYear}-${startMonth}-${startDay}`;
          const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;
  
          // Kết hợp thành chuỗi datetime-local
          const startDateTime = `${formattedStartDate} ${startTimeValue}`;
          const endDateTime = `${formattedEndDate} ${endTimeValue}`;
  
          // Gán giá trị vào các trường input datetime-local
          document.getElementById('startTime').value = startDateTime;
          document.getElementById('endTime').value = endDateTime;
  
          // In ra để kiểm tra
          console.log(`Thời gian bắt đầu: ${startDateTime}`);
          console.log(`Thời gian kết thúc: ${endDateTime}`);
        }
      }
      modal.classList.add('show');
      document.getElementById('createTaskForm').onsubmit();
    }
  
    document.getElementById('createTaskForm').onsubmit = function (e) {
      e.preventDefault();
      addTaskToCalendar();
      closeModal();
      document.getElementById('createTaskForm').reset();
    };
    function addTask(taskData) {
            console.log(1234)
            // fetch('http://localhost:5004/add-task', {
            fetch('/add-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Optionally, update the calendar here or show a success message
                getUserTasks(); // Refresh the tasks after adding a new one
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle errors here
            });
        }

    function deleteTask(taskData) {
        console.log(1234)
        // fetch('http://localhost:5004/delete-task', {
        fetch('/delete-task', {

            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Optionally, update the calendar here or show a success message
            getUserTasks(); // Refresh the tasks after adding a new one
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors here
        });
    }
    function addTaskToCalendar() {
      const task = document.createElement('div');
      task.classList.add('task');
  
      // Task Name
      const taskName = document.createElement('p');
      taskName.classList.add('taskName');
      taskName.textContent = document.getElementById('taskName').value;
  
      // Task Description
      const taskDescript = document.createElement('p');
      taskDescript.classList.add('taskDescript');
      taskDescript.textContent = document.getElementById('taskDescription').value;
  
      // Lấy thời gian bắt đầu và kết thúc
      const startTimeValue = startTimeInput.value; // Giá trị thời gian bắt đầu (datetime)
      const endTimeValue = endTimeInput.value; // Giá trị thời gian kết thúc (datetime)
  
      const startTime = new Date(startTimeValue);
      const endTime = new Date(endTimeValue);
  
      // Task Time
      const taskTime = document.createElement('p');
      taskTime.classList.add('taskTime');
      taskTime.textContent = `${startTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${endTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
      const taskData = {
            userID: userID,
            taskName: taskName.textContent,
            taskDescription: taskDescript.textContent,
            startTime: startTime,
            endTime: endTime,
            // taskColor: document.getElementById('taskColor').value
        };
      console.log(taskData)
      addTask(taskData);
  
      // Create Delete Button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-button');
  
      // Add event listener to delete the task
      deleteButton.onclick = function() {
            const taskData = {
                userID: userID,
                taskName: taskName.textContent,
                taskDescription: taskDescript.textContent,
                startTime: startTime,
                endTime: endTime,
                // taskColor: document.getElementById('taskColor').value
            };
            // console.log(taskData)
            deleteTask(taskData);
            timeSlots.removeChild(task);
        };
  
      // Append elements to the task
      task.appendChild(taskName);
      task.appendChild(taskDescript);
      task.appendChild(taskTime);
      task.appendChild(deleteButton);
      task.style.backgroundColor = document.getElementById('taskColor').value;
      const today = new Date();
      // Tìm các phần tử time-slot tương ứng
      const startDayIndex = startTime.getDate() - today.getDate() + 3; // Ngày trong tuần (0-6)
      const startHour = startTime.getHours();
      const startMinute = startTime.getMinutes();
      const startSlotIndex =
        (startHour * 4 + startMinute / 15) * 7 + startDayIndex; // Tổng chỉ số time-slot
  
      const endDayIndex = endTime.getDate() - today.getDate() + 3;
      const endHour = endTime.getHours();
      const endMinute = endTime.getMinutes();
      const endSlotIndex = (endHour * 4 + endMinute / 15) * 7 + endDayIndex; // Tổng chỉ số time-slot
      console.log(`StartTime: ${startDayIndex} - ${startHour} - ${startMinute}`);
      console.log(`EndTime: ${endDayIndex} - ${endHour} - ${endMinute}`);
      console.log(`hahaha ${startSlotIndex} - ${endSlotIndex}`);
      const timeSlot = document.querySelectorAll('.time-slot');
  
      // Tìm các time-slot tương ứng
      const startSlotElement = timeSlot[startSlotIndex + 7];
      const endSlotElement = timeSlot[endSlotIndex + 7];
  
      // Tính toán vị trí của task
      const startRect = startSlotElement.getBoundingClientRect();
      const endRect = endSlotElement.getBoundingClientRect();
      const timeSlotRect = timeSlot[0].getBoundingClientRect();
      // Giả sử thời gian bắt đầu là phần tử đầu tiên
  
      task.style.position = 'absolute';
      task.style.left = `${
        Math.min(startRect.left, endRect.left) - timeSlotRect.left
      }px`;
      task.style.top = `${
        Math.min(startRect.top, endRect.top) - timeSlotRect.top + 10
      }px`;
      task.style.width = `${
        Math.max(startRect.right, endRect.right) -
        Math.min(startRect.left, endRect.left)
      }px`;
      task.style.height = `${
        Math.max(startRect.bottom, endRect.bottom) -
        Math.min(startRect.top, endRect.top) -
        20
      }px`;
  
      // Append the task to time slots
      timeSlots.appendChild(task);
    }
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    // Get today's date
    const currentDate = new Date();
  
    // Function to format date as "DD.MM.YYYY"
    function formatDate(date) {
      const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with zero
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (0-based) and pad
      const year = date.getFullYear(); // Get full year
      return `${day}.${month}.${year}`; // Return formatted date
    }
  
    // Select the <p> element inside the .day div
    const dayElement = document.querySelector('.day p');
  
    // Set the text content to today's date
    dayElement.textContent = formatDate(currentDate);
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    const chatWindow = document.querySelector('.chat-window');
    const inputField = document.querySelector('.input-area input');
    const sendButton = document.querySelector('.input-area button');
  
    function addMessage(message, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = isUser ? 'user-message' : 'bot-message';
      messageDiv.innerHTML = `<p>${message}</p>`;
      chatWindow.appendChild(messageDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  
    function addTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'bot-message typing-indicator';
      typingDiv.innerHTML =
        '<div class="typing-bubble"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
      chatWindow.appendChild(typingDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  
    function removeTypingIndicator() {
      const typingIndicator = document.querySelector('.typing-indicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }
  
    async function handleUserInput() {
      const userMessage = inputField.value.trim();
      if (userMessage) {
        console.log(userMessage);
        addMessage(userMessage, true);
        inputField.value = '';
  
        // Add typing indicator
        addTypingIndicator();
  
        try {
          // const response = await fetch(`http://localhost:8034/infer`, {
          const response = await fetch(`/infer`, {
        

            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: userMessage }),
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
  
          // Remove typing indicator before adding the bot's response
          removeTypingIndicator();
          addMessage(data.response);
        } catch (error) {
          console.error('Error:', error);
  
          // Remove typing indicator before adding the error message
          removeTypingIndicator();
          addMessage('Sorry, there was an error processing your message.');
        }
      }
    }
  
    sendButton.addEventListener('click', handleUserInput);
  
    inputField.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        handleUserInput();
      }
    });
  });
  
  const tracker = document.querySelector('.tracker');
  const progressBar = document.querySelector('.progress-bar');
  const timePeriod = document.querySelector('.time-period');
  
  // Sample data (you can replace this with real data)
  const tasksData = {
    week: 35,
    month: 120,
    total: 200,
  };
  
  // Set initial progress
  const progress = (tasksData.month / tasksData.total) * 100;
  progressBar.style.width = `${progress}%`;
  
  let isShowingWeek = true;
  function updateProgressInfo() {
    if (isShowingWeek) {
      timePeriod.textContent = `Week (${tasksData.week})`;
    } else {
      timePeriod.textContent = `Month (${tasksData.month})`;
    }
    isShowingWeek = !isShowingWeek;
  }
  
  tracker.addEventListener('mouseenter', () => {
    updateProgressInfo();
  });
  
  tracker.addEventListener('mouseover', () => {
    if (!timePeriod.style.opacity || timePeriod.style.opacity === '0') {
      updateProgressInfo();
    }
  });
  
  setInterval(() => {
    if (tracker.matches(':hover')) {
      updateProgressInfo();
    }
  }, 2000); // Switch between week and month data every 2 seconds while hovering
