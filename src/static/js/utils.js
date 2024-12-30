function formatTimeForInput(hours, minutes) {
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

function formatTimeForDisplay(hours, minutes) {
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

function getTimeFromStartSlot(slot) {
  const timeSlots = document.querySelector('.time-slots');
  const slotIndex = Array.from(timeSlots.children).indexOf(slot) - 7;
  // Lấy giờ và phút từ chỉ số của slot
  const hours = Math.floor(slotIndex / 28);
  const minutes = Math.floor((slotIndex % 28) / 7) * 15;

  // Lấy ngày từ dataset của slot
  const date = slot.dataset.date; // Định dạng ngày 'DD-MM-YYYY'

  // Kết hợp ngày với giờ và phút
  const formattedTime = formatDateTimeForInput(date, hours, minutes);

  return formattedTime; // Trả về định dạng 'YYYY-MM-DDTHH:MM'
}

function getTimeFromEndSlot(slot) {
  const timeSlots = document.querySelector('.time-slots');
  const slotIndex = Array.from(timeSlots.children).indexOf(slot);
  // Lấy giờ và phút từ chỉ số của slot
  const hours = Math.floor(slotIndex / 28);
  const minutes = Math.floor((slotIndex % 28) / 7) * 15;

  // Lấy ngày từ dataset của slot
  const date = slot.dataset.date; // Định dạng ngày 'DD-MM-YYYY'

  // Kết hợp ngày với giờ và phút
  const formattedTime = formatDateTimeForInput(date, hours, minutes);

  return formattedTime; // Trả về định dạng 'YYYY-MM-DDTHH:MM'
}

function formatDateTimeForInput(date, hours, minutes) {
  const formattedHours = String(hours).padStart(2, '0'); // Đảm bảo có 2 chữ số cho giờ
  const formattedMinutes = String(minutes).padStart(2, '0'); // Đảm bảo có 2 chữ số cho phút
  return `${date}T${formattedHours}:${formattedMinutes}`; // Trả về định dạng 'YYYY-MM-DDTHH:MM'
}

// function getIndexFromTime(time) {
//   const dayElements = document.querySelectorAll('.calendar-day');
//   // const timeDate = time instanceof Date ? time : new Date(time);
//   const DayIndex =
//     (new Date(formatDate(time)) - new Date(dayElements[0].dataset.date)) /
//     (1000 * 60 * 60 * 24);
//   const Hour = time.getHours();
//   const Minute = time.getMinutes();

//   const SlotIndex = (Hour * 4 + Minute / 15) * 7 + DayIndex;
//   console.log(
//     `${Hour}-${Minute}-${formatDate(time)}-${
//       dayElements[0].dataset.date
//     }-${DayIndex}`
//   );
//   return SlotIndex;
// }
function getIndexFromTime(time) {
  const dayElements = document.querySelectorAll('.calendar-day');
  const timeDate = time instanceof Date ? time : new Date(time);

  const DayIndex =
    (new Date(formatDate(time)) - new Date(dayElements[0].dataset.date)) /
    (1000 * 60 * 60 * 24);
  const Hour = timeDate.getHours();
  const Minute = timeDate.getMinutes();

  const SlotIndex = (Hour * 4 + Minute / 15) * 7 + DayIndex;
  console.log(
    `${Hour}-${Minute}-${formatDate(timeDate)}-${
      dayElements[0].dataset.date
    }-${DayIndex}`
  );
  return SlotIndex;
}

function modifyTask(task, taskData, event) {
  // Kiểm tra nếu taskName và taskDescription trống
  const taskName = taskData.taskName ? taskData.taskName : 'No name';
  const taskDescription = taskData.taskDescription
    ? taskData.taskDescription
    : 'No description';

  // Hiển thị thông tin task
  document.getElementById('displayTaskName').textContent = taskName;
  document.getElementById('displayTaskDescription').textContent =
    taskDescription;

  // Xử lý thời gian bắt đầu và kết thúc
  const startTime = new Date(taskData.startTime);
  const endTime = new Date(taskData.endTime);

  const fromDate = startTime.toLocaleDateString();
  const toDate = endTime.toLocaleDateString();
  const startHour = formatTimeForDisplay(
    startTime.getHours(),
    startTime.getMinutes()
  );
  const endHour = formatTimeForDisplay(
    endTime.getHours(),
    endTime.getMinutes()
  );
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
    task.remove();
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
    console.log(document.getElementById('startTime').value);
    openCreateTaskModal();
    // Modify the submit handler for the form
    document.getElementById('createTaskForm').onsubmit = function (e) {
      e.preventDefault();
      const updatedTaskData = getTaskDataFromForm();
      deleteTask(taskData);
      task.remove();
      let currentView = document.querySelector('.view-text').textContent;
      if (currentView == 'Week') addTaskToCalendarFromDB(updatedTaskData);
      else if (currentView == 'Month') addTaskToMonthView(updatedTaskData);
      addTask(updatedTaskData)
      closeModal();
      this.reset();
    };
  };
}
