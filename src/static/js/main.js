let currentView = 'week-view';
document.addEventListener('DOMContentLoaded', function () {
  changeWeekView();
  initializeChat();
  initializeModal();
  initializeProgressTracker();

  const logout = document.getElementById('logoutBtn');
  logout.onclick = function () {
    window.location.href = '/create-account';
  };

  addTaskFromDB();
});

function addTaskFromDB() {
  getUserTasks().then((tasks) => {
    tasks.forEach((task) => {
      addTaskToCalendarFromDB(task);
    });
  });
}
