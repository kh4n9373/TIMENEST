function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

function getPreviousMonthLastDate(year, month) {
    return daysInMonth(year, month - 1);
}

async function addBaseTaskToMonthView(){
    const basedata = await fetchdata();
    console.log(basedata);
    basedata.forEach((message) => {
        addTaskToMonthView(message);
    });
}

function addTaskToMonthView(taskData){
    const daySlots = document.querySelectorAll('.day-slot');
    const taskDate = taskData.startTime.split('T')[0]; // Extract date in yyyy-mm-dd format
    daySlots.forEach(daySlot => {
        if (daySlot.getAttribute('data-date') === taskDate) {
            const task = document.createElement('button');
            task.classList.add('task');
            task.classList.add('month_task');
            task.style.backgroundColor = taskData.taskColor;
            task.textContent = taskData.taskName;
            task.addEventListener('click', function (event) {
                modifyTask(task, taskData, event);
              });
            daySlot.appendChild(task);
        }
    });
}

function renderCalendar(year, month){
    console.log(year,month);
    const monthDaysDiv = document.getElementById('month-days');
    console.log(monthDaysDiv);
    monthDaysDiv.innerHTML = ''; 
    const totalSlots = 35; 
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInCurrentMonth = daysInMonth(year, month);
    const daysInPrevMonth = getPreviousMonthLastDate(year, month);
    // console.log(firstDay);
    // console.log(daysInCurrentMonth);
    // console.log(daysInPrevMonth);
    let daySlot = 1; 
    let prevMonthDay = daysInPrevMonth - firstDay + 1; 

    for (let i = 0; i < totalSlots; i++){
        // console.log(i);
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day-slot');

        const day = document.createElement('p');
        day.classList.add('day-in-month');
        dayDiv.appendChild(day);
        
        let date;
        if (i < firstDay) {
            day.textContent = prevMonthDay++;
            day.classList.add('prev-month');
            date = new Date(year, month - 1, day.textContent);
        } else if (daySlot <= daysInCurrentMonth) {
            day.textContent = daySlot++;
            date = new Date(year, month, day.textContent);
        } else {
            day.textContent = daySlot - daysInCurrentMonth;
            day.classList.add('next-month');
            date = new Date(year, month + 1, day.textContent);
            daySlot++;
        }
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        dayDiv.setAttribute('data-date', formattedDate);
        // console.log(formattedDate, day.textContent, new Date(year, month, day.textContent));
        monthDaysDiv.appendChild(dayDiv);
    }
    addBaseTaskToMonthView();
}