function addTask(taskData) {
  return fetch('/add-task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      getUserTasks();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function deleteTask(taskData) {
  return fetch('/delete-task', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      getUserTasks();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function getUserTasks() {
  return fetch(
    `/get-user-metadata?userID=${encodeURIComponent(window.userID)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((userData) => {
      console.log('UserData:', userData);
      return userData.tasks || [];
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      return [];
    });
}
