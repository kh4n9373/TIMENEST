function addTaskToCalendar(taskData) {
  const task = createTaskElement(taskData);
  positionTask(task, new Date(taskData.startTime), new Date(taskData.endTime));
  document.querySelector('.time-slots').appendChild(task);
  addTask(taskData);
}

function addTaskToCalendarFromDB(taskData){
  const task = createTaskElement(taskData);
  if(currentWeek <= new Date(taskData.startTime) && new Date(taskData.endTime) <= endWeek)positionTask(task, taskData.startTime, taskData.endTime);
  document.querySelector('.time-slots').appendChild(task);
}

function createTaskElement(taskData) {
  const task = document.createElement('button');
  task.classList.add('task');

  const taskName = document.createElement('p');
  taskName.classList.add('taskName');
  taskName.textContent = taskData.taskName;

  const taskDescript = document.createElement('p');
  taskDescript.classList.add('taskDescription');
  taskDescript.textContent = taskData.taskDescription;
  const startTime = new Date(taskData.startTime);
  const endTime = new Date(taskData.endTime);

  const taskTime = document.createElement('p');
  taskTime.classList.add('taskTime');
  taskTime.textContent = `${startTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })} - ${endTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  task.appendChild(taskName);
  task.appendChild(taskTime);
  task.appendChild(taskDescript);
  task.dataset.status = "In progress";

  // Lấy các giá trị từ các trường input khi click vào button
  task.addEventListener('click', function(event) {
    // Kiểm tra nếu taskName và taskDescription trống
    const taskName = taskData.taskName ? taskData.taskName : "No name";
    const taskDescription = taskData.taskDescription ? taskData.taskDescription : "No description";

    // Hiển thị thông tin task
    document.getElementById('displayTaskName').textContent = taskName;
    document.getElementById('displayTaskDescription').textContent = taskDescription;

    // Xử lý thời gian bắt đầu và kết thúc
    const startTime = new Date(taskData.startTime);
    const endTime = new Date(taskData.endTime);
    
    const fromDate = startTime.toLocaleDateString();
    const toDate = endTime.toLocaleDateString();
    const startHour = formatTimeForDisplay(startTime.getHours(), startTime.getMinutes()); 
    const endHour = formatTimeForDisplay(endTime.getHours(), endTime.getMinutes());  
    const duration = `${startHour} - ${endHour}`;
    
    // Hiển thị thời gian
    document.getElementById('displayFromDate').textContent = fromDate;
    document.getElementById('displayToDate').textContent = toDate;
    document.getElementById('displayDuration').textContent = duration;

    // Kiểm tra trạng thái của task và cập nhật dropdown
    const statusSelect = document.getElementById('statusSelect');
    statusSelect.value = taskData.status; // Gán giá trị status hiện tại

    //Nút xóa

    // Hiển thị khung task info (giữ nguyên màu)
    const showtask = document.getElementById('taskInfo');
    showtask.style.opacity = 1;
    showtask.style.visibility = 'visible';

    document.getElementById('deleteButton').onclick = function () {
      deleteTask(taskData);
      document.querySelector('.time-slots').removeChild(task);
      showtask.style.opacity = 0;
      showtask.style.visibility = 'hidden';
    };

    //Nút chỉnh sửa
    document.getElementById('editButton').onclick = function () {
      showtask.style.opacity = 0;
      showtask.style.visibility = 'hidden';
      // Show the modal
  
      // Set the values in the modal
      document.getElementById('taskName').value = taskData.taskName;
      document.getElementById('taskDescription').value = taskData.taskDescription;
      document.getElementById('startTime').value = taskData.startTime; // Format for datetime-local
      document.getElementById('endTime').value = taskData.endTime; // Format for datetime-local
      document.getElementById('taskColor').value = taskData.taskColor;
      console.log(document.getElementById('startTime').value)
      openCreateTaskModal();
      // Modify the submit handler for the form
      document.getElementById('createTaskForm').onsubmit = function (e) {
          e.preventDefault();
          const updatedTaskData = getTaskDataFromForm();
          deleteTask(taskData);
          document.querySelector('.time-slots').removeChild(task);
          addTaskToCalendar(updatedTaskData);
          closeModal();
          this.reset();
      };
  };
  
  }); 

// Cập nhật trạng thái khi người dùng thay đổi
  document.getElementById('statusSelect').addEventListener('change', function(event) {
    const newStatus = event.target.value;
    taskData.status = newStatus;  // Cập nhật trạng thái mới của task
    updateTaskColor(task, newStatus);  // Cập nhật màu của task trong lịch
  });


  // Thêm sự kiện cho nút đóng
  document.getElementById('closeButton').addEventListener('click', function() {
      const showtask = document.getElementById('taskInfo');
      showtask.style.opacity = 0;
      showtask.style.visibility = 'hidden';
  });

  return task;  
}

function updateTaskColor(taskElement, status) {
  if (status === "Completed") {
      taskElement.style.backgroundColor = 'green';  // Completed: Xanh lá cây
  } else if (status === "Pass due") {
      taskElement.style.backgroundColor = 'red';    // Pass due: Đỏ
  } else {
      taskElement.style.backgroundColor = 'blue';   // In progress: Xanh dương
  }
}

// Chỉnh màu dựa trên status
const colors = ['#0000FF', '#FF0000', '#008000'];

function positionTask(taskElement, startTime, endTime) {
  const timeSlots = document.querySelectorAll('.time-slot');

  const startSlotElement = timeSlots[getIndexFromTime(startTime) + 7];
  const endSlotElement = timeSlots[getIndexFromTime(endTime) + 7];

  const startRect = startSlotElement.getBoundingClientRect();
  const endRect = endSlotElement.getBoundingClientRect();
  const timeSlotRect = timeSlots[0].getBoundingClientRect();

  taskElement.style.position = 'absolute';
  taskElement.style.left = `${
    Math.min(startRect.left, endRect.left) - timeSlotRect.left
  }px`;
  taskElement.style.top = `${
    Math.min(startRect.top, endRect.top) - timeSlotRect.top + 10
  }px`;
  taskElement.style.width = `${
    Math.max(startRect.right, endRect.right) -
    Math.min(startRect.left, endRect.left)
  }px`;
  taskElement.style.height = `${
    Math.max(startRect.bottom, endRect.bottom) -
    Math.min(startRect.top, endRect.top) -
    20
  }px`;
}

