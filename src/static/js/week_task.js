// function addTaskToCalendar(taskData) {
//   const task = createTaskElement(taskData);
//   if (
//     currentWeek <= new Date(taskData.startTime) &&
//     new Date(taskData.endTime) <= endWeek
//   ) {
//     console.log(taskData);
//     positionTask(
//       task,
//       new Date(taskData.startTime),
//       new Date(taskData.endTime)
//     );

//     document.querySelector('.time-slots').appendChild(task);
//   }
//   addTask(taskData);
// }

function addTaskToCalendarFromDB(taskData) {
  const task = createTaskElement(taskData);
  // console.log(taskData);
  console.log('CURRENNT WEEK: ',currentWeek);
  console.log('END WEKK: ',endWeek);
  console.log('Before start time week', taskData.startTime);
  console.log('Start time WEKK: ',new Date(taskData.startTime));
  console.log('end time WEKK: ',new Date(taskData.endTime));
  console.log('task Data:', taskData)
  if (
    currentWeek <= new Date(taskData.startTime) &&
    new Date(taskData.endTime) <= endWeek
  ) {
    positionTask(task, taskData.startTime, taskData.endTime);
    document.querySelector('.time-slots').appendChild(task);
  }
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
  task.style.backgroundColor = taskData.taskColor;

  task.dataset.status = 'In progress';

  // Lấy các giá trị từ các trường input khi click vào button
  task.addEventListener('click', function (event) {
    modifyTask(task, taskData, event);
  });

  // Cập nhật trạng thái khi người dùng thay đổi
  document
    .getElementById('statusSelect')
    .addEventListener('change', function (event) {
      const newStatus = event.target.value;
      taskData.status = newStatus; // Cập nhật trạng thái mới của task
      updateTaskColor(task, newStatus); // Cập nhật màu của task trong lịch
    });

  // Thêm sự kiện cho nút đóng
  document.getElementById('closeButton').addEventListener('click', function () {
    const showtask = document.getElementById('taskInfo');
    showtask.style.opacity = 0;
    showtask.style.visibility = 'hidden';
  });

  return task;
}

function updateTaskColor(taskElement, status) {
  if (status === 'Completed') {
    taskElement.style.backgroundColor = 'green'; // Completed: Xanh lá cây
  } else if (status === 'Pass due') {
    taskElement.style.backgroundColor = 'red'; // Pass due: Đỏ
  } else {
    taskElement.style.backgroundColor = 'blue'; // In progress: Xanh dương
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
