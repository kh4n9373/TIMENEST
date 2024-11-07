function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

function getPreviousMonthLastDate(year, month) {
    return daysInMonth(year, month - 1);
}

function renderCalendar(year, month) {
    console.log(year,month);
    const monthDaysDiv = document.getElementById('month-days');
    console.log(monthDaysDiv);
    monthDaysDiv.innerHTML = ''; 
    console.log("asdasfas");
    const totalSlots = 35; 
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInCurrentMonth = daysInMonth(year, month);
    const daysInPrevMonth = getPreviousMonthLastDate(year, month);

    let daySlot = 1; 
    let prevMonthDay = daysInPrevMonth - firstDay + 1; 

    for (let i = 0; i < totalSlots; i++) {
        console.log(i);
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day-slot');

        const day = document.createElement('p');
        day.classList.add('day-in-month');
        dayDiv.appendChild(day);
        
        if (i < firstDay) {
            day.textContent = prevMonthDay++;
            day.classList.add('prev-month');
        } else if (daySlot <= daysInCurrentMonth) {
            day.textContent = daySlot++;
            day.classList.add('current-month');
        } else {
            day.textContent = (daySlot++) - daysInCurrentMonth;
            day.classList.add('next-month');
        }
        monthDaysDiv.appendChild(dayDiv);
    }
}   