
// async function fetchdata(){
//   try{
//     console.log("manh dep trai");
//     // const reponse = await getUserTasks();
//     const basedata = await getUserTasks();
//     return basedata;
//   }
//   catch(error){
//     console.log('Error fetching data:', error);
//   }
// }

document.addEventListener('DOMContentLoaded', function () {
  console.log("asgasdgdggwrtqrq");
  changeWeekView();
  initializeChat();
  initializeModal();

  const logout = document.getElementById('logoutBtn');
  logout.onclick = function () {
    window.location.href = '/create-account';
  };


});

async function addTaskFromDB() {
  try {
    const userData = await getUserTasks();
    if (userData) {
      userData.forEach(task => {
        addTaskToCalendarFromDB(task);
      });
    }
  } catch (error) {
    console.error('Error adding tasks:', error);
  }
}


