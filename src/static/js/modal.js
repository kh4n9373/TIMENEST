function initializeModal() {
  const modal = document.getElementById('createTaskModal');
  const btn = document.getElementById('createBtn');
  const span = document.getElementsByClassName('close-button')[0];

  btn.onclick = function () {
    openCreateTaskModal();
  };

  span.onclick = closeModal;

  window.onclick = function (event) {
    if (event.target == modal) {
      closeModal();
    }
  };

}

function openCreateTaskModal() {
  const modal = document.getElementById('createTaskModal');
  modal.classList.add('show');
  document.getElementById('createTaskForm').onsubmit = function (e) {
    e.preventDefault();
    const taskData = getTaskDataFromForm();
    addTaskToCalendar(taskData);
    closeModal();
    this.reset();
  };
  if (!window.alertShown) {
    alert(
      "When creating a task, your minutes range must be incremented by 15, else your task won't be displayed on the calendar. This is a special feature of our unique website, not a bug 🫶"
    );
    window.alertShown = true;
  }
}

function closeModal() {
  const modal = document.getElementById('createTaskModal');
  modal.classList.remove('show');
  document.getElementById('createTaskForm').reset();
}

function getTaskDataFromForm() {
  return {
    userID: window.userID,
    taskName: document.getElementById('taskName').value,
    taskDescription: document.getElementById('taskDescription').value,
    taskColor: document.getElementById('taskColor').value,
    startTime: document.getElementById('startTime').value,
    endTime: document.getElementById('endTime').value,
  };
}

